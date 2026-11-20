// 纯 JavaScript DXF 读取器：只解析审查需要的组码，不依赖第三方库。
// 支持 ASCII DXF（R12 ~ R2018），含块展开、图层/线型表、常用图元与 DIMENSION 实体。

const MAX_EXPANDED_ENTITIES = 200000
const MAX_INSERT_DEPTH = 4

export class DxfParseError extends Error {
  constructor(message, code = 'DXF_PARSE_FAILED') {
    super(message)
    this.name = 'DxfParseError'
    this.code = code
  }
}

export function decodeDxfBuffer(buffer) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  if (bytes.length === 0) throw new DxfParseError('文件内容为空', 'DXF_EMPTY')
  if (bytes.length >= 22) {
    const head = Buffer.from(bytes.subarray(0, 22)).toString('latin1')
    if (head.startsWith('AutoCAD Binary DXF')) {
      throw new DxfParseError('二进制 DXF 暂不支持，请在 CAD 中另存为 ASCII DXF', 'DXF_BINARY_UNSUPPORTED')
    }
    if (/^AC10\d\d$/.test(head.slice(0, 6)) && bytes[6] === 0) {
      throw new DxfParseError('这是 DWG 文件，请先另存为 DXF 后再审查', 'DXF_DWG_UNSUPPORTED')
    }
  }

  try {
    const utf8 = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    return { text: utf8, encoding: 'utf-8' }
  } catch {
    // 继续尝试 GB18030
  }
  const gb = tryDecode(bytes, 'gb18030')
  if (gb !== null) return { text: gb, encoding: 'gb18030' }
  const latin = tryDecode(bytes, 'windows-1252')
  if (latin !== null) return { text: latin, encoding: 'windows-1252' }
  return { text: Buffer.from(bytes).toString('latin1'), encoding: 'latin1' }
}

function tryDecode(bytes, encoding) {
  try {
    return new TextDecoder(encoding, { fatal: false }).decode(bytes)
  } catch {
    return null
  }
}

function tokenize(text) {
  const lines = text.split(/\r\n|\r|\n/)
  const tokens = []
  let index = 0
  while (index < lines.length - 1) {
    const codeText = lines[index].trim()
    if (!/^-?\d+$/.test(codeText)) {
      index += 1
      continue
    }
    tokens.push([Number.parseInt(codeText, 10), lines[index + 1]])
    index += 2
  }
  return tokens
}

// 把 0 组码记录切分出来，保留记录内的其余组码
function splitRecords(tokens, startIndex) {
  const records = []
  let index = startIndex
  let current = null
  while (index < tokens.length) {
    const [code, value] = tokens[index]
    const token = String(value || '').trim()
    if (code === 0) {
      if (current) records.push(current)
      if (token === 'ENDSEC') {
        records.push({ type: 'ENDSEC', pairs: [] })
        return { records, nextIndex: index + 1 }
      }
      current = { type: token, pairs: [] }
    } else if (current) {
      current.pairs.push([code, value])
    }
    index += 1
  }
  if (current) records.push(current)
  return { records, nextIndex: index }
}

function findSection(tokens) {
  const sections = new Map()
  let index = 0
  while (index < tokens.length) {
    const [code, value] = tokens[index]
    if (code === 0 && String(value).trim() === 'SECTION') {
      let name = ''
      let cursor = index + 1
      while (cursor < tokens.length && cursor < index + 6) {
        if (tokens[cursor][0] === 2) {
          name = String(tokens[cursor][1]).trim().toUpperCase()
          break
        }
        cursor += 1
      }
      const start = cursor + 1
      const { records, nextIndex } = splitRecords(tokens, start)
      sections.set(name, { records, raw: tokens.slice(start, nextIndex - 1) })
      index = nextIndex
      continue
    }
    index += 1
  }
  return sections
}

function pairValues(record) {
  const map = new Map()
  for (const [code, value] of record.pairs) {
    if (!map.has(code)) map.set(code, [])
    map.get(code).push(value)
  }
  return map
}

function makeReader(record) {
  const values = pairValues(record)
  return {
    values,
    one: (code, fallback = '') => {
      const list = values.get(code)
      return list && list.length ? list[0] : fallback
    },
    all: code => values.get(code) || [],
    nums: code => (values.get(code) || []).map(toNumber),
  }
}

