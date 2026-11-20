/**
 * DXF 解析：把 ASCII DXF 转成「路径（path）+ 文字（text）」两类可计算对象。
 * 覆盖 LINE / LWPOLYLINE / POLYLINE / ARC / CIRCLE / ELLIPSE / SPLINE / TEXT / MTEXT / ATTRIB，
 * 并展开 INSERT 块参照（含嵌套、缩放、旋转）——很多矿井图纸的巷道几何画在块里。
 */

import { entityColorDescriptor, layerColorKey, resolveColorKey } from './colors.js'

const MAX_ENTITIES = 400000

export function decodeDxf(bytes) {
  if (bytes[0] === 65 && new TextDecoder('ascii').decode(bytes.slice(0, 22)).startsWith('AutoCAD Binary DXF'))
    throw new Error('暂不支持二进制 DXF，请在 CAD 中另存为 ASCII DXF 或直接上传 DWG。')
  let text = new TextDecoder('utf-8', { fatal: false }).decode(bytes)
  if (text.includes('\ufffd')) text = new TextDecoder('gb18030', { fatal: false }).decode(bytes)
  return text.replace(/^\ufeff/, '')
}

const round = v => Math.round(v * 1000) / 1000

/** 去掉 MTEXT 的格式控制码（\fSimSun|b0; \H2.5x; \P …），只留可读文字。 */
export function cleanMText(raw) {
  return String(raw || '')
    .replace(/\\P/gi, ' ')
    .replace(/\\S([^;]*?)[\^#]([^;]*?);/g, '$1/$2')
    .replace(/\\[A-Za-z][^;\\{}]*;/g, '')
    .replace(/\\[A-Za-z]/g, '')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function arcPoints(cx, cy, r, a0, a1, maxSeg = 1.5, maxSteps = 6000) {
  let sweep = (a1 - a0) % (Math.PI * 2)
  if (sweep <= 0) sweep += Math.PI * 2
  const steps = Math.min(maxSteps, Math.max(2, Math.ceil((sweep * r) / maxSeg)))
  const pts = []
  for (let i = 0; i <= steps; i++) {
    const a = a0 + (sweep * i) / steps
    pts.push([round(cx + r * Math.cos(a)), round(cy + r * Math.sin(a))])
  }
  return pts
}

function bulgePoints(x1, y1, x2, y2, bulge, maxSeg = 1.5) {
  if (!bulge) return []
  const dx = x2 - x1
  const dy = y2 - y1
  const chord = Math.hypot(dx, dy)
  if (chord < 1e-9) return []
  const theta = 4 * Math.atan(bulge)
  const r = chord / (2 * Math.sin(Math.abs(theta) / 2))
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const h = Math.sqrt(Math.max(0, r * r - (chord / 2) * (chord / 2)))
  const sign = bulge > 0 ? 1 : -1
  const ux = -dy / chord
  const uy = dx / chord
  const cx = mx + ux * h * sign
  const cy = my + uy * h * sign
  const a0 = Math.atan2(y1 - cy, x1 - cx)
  const a1 = Math.atan2(y2 - cy, x2 - cx)
  const pts = arcPoints(cx, cy, r, a0, a1, maxSeg)
  return pts.slice(1, -1)
}

/** NURBS 采样（de Boor）；节点不完整时退化为控制多边形。 */
function splinePoints(ctrl, knots, degree, weights) {
  const n = ctrl.length
  if (n < 2) return ctrl
  const p = Math.min(Math.max(1, degree || 3), n - 1)
  if (!knots || knots.length < n + p + 1) return ctrl.slice()
  const out = []
  const segments = Math.min(6000, Math.max(8, Math.min(400, n * 6)))
  const u0 = knots[p]
  const u1 = knots[n]
  if (!(u1 > u0)) return ctrl.slice()
  for (let s = 0; s <= segments; s++) {
    const u = u0 + ((u1 - u0) * s) / segments
    let k = p
    while (k < n - 1 && u >= knots[k + 1]) k++
    const d = []
    for (let j = 0; j <= p; j++) {
      const idx = Math.min(n - 1, Math.max(0, k - p + j))
      const w = weights && weights[idx] ? weights[idx] : 1
      d.push([ctrl[idx][0], ctrl[idx][1], w])
    }
    for (let r = 1; r <= p; r++) {
      for (let j = p; j >= r; j--) {
        const i = k - p + j
        const denom = knots[i + p + 1 - r] - knots[i]
        const alpha = denom === 0 ? 0 : (u - knots[i]) / denom
        d[j] = [
          d[j - 1][0] * (1 - alpha) + d[j][0] * alpha,
          d[j - 1][1] * (1 - alpha) + d[j][1] * alpha,
          d[j - 1][2] * (1 - alpha) + d[j][2] * alpha,
        ]
      }
    }
    const w = d[p][2] || 1
    out.push([round(d[p][0] / w), round(d[p][1] / w)])
  }
  return out
}

function ellipsePoints(cx, cy, mx, my, ratio, a0, a1) {
  const major = Math.hypot(mx, my)
  if (major < 1e-9) return []
  const minor = major * (ratio || 1)
  const rot = Math.atan2(my, mx)
  let sweep = a1 - a0
  if (sweep <= 0) sweep += Math.PI * 2
  const steps = Math.min(6000, Math.max(8, Math.ceil((sweep * major) / 2)))
  const pts = []
  for (let i = 0; i <= steps; i++) {
    const t = a0 + (sweep * i) / steps
    const x = major * Math.cos(t)
    const y = minor * Math.sin(t)
    pts.push([round(cx + x * Math.cos(rot) - y * Math.sin(rot)), round(cy + x * Math.sin(rot) + y * Math.cos(rot))])
  }
  return pts
}

const MULTI_POINT = new Set(['LWPOLYLINE', 'VERTEX', 'SPLINE'])

export function parseDxf(bytes) {
  const text = decodeDxf(bytes)
  const lines = text.split(/\r\n|\n|\r/)
  const paths = []
  const texts = []
  const typeCount = Object.create(null)
  const layerCount = Object.create(null)
  const layerNames = new Set()
  const layerColors = new Map([['0', 'aci:7']])
  const warnings = []
  const blocks = new Map()
  const insertQueue = []
  let section = ''
  let pendingSection = false
  let rec = null
  let polyline = null
  let currentBlock = null
  let entityCount = 0

  const pushPath = (layer, pts, closed, kind, width = 0, circle = null, colorInfo = null, inheritedColor = null, handle = null) => {
    if (!pts || pts.length < 2) return
    const cleaned = []
    for (const p of pts) {
      const last = cleaned[cleaned.length - 1]
      if (!last || Math.hypot(last[0] - p[0], last[1] - p[1]) > 1e-4) cleaned.push(p)
    }
    if (cleaned.length < 2) return
    if (currentBlock) currentBlock.entities.push({ kind: 'path', layer, pts: cleaned, closed: !!closed, pathKind: kind, width, circle, colorInfo, handle })
    else paths.push({
      layer,
      pts: cleaned,
      closed: !!closed,
      kind,
      width,
      circle,
      handle,
      color: resolveColorKey(layerColors, layer, colorInfo, inheritedColor),
      color_source: colorInfo,
    })
  }

  const pushText = item => {
    if (currentBlock) currentBlock.entities.push({ kind: 'text', ...item })
    else texts.push({
      ...item,
      color: resolveColorKey(layerColors, item.layer, item.colorInfo),
    })
  }

  const finishRecord = () => {
    if (!rec) return
    const f = rec.fields
    const layer = f['8'] || '0'
    const isEntitySection = section === 'ENTITIES' || section === 'BLOCKS'
    if (isEntitySection && rec.type !== 'ENDBLK' && rec.type !== 'BLOCK' && rec.type !== 'SEQEND') {
      entityCount++
      if (entityCount > MAX_ENTITIES) throw new Error('图纸实体超过 40 万个，请先在 CAD 中清理后重试。')
      typeCount[rec.type] = (typeCount[rec.type] || 0) + 1
      layerCount[layer] = (layerCount[layer] || 0) + 1
    }
    if (section === 'TABLES' && rec.type === 'LAYER' && f['2']) {
      layerNames.add(f['2'])
      layerColors.set(f['2'], layerColorKey(f))
    }

    if (section === 'BLOCKS') {
      if (rec.type === 'BLOCK') {
        const name = String(f['2'] || f['3'] || '').trim()
        currentBlock = { name, baseX: Number(f['10']) || 0, baseY: Number(f['20']) || 0, entities: [] }
        if (name) blocks.set(name, currentBlock)
      } else if (rec.type === 'ENDBLK') {
        currentBlock = null
      }
    }

    if (section === 'ENTITIES' || section === 'BLOCKS') {
      const colorInfo = entityColorDescriptor(f)
      const num = code => {
        const v = Number(f[code])
        return Number.isFinite(v) ? v : 0
      }
      switch (rec.type) {
        case 'LINE':
          pushPath(layer, [[round(num('10')), round(num('20'))], [round(num('11')), round(num('21'))]], false, 'LINE', 0, null, colorInfo, null, f['5'] || null)
          break
        case 'LWPOLYLINE': {
          if (rec.vertices.some(v => v[2])) {
            const expanded = []
            for (let i = 0; i < rec.vertices.length - 1; i++) {
              const a = rec.vertices[i]
              const b = rec.vertices[i + 1]
              expanded.push([round(a[0]), round(a[1])])
              if (a[2]) expanded.push(...bulgePoints(a[0], a[1], b[0], b[1], a[2]))
            }
            const last = rec.vertices[rec.vertices.length - 1]
            expanded.push([round(last[0]), round(last[1])])
            if (rec.closed && last[2]) {
              const first = rec.vertices[0]
              expanded.push(...bulgePoints(last[0], last[1], first[0], first[1], last[2]))
            }
            pushPath(layer, expanded, rec.closed, 'LWPOLYLINE', Number(f['43']) || 0, null, colorInfo, null, f['5'] || null)
          } else pushPath(layer, rec.vertices.map(v => [round(v[0]), round(v[1])]), rec.closed, 'LWPOLYLINE', Number(f['43']) || 0, null, colorInfo, null, f['5'] || null)
          break
        }
        case 'POLYLINE':
          polyline = { layer, pts: [], closed: (Number(f['70']) & 1) !== 0, colorInfo, handle: f['5'] || null }
          break
        case 'VERTEX':
          if (polyline) polyline.pts.push([num('10'), num('20')])
          break
        case 'SEQEND':
          if (polyline) {
            pushPath(polyline.layer, polyline.pts.map(p => [round(p[0]), round(p[1])]), polyline.closed, 'POLYLINE', 0, null, polyline.colorInfo, null, polyline.handle)
            polyline = null
          }
          break
        case 'ARC': {
          const cx = num('10')
          const cy = num('20')
          const r = num('40')
          const a0 = (num('50') * Math.PI) / 180
          const a1 = (num('51') * Math.PI) / 180
          if (r > 0) pushPath(layer, arcPoints(cx, cy, r, a0, a1), false, 'ARC', 0, null, colorInfo, null, f['5'] || null)
          break
        }
        case 'CIRCLE': {
          const cx = num('10')
          const cy = num('20')
          const r = num('40')
          if (r > 0) pushPath(layer, arcPoints(cx, cy, r, 0, Math.PI * 2, Math.max(1.5, r / 6)), true, 'CIRCLE', 0, { x: cx, y: cy, r }, colorInfo, null, f['5'] || null)
          break
        }
        case 'ELLIPSE': {
          const pts = ellipsePoints(num('10'), num('20'), num('11'), num('21'), num('40') || 1, num('41'), num('42') || Math.PI * 2)
          if (pts.length > 1) pushPath(layer, pts, false, 'ELLIPSE', 0, null, colorInfo, null, f['5'] || null)
          break
        }
        case 'SPLINE': {
          const ctrl = rec.vertices.map(v => [v[0], v[1]])
          const pts = splinePoints(ctrl, rec.knots, Number(f['71']) || 3, rec.weights)
          if (pts.length > 1) pushPath(layer, pts.map(p => [round(p[0]), round(p[1])]), false, 'SPLINE', 0, null, colorInfo, null, f['5'] || null)
          break
        }
        case 'INSERT': {
          const item = {
            kind: 'insert',
            name: String(f['2'] || '').trim(),
            layer,
            x: num('10'),
            y: num('20'),
            sx: Number(f['41']) || 1,
            sy: Number(f['42']) || 1,
            rot: ((num('50') || 0) * Math.PI) / 180,
            colorInfo,
            color: resolveColorKey(layerColors, layer, colorInfo),
          }
          if (currentBlock) currentBlock.entities.push(item)
          else insertQueue.push(item)
          break
        }
        case 'TEXT':
        case 'MTEXT':
        case 'ATTRIB': {
          const raw = rec.type === 'MTEXT' ? rec.text3 + rec.text1 : rec.text1
          const value = cleanMText(raw)
          if (value) {
            const halign = num('72'), valign = num('73')
            const useAlignment = rec.type !== 'MTEXT' && (halign !== 0 || valign !== 0) && halign !== 3 && halign !== 5 && f['11'] != null && f['21'] != null
            pushText({
              layer,
              text: value,
              x: num(useAlignment ? '11' : '10'),
              y: num(useAlignment ? '21' : '20'),
              h: num('40') || 2.5,
              rot: num('50'),
              colorInfo,
            })
          }
          break
        }
        default:
          break
      }
    }
    rec = null
  }

  for (let i = 0; i + 1 < lines.length; i += 2) {
    const codeRaw = lines[i].trim()
    if (codeRaw === '') throw new Error('DXF 结构不完整，无法解析。')
    const code = Number(codeRaw)
    if (!Number.isInteger(code)) throw new Error('DXF 组码异常，文件可能不是有效的 ASCII DXF。')
    const value = lines[i + 1]
    if (pendingSection && code === 2) {
      section = value.trim()
      pendingSection = false
      continue
    }
    if (code === 0) {
      finishRecord()
      const t = value.trim()
      if (t === 'SECTION') {
        pendingSection = true
        continue
      }
      if (t === 'ENDSEC') {
        if (polyline) polyline = null
        if (section === 'BLOCKS') currentBlock = null
        section = ''
        continue
      }
      if (t === 'EOF') {
        rec = null
        break
      }
      rec = { type: t, fields: Object.create(null), vertices: [], knots: [], weights: [], text1: '', text3: '' }
      continue
    }
    if (!rec) continue

    if (code === 1) rec.text1 += value
    else if (code === 3) rec.text3 += value
    else if (code === 40 && rec.type === 'SPLINE') rec.knots.push(Number(value) || 0)
    else if (code === 41 && rec.type === 'SPLINE') rec.weights.push(Number(value) || 0)
    else if (MULTI_POINT.has(rec.type) && (code === 10 || code === 11)) {
      rec.vertices.push([Number(value) || 0, 0])
      rec.pendingVertexX = true
    } else if (MULTI_POINT.has(rec.type) && (code === 20 || code === 21)) {
      const last = rec.vertices[rec.vertices.length - 1]
      if (last && rec.pendingVertexX) {
        last[1] = Number(value) || 0
        rec.pendingVertexX = false
      }
    } else if (code === 42 && rec.type === 'LWPOLYLINE') {
      const last = rec.vertices[rec.vertices.length - 1]
      if (last) last[2] = Number(value) || 0
    } else {
      rec.fields[code] = value
    }
  }
  finishRecord()

  // 展开块参照（含嵌套，最多 3 层）
  const expandedPaths = []
  const expandedTexts = []
  const expandInsert = (item, depth) => {
    const block = blocks.get(item.name)
    if (!block || depth > 3) return
    const cos = Math.cos(item.rot)
    const sin = Math.sin(item.rot)
    for (const ent of block.entities) {
      if (ent.kind === 'path') {
        const effectiveLayer = ent.layer === '0' ? item.layer : ent.layer
        const pts = ent.pts.map(([x, y]) => {
          const bx = (x - block.baseX) * item.sx
          const by = (y - block.baseY) * item.sy
          return [round(bx * cos - by * sin + item.x), round(bx * sin + by * cos + item.y)]
        })
        expandedPaths.push({
          layer: effectiveLayer,
          pts,
          closed: ent.closed,
          kind: `${ent.pathKind}@${item.name}`,
          handle: ent.handle || null,
          color: resolveColorKey(layerColors, effectiveLayer, ent.colorInfo, item.color),
          color_source: ent.colorInfo,
          circle: ent.circle && Math.abs(Math.abs(item.sx) - Math.abs(item.sy)) < 1e-9 ? {
            x: (ent.circle.x - block.baseX) * item.sx * cos - (ent.circle.y - block.baseY) * item.sy * sin + item.x,
            y: (ent.circle.x - block.baseX) * item.sx * sin + (ent.circle.y - block.baseY) * item.sy * cos + item.y,
            r: ent.circle.r * Math.abs(item.sx),
          } : null,
        })
      } else if (ent.kind === 'text') {
        const effectiveLayer = ent.layer === '0' ? item.layer : ent.layer
        const bx = (ent.x - block.baseX) * item.sx
        const by = (ent.y - block.baseY) * item.sy
        expandedTexts.push({
          layer: effectiveLayer,
          text: ent.text,
          x: round(bx * cos - by * sin + item.x),
          y: round(bx * sin + by * cos + item.y),
          h: (ent.h || 2.5) * Math.max(Math.abs(item.sx), Math.abs(item.sy)),
          rot: (ent.rot || 0) + (item.rot * 180) / Math.PI,
          color: resolveColorKey(layerColors, effectiveLayer, ent.colorInfo, item.color),
          color_source: ent.colorInfo,
        })
      } else if (ent.kind === 'insert') {
        const effectiveLayer = ent.layer === '0' ? item.layer : ent.layer
        expandInsert(
          {
            ...ent,
            x: ent.x * item.sx * cos - ent.y * item.sy * sin + item.x,
            y: ent.x * item.sx * sin + ent.y * item.sy * cos + item.y,
            sx: ent.sx * item.sx,
            sy: ent.sy * item.sy,
            rot: ent.rot + item.rot,
            color: resolveColorKey(layerColors, effectiveLayer, ent.colorInfo, item.color),
          },
          depth + 1
        )
      }
    }
  }
  for (const item of insertQueue) expandInsert(item, 0)
  for (const p of expandedPaths) paths.push(p)
  for (const t of expandedTexts) texts.push(t)

  const layers = [...layerNames, ...Object.keys(layerCount)]
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .map(name => ({ name, count: layerCount[name] || 0 }))
    .sort((a, b) => b.count - a.count)

  return { paths, texts, layers, typeCount, warnings, blocks: blocks.size, inserts: insertQueue.length }
}
