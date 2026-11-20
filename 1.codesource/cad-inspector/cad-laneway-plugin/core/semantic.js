/** 巷道语义：从图纸文字中提取标高与巷道名称，并生成客户系统 JSON 记录。 */

import { isCodeLike, looksLikeName } from './learning.js'

const NAME_HINTS =
  /(巷道|石门|顺槽|大巷|联络巷|上山|下山|车场|绕道|切眼|煤门|措施巷|工作面|回风|运输|皮带|轨道|斜井|井底|井筒|硐室|绕巷|回采|掘进|盘区|采区)/
const ELEV_RE = /([+\-]?\d{2,4}(?:\.\d{1,3})?)\s*(?:m|米)?/
const DIRTY = /[\u0000-\u001f\u007f]/g

export function cleanText(text) {
  return String(text || '')
    .replace(DIRTY, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** 解析单条文字：返回标高、名称与类型提示。 */
export function parseLabel(raw, learned) {
  const text = cleanText(raw)
  if (!text || text.length > 60) return null
  const hasName = looksLikeName(text, learned) || NAME_HINTS.test(text)
  const pointLabel = /^[A-Za-z]{0,4}\d{0,5}[′'"]?\s*[+\-]\d{2,4}(?:\.\d{1,3})?\s*[Tt]?$/.test(text)
  if (!hasName && !pointLabel && !/Z\s*=\s*[+\-]?\d/i.test(text)) return null
  let elevation = null
  let name = ''

  const zMatch = text.match(/Z\s*=\s*([+\-]?\d{2,4}(?:\.\d{1,3})?)/i)
  if (zMatch) {
    const v = Number(zMatch[1])
    if (v >= 100 && v <= 2500) elevation = v
  }
  const mLabel = text.match(/^\s*([+\-]?\d{2,4}(?:\.\d{1,3})?)\s*(?:m|米)\s*(.*)$/i)
  if (mLabel) {
    const v = Number(mLabel[1])
    if (v >= 100 && v <= 2500) {
      if (elevation === null) elevation = v
      const tail = mLabel[2].trim()
      if (tail && looksLikeName(tail, learned)) name = tail
    }
  }
  if (!name) {
    const plus = text.match(/([+\-]\d{2,4}(?:\.\d{1,3})?)(?!\d)/)
    if (plus) {
      const v = Number(plus[1])
      if (elevation === null && v >= 100 && v <= 2500) elevation = v
      const tail = text
        .slice(plus.index + plus[0].length)
        .replace(/^\s*(?:m|米)\s*/i, '')
        .replace(/^[Tt]\s*$/, '')
        .trim()
      if (tail && looksLikeName(tail, learned)) name = tail
    }
  }
  if (hasName && !name) {
    const stripped = text
      .replace(/Z\s*=\s*[+\-]?\d{2,4}(?:\.\d{1,3})?/gi, ' ')
      .replace(/(?:^|\s)[+\-]\d{2,4}(?:\.\d{1,3})?\s*(?:m|米)?/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    if (looksLikeName(stripped, learned)) name = stripped
    else if (looksLikeName(text, learned)) name = text
  }
  if (!name && elevation === null) return null
  const kind = hasName ? 'laneway' : pointLabel ? 'point' : 'elevation'
  return { text, elevation, name: name.slice(0, 40), kind }
}

function nearestLabels(lane, texts, maxDistance, learned) {
  const n = lane.pts.length
  const anchors = [0, 0.25, 0.5, 0.75, 1].map(r => lane.pts[Math.min(n - 1, Math.round((n - 1) * r))])
  const found = []
  for (const t of texts) {
    const d = Math.min(...anchors.map(a => Math.hypot(a[0] - t.x, a[1] - t.y)))
    if (d > maxDistance) continue
    const parsed = parseLabel(t.text, learned)
    if (!parsed) continue
    found.push({ ...parsed, distance: d, x: t.x, y: t.y })
  }
  found.sort((a, b) => a.distance - b.distance)
  return found
}

/** 为巷道匹配名称与标高：优先近距离、带巷道名称词、带标高的文字。 */
export function labelLanes(lanes, texts, { radius = 30, elevationRadius = 80, learned = null } = {}) {
  const candidates = texts.map(t => ({ x: t.x, y: t.y, text: t.text, h: t.h })).filter(t => Number.isFinite(t.x) && Number.isFinite(t.y))
  const labelled = lanes.map(lane => {
    const labelList = nearestLabels(lane, candidates, radius, learned)
    const labels = labelList
    const elevated = nearestLabels(lane, candidates, elevationRadius, learned).filter(l => l.elevation !== null)
    const named = labels.filter(l => l.name)
    const best = named[0] || labels.find(l => l.name) || null
    const elevList = elevated.slice(0, 3).map(l => l.elevation)
    const elevation = lane.source === 'nodegraph'
      ? (Number.isFinite(lane.elevation) ? lane.elevation : null)
      : elevList.length ? elevList.sort((a, b) => a - b)[Math.floor(elevList.length / 2)] : null
    const name = best ? best.name : ''
    return {
      ...lane,
      name,
      elevation,
      elevationSource: elevation !== null ? 'text' : 'none',
      labelDistance: best ? Math.round(best.distance * 10) / 10 : null,
      labelText: best ? best.text : '',
      confidence: (name ? 0.55 : 0) + (elevation !== null ? 0.3 : 0) + (best && best.distance < 12 ? 0.15 : 0),
    }
  })
  // 标高继承：同层相邻巷道若无文字标高，取最近已标高巷道（80 米内）。
  const known = labelled.filter(l => l.elevation !== null)
  if (known.length)
    for (const lane of labelled) {
      if (lane.source === 'nodegraph' || lane.elevation !== null) continue
      const mid = lane.pts[Math.floor(lane.pts.length / 2)]
      let best = null
      for (const other of known) {
        const omid = other.pts[Math.floor(other.pts.length / 2)]
        const d = Math.hypot(mid[0] - omid[0], mid[1] - omid[1])
        if (d > 80) continue
        if (!best || d < best.d) best = { d, elevation: other.elevation }
      }
      if (best) {
        lane.elevation = best.elevation
        lane.elevationSource = 'inherited'
        lane.confidence = Math.min(0.9, lane.confidence + 0.1)
      }
    }
  return labelled
}

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export function lanewayCode(seed) {
  let h1 = 0x811c9dc5
  let h2 = 0x01000193
  for (let i = 0; i < seed.length; i++) {
    h1 = (h1 ^ seed.charCodeAt(i)) * 0x01000193
    h2 = (h2 + seed.charCodeAt(i) * (i + 7)) >>> 0
  }
  h1 >>>= 0
  let out = ''
  let value = h1
  for (let i = 0; i < 7; i++) {
    out += ALPHABET[value % 62]
    value = Math.floor(value / 62) + (h2 % 61)
  }
  return out
}

export function lanewayDisplayName(lane) {
  const name = (lane.name || '').trim()
  if (!name && lane.levelName) return lane.levelName
  const elevation = lane.elevation
  const elevText =
    elevation === null ? '' : Number.isInteger(elevation) ? `+${elevation}m` : `+${Math.round(elevation * 10) / 10}m`
  if (!name) return elevText ? `${elevText}未命名巷道` : '未命名巷道'
  if (/^[+\-]?\d{2,4}(?:\.\d+)?\s*m/.test(name)) return name
  if (/^[+\-]?\d{3,4}(?:\.\d+)?$/.test(name)) return elevText || `+${name}m`
  if (!elevText) return name
  return `${elevText}${name}`
}

const round6 = v => Math.round(v * 1e6) / 1e6

/** 生成客户系统可导入的巷道记录（25 字段）。 */
export function buildRecord(lane, { meta = {}, borderLinePoints = [] } = {}) {
  const name = lanewayDisplayName(lane)
  const elevation = Number.isFinite(lane.elevation) ? lane.elevation : null
  const height = Number(meta.height) > 0 ? Number(meta.height) : 3
  const width = Number(lane.width) > 0 ? lane.width : Number(meta.width) > 0 ? Number(meta.width) : 4
  const code = lane.code || lanewayCode(name + ':' + Math.round(lane.pts[0][0]) + ':' + Math.round(lane.pts[0][1]))
  const color = /主要|大巷|主运|辅运/.test(`${lane.layer} ${name}`) ? 'RGB(0,255,0)' : 'RGB(0,255,255)'
  const pointName = (meta.pointName && String(meta.pointName).trim()) || name
  if (lane.source === 'nodegraph' && (!Array.isArray(lane.zs) || lane.zs.length !== lane.pts.length))
    throw new Error('导线点坐标与标高数量不一致，已停止输出。')
  const perPointZ = Array.isArray(lane.zs) && lane.zs.length === lane.pts.length ? lane.zs : null
  const traverse = lane.pts.map((pt, i) => {
    const zi = perPointZ ? (Number.isFinite(perPointZ[i]) ? perPointZ[i] : null) : elevation
    return {
      laneway_code: code,
      point_name: (Array.isArray(lane.names) && lane.names[i]) || pointName,
      traverse_point_type: '导线点',
      x: round6(pt[0]),
      y: round6(pt[1]),
      z_top: zi === null ? null : round6(zi + height),
      z_bottom: zi === null ? null : round6(zi),
      left_side: Math.round((width / 2) * 1000) / 1000,
      right_side: Math.round((width / 2) * 1000) / 1000,
      radius: 0,
      point_order: i,
      use_second_side: false,
      second_left_side: Math.round((width / 2) * 1000) / 1000,
      second_right_side: Math.round((width / 2) * 1000) / 1000,
      coal_seam_struct: '',
      top_coal_thick: 0,
      bottom_coal_thick: 0,
    }
  })
  return {
    laneway_name: name,
    horizontal_name: meta.horizontalName || '',
    MineCode: meta.mineCode || '',
    mining_area_name: meta.miningArea || '',
    work_face_name: meta.workFace || '',
    mining_name: meta.mineName || '',
    laneway_type: meta.lanewayType || '普通',
    laneway_sec_style: meta.sectionStyle || '半圆拱',
    laneway_code: code,
    color,
    border_line_points: borderLinePoints.map(line => line.map(p => ({ x: round6(p[0]), y: round6(p[1]) }))),
    material: '',
    Laneway_draw_style: meta.drawStyle || '副本 标准样式',
    traverse_point_count: traverse.length,
    traverse_point_array: traverse,
    laneway_height: Math.round(height * 1000) / 1000,
    laneway_width: Math.round(width * 1000) / 1000,
    into_or_out_wind: meta.airMode || '进风',
    support_pattern: meta.support || '锚杆支护',
    laneway_use: meta.usage || '开拓巷道',
    // 与云图 CAD SDK 的 convertTunnelData / MAS Save 对齐的扩展字段
    series_ventilation: meta.seriesVentilation || '2',
    return_air_type: meta.returnAirType || '采区回风巷',
    excavation_status: meta.excavationStatus || '准备中',
    excavation_type: meta.excavationType || '单掘',
    current_footage: Number(meta.currentFootage) || 0,
    CreateDateTime: '',
    CreateUserId: '',
    CreateCompanyId: '',
    CreateDepartmentId: '',
    UpdateUserId: '',
    UpdateDateTime: '',
  }
}
