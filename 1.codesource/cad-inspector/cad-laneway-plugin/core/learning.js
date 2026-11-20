/**
 * 图纸惯例学习：不写死图层名/标注格式，而是从当前图纸的文字里统计出
 * 「标高怎么写」「巷道名怎么起」「有几个水平」，再用于识别。
 */

const CJK = /[\u4e00-\u9fa5]/
const ELEV_LABEL = /^([+\-]?\d{2,4}(?:\.\d{1,3})?)\s*(?:m|米)\s*(.*)$/i
const Z_LABEL = /Z\s*=\s*([+\-]?\d{2,4}(?:\.\d{1,3})?)/i
const POINT_Z = /([A-Za-z]{1,4}\d{0,4})[′'"]?\s*([+\-]\d{3,4}(?:\.\d{2,3})?)\s*T?\b/
const BARE_PLUS = /([+\-]\d{3,4}(?:\.\d{1,3})?)(?!\d)/

const isElevation = v => Number.isFinite(v) && v >= 100 && v <= 2500

/** 纯点名/编号（H2201、L9、—96、3#、37.8—44）不算巷道名。 */
export function isCodeLike(text) {
  const s = String(text || '').trim()
  if (!s) return true
  if (!CJK.test(s)) return true
  if (/^[—\-–~—]?\s*\d{1,4}$/.test(s)) return true
  if (/^[A-Za-z]{0,4}\d{1,4}[′'"]?$/.test(s)) return true
  if (/^\d+(\.\d+)?[—\-–~]\d+(\.\d+)?$/.test(s)) return true
  if (/^\d+#$/.test(s)) return true
  return false
}

/** 从全图文字中学习标高写法、名称用词与水平集合。 */
export function learnConventions(texts, options = {}) {
  const stats = { plusUnit: 0, zEquals: 0, pointZT: 0, barePlus: 0 }
  const wordCount = new Map()
  const elevations = []
  const samples = []
  for (const item of texts || []) {
    const text = String(item.text || '').trim()
    if (!text || text.length > 60) continue
    let hit = false
    const m1 = text.match(ELEV_LABEL)
    if (m1 && isElevation(Number(m1[1]))) {
      stats.plusUnit++
      elevations.push(Number(m1[1]))
      const tail = m1[2].trim()
      if (tail && !isCodeLike(tail)) collectWords(tail, wordCount)
      hit = true
    }
    const m2 = text.match(Z_LABEL)
    if (m2 && isElevation(Number(m2[1]))) {
      stats.zEquals++
      elevations.push(Number(m2[1]))
      hit = true
    }
    const m3 = text.match(POINT_Z)
    if (m3 && isElevation(Number(m3[2]))) {
      stats.pointZT++
      elevations.push(Number(m3[2]))
      hit = true
    }
    if (!hit) {
      const m4 = text.match(BARE_PLUS)
      if (m4 && isElevation(Number(m4[1]))) {
        stats.barePlus++
        elevations.push(Number(m4[1]))
      }
    }
    if (CJK.test(text) && text.length <= 24) collectWords(text, wordCount)
    if (samples.length < 12 && CJK.test(text) && text.length <= 24) samples.push(text)
  }

  const vocabulary = [...wordCount.entries()]
    .filter(([, count]) => count >= (options.minWordCount || 2))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([word]) => word)

  // 水平：把标高按 0.5 m 聚类，出现 2 次以上算一个“水平”
  const buckets = new Map()
  for (const v of elevations) {
    const key = Math.round(v * 2) / 2
    buckets.set(key, (buckets.get(key) || 0) + 1)
  }
  const levels = [...buckets.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => a[0] - b[0])
    .map(([value, count]) => ({ value, count }))

  const patternCount = Object.values(stats).filter(v => v > 0).length
  return {
    stats,
    vocabulary,
    levels,
    elevationSamples: [...new Set(elevations)].slice(0, 20),
    samples,
    confidence: Math.min(1, patternCount / 3 + Math.min(1, vocabulary.length / 10) * 0.3),
  }
}

function collectWords(text, counter) {
  const cleaned = text.replace(/^[+\-]?\d+(\.\d+)?\s*(m|米)?/i, '').trim()
  if (!cleaned || !CJK.test(cleaned)) return
  const words = new Set()
  for (let len = 2; len <= 6; len++)
    for (let i = 0; i + len <= cleaned.length; i++) {
      const w = cleaned.slice(i, i + len)
      if (CJK.test(w)) words.add(w)
    }
  for (const w of words) counter.set(w, (counter.get(w) || 0) + 1)
}

/** 用学到的词表判断一段文字像不像巷道名。 */
export function looksLikeName(text, learned) {
  const s = String(text || '').trim()
  if (!s || isCodeLike(s)) return false
  if (!CJK.test(s)) return false
  if (learned && learned.vocabulary && learned.vocabulary.length) {
    const hits = learned.vocabulary.filter(w => w.length >= 2 && s.includes(w))
    if (hits.length) return true
  }
  return /巷|井|石门|顺槽|大巷|工作面|盘区|采区|硐室|车场|切眼|上山|下山|绕道/.test(s)
}

/** 最近的“水平”（用于给没有名称的巷道起可读名字）。 */
export function nearestLevel(elevation, learned) {
  if (!Number.isFinite(elevation) || !learned?.levels?.length) return null
  let best = null
  for (const level of learned.levels) {
    const d = Math.abs(level.value - elevation)
    if (!best || d < best.d) best = { ...level, d }
  }
  return best && best.d <= 3 ? best : null
}
