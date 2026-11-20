/** 巷道几何引擎：路径成链、双线配对估宽、中线提取、平行偏移生成边界。 */

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])

export function pathLength(pts) {
  let sum = 0
  for (let i = 1; i < pts.length; i++) sum += dist(pts[i - 1], pts[i])
  return sum
}

function simplify(points, tolerance = 0.15) {
  if (points.length < 3) return points
  const keep = new Uint8Array(points.length)
  keep[0] = 1
  keep[points.length - 1] = 1
  const stack = [[0, points.length - 1]]
  while (stack.length) {
    const [first, last] = stack.pop()
    if (last - first < 2) continue
    const [ax, ay] = points[first]
    const [bx, by] = points[last]
    const dx = bx - ax
    const dy = by - ay
    const len = Math.hypot(dx, dy)
    let maxDist = -1
    let index = -1
    for (let i = first + 1; i < last; i++) {
      const [px, py] = points[i]
      const d = len < 1e-9 ? Math.hypot(px - ax, py - ay) : Math.abs(dy * px - dx * py + bx * ay - by * ax) / len
      if (d > maxDist) {
        maxDist = d
        index = i
      }
    }
    if (maxDist > tolerance) {
      keep[index] = 1
      stack.push([first, index], [index, last])
    }
  }
  return points.filter((_, i) => keep[i])
}

/**
 * 坐标簇选取：把整幅图按网格连通性分簇，保留成规模的几个簇（多分区/多图纸常有多簇），
 * 只丢掉零散噪点与超远局部详图，避免"只认最大一块"漏掉真实巷道。
 */
export function selectClusters(paths, { cell = 4000, minRatio = 0.02, maxClusters = 4, maxSpread = 50000 } = {}) {
  if (!paths.length) return { paths, dropped: 0, clusters: 0 }
  const buckets = new Map()
  paths.forEach((p, i) => {
    const x = p.pts[0][0]
    const y = p.pts[0][1]
    const key = `${Math.floor(x / cell)}:${Math.floor(y / cell)}`
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key).push(i)
  })
  const seen = new Map()
  const groups = []
  for (const [key, idxs] of buckets) {
    if (seen.has(key)) continue
    const stack = [key]
    const members = []
    seen.set(key, true)
    while (stack.length) {
      const k = stack.pop()
      const list = buckets.get(k)
      if (list) members.push(...list)
      const [gx, gy] = k.split(':').map(Number)
      for (let dx = -2; dx <= 2; dx++)
        for (let dy = -2; dy <= 2; dy++) {
          const nk = `${gx + dx}:${gy + dy}`
          if (buckets.has(nk) && !seen.has(nk)) {
            seen.set(nk, true)
            stack.push(nk)
          }
        }
    }
    groups.push(members)
  }
  groups.sort((a, b) => b.length - a.length)
  const largest = groups[0].length
  const threshold = Math.max(5, largest * minRatio)
  const centroid = members => {
    let sx = 0
    let sy = 0
    for (const idx of members) {
      sx += paths[idx].pts[0][0]
      sy += paths[idx].pts[0][1]
    }
    return [sx / members.length, sy / members.length]
  }
  const main = centroid(groups[0])
  const kept = []
  let dropped = 0
  let used = 0
  let far = 0
  groups.forEach((members, i) => {
    const [cx, cy] = centroid(members)
    const distance = Math.hypot(cx - main[0], cy - main[1])
    const ok = i === 0 || (i < maxClusters && members.length >= threshold && distance <= maxSpread)
    if (ok) {
      used++
      for (const idx of members) kept.push(paths[idx])
    } else {
      dropped += members.length
      if (i > 0 && distance > maxSpread) far++
    }
  })
  kept.sort((a, b) => a.pts[0][0] - b.pts[0][0])
  return { paths: kept, dropped, clusters: used, total: groups.length, far }
}

/** 兼容旧调用：只保留主簇。 */
export function dominantCluster(paths, maxDistance = 20000) {
  return selectClusters(paths, { cell: maxDistance / 4 })
}

function endpointKey(pt, tol) {
  return `${Math.round(pt[0] / tol)}:${Math.round(pt[1] / tol)}`
}

