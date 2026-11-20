/**
 * 自然语言指令 → 过滤条件（参考 text-to-cad 的“说人话就能改图”思路，
 * 但这里作用在识别结果上，避免让模型直接生成几何带来的不可控）。
 * 支持：水平/标高、长度区间、名称关键词、只要命名、图层、条数上限。
 */
const CN_NUM = { 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 }

function toNumber(text) {
  const t = String(text || '').trim()
  if (/^\d+(\.\d+)?$/.test(t)) return Number(t)
  if (CN_NUM[t]) return CN_NUM[t]
  return null
}

export function parseNlFilters(raw) {
  const text = String(raw || '').trim()
  const filters = {
    levels: [],
    minLength: null,
    maxLength: null,
    keyword: '',
    excludeUnnamed: false,
    onlyNamed: false,
    laneLayer: '',
    limit: null,
  }
  if (!text) return filters

  // 水平/标高：+896.8m / +896.8 水平 / 标高 896.8
  const levelRe = /\+(\d{3,4}(?:\.\d{1,2})?)\s*(?:m|米)?|(?:标高|水平)\s*[:：]?\s*(\d{3,4}(?:\.\d{1,2})?)/g
  let m
  while ((m = levelRe.exec(text))) {
    const v = Number(m[1] || m[2])
    if (v >= 100 && v <= 2500) filters.levels.push(Math.round(v * 10) / 10)
  }

  // 长度：大于/超过 50 米；小于/不到 200 米
  const minRe = /(?:大于|超过|不少于|至少|≥|>)\s*(\d+(?:\.\d+)?)\s*(?:米|m)?/
  const maxRe = /(?:小于|不到|不超过|至多|≤|<)\s*(\d+(?:\.\d+)?)\s*(?:米|m)?/
  const min = text.match(minRe)
  if (min) filters.minLength = Number(min[1])
  const max = text.match(maxRe)
  if (max) filters.maxLength = Number(max[1])

  // 名称关键词
  const kwRe = /(?:名称|名字|含|包含|含有|带|叫)\s*[“"']?([\u4e00-\u9fa5A-Za-z0-9#]{2,8}?)(?=的|巷道|$|[，,、\s])/
  const kw = text.match(kwRe)
  if (kw)
    filters.keyword = kw[1]
      .replace(/^的/, '')
      .replace(/^(含|包含|含有|带有|有)/, '')
      .replace(/的.*$/, '')

  if (/(?:去掉|不要|排除|过滤掉|删除)\s*未命名/.test(text) || /只要?(?:有)?命名/.test(text)) {
    filters.excludeUnnamed = true
    filters.onlyNamed = true
  }
  if (/只(?:要|保留)\s*未命名/.test(text)) filters.onlyUnnamed = true

  const layer = text.match(/图层\s*[:：]?\s*([\u4e00-\u9fa5A-Za-z0-9_]+)/)
  if (layer) filters.laneLayer = layer[1]

  const limit = text.match(/(?:前|最多|只要|保留)\s*(\d+|[一二两三四五六七八九十])\s*条/)
  if (limit) filters.limit = toNumber(limit[1])

  return filters
}

export function hasFilters(f) {
  return !!(
    f &&
    ((f.levels && f.levels.length) ||
      f.minLength ||
      f.maxLength ||
      f.keyword ||
      f.excludeUnnamed ||
      f.onlyUnnamed ||
      f.limit)
  )
}

/** 应用过滤条件到识别结果，返回新数组与说明。 */
export function applyFilters(records, f) {
  if (!hasFilters(f)) return { records, note: '' }
  const before = records.length
  let list = records.filter(r => {
    const elev = r.traverse_point_array?.[0]?.z_bottom
    if (f.levels && f.levels.length) {
      if (!f.levels.some(lv => Math.abs((elev ?? -9999) - lv) <= 2)) return false
    }
    const pts = r.traverse_point_array || []
    let length = 0
    for (let i = 1; i < pts.length; i++) length += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)
    if (f.minLength && length !== null && length < f.minLength) return false
    if (f.maxLength && length !== null && length > f.maxLength) return false
    if (f.keyword && !String(r.laneway_name || '').includes(f.keyword)) return false
    if (f.excludeUnnamed && /未命名/.test(r.laneway_name || '')) return false
    if (f.onlyUnnamed && !/未命名/.test(r.laneway_name || '')) return false
    return true
  })
  if (f.limit) list = list.slice(0, f.limit)
  const note = `已按指令过滤：保留 ${list.length} / ${before} 条。`
  return { records: list, note }
}
