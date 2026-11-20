// 把 DXF 图元整理成审查需要的语义模型：图幅、图框、标题栏、明细栏、件号、尺寸、线型、框格、粗糙度。
import {
  asRect,
  distance,
  entitySegments,
  isHorizontal,
  isVertical,
  median,
  mode,
  normalizeAngle,
  pointInPolygon,
  pointSegmentDistance,
  rect,
  rectContainsPoint,
  rectContainsRect,
  rectExpand,
  rectHeight,
  rectOverlapArea,
  rectWidth,
  segmentAngle,
  segmentLength,
  segmentsIntersect,
  textBox,
  textWidth,
} from './geom.js'

const SHEET_FORMATS = [
  { name: 'A0', width: 1189, height: 841 },
  { name: 'A1', width: 841, height: 594 },
  { name: 'A2', width: 594, height: 420 },
  { name: 'A3', width: 420, height: 297 },
  { name: 'A4', width: 297, height: 210 },
]

const SIGNATURE_LABELS = ['设计', '审核', '工艺', '标准化', '批准']

export function extractDrawing(doc, options = {}) {
  if (!doc || !Array.isArray(doc.entities)) throw new Error('DXF 解析结果为空')
  const sheet = detectSheet(doc)
  const entities = doc.entities
  const texts = buildTexts(entities)
  const rects = collectRects(entities)
  const frame = detectFrame(rects, sheet)
  const titleBlock = detectTitleBlock(rects, texts, frame, sheet, entities)
  const bom = detectBom(rects, texts, titleBlock, frame, sheet)
  const regions = { titleBlock: titleBlock?.box || null, bom: bom?.box || null, frame: frame?.box || null }
  assignTextRoles(texts, regions, sheet)

  const lineGroups = classifyLines(entities, sheet, regions)
  const tech = detectTechRequirements(texts, frame, sheet)
  const fcf = detectFeatureControlFrames(entities, texts, regions, sheet)
  const roughness = detectRoughness(texts, entities, rects, regions, sheet)
  const balloons = detectBalloons(texts, entities, rects, regions, sheet, bom)
  const dimensions = detectDimensions(texts, entities, regions, sheet, fcf, roughness, balloons)
  const titleFields = readTitleBlockFields(titleBlock, texts, sheet)

  const model = {
    sheet,
    frame,
    titleBlock: titleBlock ? { ...titleBlock, fields: titleFields } : null,
    bom: bom ? { ...bom, items: bom.rows || [] } : null,
    texts,
    tech,
    fcf,
    roughness,
    balloons,
    dimensions,
    lines: lineGroups,
    rects,
    layers: doc.layers,
    entitiesForRules: entities,
    entityCount: entities.length,
    warnings: [...(doc.warnings || [])],
  }
  model.summary = buildSummary(model)
  model.evidence = buildEvidence(model, options)
  return model
}

// ── 图幅 ──
function detectSheet(doc) {
  const box = doc.bbox || doc.headerBbox
  if (!box) throw new Error('无法从 DXF 中获取图纸范围，请检查图纸是否为空')
  const width = box.width ?? box.x1 - box.x0
  const height = box.height ?? box.y1 - box.y0
  const longSide = Math.max(width, height)
  const shortSide = Math.min(width, height)
  let format = null
  for (const candidate of SHEET_FORMATS) {
    if (Math.abs(longSide - candidate.width) <= 2 && Math.abs(shortSide - candidate.height) <= 2) {
      format = candidate
      break
    }
  }
  let extended = false
  if (!format) {
    const nearest = SHEET_FORMATS.reduce((best, candidate) => {
      const score = Math.abs(longSide - candidate.width) + Math.abs(shortSide - candidate.height)
      return !best || score < best.score ? { candidate, score } : best
    }, null)
    if (nearest && nearest.score <= 260) {
      format = { ...nearest.candidate, name: `${nearest.candidate.name}（加长/非标）` }
      extended = true
    }
  }
  return {
    x0: box.x0,
    y0: box.y0,
    x1: box.x1,
    y1: box.y1,
    width,
    height,
    longSide,
    shortSide,
    format: format ? format.name : '非标幅面',
    formatBase: format ? format.name.replace('（加长/非标）', '') : null,
    extended,
    area: width * height,
    orientation: width >= height ? '横向' : '纵向',
  }
}

function buildTexts(entities) {
  const texts = []
  for (const entity of entities) {
    if (entity.type !== 'TEXT' && entity.type !== 'MTEXT') continue
    const content = String(entity.text ?? '')
    if (!content.trim()) continue
    const height = Number(entity.height) || 2.5
    const rotation = Number(entity.rotation) || 0
    const box = textBox(content, entity.x, entity.y, height, rotation, entity.hAlign || 0, entity.vAlign || 0)
    texts.push({
      id: entity.handle || `t${texts.length + 1}`,
      kind: entity.type,
      text: content,
      x: entity.x,
      y: entity.y,
      height,
      rotation,
      box,
      layer: entity.layer,
      style: entity.style || '',
      role: 'unknown',
      entity,
    })
  }
  return texts
}

function collectRects(entities) {
  const rects = []
  for (const entity of entities) {
    const found = asRect(entity)
    if (found) rects.push({ ...found, source: entity, area: rectWidth(found.box) * rectHeight(found.box) })
  }
  // 由四条 LINE 组成的矩形（常见于无闭合多段线的图纸）
  const lines = entities.filter(entity => entity.type === 'LINE')
  const horizontal = lines.filter(line => Math.abs(line.y1 - line.y0) < 0.2)
  const vertical = lines.filter(line => Math.abs(line.x1 - line.x0) < 0.2)
  if (horizontal.length > 600 || vertical.length > 600) return rects
  let pairs = 0
  const used = new Set()
  for (const h1 of horizontal) {
    if (pairs > 6000) break
    if (used.has(h1)) continue
    const sameY = horizontal.filter(
      line => line !== h1 && Math.abs(line.y0 - h1.y0) < 0.2 && Math.min(line.x0, line.x1) <= Math.min(h1.x0, h1.x1) + 0.5
    )
    for (const h2 of horizontal) {
      if (h2 === h1) continue
      pairs += 1
      if (pairs > 6000) break
      if (Math.abs(h2.y0 - h1.y0) < 1) continue
      const yTop = Math.max(h1.y0, h2.y0)
      const yBottom = Math.min(h1.y0, h2.y0)
      const x1 = Math.min(Math.min(h1.x0, h1.x1), Math.min(h2.x0, h2.x1))
      const x2 = Math.max(Math.max(h1.x0, h1.x1), Math.max(h2.x0, h2.x1))
      if (x2 - x1 < 5) continue
      const v1 = vertical.find(
        line => Math.abs(line.x0 - x1) < 0.5 && Math.min(line.y0, line.y1) <= yBottom + 0.5 && Math.max(line.y0, line.y1) >= yTop - 0.5
      )
      const v2 = vertical.find(
        line => Math.abs(line.x0 - x2) < 0.5 && Math.min(line.y0, line.y1) <= yBottom + 0.5 && Math.max(line.y0, line.y1) >= yTop - 0.5
      )
      if (!v1 || !v2) continue
      const box = rect(x1, yBottom, x2, yTop)
      if (rects.some(item => Math.abs(item.box.x0 - box.x0) < 0.5 && Math.abs(item.box.y0 - box.y0) < 0.5 && Math.abs(item.box.x1 - box.x1) < 0.5 && Math.abs(item.box.y1 - box.y1) < 0.5)) continue
      rects.push({ box, source: h1, area: rectWidth(box) * rectHeight(box), fromLines: true })
      used.add(h1).add(h2)
      void sameY
    }
  }
  return rects
}