export function parseDxf(text) {
  if (typeof text !== 'string' || !text.trim()) throw new DxfParseError('DXF 内容为空', 'DXF_EMPTY')
  const tokens = tokenize(text)
  if (tokens.length === 0) throw new DxfParseError('DXF 内容无法解析', 'DXF_PARSE_FAILED')
  const sections = findSection(tokens)
  if (!sections.has('ENTITIES')) {
    throw new DxfParseError('未找到 ENTITIES 段，可能不是有效的 DXF 文件', 'DXF_NO_ENTITIES')
  }

  const header = parseHeader(sections.get('HEADER')?.raw || [])
  const layers = new Map()
  const linetypes = new Map()
  parseTables(sections.get('TABLES')?.records || [], layers, linetypes)
  const blocks = parseBlocks(sections.get('BLOCKS')?.records || [])
  const warnings = []
  const entities = []
  parseEntities(sections.get('ENTITIES')?.records || [], entities, blocks, warnings)
  if (entities.length === 0) warnings.push('图纸中没有可识别的图元')
  if (entities.length >= MAX_EXPANDED_ENTITIES) warnings.push('图元数量过多，已截断部分块展开内容')

  const layerList = [...layers.values()]
    .filter(layer => layer.name)
    .map(layer => ({
      name: layer.name,
      lineweight: normalizeLineweight(layer.lineweight),
      rawLineweight: layer.lineweight,
      linetype: layer.linetype || 'CONTINUOUS',
      color: layer.color,
      off: (layer.color ?? 7) < 0,
      frozen: (layer.flags & 1) === 1,
    }))
  const layerMap = new Map(layerList.map(layer => [layer.name.toUpperCase(), layer]))
  const linetypeMap = new Map([...linetypes.values()].map(item => [item.name.toUpperCase(), item]))

  const resolved = entities.map(entity => {
    const layer = layerMap.get(String(entity.layer || '0').toUpperCase())
    const lineweight =
      entity.lineweight > 0 ? entity.lineweight / 100 : layer && layer.lineweight > 0 ? layer.lineweight : 0.25
    const linetype =
      entity.linetype && entity.linetype.toUpperCase() !== 'BYLAYER'
        ? entity.linetype
        : layer
          ? layer.linetype
          : 'CONTINUOUS'
    return {
      ...entity,
      effectiveLineweight: round(lineweight, 3),
      effectiveLinetype: String(linetype || 'CONTINUOUS').toUpperCase(),
      layerLineweight: layer ? layer.lineweight : 0.25,
      layerLinetype: layer ? layer.linetype : 'CONTINUOUS',
      layerKnown: Boolean(layer),
    }
  })

  const bbox = computeExtents(resolved)
  const headerBbox = header.extMin && header.extMax
    ? {
        x0: Math.min(header.extMin.x, header.extMax.x),
        y0: Math.min(header.extMin.y, header.extMax.y),
        x1: Math.max(header.extMin.x, header.extMax.x),
        y1: Math.max(header.extMin.y, header.extMax.y),
      }
    : null
  return {
    version: header.acadVersion || '',
    encodingHint: header.dwgCodePage || '',
    header,
    layers: layerList,
    linetypes: [...linetypeMap.values()],
    blocks: [...blocks.keys()],
    entities: resolved,
    bbox,
    headerBbox,
    warnings,
  }
}

