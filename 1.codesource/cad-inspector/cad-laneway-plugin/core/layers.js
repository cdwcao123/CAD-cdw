/**
 * 图层判别：不只看图层名，而是看这一层的几何"像不像巷道"。
 * 判据：总长度、线段中位长度、平行双线密度（巷道两帮）、闭合比例。
 * 名称只作为加权先验，避免换一张图（图层叫 114采区 / 0 / GSLAYER）就失效。
 */
import { buildChains, pairChains, pathLength } from './geometry.js'

const LANE_NAME = /巷道|井巷|大巷|顺槽|石门|联络|中心线|煤巷|开拓|回采|掘进|上山|下山|车场|绕道|切眼/i
const NOISE_NAME = /等高线|断层|钻孔|露头|煤柱|标注|文字|图框|填充|设备|水沟|风门|密闭|剖面|经纬|网格|坐标|图例|色块|岩性|支护|通风|管线|电缆|监测|排水|钻孔|探放水|充水/i

const median = list => {
  if (!list.length) return 0
  const sorted = list.slice().sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

function sampleLayer(paths, limit) {
  if (paths.length <= limit) return paths
  const step = paths.length / limit
  const out = []
  for (let i = 0; i < limit; i++) out.push(paths[Math.floor(i * step)])
  return out
}

/**
 * 给每个图层打“像不像巷道”的分（0-1）。
 * @returns {Array<{name:string, score:number, totalLength:number, pairing:number, paths:number}>}
 */
export function rankLayers(paths, { sampleSize = 2500, minLength = 15 } = {}) {
  const byLayer = new Map()
  for (const p of paths) {
    if (!byLayer.has(p.layer)) byLayer.set(p.layer, [])
    byLayer.get(p.layer).push(p)
  }
  const result = []
  for (const [name, list] of byLayer) {
    if (list.length < 3) continue
    const sample = sampleLayer(list, sampleSize)
    const lengths = sample.map(p => pathLength(p.pts))
    const totalLength = lengths.reduce((a, b) => a + b, 0)
    if (totalLength < 200) continue
    const longRatio = lengths.filter(v => v >= minLength).length / lengths.length
    const closedRatio = sample.filter(p => p.closed).length / sample.length
    const chains = buildChains(sample, 1.2).filter(c => c.length >= minLength && !c.closed)
    const { corridors } = pairChains(
      chains.slice(0, Math.min(1200, chains.length)),
      { minGap: 1.5, maxGap: 8 }
    )
    const pairLength = corridors.reduce((sum, c) => sum + c.length, 0)
    const chainLength = chains.reduce((sum, c) => sum + c.length, 0) || 1
    const pairing = Math.min(1, pairLength / chainLength)
    const medianLen = median(lengths)
    let score = 0
    score += 0.5 * pairing
    score += 0.2 * longRatio
    score += 0.15 * Math.min(1, totalLength / 8000)
    score += 0.15 * (closedRatio < 0.1 ? 1 : closedRatio < 0.35 ? 0.5 : 0)
    if (LANE_NAME.test(name)) score += 0.25
    if (NOISE_NAME.test(name)) score -= 0.45
    if (medianLen < 6) score -= 0.2
    result.push({
      name,
      score: Math.max(0, Math.min(1, Math.round(score * 100) / 100)),
      totalLength: Math.round(totalLength),
      pairing: Math.round(pairing * 100) / 100,
      medianLength: Math.round(medianLen),
      paths: list.length,
      named: LANE_NAME.test(name),
    })
  }
  result.sort((a, b) => b.score - a.score)
  return result
}

/** 综合选层：名称命中的优先，但几何分数过低或总长明显不足时改用几何排名。 */
export function chooseLaneLayers(paths, options = {}) {
  const ranked = rankLayers(paths, options)
  const byName = ranked.filter(r => r.named && r.score >= 0.15).slice(0, 8)
  const byGeometry = ranked.filter(r => r.score >= 0.35).slice(0, 4)
  const nameLength = byName.reduce((sum, r) => sum + r.totalLength, 0)
  const geoLength = byGeometry.reduce((sum, r) => sum + r.totalLength, 0)
  const useGeometry = byGeometry.length && (nameLength < geoLength * 0.5 || byName.length === 0)
  const chosen = useGeometry ? byGeometry : byName.length ? byName : byGeometry
  return {
    layers: chosen.map(r => r.name),
    reason: useGeometry ? '按几何特征选层' : '按图层名选层',
    ranked,
    candidates: { byName, byGeometry },
  }
}