// ── 图框 ──
function detectFrame(rects, sheet) {
  const candidates = rects.filter(item => {
    const box = item.box
    const inside = rectContainsRect(sheet, box, 1)
    const w = rectWidth(box)
    const h = rectHeight(box)
    return inside && w > sheet.width * 0.6 && h > sheet.height * 0.6 && w < sheet.width * 0.995 && h < sheet.height * 0.995
  })
  const best = candidates.sort((a, b) => b.area - a.area)[0]
  if (!best) return { box: { x0: sheet.x0 + 10, y0: sheet.y0 + 10, x1: sheet.x1 - 10, y1: sheet.y1 - 10 }, found: false }
  const box = best.box
  return {
    box,
    found: true,
    margins: {
      left: box.x0 - sheet.x0,
      right: sheet.x1 - box.x1,
      bottom: box.y0 - sheet.y0,
      top: sheet.y1 - box.y1,
    },
    width: rectWidth(box),
    height: rectHeight(box),
  }
}

// ── 标题栏 ──
function detectTitleBlock(rects, texts, frame, sheet, entities) {
  if (!frame) return null
  const region = rect(frame.box.x1 - 230, frame.box.y0 - 2, frame.box.x1 + 2, frame.box.y0 + 90)
  const candidates = rects.filter(item => {
    const box = item.box
    return (
      rectContainsRect(region, box, 2) &&
      rectWidth(box) >= 110 &&
      rectWidth(box) <= 230 &&
      rectHeight(box) >= 32 &&
      rectHeight(box) <= 95
    )
  })
  let best = candidates.sort((a, b) => b.area - a.area)[0] || null
  if (!best) {
    const fallback = rect(Math.max(sheet.x0, frame.box.x1 - 180), frame.box.y0, frame.box.x1, frame.box.y0 + 56)
    const insideTexts = texts.filter(item => rectContainsPoint(fallback, item.box.center, 2))
    if (insideTexts.length < 3) return null
    best = { box: fallback, source: null, area: rectWidth(fallback) * rectHeight(fallback) }
  }
  const box = best.box
  const blockTexts = texts.filter(item => rectContainsPoint(box, item.box.center, 2))
  const verticalLines = collectBlockLines(entities, box).vertical
  const horizontalLines = collectBlockLines(entities, box).horizontal
  const topBottom = verticalLines.sort((a, b) => a - b)
  const rightColumn = topBottom.length ? topBottom[topBottom.length - 1] : box.x0 + rectWidth(box) * 0.5
  return {
    box,
    source: best.source,
    texts: blockTexts,
    verticalLines: topBottom,
    horizontalLines: horizontalLines.sort((a, b) => a - b),
    rightColumn,
    area: best.area,
  }
}

function collectBlockLines(entities, box) {
  const lines = []
  // 从图框内的所有实体里取 LINE：标题栏是矩形内的表格线
  for (const entity of entities || []) {
    if (entity.type !== 'LINE') continue
    const minX = Math.min(entity.x0, entity.x1)
    const maxX = Math.max(entity.x0, entity.x1)
    const minY = Math.min(entity.y0, entity.y1)
    const maxY = Math.max(entity.y0, entity.y1)
    if (minX < box.x0 - 1 || maxX > box.x1 + 1 || minY < box.y0 - 1 || maxY > box.y1 + 1) continue
    lines.push(entity)
  }
  const vertical = []
  const horizontal = []
  for (const line of lines) {
    if (Math.abs(line.x0 - line.x1) < 0.3) {
      const span = Math.abs(line.y1 - line.y0)
      if (span >= rectHeight(box) * 0.7) vertical.push(line.x0)
    } else if (Math.abs(line.y0 - line.y1) < 0.3) {
      const span = Math.abs(line.x1 - line.x0)
      if (span >= rectWidth(box) * 0.3) horizontal.push(line.y0)
    }
  }
  return { vertical, horizontal }
}