function parseHeader(tokens) {
  const header = {
    acadVersion: '',
    dwgCodePage: '',
    insertUnits: 0,
    measurement: 0,
    dimScale: 1,
    lineTypeScale: 1,
    extMin: null,
    extMax: null,
    limits: null,
    vars: {},
  }
  let variable = null
  for (const [code, value] of tokens) {
    if (code === 9) {
      variable = String(value).trim()
      header.vars[variable] = []
    } else if (variable) {
      header.vars[variable].push([code, value])
    }
  }
  const get = (name, code, fallback = '') => {
    const list = header.vars[name]
    if (!Array.isArray(list)) return fallback
    const found = list.find(item => item[0] === code)
    return found ? found[1] : fallback
  }
  header.acadVersion = String(get('$ACADVER', 1, '')).trim()
  header.dwgCodePage = String(get('$DWGCODEPAGE', 3, '')).trim()
  header.insertUnits = Number.parseInt(get('$INSUNITS', 70, '0'), 10) || 0
  header.measurement = Number.parseInt(get('$MEASUREMENT', 70, '0'), 10) || 0
  header.dimScale = Number.parseFloat(get('$DIMSCALE', 40, '1')) || 1
  header.lineTypeScale = Number.parseFloat(get('$LTSCALE', 40, '1')) || 1
  const ext = readExtents(get('$EXTMIN', 10, 'NaN'), get('$EXTMIN', 20, 'NaN'), get('$EXTMAX', 10, 'NaN'), get('$EXTMAX', 20, 'NaN'))
  if (ext) {
    header.extMin = { x: ext.x0, y: ext.y0 }
    header.extMax = { x: ext.x1, y: ext.y1 }
  }
  const lim = readExtents(get('$LIMMIN', 10, 'NaN'), get('$LIMMIN', 20, 'NaN'), get('$LIMMAX', 10, 'NaN'), get('$LIMMAX', 20, 'NaN'))
  if (lim) header.limits = lim
  return header
}

function readExtents(x0, y0, x1, y1) {
  const values = [x0, y0, x1, y1].map(value => Number.parseFloat(value))
  if (!values.every(Number.isFinite)) return null
  if (Math.abs(values[0]) > 1e10 || Math.abs(values[1]) > 1e10) return null
  return { x0: Math.min(values[0], values[2]), y0: Math.min(values[1], values[3]), x1: Math.max(values[0], values[2]), y1: Math.max(values[1], values[3]) }
}

function parseTables(records, layers, linetypes) {
  let table = ''
  for (const record of records) {
    const reader = makeReader(record)
    if (record.type === 'TABLE') {
      table = String(reader.one(2, '')).trim().toUpperCase()
      continue
    }
    if (record.type === 'ENDTAB') {
      table = ''
      continue
    }
    if (table === 'LAYER' && record.type === 'LAYER') {
      const layer = {
        name: String(reader.one(2, '')).trim(),
        lineweight: Number.parseInt(reader.one(370, '-3'), 10),
        linetype: String(reader.one(6, 'CONTINUOUS')).trim() || 'CONTINUOUS',
        color: Number.parseInt(reader.one(62, '7'), 10) || 7,
        flags: Number.parseInt(reader.one(70, '0'), 10) || 0,
      }
      if (layer.name) layers.set(layer.name.toUpperCase(), layer)
    } else if (table === 'LTYPE' && record.type === 'LTYPE') {
      const ltype = {
        name: String(reader.one(2, '')).trim(),
        description: String(reader.one(3, '')).trim(),
        pattern: reader.nums(49),
      }
      if (ltype.name) linetypes.set(ltype.name.toUpperCase(), ltype)
    }
  }
}

function parseBlocks(records) {
  const blocks = new Map()
  let current = null
  for (const record of records) {
    if (record.type === 'BLOCK') {
      const reader = makeReader(record)
      current = {
        name: String(reader.one(2, '')).trim(),
        baseX: toNumber(reader.one(10, '0')),
        baseY: toNumber(reader.one(20, '0')),
        entities: [],
      }
      continue
    }
    if (record.type === 'ENDBLK') {
      if (current && current.name) blocks.set(current.name.toUpperCase(), current)
      current = null
      continue
    }
    if (!current) continue
    const entity = normalizeEntity(record)
    if (entity) current.entities.push(entity)
  }
  return blocks
}