/** 路径按端点吸附成链；岔口处优先选择方向最接近的分支。 */
export function buildChains(paths, tolerance = 1.2) {
  const chains = []
  const open = []
  for (const p of paths) {
    if (p.closed) chains.push({ layer: p.layer, pts: p.pts, closed: true, sources: 1 })
    else open.push({ layer: p.layer, pts: p.pts, closed: false, used: false, sources: 1 })
  }
  const buckets = new Map()
  const add = (pt, index, end) => {
    const key = endpointKey(pt, tolerance)
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key).push({ index, end })
  }
  open.forEach((p, i) => {
    add(p.pts[0], i, 0)
    add(p.pts[p.pts.length - 1], i, 1)
  })

  const near = pt => {
    const kx = Math.round(pt[0] / tolerance)
    const ky = Math.round(pt[1] / tolerance)
    const out = []
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++) {
        const list = buckets.get(`${kx + dx}:${ky + dy}`)
        if (list) for (const item of list) if (!out.includes(item)) out.push(item)
      }
    return out
  }

  const direction = (pts, atEnd) => {
    const n = pts.length
    const a = atEnd ? pts[Math.max(0, n - 2)] : pts[1]
    const b = atEnd ? pts[n - 1] : pts[0]
    return Math.atan2(a[1] - b[1], a[0] - b[0])
  }

  const pickNext = (pt, incomingAngle, layer) => {
    let best = null
    let bestScore = Infinity
    for (const item of near(pt)) {
      const cand = open[item.index]
      if (cand.used) continue
      if (!cand.closed && dist(cand.pts[item.end === 0 ? 0 : cand.pts.length - 1], pt) > tolerance * 1.8) continue
      const dir = direction(cand.pts, item.end === 1)
      let diff = Math.abs(((dir - incomingAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI)
      if (cand.layer !== layer) diff += 0.35
      if (diff < bestScore) {
        bestScore = diff
        best = { ...item, angle: diff }
      }
    }
    return bestScore <= Math.PI * 0.72 ? best : null
  }

  for (let i = 0; i < open.length; i++) {
    const start = open[i]
    if (start.used) continue
    start.used = true
    let pts = start.pts.slice()
    const layer = start.layer
    let sources = 1

    // 向前延伸
    let guard = 0
    while (guard++ < 4000) {
      const angle = direction(pts, true)
      const next = pickNext(pts[pts.length - 1], angle, layer)
      if (!next) break
      const cand = open[next.index]
      cand.used = true
      sources++
      const seq = next.end === 0 ? cand.pts : cand.pts.slice().reverse()
      pts = pts.concat(seq.slice(1))
    }
    // 向后延伸
    guard = 0
    while (guard++ < 4000) {
      const angle = direction(pts, false)
      const next = pickNext(pts[0], angle, layer)
      if (!next) break
      const cand = open[next.index]
      cand.used = true
      sources++
      const seq = next.end === 1 ? cand.pts : cand.pts.slice().reverse()
      pts = seq.slice(0, -1).concat(pts)
    }
    const simplified = simplify(pts, 0.12)
    if (simplified.length >= 2) chains.push({ layer, pts: simplified, closed: false, sources })
  }
  return chains.map(c => ({ ...c, length: pathLength(c.pts) }))
}

function bbox(pts) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const [x, y] of pts) {
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
  }
  return { minX, minY, maxX, maxY }
}

function sample(pts, step) {
  const out = []
  const total = pathLength(pts)
  if (total < 1e-6) return out
  const count = Math.max(2, Math.min(120, Math.round(total / step)))
  const seg = total / count
  let target = 0
  let acc = 0
  for (let i = 1; i < pts.length && out.length < count; i++) {
    const a = pts[i - 1]
    const b = pts[i]
    const d = dist(a, b)
    while (acc + d >= target && out.length < count) {
      const t = d < 1e-9 ? 0 : (target - acc) / d
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
      target += seg
    }
    acc += d
  }
  return out
}

function pointToChainDistance(pt, pts) {
  let best = { d: Infinity, point: null }
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1]
    const [bx, by] = pts[i]
    const dx = bx - ax
    const dy = by - ay
    const len2 = dx * dx + dy * dy
    let t = len2 < 1e-12 ? 0 : ((pt[0] - ax) * dx + (pt[1] - ay) * dy) / len2
    t = Math.max(0, Math.min(1, t))
    const px = ax + dx * t
    const py = ay + dy * t
    const d = Math.hypot(pt[0] - px, pt[1] - py)
    if (d < best.d) best = { d, point: [px, py] }
  }
  return best
}

