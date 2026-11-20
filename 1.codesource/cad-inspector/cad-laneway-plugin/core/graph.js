/**
 * 导线点建图：MAS 的巷道是"导线点串成的路径"，所以把识别出的中线吸附到导线点上，
 * 让每条巷道的顶点落在真实的测量点上（而不是自由的插值点）。
 */

/** 从已解析路径里提取小圆圈（导线点）中心。 */
export function extractNodes(paths, { minR = 0.25, maxR = 0.6 } = {}) {
  const nodes = []
  for (const p of paths) {
    if (p.kind !== 'CIRCLE' && !(p.kind === 'ARC' && p.closed)) continue
    let minX = Infinity
    let maxX = -Infinity
    let minY = Infinity
    let maxY = -Infinity
    for (const [x, y] of p.pts) {
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
    const r = ((maxX - minX) + (maxY - minY)) / 4
    if (r < minR || r > maxR) continue
    nodes.push({ x: (minX + maxX) / 2, y: (minY + maxY) / 2, r })
  }
  return nodes
}

const dist2 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])

const pathLength = pts => {
  let total = 0
  for (let i = 1; i < pts.length; i++) total += dist2(pts[i - 1], pts[i])
  return total
}

function projectOnSegment(pt, a, b) {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const len2 = dx * dx + dy * dy
  if (len2 < 1e-9) return { t: 0, d: dist2(pt, a), p: a }
  let t = ((pt[0] - a[0]) * dx + (pt[1] - a[1]) * dy) / len2
  t = Math.max(0, Math.min(1, t))
  const p = [a[0] + dx * t, a[1] + dy * t]
  return { t, d: dist2(pt, p), p }
}

/**
 * 把巷道中线吸附到导线点：距离中线 <= maxDist 的节点，按弧长插进折线。
 * 返回新的中线顶点序列（含 inserted 标记，便于后续给点取名/标高）。
 */
export function snapLaneToNodes(pts, nodes, { maxDist = 8 } = {}) {
  if (pts.length < 2 || !nodes.length) return { pts: pts.map(p => ({ x: p[0], y: p[1], node: null })), snapped: 0 }

  // 为每个线段找邻近节点
  const inserted = []
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]
    const b = pts[i + 1]
    const segLen = dist2(a, b) || 1e-6
    for (const n of nodes) {
      const { t, d } = projectOnSegment([n.x, n.y], a, b)
      if (d > maxDist) continue
      inserted.push({ i, t, arc: i + t, dist: d, x: n.x, y: n.y })
    }
  }
  if (!inserted.length) return { pts: pts.map(p => ({ x: p[0], y: p[1], node: null })), snapped: 0 }

  // 同一位置只保留最近的节点
  inserted.sort((p, q) => p.arc - q.arc)
  const kept = []
  let lastArc = -1
  for (const ins of inserted) {
    if (ins.arc - lastArc < 0.15) {
      if (kept.length && ins.dist < kept[kept.length - 1].dist) kept[kept.length - 1] = ins
      continue
    }
    kept.push(ins)
    lastArc = ins.arc
  }

  // 按段重建
  const out = [{ x: pts[0][0], y: pts[0][1], node: null }]
  let k = 0
  for (let i = 0; i < pts.length - 1; i++) {
    while (k < kept.length && kept[k].i === i) {
      const ins = kept[k++]
      const prev = out[out.length - 1]
      if (Math.hypot(ins.x - prev.x, ins.y - prev.y) > 0.3) out.push({ x: ins.x, y: ins.y, node: ins })
    }
    const b = pts[i + 1]
    const prev = out[out.length - 1]
    if (Math.hypot(b[0] - prev.x, b[1] - prev.y) > 0.3) out.push({ x: b[0], y: b[1], node: null })
  }
  return { pts: out, snapped: kept.length }
}

/**
 * 节点建图：把每条候选巷道上的导线点按里程串起来，用节点序列替代自由顶点。
 * 思路对应人工采集（沿导线点连线），节点间距 15~60 m 时可信。
 */
export function buildNodeLanes(lanes, nodes, { snapDist = 4, minSpan = 12, maxStep = 80 } = {}) {
  const out = []
  for (const lane of lanes) {
    const pts = lane.pts
    // 累计里程，用于排序
    const mileage = [0]
    for (let i = 1; i < pts.length; i++) mileage.push(mileage[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
    const picked = []
    for (const n of nodes) {
      let best = { d: Infinity, s: 0 }
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i]
        const b = pts[i + 1]
        const dx = b[0] - a[0]
        const dy = b[1] - a[1]
        const len2 = dx * dx + dy * dy
        let t = len2 ? ((n.x - a[0]) * dx + (n.y - a[1]) * dy) / len2 : 0
        t = Math.max(0, Math.min(1, t))
        const px = a[0] + dx * t
        const py = a[1] + dy * t
        const d = Math.hypot(n.x - px, n.y - py)
        if (d < best.d) best = { d, s: mileage[i] + Math.hypot(px - a[0], py - a[1]) }
      }
      if (best.d <= snapDist) picked.push({ s: best.s, x: n.x, y: n.y, z: n.z })
    }
    if (picked.length < 2) continue
    picked.sort((a, b) => a.s - b.s)
    // 去掉过近的重复节点
    const chain = []
    for (const p of picked) {
      const last = chain[chain.length - 1]
      if (last && Math.hypot(p.x - last.x, p.y - last.y) < minSpan / 3) continue
      if (last && Math.hypot(p.x - last.x, p.y - last.y) > maxStep) continue
      chain.push(p)
    }
    if (chain.length < 2) continue
    const span = chain[chain.length - 1].s - chain[0].s
    if (span < minSpan) continue
    out.push({
      layer: lane.layer,
      width: lane.width,
      pts: chain.map(p => [p.x, p.y]),
      zs: chain.map(p => p.z),
      nodeCount: chain.length,
      length: pathLength(chain.map(p => [p.x, p.y])),
    })
  }
  return out
}
