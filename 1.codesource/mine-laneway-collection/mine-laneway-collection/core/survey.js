import { decodeDxf, cleanMText } from './parse.js'
import {
  colorLayerOrder,
  colorPriorityMap,
  entityColorDescriptor,
  layerColorKey,
  resolveColorKey,
} from './colors.js'
import { parseElev, parsePointName } from './nodes.js'

// IDs identify expanded entity instances, not just reusable block definitions.
export function extractSurvey(bytes, options = {}) {
  const lines = decodeDxf(bytes).split(/\r\n|\n|\r/)
  const blocks = new Map(), roots = []
  const layerColors = new Map([['0', 'aci:7']])
  let section = '', pending = false, block = null, record = null, count = 0
  const finish = () => {
    if (!record) return
    const f = record.fields, type = record.type
    if (section === 'TABLES' && type === 'LAYER' && f[2]) layerColors.set(f[2], layerColorKey(f))
    if (section === 'BLOCKS' && type === 'BLOCK') {
      block = { name: f[2] || f[3], x: Number(f[10]) || 0, y: Number(f[20]) || 0, entities: [] }
      blocks.set(block.name, block)
    } else if (section === 'BLOCKS' && type === 'ENDBLK') block = null
    else if ((section === 'ENTITIES' || (section === 'BLOCKS' && block)) && ['CIRCLE', 'TEXT', 'MTEXT', 'ATTRIB', 'INSERT'].includes(type)) {
      if (++count > 400000) throw new Error('图纸实体超过 40 万个。')
      ;(block ? block.entities : roots).push(record)
    }
    record = null
  }
  for (let i = 0; i + 1 < lines.length; i += 2) {
    const code = Number(lines[i].trim()), value = lines[i + 1]
    if (!lines[i].trim() || !Number.isInteger(code)) throw new Error('DXF 组码异常。')
    if (pending && code === 2) { section = value.trim(); pending = false; continue }
    if (code === 0) {
      finish()
      const type = value.trim()
      if (type === 'SECTION') pending = true
      else if (type === 'ENDSEC') { section = ''; block = null }
      else if (type !== 'EOF') record = { type, fields: {}, chunks: [] }
    } else if (record) {
      if (record.type === 'MTEXT' && (code === 1 || code === 3)) record.chunks.push(value)
      else record.fields[code] = value
    }
  }
  finish()
  const entities = {}, circles = [], texts = [], warnings = []
  let entitySequence = 0, blockInstanceSequence = 0
  const transform = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]
  const expand = (records, matrix, inheritedLayer, stack, blockRefId = null, blockPath = [], inheritedColor = null) => {
    for (const record of records) {
      const f = record.fields, n = (key, fallback = 0) => f[key] == null ? fallback : Number(f[key])
      const layer = !f[8] || f[8] === '0' ? inheritedLayer : f[8]
      const colorInfo = entityColorDescriptor(f)
      const color = resolveColorKey(layerColors, layer, colorInfo, inheritedColor)
      if (record.type === 'INSERT') {
        const b = blocks.get(f[2])
        if (!b || stack.includes(f[2]) || stack.length >= 8) { warnings.push(`无法展开块参照: ${f[2] || ''}`); continue }
        const sx = n(41, 1), sy = n(42, 1), a = n(50) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a)
        const local = [sx*c, sx*s, -sy*s, sy*c, n(10)-sx*c*b.x+sy*s*b.y, n(20)-sx*s*b.x-sy*c*b.y]
        const m = [matrix[0]*local[0]+matrix[2]*local[1], matrix[1]*local[0]+matrix[3]*local[1], matrix[0]*local[2]+matrix[2]*local[3], matrix[1]*local[2]+matrix[3]*local[3], ...transform(matrix, local[4], local[5])]
        const instanceId = `block-${++blockInstanceSequence}`
        expand(
          b.entities,
          m,
          layer,
          [...stack, f[2]],
          blockRefId || instanceId,
          [...blockPath, { id: instanceId, name: f[2] || '' }],
          color,
        )
        continue
      }
      const aligned = record.type !== 'MTEXT' && (n(72) !== 0 || n(73) !== 0) && ![3, 5].includes(n(72)) && f[11] != null && f[21] != null
      const x = n(aligned ? 11 : 10), y = n(aligned ? 21 : 20)
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue
      const [px, py] = transform(matrix, x, y)
      const id = `entity-${++entitySequence}`
      let item
      if (record.type === 'CIRCLE') {
        const radius = n(40), sx = Math.hypot(matrix[0], matrix[1]), sy = Math.hypot(matrix[2], matrix[3])
        if (!(radius > 0) || Math.abs(sx - sy) > 1e-9 * Math.max(sx, sy) || Math.abs(matrix[0]*matrix[2]+matrix[1]*matrix[3]) > 1e-9 * sx * sy) continue
        item = {
          id,
          type: record.type,
          layer,
          x: px,
          y: py,
          radius: radius * sx,
          handle: f[5] || null,
          block_ref_id: blockRefId,
          block_path: blockPath,
          color,
          color_source: colorInfo,
        }
        circles.push(item)
      } else {
        const raw = record.type === 'MTEXT' ? record.chunks.join('') : (f[1] || '')
        if (!raw) continue
        const angle = n(50) * Math.PI / 180, dx = Math.cos(angle), dy = Math.sin(angle)
        item = {
          id,
          type: record.type,
          layer,
          x: px,
          y: py,
          rotation: Math.atan2(matrix[1]*dx+matrix[3]*dy, matrix[0]*dx+matrix[2]*dy)*180/Math.PI,
          raw_text: raw,
          text: cleanMText(raw),
          height: n(40, 0),
          handle: f[5] || null,
          block_ref_id: blockRefId,
          block_path: blockPath,
          color,
          color_source: colorInfo,
        }
        texts.push(item)
      }
      entities[id] = item
    }
  }
  expand(roots, [1, 0, 0, 1, 0, 0], '0', [])
  const textHeights = texts.map(text => text.height).filter(height => Number.isFinite(height) && height > 0).sort((a, b) => a - b)
  // Point names are usually among the smaller annotation texts. The upper half
  // is dominated by title/table text and would inflate the association radius.
  const medianTextHeight = textHeights.length ? textHeights[Math.floor((textHeights.length - 1) * 0.1)] : null
  // Relate the search radius to this drawing's text size instead of assuming a
  // metric length. The calibration pair put the 90th percentile label offset
  // near eight text heights.
  const radius = options.textRadius == null
    ? (medianTextHeight === null ? 12 : Math.max(1, medianTextHeight * 8))
    : Number(options.textRadius)
  const limit = options.maxTextsPerCircle == null ? 20 : Number(options.maxTextsPerCircle)
  if ((radius != null && (!Number.isFinite(radius) || radius < 0)) || !Number.isInteger(limit) || limit < 1) throw new Error('候选关联参数无效。')
  const grid = new Map()
  const cellSize = Math.max(radius || 12, 1)
  for (const text of texts) {
    const key = `${Math.floor(text.x / cellSize)},${Math.floor(text.y / cellSize)}`
    if (!grid.has(key)) grid.set(key, [])
    grid.get(key).push(text)
  }
  const candidates = circles.filter(circle => circle.radius >= 0.3 && circle.radius <= 0.75).map(circle => {
    const nearby = []
    const gx = Math.floor(circle.x / cellSize), gy = Math.floor(circle.y / cellSize)
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
      for (const t of grid.get(`${gx + dx},${gy + dy}`) || []) {
        const distance = Math.hypot(t.x - circle.x, t.y - circle.y)
        if (radius == null || distance <= radius) nearby.push({ id: t.id, distance })
      }
    }
    nearby.sort((a, b) => a.distance - b.distance || a.id.localeCompare(b.id))
    return { id: circle.id, circle_id: circle.id, nearby_texts: nearby.slice(0, limit) }
  })
  return { entities, candidates, warnings, summary: { circles: circles.length, texts: texts.length, units: 'drawing', textRadiusDrawingUnits: radius, medianTextHeightDrawingUnits: medianTextHeight } }
}