function parseEntities(records, out, blocks, warnings) {
  for (let i = 0; i < records.length; i += 1) {
    const record = records[i]
    if (record.type === 'ENDSEC') break
    if (record.type === 'POLYLINE') {
      const vertices = []
      let j = i + 1
      while (j < records.length && records[j].type === 'VERTEX') {
        const vertexReader = makeReader(records[j])
        vertices.push({
          x: toNumber(vertexReader.one(10, '0')),
          y: toNumber(vertexReader.one(20, '0')),
          bulge: toNumber(vertexReader.one(42, '0')),
        })
        j += 1
      }
      if (j < records.length && records[j].type === 'SEQEND') j += 1
      const entity = normalizePolyline(record, vertices)
      if (entity) out.push(...expandEntity(entity, blocks, 0, warnings))
      i = j - 1
      continue
    }
    const entity = normalizeEntity(record)
    if (!entity) continue
    out.push(...expandEntity(entity, blocks, 0, warnings))
    if (out.length >= MAX_EXPANDED_ENTITIES) {
      warnings.push('图元数量过多，已截断块展开内容')
      return
    }
  }
}

function expandEntity(entity, blocks, depth, warnings) {
  if (!entity || entity.type !== 'INSERT') return entity ? [entity] : []
  if (depth >= MAX_INSERT_DEPTH) return []
  const block = blocks.get(String(entity.blockName || '').toUpperCase())
  if (!block || block.entities.length === 0) return []
  const out = []
  const scaleX = entity.scaleX || 1
  const scaleY = entity.scaleY || 1
  const rotation = ((entity.rotation || 0) * Math.PI) / 180
  const cos = Math.cos(rotation)
  const sin = Math.sin(rotation)
  const cols = Math.max(1, Math.min(100, entity.columns || 1))
  const rows = Math.max(1, Math.min(100, entity.rows || 1))
  const gapX = entity.columnSpacing || 0
  const gapY = entity.rowSpacing || 0
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const originX = entity.x + col * gapX
      const originY = entity.y + row * gapY
      for (const child of block.entities) {
        if (out.length > 50000) {
          warnings.push('块展开图元过多，已截断')
          return out
        }
        const transformed = transformEntity(child, {
          originX,
          originY,
          baseX: block.baseX || 0,
          baseY: block.baseY || 0,
          scaleX,
          scaleY,
          cos,
          sin,
          source: entity,
        })
        if (transformed) out.push(...expandEntity(transformed, blocks, depth + 1, warnings))
      }
    }
  }
  return out
}

function transformEntity(entity, transform) {
  const { originX, originY, baseX, baseY, scaleX, scaleY, cos, sin } = transform
  const mapPoint = (x, y) => {
    const dx = (x - baseX) * scaleX
    const dy = (y - baseY) * scaleY
    return { x: originX + dx * cos - dy * sin, y: originY + dx * sin + dy * cos }
  }
  const childLayer = String(entity.layer || '0')
  const common = {
    ...entity,
    layer: childLayer && childLayer !== '0' && childLayer.toUpperCase() !== 'BYBLOCK' ? childLayer : transform.source.layer,
    handle: '',
    fromBlock: true,
    blockSource: transform.source.blockName || '',
  }
  switch (entity.type) {
    case 'LINE': {
      const a = mapPoint(entity.x0, entity.y0)
      const b = mapPoint(entity.x1, entity.y1)
      return { ...common, x0: a.x, y0: a.y, x1: b.x, y1: b.y, bbox: lineBbox(a.x, a.y, b.x, b.y) }
    }
    case 'LWPOLYLINE': {
      const points = entity.points.map(point => mapPoint(point.x, point.y))
      return { ...common, points, bbox: pointsBbox(points) }
    }
    case 'CIRCLE': {
      const center = mapPoint(entity.cx, entity.cy)
      const radius = Math.abs(entity.radius * Math.max(Math.abs(scaleX), Math.abs(scaleY)))
      return { ...common, cx: center.x, cy: center.y, radius, bbox: circleBbox(center.x, center.y, radius) }
    }
    case 'ARC': {
      const center = mapPoint(entity.cx, entity.cy)
      const radius = Math.abs(entity.radius * Math.max(Math.abs(scaleX), Math.abs(scaleY)))
      return { ...common, cx: center.x, cy: center.y, radius, bbox: circleBbox(center.x, center.y, radius) }
    }
    case 'TEXT': {
      const pos = mapPoint(entity.x, entity.y)
      return { ...common, x: pos.x, y: pos.y, height: entity.height * Math.abs(scaleY || 1), bbox: null }
    }
    case 'MTEXT': {
      const pos = mapPoint(entity.x, entity.y)
      return { ...common, x: pos.x, y: pos.y, height: entity.height * Math.abs(scaleY || 1) }
    }
    case 'SOLID': {
      const points = entity.points.map(point => mapPoint(point.x, point.y))
      return { ...common, points, bbox: pointsBbox(points) }
    }
    default:
      return null
  }
}