/** 双线巷道：两条近似平行、间距稳定的链合成一条中线。 */
export function pairChains(chains, { minGap = 1.5, maxGap = 8, cell = 80 } = {}) {
  const eligible = chains.filter(c => !c.closed && c.length >= 8)
  const grid = new Map()
  const boxes = eligible.map(c => bbox(c.pts))
  boxes.forEach((b, i) => {
    for (let gx = Math.floor(b.minX / cell); gx <= Math.floor(b.maxX / cell); gx++)
      for (let gy = Math.floor(b.minY / cell); gy <= Math.floor(b.maxY / cell); gy++) {
        const key = `${gx}:${gy}`
        if (!grid.has(key)) grid.set(key, [])
        grid.get(key).push(i)
      }
  })
  const used = new Uint8Array(eligible.length)
  const corridors = []
  const free = []
  for (let i = 0; i < eligible.length; i++) {
    if (used[i]) continue
    const a = eligible[i]
    const box = boxes[i]
    const candidates = new Set()
    for (let gx = Math.floor(box.minX / cell) - 1; gx <= Math.floor(box.maxX / cell) + 1; gx++)
      for (let gy = Math.floor(box.minY / cell) - 1; gy <= Math.floor(box.maxY / cell) + 1; gy++) {
        const list = grid.get(`${gx}:${gy}`)
        if (list) for (const j of list) if (j !== i && !used[j]) candidates.add(j)
      }
    const samples = sample(a.pts, 4)
    let best = null
    for (const j of candidates) {
      const b = eligible[j]
      const boxB = boxes[j]
      if (boxB.minX > box.maxX + maxGap || boxB.maxX < box.minX - maxGap) continue
      if (boxB.minY > box.maxY + maxGap || boxB.maxY < box.minY - maxGap) continue
      const gaps = []
      let hits = 0
      for (const s of samples) {
        const { d } = pointToChainDistance(s, b.pts)
        if (d >= minGap && d <= maxGap) {
          hits++
          gaps.push(d)
        }
      }
      if (!samples.length) continue
      const ratio = hits / samples.length
      if (ratio < 0.6 || gaps.length < 3) continue
      gaps.sort((x, y) => x - y)
      const median = gaps[Math.floor(gaps.length / 2)]
      const spread = gaps[gaps.length - 1] - gaps[0]
      if (spread > Math.max(1.2, median * 0.6)) continue
      const score = ratio - spread / 10
      if (!best || score > best.score) best = { j, score, ratio, width: median }
    }
    if (best) {
      used[i] = 1
      used[best.j] = 1
      const b = eligible[best.j]
      const mid = sample(a.pts, 3)
      const midPoints = mid.map(pt => {
        const { point } = pointToChainDistance(pt, b.pts)
        return point ? [(pt[0] + point[0]) / 2, (pt[1] + point[1]) / 2] : pt
      })
      const cleaned = simplify(midPoints, 0.12)
      if (cleaned.length >= 2)
        corridors.push({
          layer: a.layer,
          pts: cleaned,
          width: Math.max(minGap, best.width),
          length: pathLength(cleaned),
          sources: 2,
        })
    } else free.push(a)
  }
  for (let i = 0; i < eligible.length; i++) if (!used[i]) free.push(eligible[i])
  return { corridors, free }
}