export function assembleSurvey(state, decisions, options = {}) {
  const priority = colorPriorityMap(options.colorPriority || [])
  const seen = new Set(), usedTexts = new Set(), points = []
  for (const d of decisions) {
    const candidate = state.candidates.find(c => c.id === d.candidate_id)
    if (!candidate || seen.has(d.candidate_id)) throw new Error('候选 ID 无效或重复。')
    seen.add(d.candidate_id)
    if (d.accept !== true) continue
    const allowed = new Set(candidate.nearby_texts.map(t => t.id))
    for (const id of [d.name_text_id, d.elevation_text_id].filter(Boolean)) {
      if (!allowed.has(id)) throw new Error('确认的文字不属于该候选。')
      if (usedTexts.has(id)) throw new Error('同一文字不能被多个测点重复使用。')
    }
    if (typeof d.name_text_id !== 'string' || !d.name_text_id) throw new Error('测点必须包含编号文字。')
    if (d.elevation_text_id !== null && typeof d.elevation_text_id !== 'string') throw new Error('高程文字证据格式无效。')
    if (d.elevation_text_id === '') throw new Error('高程文字证据格式无效。')
    const nameText = state.entities[d.name_text_id].text.trim()
    const nameEntity = state.entities[d.name_text_id]
    const pointName = parsePointName(nameText) || (/^(?:[A-Za-z]{1,4}\d{1,5}['′]?|\d{1,5})$/.test(nameText) ? nameText : null)
    const elevationText = d.elevation_text_id === null ? '' : state.entities[d.elevation_text_id].text.trim()
    const elevationEntity = d.elevation_text_id === null ? null : state.entities[d.elevation_text_id]
    const elevation = d.elevation_text_id === null ? null : parseElev(elevationText)
    if (d.name_text_id === d.elevation_text_id && /^\d+$/.test(nameText)) throw new Error('纯数字编号与高程必须使用不同文字证据。')
    if (!pointName || (d.elevation_text_id !== null && elevation === null)) throw new Error('测点文字证据不符合编号或高程格式。')
    const suffixMatch = elevationText.match(/[+\-]?\d{2,4}(?:\.\d{1,4})?\s*([A-Za-z\u4e00-\u9fff⊥·]+|[（(][^()（）]+[）)])\s*$/)
    const suffix = suffixMatch ? suffixMatch[1] : ''
    if ((d.elevation != null || d.elevation_suffix != null) && !d.elevation_text_id) throw new Error('高程及后缀必须关联文字证据。')
    if (d.elevation != null && (typeof d.elevation !== 'number' || !Number.isFinite(d.elevation))) throw new Error('高程必须为有限数值或 null。')
    if ((d.point_name != null && typeof d.point_name !== 'string') || (d.elevation_suffix != null && typeof d.elevation_suffix !== 'string')) throw new Error('测点名称和高程后缀必须为字符串或 null。')
    for (const id of [d.name_text_id, d.elevation_text_id].filter(Boolean)) usedTexts.add(id)
    const circle = state.entities[candidate.circle_id]
    points.push({
      point_name: pointName,
      x: circle.x,
      y: circle.y,
      elevation,
      elevation_text: d.elevation_text_id === null ? '' : state.entities[d.elevation_text_id].raw_text,
      elevation_text_raw: d.elevation_text_id === null ? null : state.entities[d.elevation_text_id].raw_text,
      elevation_suffix: suffix,
      elevation_status: elevation === null ? 'missing' : 'measured',
      circle_radius: circle.radius,
      block_ref_id: circle.block_ref_id || null,
      circle_id: candidate.circle_id,
      circle_layer: circle.layer || '0',
      circle_color: circle.color || null,
      color_group: circle.color || `layer:${circle.layer || '0'}`,
      color_layer_order: colorLayerOrder(circle.color, priority),
      source_handle: circle.handle || null,
      source_block_path: circle.block_path || [],
      name_text_id: d.name_text_id,
      name_text: nameEntity.raw_text ?? nameEntity.text,
      name_text_color: nameEntity.color || null,
      elevation_text_id: d.elevation_text_id,
      elevation_text_color: elevationEntity?.color || null,
    })
  }
  return points
}