function normalizePolyline(record, vertices) {
  const reader = makeReader(record)
  const common = commonProps(reader)
  const closed = (Number.parseInt(reader.one(70, '0'), 10) & 1) === 1
  if (vertices.length === 0) return null
  const entity = { ...common, type: 'POLYLINE', points: vertices, closed }
  entity.bbox = pointsBbox(vertices)
  entity.area = closed ? Math.abs(polygonArea(vertices)) : 0
  return entity
}

function commonProps(reader) {
  return {
    handle: String(reader.one(5, '')).trim(),
    layer: String(reader.one(8, '0')).trim() || '0',
    linetype: String(reader.one(6, 'BYLAYER')).trim() || 'BYLAYER',
    color: Number.parseInt(reader.one(62, '256'), 10),
    lineweight: Number.parseInt(reader.one(370, '-1'), 10),
    space: Number.parseInt(reader.one(67, '0'), 10) || 0,
    bbox: null,
  }
}

function normalizeEntity(record) {
  const type = record.type
  if (!type || ['VERTEX', 'SEQEND', 'ATTRIB', 'ATTDEF', 'ENDSEC', 'TABLE', 'BLOCK', 'ENDBLK', 'ENDTAB', 'CLASS', 'DICTIONARY'].includes(type)) {
    return null
  }
  const reader = makeReader(record)
  const common = commonProps(reader)
  switch (type) {
    case 'LINE': {
      const entity = {
        ...common,
        type,
        x0: toNumber(reader.one(10, '0')),
        y0: toNumber(reader.one(20, '0')),
        x1: toNumber(reader.one(11, '0')),
        y1: toNumber(reader.one(21, '0')),
      }
      entity.bbox = lineBbox(entity.x0, entity.y0, entity.x1, entity.y1)
      return entity
    }
    case 'LWPOLYLINE': {
      const xs = reader.nums(10)
      const ys = reader.nums(20)
      const bulges = reader.nums(42)
      const points = xs.map((x, index) => ({ x, y: ys[index] ?? 0, bulge: bulges[index] ?? 0 }))
      if (points.length === 0) return null
      const closed = (Number.parseInt(reader.one(70, '0'), 10) & 1) === 1
      const entity = { ...common, type, points, closed }
      entity.bbox = pointsBbox(points)
      entity.area = closed ? Math.abs(polygonArea(points)) : 0
      return entity
    }
    case 'CIRCLE': {
      const entity = { ...common, type, cx: toNumber(reader.one(10, '0')), cy: toNumber(reader.one(20, '0')), radius: toNumber(reader.one(40, '0')) }
      entity.bbox = circleBbox(entity.cx, entity.cy, entity.radius)
      return entity
    }
    case 'ARC': {
      const entity = {
        ...common,
        type,
        cx: toNumber(reader.one(10, '0')),
        cy: toNumber(reader.one(20, '0')),
        radius: toNumber(reader.one(40, '0')),
        startAngle: toNumber(reader.one(50, '0')),
        endAngle: toNumber(reader.one(51, '360')),
      }
      entity.bbox = arcBbox(entity)
      return entity
    }
    case 'TEXT': {
      const entity = {
        ...common,
        type,
        text: decodeText(reader.one(1, '')),
        x: toNumber(reader.one(10, '0')),
        y: toNumber(reader.one(20, '0')),
        height: toNumber(reader.one(40, '2.5')) || 2.5,
        rotation: toNumber(reader.one(50, '0')),
        style: String(reader.one(7, '')).trim(),
        hAlign: Number.parseInt(reader.one(72, '0'), 10) || 0,
        vAlign: Number.parseInt(reader.one(73, '0'), 10) || 0,
        widthFactor: Number.parseFloat(reader.one(41, '1')) || 1,
      }
      if (reader.values.has(11)) {
        entity.alignX = toNumber(reader.one(11, '0'))
        entity.alignY = toNumber(reader.one(21, '0'))
      }
      return entity
    }
    case 'MTEXT': {
      const rawText = [...reader.all(3), reader.one(1, '')].join('')
      return {
        ...common,
        type,
        text: decodeText(rawText, true),
        x: toNumber(reader.one(10, '0')),
        y: toNumber(reader.one(20, '0')),
        height: toNumber(reader.one(40, '2.5')) || 2.5,
        rotation: toNumber(reader.one(50, '0')),
        attachment: Number.parseInt(reader.one(71, '1'), 10) || 1,
        width: Number.parseFloat(reader.one(41, '0')) || 0,
      }
    }
    case 'INSERT': {
      return {
        ...common,
        type,
        blockName: String(reader.one(2, '')).trim(),
        x: toNumber(reader.one(10, '0')),
        y: toNumber(reader.one(20, '0')),
        scaleX: Number.parseFloat(reader.one(41, '1')) || 1,
        scaleY: Number.parseFloat(reader.one(42, '1')) || 1,
        scaleZ: Number.parseFloat(reader.one(43, '1')) || 1,
        rotation: toNumber(reader.one(50, '0')),
        columns: Number.parseInt(reader.one(70, '1'), 10) || 1,
        rows: Number.parseInt(reader.one(71, '1'), 10) || 1,
        columnSpacing: Number.parseFloat(reader.one(44, '0')) || 0,
        rowSpacing: Number.parseFloat(reader.one(45, '0')) || 0,
      }
    }
    case 'DIMENSION': {
      const entity = {
        ...common,
        type,
        dimType: Number.parseInt(reader.one(70, '0'), 10) || 0,
        blockName: String(reader.one(2, '')).trim(),
        dimStyle: String(reader.one(3, '')).trim(),
        textOverride: decodeText(reader.one(1, '')),
        measurement: Number.parseFloat(reader.one(42, 'NaN')),
        x: toNumber(reader.one(10, '0')),
        y: toNumber(reader.one(20, '0')),
        textX: optionalNumber(reader.one(11, 'NaN')),
        textY: optionalNumber(reader.one(21, 'NaN')),
        ext1X: optionalNumber(reader.one(13, 'NaN')),
        ext1Y: optionalNumber(reader.one(23, 'NaN')),
        ext2X: optionalNumber(reader.one(14, 'NaN')),
        ext2Y: optionalNumber(reader.one(24, 'NaN')),
        rotation: toNumber(reader.one(50, '0')),
        textRotation: toNumber(reader.one(53, reader.one(50, '0'))),
      }
      const xs = [entity.x, entity.textX, entity.ext1X, entity.ext2X].filter(Number.isFinite)
      const ys = [entity.y, entity.textY, entity.ext1Y, entity.ext2Y].filter(Number.isFinite)
      if (xs.length && ys.length) {
        entity.bbox = { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) }
      }
      return entity
    }
    case 'SOLID':
    case 'TRACE': {
      const points = []
      for (const [xc, yc] of [[10, 20], [11, 21], [12, 22], [13, 23]]) {
        if (reader.values.has(xc)) points.push({ x: toNumber(reader.one(xc, '0')), y: toNumber(reader.one(yc, '0')) })
      }
      if (points.length < 3) return null
      return { ...common, type, points, bbox: pointsBbox(points) }
    }
    case 'LEADER': {
      const xs = reader.nums(10)
      const ys = reader.nums(20)
      const points = xs.map((x, index) => ({ x, y: ys[index] ?? 0 }))
      if (points.length < 2) return null
      return { ...common, type, points, bbox: pointsBbox(points) }
    }
    case 'HATCH': {
      const xs = reader.nums(10)
      const ys = reader.nums(20)
      if (xs.length === 0) return null
      const points = xs.map((x, index) => ({ x, y: ys[index] ?? 0 }))
      return { ...common, type, points, bbox: pointsBbox(points) }
    }
    case 'ELLIPSE': {
      const entity = {
        ...common,
        type,
        cx: toNumber(reader.one(10, '0')),
        cy: toNumber(reader.one(20, '0')),
        majorX: toNumber(reader.one(11, '0')),
        majorY: toNumber(reader.one(21, '0')),
        ratio: Number.parseFloat(reader.one(40, '1')) || 1,
        startAngle: toNumber(reader.one(41, '0')),
        endAngle: toNumber(reader.one(42, '6.283185307179586')),
      }
      const rx = Math.hypot(entity.majorX, entity.majorY)
      entity.bbox = circleBbox(entity.cx, entity.cy, rx)
      return entity
    }
    case 'SPLINE': {
      const xs = reader.nums(10)
      const ys = reader.nums(20)
      if (xs.length === 0) return null
      const points = xs.map((x, index) => ({ x, y: ys[index] ?? 0 }))
      return { ...common, type, points, bbox: pointsBbox(points) }
    }
    default:
      return null
  }
}