/** 首尾相接且方向接近的中线合并成一条巷道。 */
export function mergeLanes(lanes, tolerance = 2.5, maxLength = 3000) {
  const pool = lanes
    .filter(l => l.pts.length >= 2)
    .slice()
    .sort((a, b) => b.length - a.length)
  const used = new Array(pool.length).fill(false)
  const headAngle = pts => Math.atan2(pts[0][1] - pts[1][1], pts[0][0] - pts[1][0])
  const tailAngle = pts => {
    const n = pts.length
    return Math.atan2(pts[n - 1][1] - pts[n - 2][1], pts[n - 1][0] - pts[n - 2][0])
  }
  const angleDiff = (a, b) => Math.abs(((a - b + Math.PI * 3) % (Math.PI * 2)) - Math.PI)
  const result = []
  for (let i = 0; i < pool.length; i++) {
    if (used[i]) continue
    used[i] = true
    let lane = { ...pool[i], pts: pool[i].pts.slice() }
    let changed = true
    while (changed) {
      changed = false
      const tail = lane.pts[lane.pts.length - 1]
      const head = lane.pts[0]
      for (let j = 0; j < pool.length; j++) {
        if (used[j]) continue
        const other = pool[j]
        let merged = null
        if (dist(tail, other.pts[0]) <= tolerance && angleDiff(tailAngle(lane.pts), tailAngle(other.pts)) <= 0.6)
          merged = lane.pts.concat(other.pts.slice(1))
        else if (
          dist(tail, other.pts[other.pts.length - 1]) <= tolerance &&
          angleDiff(tailAngle(lane.pts), headAngle(other.pts)) <= 0.6
        )
          merged = lane.pts.concat(other.pts.slice(0, -1).reverse())
        else if (dist(head, other.pts[other.pts.length - 1]) <= tolerance && angleDiff(headAngle(lane.pts), tailAngle(other.pts)) <= 0.6)
          merged = other.pts.concat(lane.pts.slice(1))
        else if (dist(head, other.pts[0]) <= tolerance && angleDiff(headAngle(lane.pts), headAngle(other.pts)) <= 0.6)
          merged = other.pts.slice().reverse().concat(lane.pts.slice(1))
        if (!merged) continue
        const mergedLength = pathLength(merged)
        if (mergedLength > maxLength) continue
        used[j] = true
        lane = {
          layer: lane.layer,
          pts: merged,
          width: (lane.width * lane.length + other.width * other.length) / Math.max(1e-6, lane.length + other.length),
          length: mergedLength,
          sources: lane.sources + other.sources,
        }
        changed = true
        break
      }
    }
    result.push(lane)
  }
  return result
}

/** 平行偏移生成边界（斜接），退化时退化为圆弧近似。 */
export function offsetPolyline(pts, distance) {
  const n = pts.length
  if (n < 2) return pts.slice()
  const out = []
  for (let i = 0; i < n; i++) {
    const prev = pts[Math.max(0, i - 1)]
    const next = pts[Math.min(n - 1, i + 1)]
    let dx = next[0] - prev[0]
    let dy = next[1] - prev[1]
    const len = Math.hypot(dx, dy)
    if (len < 1e-9) {
      out.push([pts[i][0], pts[i][1]])
      continue
    }
    dx /= len
    dy /= len
    const nx = -dy * distance
    const ny = dx * distance
    out.push([pts[i][0] + nx, pts[i][1] + ny])
  }
  return out
}

/** 采样点法向量（用于宽度校验与边界平滑）。 */
export function normals(pts) {
  return pts.map((p, i) => {
    const prev = pts[Math.max(0, i - 1)]
    const next = pts[Math.min(pts.length - 1, i + 1)]
    const dx = next[0] - prev[0]
    const dy = next[1] - prev[1]
    const len = Math.hypot(dx, dy) || 1
    return [-dy / len, dx / len]
  })
}

/** 去重：几何几乎重合的中线只留一条（块展开/双线冗余常产生重复）。 */
export function dedupeLanes(lanes, { tol = 2, angleTol = 0.17, lengthTol = 0.2 } = {}) {
  const kept = []
  const mid = l => l.pts[Math.floor(l.pts.length / 2)]
  const angle = l => {
    const a = l.pts[0]
    const b = l.pts[l.pts.length - 1]
    return Math.atan2(b[1] - a[1], b[0] - a[0])
  }
  const list = lanes.slice().sort((a, b) => b.length - a.length)
  for (const lane of list) {
    const [mx, my] = mid(lane)
    const ang = angle(lane)
    let dup = false
    for (const other of kept) {
      const [ox, oy] = mid(other)
      if (Math.hypot(mx - ox, my - oy) > tol) continue
      if (Math.abs(ang - angle(other)) > angleTol && Math.abs(ang - angle(other)) < Math.PI - angleTol) continue
      if (Math.abs(lane.length - other.length) > Math.max(5, other.length * lengthTol)) continue
      dup = true
      break
    }
    if (!dup) kept.push(lane)
  }
  return kept
}