function readTitleBlockFields(titleBlock, texts, sheet) {
  const fields = {
    name: null,
    code: null,
    material: null,
    scale: null,
    version: null,
    sheetCount: null,
    stage: null,
    signatures: {},
    all: [],
  }
  if (!titleBlock) return fields
  const box = titleBlock.box
  const blockTexts = texts.filter(item => rectContainsPoint(box, item.box.center, 2))
  fields.all = blockTexts.map(item => ({ text: item.text, x: item.x, y: item.y, height: item.height, id: item.id }))
  const rightX = titleBlock.rightColumn || box.x0 + rectWidth(box) * 0.55
  const rightTexts = blockTexts.filter(item => item.box.center.x >= rightX - 1)

  // 代号
  const codePattern = /^[A-Z0-9]{2,}([-.][A-Z0-9]+){1,}$/
  const codeCandidates = rightTexts
    .filter(item => codePattern.test(item.text.trim()) && !/^\d{4}[-.]\d{1,2}[-.]\d{1,2}$/.test(item.text.trim()))
    .filter(item => item.height >= 3)
    .sort((a, b) => b.height - a.height)
  fields.code = codeCandidates[0] ? textRef(codeCandidates[0]) : null

  // 材料
  const materialPattern = /(GB\/T|ZL\d|Q\d{3}|[A-Z]{2}\d|^\d{2}$|Cr$|Mn$|#)/i
  const materialCandidates = rightTexts
    .filter(item => materialPattern.test(item.text.trim()) && !/^\d{4}[-.]/.test(item.text.trim()))
    .filter(item => !fields.code || item.text.trim() !== fields.code.text)
    .filter(item => item.box.center.y < (fields.code ? fields.code.y - 1 : box.y1))
  fields.material = materialCandidates[0] ? textRef(materialCandidates[0]) : null

  // 图样名称：排除代号/材料/单位名称/日期/签署后，取字高最大者
  const excluded = new Set([fields.code?.text, fields.material?.text].filter(Boolean))
  const nameCandidates = rightTexts
    .filter(item => !excluded.has(item.text.trim()))
    .filter(item => !/^(版次|共\s*\d+\s*张|第\s*\d+\s*张|20\d{2}[-./])/.test(item.text.trim()))
    .filter(item => !/研究所|公司|厂$/.test(item.text.trim()))
    .filter(item => item.height >= 2)
    .sort((a, b) => b.height - a.height || b.box.center.y - a.box.center.y)
  fields.name = nameCandidates[0] ? textRef(nameCandidates[0]) : null

  // 比例
  for (const item of blockTexts) {
    const match = item.text.match(/比例\s*[:：]?\s*(\d+(?:\.\d+)?)\s*[:：]\s*(\d+(?:\.\d+)?)/)
    if (match) {
      fields.scale = {
        ...textRef(item),
        label: item.text,
        numerator: Number(match[1]),
        denominator: Number(match[2]),
        ratio: Number(match[1]) / Number(match[2]),
      }
      break
    }
    const bare = item.text.match(/^\s*(\d+)\s*[:：]\s*(\d+)\s*$/)
    if (!fields.scale && bare && /比例/.test(blockTexts.map(t => t.text).join(' '))) {
      fields.scale = {
        ...textRef(item),
        label: item.text,
        numerator: Number(bare[1]),
        denominator: Number(bare[2]),
        ratio: Number(bare[1]) / Number(bare[2]),
      }
    }
  }
  if (!fields.scale) {
    const bare = blockTexts.find(item => /^\s*(\d+)\s*[:：]\s*(\d+)\s*$/.test(item.text))
    if (bare) {
      const match = bare.text.match(/(\d+)\s*[:：]\s*(\d+)/)
      fields.scale = { ...textRef(bare), label: bare.text, numerator: Number(match[1]), denominator: Number(match[2]), ratio: Number(match[1]) / Number(match[2]) }
    }
  }

  // 版次
  const versionText = blockTexts.find(item => /版次/.test(item.text))
  if (versionText) {
    const match = versionText.text.match(/版次\s*[:：]?\s*([A-Za-z0-9.]+)/)
    fields.version = { ...textRef(versionText), value: match ? match[1] : versionText.text.replace(/版次/g, '').trim(), label: versionText.text }
  }

  // 张次
  for (const item of blockTexts) {
    const match = item.text.match(/共\s*(\d+)\s*张\s*第\s*(\d+)\s*张/)
    if (match) {
      fields.sheetCount = { ...textRef(item), label: item.text, total: Number(match[1]), index: Number(match[2]) }
      break
    }
  }

  // 阶段标记
  const stageLabel = blockTexts.find(item => /阶段标记/.test(item.text))
  if (stageLabel) {
    const row = blockTexts.filter(
      item => item !== stageLabel && Math.abs(item.box.center.y - stageLabel.box.center.y) <= Math.max(2, stageLabel.height)
    )
    const value = row.find(
      item =>
        item.box.center.x > stageLabel.box.x1 &&
        item.box.center.x < stageLabel.box.x1 + 45 &&
        !/重量|比例|共\s*\d+\s*张/.test(item.text)
    )
    fields.stage = { label: stageLabel.text, labelRef: textRef(stageLabel), value: value ? textRef(value) : null }
  } else {
    fields.stage = { label: '阶段标记', labelRef: null, value: null, labelMissing: true }
  }

  // 五类签署
  for (const label of SIGNATURE_LABELS) {
    const labelText = blockTexts.find(item => item.text.trim() === label)
    if (!labelText) {
      fields.signatures[label] = { label, present: false, value: null }
      continue
    }
    const row = blockTexts.filter(
      item => item !== labelText && Math.abs(item.box.center.y - labelText.box.center.y) <= Math.max(2.2, labelText.height)
    )
    const value = row.find(
      item =>
        item.box.center.x > labelText.box.x1 + 2 &&
        item.box.center.x < labelText.box.x1 + 42 &&
        !/^\d{4}[-./]\d{1,2}[-./]\d{1,2}$/.test(item.text.trim()) &&
        !SIGNATURE_LABELS.includes(item.text.trim())
    )
    fields.signatures[label] = { label, present: true, value: value ? textRef(value) : null, labelRef: textRef(labelText) }
  }

  // 单位名称（用于排除名称误判）
  fields.organization = null
  const orgText = blockTexts.find(item => /研究所|公司|厂$/.test(item.text))
  if (orgText) fields.organization = textRef(orgText)
  void sheet
  return fields
}

function textRef(item) {
  return {
    text: item.text,
    x: item.x,
    y: item.y,
    height: item.height,
    rotation: item.rotation,
    id: item.id,
    box: item.box,
  }
}

// ── 明细栏 ──
function detectBom(rects, texts, titleBlock, frame, sheet) {
  if (!titleBlock) return null
  const base = titleBlock.box
  const region = rect(base.x0 - 10, base.y1, base.x1 + 10, Math.min(frame.box.y1, base.y1 + 110))
  const candidates = rects
    .filter(item => {
      const box = item.box
      return rectContainsRect(region, box, 3) && rectWidth(box) >= 100 && rectWidth(box) <= 240 && rectHeight(box) >= 25 && rectHeight(box) <= 100
    })
    .sort((a, b) => b.area - a.area)
  if (!candidates.length) return null
  const box = candidates[0].box
  const blockTexts = texts.filter(item => rectContainsPoint(box, item.box.center, 2))
  const headerKeywords = ['序号', '代号', '名称', '数量', '材料', '重量', '备注']
  const headerItems = blockTexts.filter(item => headerKeywords.some(keyword => item.text.includes(keyword)))
  if (headerItems.length < 3) return null
  const headerY = median(headerItems.map(item => item.box.center.y))
  const columns = []
  for (const keyword of headerKeywords) {
    const found = headerItems
      .filter(item => item.text.includes(keyword))
      .sort((a, b) => b.height - a.height)[0]
    if (found) columns.push({ key: keyword, x: found.box.center.x, text: found.text })
  }
  columns.sort((a, b) => a.x - b.x)
  if (columns.length < 3) return null

  const dataTexts = blockTexts.filter(item => item.box.center.y < headerY - 2)
  const rowsMap = new Map()
  for (const item of dataTexts) {
    const key = Math.round(item.box.center.y / 2) * 2
    if (!rowsMap.has(key)) rowsMap.set(key, [])
    rowsMap.get(key).push(item)
  }
  const rows = []
  for (const [, items] of [...rowsMap.entries()].sort((a, b) => b[0] - a[0])) {
    const row = { y: items[0].box.center.y, cells: {}, texts: items }
    for (const item of items) {
      let best = null
      for (const column of columns) {
        const dx = Math.abs(item.box.center.x - column.x)
        if (!best || dx < best.dx) best = { column, dx }
      }
      if (best && best.dx <= Math.max(18, rectWidth(box) / columns.length / 1.4)) {
        if (!row.cells[best.column.key] || item.height > row.cells[best.column.key].height) {
          row.cells[best.column.key] = item
        }
      }
    }
    const indexText = row.cells['序号']
    const index = indexText ? Number.parseInt(indexText.text.trim(), 10) : NaN
    if (!Number.isFinite(index)) continue
    rows.push({
      index,
      code: row.cells['代号']?.text || '',
      name: row.cells['名称']?.text || '',
      quantity: row.cells['数量']?.text || '',
      material: row.cells['材料']?.text || '',
      weight: row.cells['重量']?.text || '',
      note: row.cells['备注']?.text || '',
      y: row.y,
      cellRefs: Object.fromEntries(Object.entries(row.cells).map(([key, value]) => [key, textRef(value)])),
    })
  }
  return { box, columns, headerY, rows: rows.sort((a, b) => a.index - b.index), found: rows.length > 0 }
}

function assignTextRoles(texts, regions, sheet) {
  for (const item of texts) {
    if (regions.titleBlock && rectContainsPoint(regions.titleBlock, item.box.center, 1.5)) item.role = 'title'
    else if (regions.bom && rectContainsPoint(regions.bom, item.box.center, 1.5)) item.role = 'bom'
    else if (regions.frame && !rectContainsPoint(regions.frame, item.box.center, 1)) item.role = 'frame-zone'
    else item.role = 'drawing'
  }
  for (const item of texts) {
    if (item.role !== 'drawing') continue
    const inLeftBottom = regions.frame
      ? item.box.center.x < regions.frame.x0 + rectWidth(regions.frame) * 0.62 &&
        item.box.center.y < regions.frame.y0 + rectHeight(regions.frame) * 0.36
      : false
    if (inLeftBottom && (/^\d+\s*[.、]/.test(item.text) || /技术要求/.test(item.text))) item.role = 'tech'
  }
  const heading = texts.find(item => /^技术要求$/.test(item.text.trim()))
  if (heading) {
    for (const item of texts) {
      if (item.role !== 'drawing') continue
      if (!/^\d+\s*[.、]/.test(item.text.trim())) continue
      const dx = Math.abs(item.box.center.x - heading.box.center.x)
      const dy = heading.box.center.y - item.box.center.y
      if (dx <= 40 && dy > 0 && dy <= 110) item.role = 'tech'
    }
  }
  void sheet
}

// ── 线型分组 ──
function classifyLines(entities, sheet, regions) {
  const groups = { visible: [], thin: [], center: [], hidden: [], hatch: [], dim: [], table: [], frame: [], text: [], other: [] }
  for (const entity of entities) {
    if (!['LINE', 'LWPOLYLINE', 'POLYLINE', 'CIRCLE', 'ARC'].includes(entity.type)) continue
    const role = layerRole(entity.layer, entity.effectiveLineweight, entity.effectiveLinetype)
    const item = {
      entity,
      layer: entity.layer,
      lineweight: entity.effectiveLineweight,
      linetype: entity.effectiveLinetype,
      role,
      length: entityLength(entity),
      bbox: entity.bbox,
      inTable: regions.titleBlock && entity.bbox ? rectOverlapArea(entity.bbox, regions.titleBlock) > 0.6 * Math.max(1, rectWidth(entity.bbox) * rectHeight(entity.bbox)) : false,
    }
    if (item.inTable) continue
    groups[role]?.push(item)
  }
  // 依据几何补充可见轮廓：大尺寸闭合轮廓即使放在细线层，也按可见轮廓角色复核
  const closed = entities.filter(entity => (entity.type === 'LWPOLYLINE' || entity.type === 'POLYLINE') && entity.closed)
  for (const entity of closed) {
    const box = entity.bbox
    if (!box) continue
    const w = rectWidth(box)
    const h = rectHeight(box)
    const area = w * h
    if (area < 400 || w < 20 || h < 20) continue
    if (regions.titleBlock && rectOverlapArea(box, regions.titleBlock) > area * 0.5) continue
    if (regions.bom && rectOverlapArea(box, regions.bom) > area * 0.5) continue
    if (Math.abs(w - sheet.width) < 1 && Math.abs(h - sheet.height) < 1) continue
    if (Math.min(w, h) / Math.max(w, h) > 0.85 && area > sheet.area * 0.5) continue
    const layer = String(entity.layer || '').toUpperCase()
    if (/HATCH|DIM|CENTER|TABLE|TEXT|FRAME/.test(layer)) continue
    const already = groups.visible.some(item => item.entity === entity)
    if (!already) {
      groups.visible.push({
        entity,
        layer: entity.layer,
        lineweight: entity.effectiveLineweight,
        linetype: entity.effectiveLinetype,
        role: 'visible',
        length: entityLength(entity),
        bbox: box,
        suspected: true,
      })
    }
  }
  return groups
}

function layerRole(layerName, lineweight, linetype) {
  const name = String(layerName || '').toUpperCase()
  if (/FRAME|BORDER|图框/.test(name)) return 'frame'
  if (/TABLE|BOM|TITLE|标题|明细/.test(name)) return 'table'
  if (/DIM|尺寸|标注/.test(name)) return 'dim'
  if (/CENTER|AXIS|中心|轴线/.test(name)) return 'center'
  if (/HATCH|剖面|填充/.test(name)) return 'hatch'
  if (/DASH|HIDDEN|虚线/.test(name)) return 'hidden'
  if (/TEXT|文字|字/.test(name)) return 'text'
  if (/OUTLINE|VISIBLE|THICK|粗|轮廓|实体/.test(name)) return 'visible'
  if (/THIN|细/.test(name)) return 'thin'
  if (linetype && /CENTER|DASHDOT|点画/.test(String(linetype).toUpperCase())) return 'center'
  if (linetype && /DASH/.test(String(linetype).toUpperCase())) return 'hidden'
  if (lineweight >= 0.4) return 'visible'
  return 'thin'
}

function entityLength(entity) {
  if (entity.type === 'LINE') return Math.hypot(entity.x1 - entity.x0, entity.y1 - entity.y0)
  if (entity.type === 'CIRCLE') return Math.PI * 2 * entity.radius
  if (entity.type === 'ARC') return (Math.abs(entity.endAngle - entity.startAngle) * Math.PI * entity.radius) / 180
  if (entity.points) {
    let total = 0
    for (let i = 0; i < entity.points.length - 1; i += 1) total += distance(entity.points[i], entity.points[i + 1])
    if (entity.closed && entity.points.length > 2) total += distance(entity.points[entity.points.length - 1], entity.points[0])
    return total
  }
  return 0
}

// ── 技术要求 ──
function detectTechRequirements(texts, frame, sheet) {
  const heading = texts.find(item => /^技术要求$/.test(item.text.trim()))
  const candidates = texts.filter(item => item.role === 'tech')
  const body = candidates.filter(item => /^\d+\s*[.、]/.test(item.text.trim()))
  const heights = body.map(item => item.height)
  return {
    heading: heading ? textRef(heading) : null,
    body: body.map(item => textRef(item)),
    minHeight: heights.length ? Math.min(...heights) : null,
    heights: [...new Set(heights.map(value => Math.round(value * 100) / 100))],
    found: Boolean(heading),
    region: frame ? { x0: frame.box.x0, y0: frame.box.y0, x1: frame.box.x0 + rectWidth(frame.box) * 0.62, y1: frame.box.y0 + rectHeight(frame.box) * 0.36 } : null,
    sheet: sheet.format,
  }
}

// ── 几何公差框格 ──
function detectFeatureControlFrames(entities, texts, regions, sheet) {
  const frames = []
  for (const entity of entities) {
    if (entity.type !== 'LWPOLYLINE' && entity.type !== 'POLYLINE') continue
    if (!entity.closed || !entity.points || entity.points.length < 4) continue
    const box = entity.bbox
    if (!box) continue
    const w = rectWidth(box)
    const h = rectHeight(box)
    if (h < 3.5 || h > 16 || w < 9 || w > 70) continue
    if (w / h < 1.5) continue
    if (regions.titleBlock && rectContainsRect(regions.titleBlock, box, 2)) continue
    if (regions.bom && rectContainsRect(regions.bom, box, 2)) continue
    const layer = String(entity.layer || '').toUpperCase()
    if (!/DIM|公差|FRAME/.test(layer) && h > 12) continue
    const inner = rectExpand(box, -0.3)
    const inside = texts.filter(item => rectContainsPoint(inner, item.box.center, 0.4))
    if (inside.length === 0) continue
    const separators = []
    for (const line of entities) {
      if (line.type !== 'LINE') continue
      if (Math.abs(line.x0 - line.x1) > 0.4) continue
      const x = line.x0
      const minY = Math.min(line.y0, line.y1)
      const maxY = Math.max(line.y0, line.y1)
      if (x > box.x0 + 1 && x < box.x1 - 1 && minY <= box.y0 + 0.8 && maxY >= box.y1 - 0.8) separators.push(x)
    }
    const cellSeparators = [...new Set(separators.map(x => Math.round(x * 10) / 10))].sort((a, b) => a - b)
    const cells = buildFcfCells(box, cellSeparators, inside)
    const symbol = detectFcfSymbol(entities, box, cellSeparators)
    const valueTexts = inside.filter(item => /^[S]?[φΦ]?\s*\d/.test(item.text) || /^\d/.test(item.text))
    const datumLetters = inside.filter(item => /^[A-Z]$/.test(item.text.trim()))
    frames.push({
      box,
      height: h,
      width: w,
      cells: cells.length,
      cellSeparators,
      texts: inside.map(textRef),
      symbol,
      value: valueTexts.length ? valueTexts[0].text : '',
      datumLetters: datumLetters.map(item => item.text.trim()),
      firstCellText: cells[0]?.text || '',
      entityId: entity.handle,
      sheet: sheet.format,
    })
  }
  // 去重（同名框）
  const unique = []
  for (const frame of frames) {
    if (!unique.some(item => Math.abs(item.box.x0 - frame.box.x0) < 0.5 && Math.abs(item.box.y0 - frame.box.y0) < 0.5)) unique.push(frame)
  }
  return unique
}

function buildFcfCells(box, separators, texts) {
  const boundaries = [box.x0, ...separators.filter(x => x > box.x0 + 0.5 && x < box.x1 - 0.5), box.x1]
  const cells = []
  for (let i = 0; i < boundaries.length - 1; i += 1) {
    const x0 = boundaries[i]
    const x1 = boundaries[i + 1]
    const cellTexts = texts.filter(item => item.box.center.x >= x0 && item.box.center.x <= x1)
    cells.push({
      x0,
      x1,
      text: cellTexts.map(item => item.text).join(' '),
      texts: cellTexts.map(textRef),
    })
  }
  return cells
}

function detectFcfSymbol(entities, box, separators) {
  const firstEnd = separators.length ? separators[0] : box.x0 + rectWidth(box) / 3
  const cell = rect(box.x0, box.y0, firstEnd, box.y1)
  let circles = 0
  let lines = 0
  for (const entity of entities) {
    if (entity.type === 'CIRCLE') {
      if (rectContainsPoint(cell, { x: entity.cx, y: entity.cy }, 0.2) && entity.radius <= rectHeight(box) * 0.6) circles += 1
    } else if (entity.type === 'LINE') {
      const a = { x: entity.x0, y: entity.y0 }
      const b = { x: entity.x1, y: entity.y1 }
      if (rectContainsPoint(cell, a, 0.3) && rectContainsPoint(cell, b, 0.3)) lines += 1
    }
  }
  if (circles >= 2) return 'coaxiality'
  if (circles === 1) return 'circularity'
  if (lines >= 2) return 'perpendicularity'
  return 'unknown'
}

// ── 粗糙度 ──
function detectRoughness(texts, entities, rects, regions, sheet) {
  const numeric = texts.filter(item => {
    if (item.role !== 'drawing') return false
    const text = item.text.trim()
    if (!/^(Ra|Rz)?\s*\d+(?:\.\d+)?$/.test(text)) return false
    if (item.height < 2 || item.height > 8) return false
    if (regions.titleBlock && rectContainsPoint(regions.titleBlock, item.box.center, 1)) return false
    if (regions.bom && rectContainsPoint(regions.bom, item.box.center, 1)) return false
    return true
  })
  const result = []
  for (const item of numeric) {
    const glyph = findRoughnessGlyph(entities, item.box)
    if (!glyph) continue
    const text = item.text.trim()
    const topRight =
      item.box.center.x > sheet.x0 + sheet.width * 0.68 && item.box.center.y > sheet.y0 + sheet.height * 0.78
    result.push({
      text,
      hasRa: /Ra|Rz/i.test(text),
      hasSymbol: true,
      uniform: /其余/.test(text),
      topRight,
      ref: textRef(item),
      glyph,
    })
  }
  // 统一注法：「其余」+符号+Ra 值，可能带「其余」前缀
  for (const item of texts) {
    if (item.role !== 'drawing') continue
    if (!/其余/.test(item.text) || !/\d/.test(item.text)) continue
    if (result.some(entry => entry.ref.id === item.id)) continue
    const glyph = findRoughnessGlyph(entities, item.box)
    result.push({
      text: item.text.trim(),
      hasRa: /Ra|Rz/i.test(item.text),
      hasSymbol: Boolean(glyph),
      uniform: true,
      topRight:
        item.box.center.x > sheet.x0 + sheet.width * 0.68 && item.box.center.y > sheet.y0 + sheet.height * 0.78,
      ref: textRef(item),
      glyph,
    })
  }
  return result
}

function findRoughnessGlyph(entities, box) {
  const search = rectExpand(box, 14)
  const shortLines = entities.filter(entity => {
    if (entity.type !== 'LINE') return false
    if (entity.bbox && !bboxIntersects(search, entity.bbox)) return false
    const length = Math.hypot(entity.x1 - entity.x0, entity.y1 - entity.y0)
    if (length < 1.5 || length > 12) return false
    const mid = { x: (entity.x0 + entity.x1) / 2, y: (entity.y0 + entity.y1) / 2 }
    return rectContainsPoint(search, mid, 0)
  })
  if (shortLines.length < 2) return null
  // 找到两条共享端点、夹角 30°~80° 的短线
  for (let i = 0; i < shortLines.length; i += 1) {
    for (let j = i + 1; j < shortLines.length; j += 1) {
      const a = shortLines[i]
      const b = shortLines[j]
      const endpointsA = [{ x: a.x0, y: a.y0 }, { x: a.x1, y: a.y1 }]
      const endpointsB = [{ x: b.x0, y: b.y0 }, { x: b.x1, y: b.y1 }]
      for (const pa of endpointsA) {
        for (const pb of endpointsB) {
          if (distance(pa, pb) > 0.8) continue
          const angle = Math.abs(segmentAngle({ a: { x: a.x0, y: a.y0 }, b: { x: a.x1, y: a.y1 } }) - segmentAngle({ a: { x: b.x0, y: b.y0 }, b: { x: b.x1, y: b.y1 } }))
          const normalized = Math.min(angle, 180 - angle)
          if (normalized >= 20 && normalized <= 80) return { vertex: pa, lines: [a.handle, b.handle] }
        }
      }
    }
  }
  return null
}

// ── 件号与指引线 ──
function detectBalloons(texts, entities, rects, regions, sheet, bom) {
  const balloons = []
  const bomMax = Math.max(0, ...(bom?.rows || []).map(row => row.index).filter(Number.isFinite))
  const maxBalloon = bomMax > 0 ? bomMax + Math.max(5, Math.ceil(bomMax * 0.2)) : 999
  const candidates = texts.filter(item => {
    if (item.role !== 'drawing') return false
    const text = item.text.trim()
    if (!/^\d{1,3}$/.test(text)) return false
    const value = Number.parseInt(text, 10)
    if (value > maxBalloon) return false
    if (item.height < 4.2 && !(bomMax > 0 && item.height >= 3.4 && value <= bomMax)) return false
    if (regions.frame && !rectContainsPoint(regions.frame, item.box.center, 0)) return false
    if (regions.titleBlock && rectContainsPoint(regions.titleBlock, item.box.center, 1)) return false
    if (regions.bom && rectContainsPoint(regions.bom, item.box.center, 1)) return false
    return true
  })
  for (const item of candidates) {
    const leaderInfo = findLeader(entities, item)
    if (!leaderInfo) continue
    const endpoint = leaderInfo.far
    const hasDot = hasTerminator(entities, endpoint)
    const contour = nearestContour(rects, endpoint, entities, sheet)
    balloons.push({
      number: Number.parseInt(item.text, 10),
      text: item.text.trim(),
      ref: textRef(item),
      leader: leaderInfo.line ? { from: leaderInfo.near, to: leaderInfo.far, segments: leaderInfo.segments } : null,
      endpoint: leaderInfo.far,
      hasDot,
      onContour: contour ? { distance: contour.distance, box: contour.box } : null,
      insideContour: contour ? contour.inside : false,
      crossesContour: leaderInfo.crosses,
      crossesEdge: leaderInfo.crossesEdge,
      sheet: sheet.format,
      bomKnown: bom?.rows?.some(row => row.index === Number.parseInt(item.text, 10)) || false,
    })
  }
  return balloons.sort((a, b) => a.number - b.number)
}

function findLeader(entities, textItem) {
  const box = rectExpand(textItem.box, 6)
  let best = null
  const candidates = []
  const searchBox = rectExpand(textItem.box, 10)
  for (const entity of entities) {
    if (entity.bbox && !bboxIntersects(searchBox, entity.bbox)) continue
    if (!isLeaderLayer(entity.layer)) continue
    if (entity.type === 'LINE') {
      candidates.push([
        { x: entity.x0, y: entity.y0 },
        { x: entity.x1, y: entity.y1 },
      ])
    } else if (entity.type === 'LEADER' && entity.points?.length >= 2) {
      const points = entity.points
      for (let i = 0; i < points.length - 1; i += 1) candidates.push([points[i], points[i + 1]])
    } else if (entity.type === 'LWPOLYLINE' && entity.points?.length === 2) {
      candidates.push([entity.points[0], entity.points[1]])
    }
  }
  for (const [a, b] of candidates) {
    const length = distance(a, b)
    if (length < 4 || length > 90) continue
    const da = pointInBox(box, a)
    const db = pointInBox(box, b)
    if (!da && !db) continue
    const near = da ? a : b
    const far = da ? b : a
    const gap = distanceToBox(near, textItem.box)
    if (!best || gap < best.gap || (gap === best.gap && length > best.length)) {
      best = { line: { a, b }, near, far, gap, length }
    }
  }
  if (!best) return null
  return {
    ...best,
    segments: [[best.near, best.far]],
    crosses: false,
    crossesEdge: false,
  }
}

function bboxIntersects(a, b) {
  return !(b.x1 < a.x0 || b.x0 > a.x1 || b.y1 < a.y0 || b.y0 > a.y1)
}

function pointInBox(box, point) {
  return rectContainsPoint(box, point, 0.2)
}

function distanceToBox(point, box) {
  const dx = Math.max(box.x0 - point.x, 0, point.x - box.x1)
  const dy = Math.max(box.y0 - point.y, 0, point.y - box.y1)
  return Math.hypot(dx, dy)
}

function isLeaderLayer(layer) {
  const name = String(layer || '').toUpperCase()
  return !/HATCH|TABLE|BOM|TITLE|FRAME|TEXT|填充|标题|明细|图框/.test(name)
}

function hasTerminator(entities, point) {
  const searchBox = rectExpand({ x0: point.x, y0: point.y, x1: point.x, y1: point.y }, 2)
  for (const entity of entities) {
    if (entity.bbox && !bboxIntersects(searchBox, entity.bbox)) continue
    if (entity.type === 'CIRCLE') {
      if (entity.radius <= 1.2 && distance({ x: entity.cx, y: entity.cy }, point) <= 0.9) return true
    } else if (entity.type === 'SOLID') {
      const box = entity.bbox
      if (box && rectContainsPoint(box, point, 0.6) && rectWidth(box) <= 2.5 && rectHeight(box) <= 2.5) return true
    }
  }
  return false
}

function nearestContour(rects, point, entities, sheet) {
  let best = null
  for (const item of rects) {
    const box = item.box
    const w = rectWidth(box)
    const h = rectHeight(box)
    if (sheet && w >= sheet.width - 1 && h >= sheet.height - 1) continue
    if (sheet && w >= sheet.width * 0.85 && h >= sheet.height * 0.85) continue
    const dx = Math.max(box.x0 - point.x, 0, point.x - box.x1)
    const dy = Math.max(box.y0 - point.y, 0, point.y - box.y1)
    const d = Math.hypot(dx, dy)
    const inside = rectContainsPoint(box, point, 0)
    const rank = inside ? -w * h : d
    if (!best || rank < best.rank) best = { box, distance: d, inside, rank }
  }
  for (const entity of entities) {
    if (entity.type !== 'CIRCLE') continue
    const d = Math.abs(distance({ x: entity.cx, y: entity.cy }, point) - entity.radius)
    if (!best || d < best.distance) best = { box: entity.bbox, distance: d, inside: false, circle: true }
  }
  return best
}

// ── 尺寸 ──
function detectDimensions(texts, entities, regions, sheet, fcf, roughness, balloons) {
  const excluded = new Set()
  for (const frame of fcf) for (const item of frame.texts) excluded.add(item.id)
  for (const item of roughness) excluded.add(item.ref.id)
  for (const balloon of balloons || []) excluded.add(balloon.ref.id)

  const dimensions = []
  // 1) DIMENSION 实体（CAD 原生标注）
  for (const entity of entities) {
    if (entity.type !== 'DIMENSION') continue
    if (regions.titleBlock && entity.bbox && rectContainsPoint(regions.titleBlock, { x: entity.x, y: entity.y }, 2)) continue
    const typeCode = entity.dimType & 7
    const kind = ['linear', 'aligned', 'angular', 'diameter', 'radius', 'angular', 'ordinate'][typeCode] || 'linear'
    let value = Number.isFinite(entity.measurement) ? entity.measurement : null
    let text = entity.textOverride || (value !== null ? formatDimValue(value) : '')
    const parsed = parseDimensionText(text)
    if (parsed.value !== null && (value === null || !Number.isFinite(value))) value = parsed.value
    if (parsed.value !== null) value = parsed.value
    const drawn = dimensionDrawnLength(entity, kind)
    dimensions.push({
      source: 'entity',
      id: entity.handle || `dim-${dimensions.length + 1}`,
      kind: parsed.kind || kind,
      value,
      text: text || String(value ?? ''),
      height: null,
      rotation: Number(entity.textRotation ?? entity.rotation ?? 0),
      dimLine: { a: { x: entity.x, y: entity.y }, b: { x: entity.ext1X, y: entity.ext1Y } },
      extLineCount: kind === 'diameter' || kind === 'radius' ? 0 : 2,
      hasDimLine: true,
      leader: kind === 'diameter' || kind === 'radius',
      measured: drawn,
      position: { x: entity.textX || entity.x, y: entity.textY || entity.y },
      entityId: entity.handle,
    })
  }
  // 2) 被打散的标注（TEXT + 线）
  for (const item of texts) {
    if (item.role !== 'drawing') continue
    if (excluded.has(item.id)) continue
    const parsed = parseDimensionText(item.text)
    if (parsed.value === null) continue
    const geometry = findDimensionGeometry(item, entities, sheet)
    if (!geometry.dimLine && !geometry.leader && parsed.kind !== 'linear') continue
    if (!geometry.dimLine && !geometry.leader) continue
    const measured = geometry.measured
    dimensions.push({
      source: 'exploded',
      id: item.id,
      kind: parsed.kind,
      value: parsed.value,
      text: item.text,
      height: item.height,
      rotation: item.rotation,
      dimLine: geometry.dimLine,
      extLineCount: geometry.extLineCount,
      hasDimLine: Boolean(geometry.dimLine),
      leader: Boolean(geometry.leader),
      leaderEnd: geometry.leaderEnd,
      leaderTerminator: geometry.leaderTerminator,
      position: { x: item.x, y: item.y },
      box: item.box,
      measured,
      entityId: item.id,
      overridden: parsed.overridden,
    })
  }
  return dimensions
}

function dimensionDrawnLength(entity, kind) {
  const hasExt = [entity.ext1X, entity.ext1Y, entity.ext2X, entity.ext2Y].every(Number.isFinite)
  if (!hasExt) return Number.isFinite(entity.measurement) ? entity.measurement : null
  const dx = entity.ext2X - entity.ext1X
  const dy = entity.ext2Y - entity.ext1Y
  if (kind === 'aligned') return Math.hypot(dx, dy)
  const angle = ((entity.rotation || 0) * Math.PI) / 180
  const projected = Math.abs(dx * Math.cos(angle) + dy * Math.sin(angle))
  if (projected > 0.01) return projected
  return Math.hypot(dx, dy)
}

function formatDimValue(value) {
  const rounded = Math.round(value * 100) / 100
  return String(rounded)
}

export function parseDimensionText(raw) {
  const text = String(raw ?? '').trim()
  if (!text) return { value: null, kind: 'unknown' }
  if (/[°度]/.test(text) && /\d/.test(text)) {
    const match = text.match(/(\d+(?:\.\d+)?)/)
    return { value: match ? Number(match[1]) : null, kind: 'angle' }
  }
  const countDia = text.match(/^(\d+)\s*[×xX]\s*[φΦ]\s*(\d+(?:\.\d+)?)/)
  if (countDia) return { value: Number(countDia[2]), kind: 'diameter', count: Number(countDia[1]), prefix: 'φ' }
  const fit = text.match(/^[S]?[φΦ]?\s*(\d+(?:\.\d+)?)\s*[A-Za-z]+\d+\s*\/\s*[A-Za-z]+\d+/)
  if (fit) return { value: Number(fit[1]), kind: 'fit', prefix: /[φΦ]/.test(text) ? 'φ' : '' }
  const dia = text.match(/^[S]?\s*[φΦ]\s*(\d+(?:\.\d+)?)/)
  if (dia) return { value: Number(dia[1]), kind: 'diameter', prefix: 'φ' }
  const radius = text.match(/^[S]?\s*R\s*(\d+(?:\.\d+)?)/i)
  if (radius) return { value: Number(radius[1]), kind: 'radius', prefix: 'R' }
  const sphere = text.match(/^S\s*[φΦ]\s*(\d+(?:\.\d+)?)/i)
  if (sphere) return { value: Number(sphere[1]), kind: 'diameter', prefix: 'Sφ' }
  const plain = text.match(/^(\d+(?:\.\d+)?)/)
  if (plain) {
    const rest = text.slice(plain[0].length)
    if (/^[\s]*(±|[+-]\d|H\d|h\d|[A-Za-z]\d)/.test(rest)) {
      return { value: Number(plain[1]), kind: 'tolerance', prefix: '' }
    }
    return { value: Number(plain[1]), kind: 'linear', prefix: '' }
  }
  return { value: null, kind: 'unknown' }
}

function findDimensionGeometry(textItem, entities, sheet) {
  const center = textItem.box.center
  const maxDistance = Math.max(7, textItem.height * 2.2)
  const search = rectExpand(textItem.box, 14)
  const lineCandidates = []
  const leaders = []
  for (const entity of entities) {
    if (entity.bbox && !bboxIntersects(search, entity.bbox)) continue
    if (entity.type === 'LINE' && isLeaderLayer(entity.layer)) {
      const a = { x: entity.x0, y: entity.y0 }
      const b = { x: entity.x1, y: entity.y1 }
      const length = distance(a, b)
      if (length < 3) continue
      const segment = { a, b }
      const d = pointSegmentDistance(center, segment)
      const projected = projectPoint(center, segment)
      const inside = projected.t >= -0.05 && projected.t <= 1.05
      const inBox = rectContainsPoint(rectExpand(textItem.box, 4), a, 0) || rectContainsPoint(rectExpand(textItem.box, 4), b, 0)
      if (inBox && length < 40) {
        leaders.push({ a, b, length })
      }
      if (inside && d <= maxDistance) lineCandidates.push({ a, b, length, distance: d })
    } else if (entity.type === 'LEADER' && entity.points?.length >= 2) {
      const points = entity.points
      const a = points[0]
      const b = points[points.length - 1]
      if (rectContainsPoint(rectExpand(textItem.box, 6), a, 0) || rectContainsPoint(rectExpand(textItem.box, 6), b, 0)) {
        leaders.push({ a, b, length: distance(a, b), polyline: points })
      }
    }
  }
  // 尺寸线：优先选择与文本邻近、且长度足够、非引出线的线段
  let dimLine = null
  const sorted = lineCandidates.sort((a, b) => a.distance - b.distance || b.length - a.length)
  if (sorted.length && leaders.length === 0) {
    const candidate = sorted[0]
    const angle = segmentAngle(candidate)
    const textAngle = normalizeAngle(textItem.rotation)
    const parallel = Math.abs(angle - textAngle) < 8 || Math.abs(angle - textAngle - 90) < 8
    if (parallel || candidate.length > 20) dimLine = candidate
  }
  let extLineCount = 0
  let measured = null
  if (dimLine) {
    const angle = segmentAngle(dimLine)
    const endpoints = [dimLine.a, dimLine.b]
    const extensions = []
    for (const entity of entities) {
      if (entity.type !== 'LINE') continue
      const a = { x: entity.x0, y: entity.y0 }
      const b = { x: entity.x1, y: entity.y1 }
      const length = distance(a, b)
      if (length < 1.5 || length > 40) continue
      const lineAngle = segmentAngle({ a, b })
      const isPerp = Math.abs(Math.abs(lineAngle - angle) - 90) < 8
      if (!isPerp) continue
      const nearEnd = endpoints.some(endpoint => pointSegmentDistance(endpoint, { a, b }) <= 1.2)
      if (nearEnd) extensions.push({ a, b, length })
    }
    extLineCount = extensions.length
    if (extensions.length >= 2) {
      const ends = extensions.map(item => (distance(item.a, dimLine.a) < distance(item.b, dimLine.a) ? item.b : item.a))
      const p1 = ends[0]
      const p2 = ends[1]
      const dx = dimLine.b.x - dimLine.a.x
      const dy = dimLine.b.y - dimLine.a.y
      const length = Math.hypot(dx, dy) || 1
      const ux = dx / length
      const uy = dy / length
      measured = Math.abs((p2.x - p1.x) * ux + (p2.y - p1.y) * uy)
    } else if (!extensions.length) {
      measured = distance(dimLine.a, dimLine.b)
    }
  }
  // 引出线：取离文字最近的一条，且远端不在文字框内
  let leader = null
  let leaderEnd = null
  let leaderTerminator = false
  for (const item of leaders.sort((a, b) => a.length - b.length)) {
    const aIn = rectContainsPoint(textItem.box, item.a, 1.5)
    const bIn = rectContainsPoint(textItem.box, item.b, 1.5)
    if (aIn === bIn) continue
    leader = { a: item.a, b: item.b }
    leaderEnd = aIn ? item.b : item.a
    break
  }
  return {
    dimLine,
    extLineCount,
    measured,
    leader,
    leaderEnd,
    leaderTerminator: leaderEnd ? hasTerminator(entities, leaderEnd) : false,
  }
}

function projectPoint(point, segment) {
  const dx = segment.b.x - segment.a.x
  const dy = segment.b.y - segment.a.y
  const lengthSq = dx * dx + dy * dy
  if (lengthSq < 1e-6) return { t: 0, distance: distance(point, segment.a) }
  const t = ((point.x - segment.a.x) * dx + (point.y - segment.a.y) * dy) / lengthSq
  return { t }
}

// ── 汇总与证据 ──
function buildSummary(model) {
  const layers = {}
  for (const layer of model.layers || []) layers[layer.name] = layer.lineweight
  return {
    sheet: `${model.sheet.format} ${Math.round(model.sheet.width)}×${Math.round(model.sheet.height)} mm（${model.sheet.orientation}）`,
    frameMargins: model.frame?.margins || null,
    titleBlock: model.titleBlock?.fields
      ? {
          name: model.titleBlock.fields.name?.text || null,
          code: model.titleBlock.fields.code?.text || null,
          material: model.titleBlock.fields.material?.text || null,
          scale: model.titleBlock.fields.scale?.label || null,
          version: model.titleBlock.fields.version?.label || null,
          sheetCount: model.titleBlock.fields.sheetCount?.label || null,
          stage: model.titleBlock.fields.stage?.value?.text || null,
          signatures: Object.fromEntries(
            Object.entries(model.titleBlock.fields.signatures).map(([key, value]) => [key, value.value?.text || null])
          ),
        }
      : null,
    bomItems: (model.bom?.rows || []).map(row => ({
      index: row.index,
      code: row.code,
      name: row.name,
      quantity: row.quantity,
      material: row.material,
    })),
    balloonNumbers: model.balloons.map(item => item.number),
    dimensionCount: model.dimensions.length,
    textHeightGroups: summarizeTextHeights(model.texts),
    layers,
    fcf: model.fcf.map(item => ({
      height: item.height,
      cells: item.cells,
      value: item.value,
      symbol: item.symbol,
      datumLetters: item.datumLetters,
      position: [Math.round(item.box.x0), Math.round(item.box.y0)],
    })),
    roughness: model.roughness.map(item => ({ text: item.text, hasRa: item.hasRa, topRight: item.topRight })),
    techHeights: model.tech.heights,
  }
}

function summarizeTextHeights(texts) {
  const groups = {}
  for (const item of texts) {
    const key = item.role === 'drawing' ? 'drawing' : item.role
    if (!groups[key]) groups[key] = {}
    const height = Math.round(item.height * 100) / 100
    groups[key][height] = (groups[key][height] || 0) + 1
  }
  return groups
}

function buildEvidence(model, options) {
  const maxTexts = options.maxEvidenceTexts || 160
  const drawingTexts = model.texts
    .slice(0, maxTexts)
    .map(item => ({
      id: item.id,
      kind: item.kind,
      text: item.text,
      height: item.height,
      rotation: Math.round(item.rotation),
      x: Math.round(item.x * 10) / 10,
      y: Math.round(item.y * 10) / 10,
      originalPosition: Number.isFinite(item.x) && Number.isFinite(item.y) ? { x: item.x, y: item.y } : null,
      layer: item.layer,
      role: item.role,
    }))
  return {
    title: model.summary,
    texts: drawingTexts,
    dimensions: model.dimensions.slice(0, 80).map(item => ({
      id: item.id,
      source: item.source,
      text: item.text,
      kind: item.kind,
      value: item.value,
      measured: item.measured,
      height: item.height,
      rotation: Math.round(item.rotation),
      extLines: item.extLineCount,
      leader: item.leader,
      position: [Math.round(item.position.x), Math.round(item.position.y)],
      originalPosition: Number.isFinite(item.position?.x) && Number.isFinite(item.position?.y) ? { x: item.position.x, y: item.position.y } : null,
    })),
    balloons: model.balloons.map(item => ({
      number: item.number,
      position: [Math.round(item.ref.x), Math.round(item.ref.y)],
      hasDot: item.hasDot,
      crosses: item.crossesContour,
    })),
    lineWidths: model.lines
      ? Object.fromEntries(Object.entries(model.lines).map(([role, items]) => [role, [...new Set(items.map(item => item.lineweight))]]))
      : {},
    coverage: { totalTexts: model.texts.length, includedTexts: drawingTexts.length, totalDimensions: model.dimensions.length, includedDimensions: Math.min(model.dimensions.length, 80), note: '文字和尺寸数量受上限限制；其他图元未逐一提供。' },
  }
}

export { SHEET_FORMATS, SIGNATURE_LABELS, median, mode, segmentLength, segmentsIntersect, entitySegments, isHorizontal, isVertical }
