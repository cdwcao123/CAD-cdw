import { LANE_LAYER_HINTS, NODE_BEARING_LAYERS, pathLen } from './nodegraph.js'

const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])
const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])

function intersects(a, b, c, d) {
  const ab1 = cross(a, b, c), ab2 = cross(a, b, d)
  const cd1 = cross(c, d, a), cd2 = cross(c, d, b)
  const on = (p, q, r) => Math.abs(cross(p, q, r)) < 1e-9 &&
    r[0] >= Math.min(p[0], q[0]) - 1e-9 && r[0] <= Math.max(p[0], q[0]) + 1e-9 &&
    r[1] >= Math.min(p[1], q[1]) - 1e-9 && r[1] <= Math.max(p[1], q[1]) + 1e-9
  return (ab1 * ab2 < 0 && cd1 * cd2 < 0) || on(a, b, c) || on(a, b, d) || on(c, d, a) || on(c, d, b)
}

const MAX_POLYGON_POINTS = 1000
const MAX_CHAIN_PAIRS = 200000

function simplePolygon(poly) {
  if (poly.length > MAX_POLYGON_POINTS) throw new Error(`polygon point limit exceeded (${poly.length} > ${MAX_POLYGON_POINTS}); split geometry and retry`)
  for (let i = 0; i < poly.length; i++) for (let j = i + 1; j < poly.length; j++) {
    if (j === i + 1 || (i === 0 && j === poly.length - 1)) continue
    if (intersects(poly[i], poly[(i + 1) % poly.length], poly[j], poly[(j + 1) % poly.length])) return false
  }
  return true
}

function contains(poly, p) {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[j], b = poly[i]
    if (Math.abs(cross(a, b, p)) < 1e-9 && p[0] >= Math.min(a[0], b[0]) && p[0] <= Math.max(a[0], b[0]) && p[1] >= Math.min(a[1], b[1]) && p[1] <= Math.max(a[1], b[1])) return true
    if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside
  }
  return inside
}

function polygonsOverlap(a, b) {
  if (a.some(p => contains(b, p)) || b.some(p => contains(a, p))) return true
  for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) {
    if (intersects(a[i], a[(i + 1) % a.length], b[j], b[(j + 1) % b.length])) return true
  }
  return false
}

function project(p, pts) {
  let best = { d: Infinity, s: 0 }, length = 0
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], dx = b[0] - a[0], dy = b[1] - a[1], len = distance(a, b)
    if (!len) continue
    const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (len * len)))
    const d = distance(p, [a[0] + t * dx, a[1] + t * dy])
    if (d < best.d) best = { d, s: length + t * len }
    length += len
  }
  return best
}