export function decodeText(value, isMText = false) {
  if (typeof value !== 'string' || value.length === 0) return ''
  let text = value
  if (isMText) {
    text = text
      .replace(/\\P/gi, '\n')
      .replace(/\\~/gi, ' ')
      .replace(/\\[A-Za-z][^;\\{}]*;/g, '')
      .replace(/[{}]/g, '')
  }
  text = text
    .replace(/%%[cC]/g, 'φ')
    .replace(/%%[dD]/g, '°')
    .replace(/%%[pP]/g, '±')
    .replace(/%%[uUoO]/g, '')
    .replace(/\\U\+([0-9A-Fa-f]{4})/g, (_match, hex) => String.fromCharCode(Number.parseInt(hex, 16)))
  return text.replace(/\s+/g, ' ').trim()
}

function optionalNumber(value) {
  const parsed = Number.parseFloat(String(value ?? '').trim())
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

function toNumber(value) {
  const parsed = Number.parseFloat(String(value ?? '').trim())
  return Number.isFinite(parsed) ? parsed : 0
}

function round(value, digits) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function normalizeLineweight(raw) {
  if (raw === undefined || raw === null || raw < 0) return 0.25
  return raw / 100
}

export function lineBbox(x0, y0, x1, y1) {
  return { x0: Math.min(x0, x1), y0: Math.min(y0, y1), x1: Math.max(x0, x1), y1: Math.max(y0, y1) }
}

export function pointsBbox(points) {
  if (!points || points.length === 0) return null
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (const point of points) {
    if (point.x < x0) x0 = point.x
    if (point.y < y0) y0 = point.y
    if (point.x > x1) x1 = point.x
    if (point.y > y1) y1 = point.y
  }
  return { x0, y0, x1, y1 }
}

function circleBbox(cx, cy, r) {
  return { x0: cx - r, y0: cy - r, x1: cx + r, y1: cy + r }
}

function arcBbox(arc) {
  const angles = [arc.startAngle, arc.endAngle]
  for (const base of [0, 90, 180, 270, 360]) {
    if (angleWithin(base, arc.startAngle, arc.endAngle)) angles.push(base)
  }
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (const angle of angles) {
    const rad = (angle * Math.PI) / 180
    const x = arc.cx + arc.radius * Math.cos(rad)
    const y = arc.cy + arc.radius * Math.sin(rad)
    x0 = Math.min(x0, x)
    y0 = Math.min(y0, y)
    x1 = Math.max(x1, x)
    y1 = Math.max(y1, y)
  }
  return { x0, y0, x1, y1 }
}

function angleWithin(angle, start, end) {
  const a = (((angle - start) % 360) + 360) % 360
  const span = (((end - start) % 360) + 360) % 360
  return a <= span
}

function polygonArea(points) {
  let area = 0
  for (let i = 0; i < points.length; i += 1) {
    const current = points[i]
    const next = points[(i + 1) % points.length]
    area += current.x * next.y - next.x * current.y
  }
  return area / 2
}

function computeExtents(entities) {
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (const entity of entities) {
    const box = entity.bbox
    if (!box) continue
    if (box.x0 < x0) x0 = box.x0
    if (box.y0 < y0) y0 = box.y0
    if (box.x1 > x1) x1 = box.x1
    if (box.y1 > y1) y1 = box.y1
  }
  if (!Number.isFinite(x0)) return null
  return { x0, y0, x1, y1, width: x1 - x0, height: y1 - y0 }
}
