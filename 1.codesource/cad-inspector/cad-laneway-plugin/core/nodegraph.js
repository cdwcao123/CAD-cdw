/** 基于圆圈和相邻线划生成实验性巷道候选；结果需要真值对拍及人工复核。 */

export function pathLen(pts) {
  let s = 0
  for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
  return s
}

// Only join at unambiguous, same-layer endpoint pairs; stop at junctions.
function continuousChains(paths, tolerance) {
  const cell = Math.max(tolerance, 1e-6)
  const buckets = new Map()
  const ends = []
  const key = (x, y) => `${x}:${y}`
  paths.forEach((p, index) => {
    for (const end of [0, 1]) {
      const pt = p.pts[end ? p.pts.length - 1 : 0]
      const item = { index, end, pt, neighbors: [] }
      const kx = Math.floor(pt[0] / cell), ky = Math.floor(pt[1] / cell)
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
        for (const other of buckets.get(key(kx + dx, ky + dy)) || []) {
          if (other.index === index || paths[other.index].layer !== p.layer) continue
          if (Math.hypot(pt[0] - other.pt[0], pt[1] - other.pt[1]) > tolerance) continue
          item.neighbors.push(other)
          other.neighbors.push(item)
        }
      }
      const k = key(kx, ky)
      if (!buckets.has(k)) buckets.set(k, [])
      buckets.get(k).push(item)
      ends[index * 2 + end] = item
    }
  })
  const link = e => e.neighbors.length === 1 && e.neighbors[0].neighbors.length === 1 ? e.neighbors[0] : null
  const used = new Set(), chains = []
  const walk = (index, entry) => {
    const pts = []
    let i = index, side = entry
    while (!used.has(i)) {
      used.add(i)
      const seq = side ? paths[i].pts.slice().reverse() : paths[i].pts
      if (pts.length && (pts[pts.length - 1][0] !== seq[0][0] || pts[pts.length - 1][1] !== seq[0][1])) pts.push(seq[0])
      pts.push(...(pts.length ? seq.slice(1) : seq))
      const next = link(ends[i * 2 + (side ? 0 : 1)])
      if (!next || used.has(next.index)) break
      i = next.index
      side = next.end
    }
    return { layer: paths[index].layer, pts }
  }
  for (let i = 0; i < paths.length; i++) {
    if (used.has(i)) continue
    const start = !link(ends[i * 2]) ? 0 : !link(ends[i * 2 + 1]) ? 1 : -1
    if (start !== -1) chains.push(walk(i, start))
  }
  // Closed endpoint loops have no unambiguous start and are not tunnel candidates.
  return chains
}

function mileAt(p, pts) {
  let best = { d: Infinity, s: 0 }
  let acc = 0
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]
    const b = pts[i]
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const len = Math.hypot(dx, dy)
    let t = len ? ((p.x - a[0]) * dx + (p.y - a[1]) * dy) / (len * len) : 0
    t = Math.max(0, Math.min(1, t))
    const d = Math.hypot(p.x - (a[0] + dx * t), p.y - (a[1] + dy * t))
    if (d < best.d) best = { d, s: acc + len * t }
    acc += len
  }
  return best
}

/**
 * 巷道线划图层：既含名称命中的，也含实测承载导线点的图层 0 / 114采区。
 * 用「有导线点落在其上」来过滤，避免把图框、等高线、符号等噪声也当成巷道。
 */
export const LANE_LAYER_HINTS = /巷道|井巷|大巷|顺槽|石门|联络|中心线|煤巷|开拓|回采|掘进|上山|下山|车场|绕道|切眼|采区/
export const NODE_BEARING_LAYERS = new Set(['0', '114采区'])

/**
 * 从导线点重建巷道。
 * @param {Array} paths 全部线划（parseDxf 的 paths）
 * @param {Array} nodes 导线点圆圈（extractSurveyNodes 的 nodes，含 x/y/z/name）
 * @param {Object} opts { snapDist=3, minLen=10, minNodes=2, chainTol=1.5 }
 * @returns {Array} lanes：[{ layer, pts:[[x,y],...], zs, names, nodeCount, length, width }]
 */
export function buildLanesFromNodes(paths, nodes, { snapDist = 3, minLen = 10, minNodes = 2, chainTol = 1.5 } = {}) {
  if (!paths || !paths.length || !nodes || nodes.length < 2) return []

  // Connect open segments before requiring measurement points; intermediate
  // segments may contain no survey circles at all.
  const candidates = paths.filter(p => p.pts && p.pts.length >= 2 && !p.closed &&
    /^(?:LINE|LWPOLYLINE|POLYLINE|ARC|SPLINE)(?:@|$)/.test(p.kind || '') &&
    (LANE_LAYER_HINTS.test(p.layer || '') || NODE_BEARING_LAYERS.has(p.layer || '')) && pathLen(p.pts) > 1e-6)
  if (!candidates.length) return []

  const chains = continuousChains(candidates, chainTol).filter(c => pathLen(c.pts) >= minLen)
  const lanes = []
  for (const c of chains) {
    const picked = []
    for (const [nodeIndex, n] of nodes.entries()) {
      const { d, s } = mileAt(n, c.pts)
      if (d <= snapDist) picked.push({ x: n.x, y: n.y, z: n.z, name: n.name, s, nodeIndex })
    }
    if (picked.length < minNodes) continue
    picked.sort((a, b) => a.s - b.s)
    const dedup = picked.filter((p, i) => i === 0 || Math.hypot(p.x - picked[i - 1].x, p.y - picked[i - 1].y) > 1)
    if (dedup.length < minNodes) continue
    const geometryReview = dedup.some((p, i) => i > 0 &&
      p.s - dedup[i - 1].s > Math.hypot(p.x - dedup[i - 1].x, p.y - dedup[i - 1].y) * 1.1 + 2)
    lanes.push({
      geometryReview,
      layer: c.layer || '0',
      pts: dedup.map(p => [p.x, p.y]),
      zs: dedup.map(p => p.z),
      names: dedup.map(p => p.name),
      nodeIndices: dedup.map(p => p.nodeIndex),
      nodeCount: dedup.length,
      length: pathLen(dedup.map(p => [p.x, p.y])),
      width: 4,
      pairConfidence: 1,
      source: 'nodegraph',
    })
  }
  lanes.sort((a, b) => b.length - a.length)
  return lanes
}