function chainsFromPaths(paths, tolerance, skipped) {
  const seen = new Set()
  const valid = paths.map((path, index) => ({ path, index })).filter(({ path: p }) => {
    if (!(p.pts && p.pts.length >= 2 && !p.closed && /^(?:LINE|LWPOLYLINE|POLYLINE|ARC|SPLINE)(?:@|$)/.test(p.kind || '') &&
      (LANE_LAYER_HINTS.test(p.layer || '') || NODE_BEARING_LAYERS.has(p.layer || '')) && pathLen(p.pts) > 1e-6)) return false
    const forward = JSON.stringify(p.pts), reverse = JSON.stringify(p.pts.slice().reverse())
    const key = JSON.stringify([p.layer, forward < reverse ? forward : reverse])
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  const ends = valid.map(({ path }) => [path.pts[0], path.pts[path.pts.length - 1]])
  const neighbors = ends.map(() => [null, null])
  const grids = new Map(), cellSize = tolerance > 0 ? tolerance : 1
  const addNeighbor = (i, end, j, other) => {
    neighbors[i][end] = neighbors[i][end] === null ? [j, other] : false
  }
  if (tolerance >= 0) for (let i = 0; i < valid.length; i++) {
    const layer = valid[i].path.layer
    if (!grids.has(layer)) grids.set(layer, new Map())
    const grid = grids.get(layer)
    for (let end = 0; end < 2; end++) {
      const p = ends[i][end], x = Math.floor(p[0] / cellSize), y = Math.floor(p[1] / cellSize)
      if (!Number.isSafeInteger(x) || !Number.isSafeInteger(y)) { neighbors[i][end] = false; skipped.endpoint++; continue }
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
        const bucket = grid.get(`${x + dx},${y + dy}`) || []
        if (bucket.length >= 64) { neighbors[i][end] = false; skipped.endpoint++; continue }
        for (const [j, other] of bucket) {
          if (j !== i && distance(p, ends[j][other]) <= tolerance) {
            addNeighbor(i, end, j, other); addNeighbor(j, other, i, end)
          }
        }
      }
      const key = `${x},${y}`
      if (!grid.has(key)) grid.set(key, [])
      const bucket = grid.get(key)
      if (bucket.length === 64) for (const [j, other] of bucket) neighbors[j][other] = false
      bucket.push([i, end])
    }
  }
  const link = (i, end) => {
    const n = neighbors[i][end]
    return n && neighbors[n[0]][n[1]] && neighbors[n[0]][n[1]][0] === i && neighbors[n[0]][n[1]][1] === end ? n : null
  }
  const used = new Set(), chains = []
  for (let i = 0; i < valid.length; i++) {
    if (used.has(i)) continue
    let index = i, entry = 0
    const visited = new Set()
    while (link(index, entry) && !visited.has(index)) {
      visited.add(index)
      const [next, nextEnd] = link(index, entry)
      index = next; entry = 1 - nextEnd
    }
    if (visited.has(index) || used.has(index)) continue
    let pts = [], pathIndices = [], ambiguous = false
    while (!used.has(index)) {
      used.add(index)
      const seq = entry ? valid[index].path.pts.slice().reverse() : valid[index].path.pts.slice()
      if (pts.length && distance(pts[pts.length - 1], seq[0]) < 1e-9) seq.shift()
      for (const p of seq) pts.push(p)
      pathIndices.push(valid[index].index)
      ambiguous ||= neighbors[index][entry] === false || neighbors[index][1 - entry] === false
      const next = link(index, 1 - entry)
      if (!next || used.has(next[0])) break
      ;[index, entry] = next
    }
    chains.push({ pts, pathIndices, layer: valid[i].path.layer, ambiguous })
  }
  return chains
}

// The sidecar retains measured and interpolated elevations without guessing their vertical meaning.
export function collectLaneCandidates(paths, points, { snapDist = 4, minLen = 10, minNodes = 2, chainTol = 1.5, heightTexts = [], recoverFragments = true } = {}) {
  const skipped = { endpoint: 0, ambiguousChain: 0, crowdedPoint: 0, spatial: 0, geometry: 0, ambiguousCandidate: 0 }
  if (minNodes > 0 && points.filter(p => Number.isFinite(p.x) && Number.isFinite(p.y)).length < minNodes) return { records: [], review: [], skipped }
  const chains = chainsFromPaths(paths || [], chainTol, skipped).filter(c => {
    if (c.ambiguous) skipped.ambiguousChain++
    return pathLen(c.pts) >= minLen
  })
  const candidates = [], pairs = new Map()
  const excludedChains = new Set()
  if (minNodes > 0) {
    const sortedPoints = points.map((p, index) => ({ p, index })).filter(({ p }) => Number.isFinite(p.x) && Number.isFinite(p.y)).sort((a, b) => a.p.x - b.p.x)
    const pointChains = new Map()
    if (snapDist >= 0) for (let i = 0; i < chains.length; i++) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
      for (const [x, y] of chains[i].pts) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x)
        minY = Math.min(minY, y); maxY = Math.max(maxY, y)
      }
      let lo = 0, hi = sortedPoints.length
      while (lo < hi) { const mid = (lo + hi) >>> 1; if (sortedPoints[mid].p.x < minX - snapDist) lo = mid + 1; else hi = mid }
      for (let k = lo; k < sortedPoints.length && sortedPoints[k].p.x <= maxX + snapDist; k++) {
        const { p, index } = sortedPoints[k]
        if (p.y < minY - snapDist || p.y > maxY + snapDist || project([p.x, p.y], chains[i].pts).d > snapDist) continue
        if (!pointChains.has(index)) pointChains.set(index, [])
        pointChains.get(index).push(i)
      }
    }
    for (const indices of pointChains.values()) if (indices.length > 32) {
      skipped.crowdedPoint++
      for (const i of indices) excludedChains.add(i)
    }
    for (const indices of pointChains.values()) if (indices.length <= 32) for (let a = 0; a < indices.length; a++) for (let b = a + 1; b < indices.length; b++) {
      const i = indices[a], j = indices[b]
      const key = `${i},${j}`
      if (!pairs.has(key) && pairs.size >= MAX_CHAIN_PAIRS) { excludedChains.add(i); excludedChains.add(j); skipped.spatial++; continue }
      pairs.set(key, (pairs.get(key) || 0) + 1)
    }
  } else {
    for (let i = 0; i < chains.length; i++) for (let j = i + 1; j < chains.length; j++) {
      if (pairs.size >= MAX_CHAIN_PAIRS) { excludedChains.add(i); excludedChains.add(j); skipped.spatial++; continue }
      pairs.set(`${i},${j}`, 0)
    }
  }
  const orderedPairs = [...pairs].filter(([, count]) => count >= minNodes).map(([key]) => key.split(',').map(Number)).sort((a, b) => a[0] - b[0] || a[1] - b[1])
  for (const [i, j] of orderedPairs) {
    const a = chains[i], b = chains[j]
    const size = a.pts.length + b.pts.length
    if (excludedChains.has(i) || excludedChains.has(j)) continue
    const work = size * size / 2 + points.length * (size * 2 + 1)
    if (size > MAX_POLYGON_POINTS || work > 20000000) {
      excludedChains.add(i); excludedChains.add(j); skipped.geometry++; continue
    }
    const ap = a.pts, bp = b.pts.slice()
    if (distance(ap[0], bp[bp.length - 1]) + distance(ap[ap.length - 1], bp[0]) < distance(ap[0], bp[0]) + distance(ap[ap.length - 1], bp[bp.length - 1])) bp.reverse()
    const polygon = [...ap, ...bp.slice().reverse()]
    if (!simplePolygon(polygon)) continue
    const picked = []
    points.forEach((p, index) => {
      const xy = [p.x, p.y]
      if (!Number.isFinite(p.x) || !Number.isFinite(p.y) || !contains(polygon, xy)) return
      const pa = project(xy, ap), pb = project(xy, bp)
      if (pa.d <= 1e-9 || pb.d <= 1e-9 || pa.d > snapDist || pb.d > snapDist) return
      picked.push({ index, s: (pa.s / pathLen(ap) + pb.s / pathLen(bp)) / 2, pa, pb })
    })
    if (picked.length < minNodes) continue
    picked.sort((x, y) => x.s - y.s || x.index - y.index)
    candidates.push({ a, b, ap, bp, picked, polygon })
  }
  const counts = new Map(), wallCounts = new Map()
  for (const c of candidates) {
    if (excludedChains.has(chains.indexOf(c.a)) || excludedChains.has(chains.indexOf(c.b))) continue
    for (const p of c.picked) counts.set(p.index, (counts.get(p.index) || 0) + 1)
    for (const wall of [c.a, c.b]) wallCounts.set(wall, (wallCounts.get(wall) || 0) + 1)
  }
  const records = [], review = []
  const heights = candidates.map(() => [])
  for (const text of heightTexts) {
    if (!Number.isFinite(text.x) || !Number.isFinite(text.y)) continue
    const match = String(text.text || '').trim().match(/^(?:巷道高度|巷高|净高)\s*[:：=]?\s*(\d+(?:\.\d+)?)\s*(毫米|mm|米|m)$/i)
    if (!match) continue
    const value = Number(match[1]) / (/^(?:mm|毫米)$/i.test(match[2]) ? 1000 : 1)
    if (!(value >= 0.5 && value <= 20)) continue
    const owners = candidates.map((c, i) => contains(c.polygon, [text.x, text.y]) ? i : -1).filter(i => i >= 0)
    if (owners.length === 1) heights[owners[0]].push(value)
  }
  candidates.forEach((c, index) => {
    const code = `candidate-${index + 1}`
    const sharedPointIndices = c.picked.filter(p => counts.get(p.index) > 1).map(p => p.index)
    const geometryReview = wallCounts.get(c.a) > 1 || wallCounts.get(c.b) > 1 || sharedPointIndices.length > 0 ||
      c.picked.some((p, i) => i > 0 && p.s - c.picked[i - 1].s < 1e-9)
    if (geometryReview || excludedChains.has(chains.indexOf(c.a)) || excludedChains.has(chains.indexOf(c.b))) { skipped.ambiguousCandidate++; return }
    const uniqueHeights = [...new Set(heights[index])]
    const height = uniqueHeights.length === 1 ? uniqueHeights[0] : 3
    const heightSource = uniqueHeights.length === 1 ? 'drawing' : uniqueHeights.length ? 'default_conflicting_annotations' : 'default'
    const elevations = c.picked.map(p => ({ value: Number.isFinite(points[p.index].elevation) ? points[p.index].elevation : null,
      source: Number.isFinite(points[p.index].elevation) ? 'measured' : 'missing', anchorPointIndices: [],
      datum: /顶板/.test(points[p.index].elevation_suffix || '') ? 'top' : 'bottom',
      assumed: !/顶板|底板/.test(points[p.index].elevation_suffix || '') }))
    if (!geometryReview) for (let k = 0; k < elevations.length; k++) {
      if (elevations[k].source !== 'missing') continue
      let left = k - 1, right = k + 1
      while (left >= 0 && elevations[left].source !== 'measured') left--
      while (right < elevations.length && elevations[right].source !== 'measured') right++
      if (left < 0 || right === elevations.length || c.picked[right].s <= c.picked[left].s) continue
      if (elevations[left].datum !== elevations[right].datum) continue
      const t = (c.picked[k].s - c.picked[left].s) / (c.picked[right].s - c.picked[left].s)
      elevations[k] = { value: elevations[left].value + t * (elevations[right].value - elevations[left].value), source: 'interpolated', anchorPointIndices: [c.picked[left].index, c.picked[right].index], datum: elevations[left].datum, assumed: elevations[left].assumed || elevations[right].assumed }
    }
    const traverse = c.picked.map(({ index: pointIndex }, order) => {
      const p = points[pointIndex]
      return {
        laneway_code: code, point_name: p.point_name || '', traverse_point_type: '',
        x: p.x, y: p.y, elevation: elevations[order].value, elevation_status: elevations[order].source,
        elevation_text: p.elevation_text ?? null, elevation_suffix: p.elevation_suffix ?? null,
        elevation_anchor_point_indices: elevations[order].anchorPointIndices,
        z_top: elevations[order].value === null ? null : elevations[order].datum === 'top' ? elevations[order].value : elevations[order].value + height,
        z_bottom: elevations[order].value === null ? null : elevations[order].datum === 'top' ? elevations[order].value - height : elevations[order].value,
        elevation_datum: elevations[order].source === 'missing' ? 'unknown' : elevations[order].source === 'interpolated' ? `interpolated_${elevations[order].datum}${elevations[order].assumed ? '_assumed' : ''}` : /顶板/.test(p.elevation_suffix || '') ? 'top_explicit' : /底板/.test(p.elevation_suffix || '') ? 'bottom_explicit' : 'bottom_assumed',
        left_side: null, right_side: null, radius: null, point_order: order,
        use_second_side: null, second_left_side: null, second_right_side: null,
        coal_seam_struct: '', top_coal_thick: null, bottom_coal_thick: null,
      }
    })
    records.push({
      laneway_name: '', horizontal_name: '', MineCode: '', mining_area_name: '',
      work_face_name: '', mining_name: '', laneway_type: '', laneway_sec_style: '',
      laneway_code: code, color: '', border_line_points: [c.ap, c.bp].map(line => line.map(([x, y]) => ({ x, y }))), material: '',
      Laneway_draw_style: '', traverse_point_count: traverse.length, traverse_point_array: traverse,
      laneway_height: height, laneway_height_source: heightSource, laneway_width: null, into_or_out_wind: '', support_pattern: '',
      laneway_use: '', CreateDateTime: '', CreateUserId: '', CreateCompanyId: '',
      CreateDepartmentId: '', UpdateUserId: '', UpdateDateTime: '',
    })
    review.push({
      laneway_code: code, requiresReview: true, geometryReview, sharedPointIndices,
      pointIndices: c.picked.map(p => p.index), sourcePoints: c.picked.map(p => ({ ...points[p.index] })),
      layer: c.a.layer, boundaryPaths: [c.a, c.b].map(w => w.pathIndices.map(i => ({ index: i, ...paths[i] }))),
      pointEvidence: c.picked.map(p => ({ pointIndex: p.index, position: p.s, boundaryDistances: [p.pa.d, p.pb.d] })), elevations,
    })
  })
  if (recoverFragments && chainTol === 1.5 && minNodes > 0) {
    const extra = collectLaneCandidates(paths, points, { snapDist, minLen, minNodes, chainTol: 5, heightTexts, recoverFragments: false })
    const usedPoints = new Set(review.flatMap(r => r.pointIndices))
    const usedPaths = new Set(review.flatMap(r => r.boundaryPaths.flatMap(side => side.map(p => p.index))))
    const polygonFor = record => [...record.border_line_points[0], ...record.border_line_points[1].slice().reverse()].map(p => [p.x, p.y])
    const usedPolygons = records.map(polygonFor)
    for (let i = 0; i < extra.records.length; i++) {
      const r = extra.review[i], pathIndices = r.boundaryPaths.flatMap(side => side.map(p => p.index))
      if (r.pointIndices.some(p => usedPoints.has(p)) || pathIndices.some(p => usedPaths.has(p))) continue
      const poly = polygonFor(extra.records[i])
      if (usedPolygons.some(p => polygonsOverlap(p, poly))) continue
      const code = `fragment-candidate-${i + 1}`
      const record = extra.records[i]
      record.laneway_code = code
      for (const point of record.traverse_point_array) point.laneway_code = code
      r.laneway_code = code
      records.push(record); review.push(r)
      usedPolygons.push(poly)
      for (const p of r.pointIndices) usedPoints.add(p)
      for (const p of pathIndices) usedPaths.add(p)
    }
  }
  return { records, review, skipped }
}
