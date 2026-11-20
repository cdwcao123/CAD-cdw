/** 小圆圈与附近文字仅作为候选证据，不能单独证明是导线点。 */
const ELEV_LABEL = /^(?:([A-Za-z][A-Za-z0-9_'′-]{0,19})\s+)?(?:Z\s*=\s*)?([+\-]?\d{2,4}(?:\.\d{1,4})?)(?:\s*([A-Za-z\u4e00-\u9fff⊥·]{1,8}|[（(][^()（）]{1,8}[）)]))?\s*$/i
const ELEV_REVERSED = /^([+\-]?\d{2,4}(?:\.\d{1,4})?)\s+([A-Za-z]{1,4}\d{1,5}['′]?)$/i
const POINT_LABEL = /^[A-Za-z]{1,4}\d{1,5}['′]?$/

function parseElevationLabel(raw) {
  const rawText = String(raw == null ? '' : raw).trim()
  const match = rawText.match(ELEV_LABEL)
  const reverse = !match && rawText.match(ELEV_REVERSED)
  if (!match && !reverse) return null
  const z = Number(match ? match[2] : reverse[1])
  const suffix = match?.[3] || ''
  if (suffix && /[\u4e00-\u9fff]/.test(suffix) && !/[.]/.test(match[2]) && !/^[（(]/.test(suffix) && suffix !== '米') return null
  return z >= 100 && z <= 2500 ? { z, name: match ? match[1] || null : reverse[2], suffix } : null
}

export function parseElev(raw) {
  return parseElevationLabel(raw)?.z ?? null
}

export function parsePointName(raw) {
  return parseElevationLabel(raw)?.name ?? null
}

export function extractSurveyNodes(paths, texts, { minR = 0.3, maxR = 0.75, textRadius = 12 } = {}) {
  const circles = []
  for (const p of paths) {
    if (!/^CIRCLE(?:@|$)/.test(p.kind || '')) continue
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
    const circle = p.circle
    const r = circle && Number.isFinite(circle.r) ? circle.r : ((maxX - minX) + (maxY - minY)) / 4
    if (r < minR || r > maxR) continue
    circles.push({ x: circle ? circle.x : (minX + maxX) / 2, y: circle ? circle.y : (minY + maxY) / 2, r })
  }

  const elevTexts = []
  const nameTexts = []
  for (const t of texts || []) {
    if (!Number.isFinite(t.x) || !Number.isFinite(t.y)) continue
    const raw = String(t.text ?? t.value ?? '').trim()
    const label = parseElevationLabel(raw)
    if (label) elevTexts.push({ ...t, ...label, value: raw })
    else if (POINT_LABEL.test(raw)) nameTexts.push({ ...t, name: raw })
  }

  // 全方向候选按距离排序，一条文字最多关联一个圆圈。
  const nodes = circles.map(c => ({ ...c, z: null, name: null, textDist: null }))
  const assign = (pool, apply, eligible = () => true, rejectAmbiguous = false) => {
    const edges = []
    for (let i = 0; i < nodes.length; i++) {
      if (!eligible(nodes[i])) continue
      for (let j = 0; j < pool.length; j++) {
        const d = Math.hypot(pool[j].x - nodes[i].x, pool[j].y - nodes[i].y)
        if (d <= textRadius) edges.push({ i, j, d })
      }
    }
    edges.sort((a, b) => a.d - b.d || a.i - b.i || a.j - b.j)
    const ambiguous = new Set()
    if (rejectAmbiguous) {
      const closest = new Map()
      for (const edge of edges) {
        const first = closest.get(edge.i)
        if (!first) closest.set(edge.i, edge)
        else if (edge.d - first.d <= 0.1 && Math.abs(pool[edge.j].z - pool[first.j].z) > 0.001) ambiguous.add(edge.i)
      }
      for (const i of ambiguous) nodes[i].elevationAmbiguous = true
    }
    const usedNodes = new Set()
    const usedTexts = new Set()
    for (const edge of edges) {
      if (ambiguous.has(edge.i) || usedNodes.has(edge.i) || usedTexts.has(edge.j)) continue
      usedNodes.add(edge.i)
      usedTexts.add(edge.j)
      apply(nodes[edge.i], pool[edge.j], edge.d)
    }
  }
  assign(elevTexts, (n, t, d) => {
    n.z = t.z
    n.name = t.name
    n.textDist = d
    n.elevationText = t.value
    n.elevationSuffix = t.suffix
    n.elevationLayer = t.layer
  }, () => true, true)
  assign(nameTexts, (n, t, d) => {
    n.name = t.name
    n.nameDist = d
  }, n => n.z !== null && !n.name)

  return {
    nodes,
    withZ: nodes.filter(n => n.z !== null).length,
    elevTexts,
    elevTextCount: elevTexts.length,
  }
}

/** 点到折线的最近距离、里程与投影点。 */
function projectOnPolyline(pts, p) {
  let best = { d: Infinity, s: 0, z: 0 }
  let acc = 0
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]
    const b = pts[i + 1]
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const len = Math.hypot(dx, dy)
    if (len < 1e-9) continue
    let t = ((p.x - a[0]) * dx + (p.y - a[1]) * dy) / (len * len)
    t = Math.max(0, Math.min(1, t))
    const px = a[0] + dx * t
    const py = a[1] + dy * t
    const d = Math.hypot(p.x - px, p.y - py)
    if (d < best.d) best = { d, s: acc + len * t }
    acc += len
  }
  return best
}

/**
 * 沿巷道投影标高文字：数字沿巷道排布，按里程排序后给顶点插值。
 * 返回被赋值的巷道数。
 */
export function assignElevations(lanes, elevTexts, { maxDist = 12 } = {}) {
  let assigned = 0
  for (const lane of lanes) {
    if (lane.source === 'nodegraph') continue // 导线点建图的巷道已带逐点标高，不再投影覆盖
    const samples = []
    for (const t of elevTexts) {
      const { d, s } = projectOnPolyline(lane.pts, t)
      if (d <= maxDist) samples.push({ s, z: t.z })
    }
    if (samples.length < 2) {
      if (samples.length === 1 && lane.elevation == null) {
        lane.elevation = samples[0].z
        assigned++
      }
      continue
    }
    samples.sort((a, b) => a.s - b.s)
    // 里程跨度太短（同一点重复标注）时退化为中位数
    const span = samples[samples.length - 1].s - samples[0].s
    if (span < 5) {
      const zs = samples.map(s => s.z).sort((a, b) => a - b)
      lane.elevation = zs[Math.floor(zs.length / 2)]
      assigned++
      continue
    }
    lane.elevSamples = samples
    const zs = samples.map(s => s.z).sort((a, b) => a - b)
    lane.elevation = zs[Math.floor(zs.length / 2)]
    assigned++
  }
  return assigned
}

/** 按里程把 samples 线性插值到每个顶点（无样本时返回 null）。 */
export function interpolateZ(samples, mileage) {
  if (!samples || !samples.length) return null
  if (mileage <= samples[0].s) return samples[0].z
  const last = samples[samples.length - 1]
  if (mileage >= last.s) return last.z
  for (let i = 0; i < samples.length - 1; i++) {
    const a = samples[i]
    const b = samples[i + 1]
    if (mileage >= a.s && mileage <= b.s && b.s > a.s) {
      const r = (mileage - a.s) / (b.s - a.s)
      return a.z + (b.z - a.z) * r
    }
  }
  return last.z
}
