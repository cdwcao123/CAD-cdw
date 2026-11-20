import { LANE_LAYER_HINTS, NODE_BEARING_LAYERS, pathLen } from './nodegraph.js'
import { selectClusters } from './geometry.js'
import { normalizeRuleColor, sameKnownColor } from './colors.js'

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
const NOISE_LAYER = /等高线|断层|钻孔|露头|煤柱|标注|文字|图框|填充|设备|水沟|风门|密闭|剖面|经纬|网格|坐标|图例|色块|岩性|支护|通风|管线|电缆|监测|排水|采区$|盘区$/i

export function selectMainCoordinateArea(paths, points, { multiArea = false } = {}) {
  if (multiArea) return { paths, points, pointIndices: points.map((_, index) => index), droppedPaths: 0 }
  const layerCounts = new Map()
  for (const path of paths) if (path.pts?.length >= 2) layerCounts.set(path.layer || '0', (layerCounts.get(path.layer || '0') || 0) + 1)
  const laneLayers = new Set([...layerCounts]
    .filter(([name, count]) => count > 0 && LANE_LAYER_HINTS.test(name) && !NOISE_LAYER.test(name))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([name]) => name))
  const representative = paths.filter(path => path.pts?.length >= 2 && laneLayers.has(path.layer || '0'))
  if (!representative.length) return { paths, points, pointIndices: points.map((_, index) => index), droppedPaths: 0 }
  const cluster = selectClusters(representative, { minRatio: 1.01 })
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  for (const path of cluster.paths) for (const [x, y] of path.pts) {
    minX = Math.min(minX, x); maxX = Math.max(maxX, x)
    minY = Math.min(minY, y); maxY = Math.max(maxY, y)
  }
  if (!Number.isFinite(minX)) return { paths, points, pointIndices: points.map((_, index) => index), droppedPaths: 0 }
  minX -= 100; maxX += 100; minY -= 100; maxY += 100
  const pointIndices = [], selectedPoints = []
  points.forEach((point, index) => {
    if (point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY) {
      pointIndices.push(index)
      selectedPoints.push(point)
    }
  })
  return {
    paths: paths.filter(path => path.pts?.length && path.pts.every(([x, y]) => x >= minX && x <= maxX && y >= minY && y <= maxY)),
    points: selectedPoints,
    pointIndices,
    droppedPaths: representative.length - cluster.paths.length,
    laneLayers: [...laneLayers],
    coordinateClusters: cluster.total,
  }
}

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
    if (d < best.d) best = { d, s: length + t * len, signedSide: cross(a, b, p) }
    length += len
  }
  return best
}

function chainsFromPaths(paths, tolerance, skipped, colorRule = {}) {
  const seen = new Set()
  const includeColors = new Set((colorRule.include || []).map(normalizeRuleColor).filter(Boolean))
  const excludeColors = new Set((colorRule.exclude || []).map(normalizeRuleColor).filter(Boolean))
  const valid = paths.map((path, index) => ({ path, index })).filter(({ path: p }) => {
    if (!(p.pts && p.pts.length >= 2 && !p.closed && /^(?:LINE|LWPOLYLINE|POLYLINE|ARC|SPLINE)(?:@|$)/.test(p.kind || '') &&
      (LANE_LAYER_HINTS.test(p.layer || '') || NODE_BEARING_LAYERS.has(p.layer || '')) && pathLen(p.pts) > 1e-6)) return false
    if (!p.color || p.color === 'unknown') {
      skipped.unknownBoundaryColor++
      return false
    }
    if (includeColors.size && !includeColors.has(p.color)) {
      skipped.boundaryColorFiltered++
      return false
    }
    if (excludeColors.has(p.color)) {
      skipped.boundaryColorFiltered++
      return false
    }
    const forward = JSON.stringify(p.pts), reverse = JSON.stringify(p.pts.slice().reverse())
    const key = JSON.stringify([p.layer, p.color, forward < reverse ? forward : reverse])
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
    const topologyKey = `${valid[i].path.layer || '0'}\u0000${valid[i].path.color}`
    if (!grids.has(topologyKey)) grids.set(topologyKey, new Map())
    const grid = grids.get(topologyKey)
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
    chains.push({
      pts,
      pathIndices,
      layer: valid[i].path.layer,
      color: valid[i].path.color,
      ambiguous,
    })
  }
  return chains
}

function sampledCorridorCoverage(source, target, maxDistance) {
  if (!source.length || !target.length) return 0
  const total = pathLen(source)
  if (!(total > 1e-9)) return 0
  const count = Math.min(80, Math.max(8, source.length * 2))
  let hits = 0
  for (let index = 0; index <= count; index++) {
    const targetDistance = total * index / count
    let travelled = 0
    for (let segment = 1; segment < source.length; segment++) {
      const length = distance(source[segment - 1], source[segment])
      if (travelled + length >= targetDistance) {
        const ratio = length < 1e-12 ? 0 : (targetDistance - travelled) / length
        const point = [
          source[segment - 1][0] + (source[segment][0] - source[segment - 1][0]) * ratio,
          source[segment - 1][1] + (source[segment][1] - source[segment - 1][1]) * ratio,
        ]
        if (project(point, target).d <= maxDistance) hits++
        break
      }
      travelled += length
    }
  }
  return hits / (count + 1)
}

function slicePolylineByDistance(points, startDistance, endDistance) {
  const total = pathLen(points)
  const start = Math.max(0, Math.min(total, startDistance))
  const end = Math.max(start, Math.min(total, endDistance))
  if (end - start < 1e-9) return points.slice()
  const output = []
  let travelled = 0
  const append = point => {
    const previous = output[output.length - 1]
    if (!previous || distance(previous, point) > 1e-8) output.push(point)
  }
  for (let index = 1; index < points.length; index++) {
    const a = points[index - 1], b = points[index]
    const length = distance(a, b)
    const next = travelled + length
    if (next < start - 1e-9) {
      travelled = next
      continue
    }
    if (travelled > end + 1e-9) break
    const localStart = length < 1e-12 ? 0 : Math.max(0, (start - travelled) / length)
    const localEnd = length < 1e-12 ? 1 : Math.min(1, (end - travelled) / length)
    if (localStart <= localEnd) {
      append([
        a[0] + (b[0] - a[0]) * localStart,
        a[1] + (b[1] - a[1]) * localStart,
      ])
      append([
        a[0] + (b[0] - a[0]) * localEnd,
        a[1] + (b[1] - a[1]) * localEnd,
      ])
    }
    travelled = next
  }
  return output.length >= 2 ? output : points.slice()
}

function trimCandidateBoundaries(candidate, padding) {
  const aPositions = candidate.picked.map(point => point.pa.s).sort((a, b) => a - b)
  const bPositions = candidate.picked.map(point => point.pb.s).sort((a, b) => a - b)
  if (!aPositions.length || !bPositions.length) {
    return { ap: candidate.ap, bp: candidate.bp, trimmed: false, removed_length: 0, trimmed_sides: 0 }
  }
  const spacing = []
  for (let index = 1; index < aPositions.length; index++) spacing.push(aPositions[index] - aPositions[index - 1])
  for (let index = 1; index < bPositions.length; index++) spacing.push(bPositions[index] - bPositions[index - 1])
  spacing.sort((a, b) => a - b)
  const typicalSpacing = spacing.length ? spacing[Math.floor(spacing.length / 2)] : 0
  const margin = Math.max(Number(padding) || 0, typicalSpacing * 1.25, 1)
  const aTotal = pathLen(candidate.ap), bTotal = pathLen(candidate.bp)
  const aStart = Math.max(0, aPositions[0] - margin)
  const aEnd = Math.min(aTotal, aPositions[aPositions.length - 1] + margin)
  const bStart = Math.max(0, bPositions[0] - margin)
  const bEnd = Math.min(bTotal, bPositions[bPositions.length - 1] + margin)
  return {
    ap: slicePolylineByDistance(candidate.ap, aStart, aEnd),
    bp: slicePolylineByDistance(candidate.bp, bStart, bEnd),
    trimmed: aStart > 1e-8 || aEnd < aTotal - 1e-8 || bStart > 1e-8 || bEnd < bTotal - 1e-8,
    removed_length: Math.max(0, aTotal - pathLen(slicePolylineByDistance(candidate.ap, aStart, aEnd))) +
      Math.max(0, bTotal - pathLen(slicePolylineByDistance(candidate.bp, bStart, bEnd))),
    trimmed_sides: Number(aStart > 1e-8 || aEnd < aTotal - 1e-8) + Number(bStart > 1e-8 || bEnd < bTotal - 1e-8),
  }
}

function quantile(values, ratio) {
  if (!values.length) return null
  const sorted = values.slice().sort((a, b) => a - b)
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor((sorted.length - 1) * ratio)))]
}

function netDirection(points) {
  let x = 0, y = 0
  for (let index = 1; index < points.length; index++) {
    const dx = points[index][0] - points[index - 1][0]
    const dy = points[index][1] - points[index - 1][1]
    const length = Math.hypot(dx, dy)
    if (length > 1e-9) {
      x += dx / length
      y += dy / length
    }
  }
  const length = Math.hypot(x, y)
  return length > 1e-9 ? [x / length, y / length] : null
}

function sampledGaps(source, target) {
  const total = pathLen(source)
  if (!(total > 1e-9)) return []
  const count = 24
  const gaps = []
  let travelled = 0
  let nextDistance = 0
  for (let index = 1; index < source.length && gaps.length < count; index++) {
    const a = source[index - 1], b = source[index]
    const length = distance(a, b)
    while (length > 1e-9 && travelled + length >= nextDistance && gaps.length < count) {
      const ratio = (nextDistance - travelled) / length
      const point = [
        a[0] + (b[0] - a[0]) * ratio,
        a[1] + (b[1] - a[1]) * ratio,
      ]
      gaps.push(project(point, target).d)
      nextDistance += total / count
    }
    travelled += length
  }
  return gaps.filter(Number.isFinite)
}

function corridorGeometryQuality(a, b, picked, coverage, centeringResidual) {
  const pointWidths = picked.map(point => point.pa.d + point.pb.d).filter(Number.isFinite)
  const gaps = pointWidths.length >= 2 ? pointWidths : [...sampledGaps(a, b), ...sampledGaps(b, a)]
  const widthMedian = quantile(gaps, 0.5)
  const widthP10 = quantile(gaps, pointWidths.length >= 2 ? 0 : 0.1)
  const widthP90 = quantile(gaps, pointWidths.length >= 2 ? 1 : 0.9)
  const widthSpreadRatio = Number.isFinite(widthMedian) && widthMedian > 1e-9
    ? (widthP90 - widthP10) / widthMedian
    : Infinity
  const directionA = netDirection(a)
  const directionB = netDirection(b)
  const endpointParallelism = directionA && directionB
    ? Math.abs(directionA[0] * directionB[0] + directionA[1] * directionB[1])
    : 0
  const sideConsistency = picked.length
    ? picked.filter(point => point.pa.signedSide * point.pb.signedSide < 0).length / picked.length
    : 0
  const reasons = []
  if (gaps.length < (pointWidths.length >= 2 ? 2 : 4)) reasons.push('insufficient_boundary_samples')
  if (coverage < 0.25) reasons.push('low_parallel_coverage')
  if (!(widthSpreadRatio <= 1.0)) reasons.push('unstable_boundary_width')
  if (endpointParallelism < 0.35) reasons.push('different_boundary_direction')
  if (sideConsistency < 0.8) reasons.push('point_not_between_same_sides')
  if (centeringResidual > 0.45) reasons.push('point_not_centered')
  return {
    valid: reasons.length === 0,
    coverage,
    width_median_drawing_units: widthMedian,
    width_spread_ratio: widthSpreadRatio,
    endpoint_parallelism: endpointParallelism,
    side_consistency: sideConsistency,
    centering_residual: centeringResidual,
    rejection_reasons: reasons,
  }
}

// The sidecar retains measured and interpolated elevations without guessing their vertical meaning.
export function collectLaneCandidates(paths, points, {
  snapDist = 4,
  minLen = 10,
  minNodes = 2,
  chainTol = 1.5,
  boundaryGapMin = 0,
  boundaryGapMax = Infinity,
  heightTexts = [],
  recoverFragments = true,
  boundaryColorInclude = [],
  boundaryColorExclude = [],
  boundaryColorPriority = [],
  allowBoundaryReuse = false,
  allowPointReuse = false,
  requireSameColorBoundaries = true,
  requireCompletePointData = true,
} = {}) {
  const skipped = {
    endpoint: 0,
    ambiguousChain: 0,
    crowdedPoint: 0,
    spatial: 0,
    geometry: 0,
    ambiguousCandidate: 0,
    flaggedCandidate: 0,
    unknownBoundaryColor: 0,
    boundaryColorFiltered: 0,
    differentColorBoundary: 0,
    incompletePointData: 0,
    boundaryGapOutsideRule: 0,
    conflictingCorridor: 0,
    competingBoundaryPair: 0,
    nonParallelBoundary: 0,
    lowParallelCoverage: 0,
    unstableBoundaryWidth: 0,
    differentBoundaryDirection: 0,
    pointNotCentered: 0,
    pointOutsideTrimmedBoundary: 0,
  }
  if (minNodes > 0 && points.filter(p => Number.isFinite(p.x) && Number.isFinite(p.y)).length < minNodes) return { records: [], review: [], skipped }
  const priorityColors = boundaryColorPriority.map(normalizeRuleColor).filter(Boolean)
  const colorPriority = new Map(priorityColors.map((color, index) => [color, index]))
  const chains = chainsFromPaths(paths || [], chainTol, skipped, {
    include: boundaryColorInclude,
    exclude: boundaryColorExclude,
  }).filter(c => {
    if (c.ambiguous) skipped.ambiguousChain++
    return pathLen(c.pts) >= minLen
  })
  let candidates = [], pairs = new Map()
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
    if (requireSameColorBoundaries && !sameKnownColor(a.color, b.color)) {
      skipped.differentColorBoundary++
      continue
    }
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
    if (Number.isFinite(boundaryGapMin) && Number.isFinite(boundaryGapMax) &&
        picked.some(point => point.pa.d + point.pb.d < boundaryGapMin || point.pa.d + point.pb.d > boundaryGapMax)) {
      skipped.boundaryGapOutsideRule++
      continue
    }
    picked.sort((x, y) => x.s - y.s || x.index - y.index)
    const sampleDistance = Math.max(snapDist * 2, Number.isFinite(boundaryGapMax) ? boundaryGapMax : snapDist * 2)
    const coverage = (
      sampledCorridorCoverage(ap, bp, sampleDistance) +
      sampledCorridorCoverage(bp, ap, sampleDistance)
    ) / 2
    if (coverage < 0.35) {
      skipped.competingBoundaryPair++
      continue
    }
    const centeringResidual = picked.reduce((sum, point) => {
      const totalWidth = point.pa.d + point.pb.d
      return sum + (totalWidth > 1e-9 ? Math.abs(point.pa.d - point.pb.d) / totalWidth : 1)
    }, 0) / picked.length
    const geometryQuality = corridorGeometryQuality(a.pts, bp, picked, coverage, centeringResidual)
    if (!geometryQuality.valid) {
      skipped.nonParallelBoundary++
      if (geometryQuality.rejection_reasons.includes('low_parallel_coverage')) skipped.lowParallelCoverage++
      if (geometryQuality.rejection_reasons.includes('unstable_boundary_width')) skipped.unstableBoundaryWidth++
      if (geometryQuality.rejection_reasons.includes('different_boundary_direction')) skipped.differentBoundaryDirection++
      if (geometryQuality.rejection_reasons.includes('point_not_centered')) skipped.pointNotCentered++
      continue
    }
    candidates.push({ a, b, ap, bp, picked, polygon, coverage, centeringResidual, geometryQuality })
  }
  const priorityIndex = candidate => colorPriority.get(candidate.a.color) ?? 10000
  candidates.sort((a, b) =>
    b.picked.length - a.picked.length ||
    priorityIndex(a) - priorityIndex(b) ||
    a.centeringResidual - b.centeringResidual ||
    b.coverage - a.coverage ||
    pathLen(b.a.pts) + pathLen(b.b.pts) - pathLen(a.a.pts) - pathLen(a.b.pts)
  )
  const selectedCandidates = [], selectedPoints = new Set(), selectedWalls = new Set()
  for (const candidate of candidates) {
    const wallKeys = [chains.indexOf(candidate.a), chains.indexOf(candidate.b)].map(index => `wall:${index}`)
    if (!allowBoundaryReuse && (selectedWalls.has(wallKeys[0]) || selectedWalls.has(wallKeys[1]))) {
      skipped.conflictingCorridor++
      continue
    }
    if (!allowPointReuse && candidate.picked.some(point => selectedPoints.has(point.index))) {
      skipped.conflictingCorridor++
      continue
    }
    selectedCandidates.push(candidate)
    for (const point of candidate.picked) selectedPoints.add(point.index)
    for (const key of wallKeys) selectedWalls.add(key)
  }
  candidates = selectedCandidates
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
    if (excludedChains.has(chains.indexOf(c.a)) || excludedChains.has(chains.indexOf(c.b))) { skipped.ambiguousCandidate++; return }
    if (geometryReview) skipped.flaggedCandidate++
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
    const traverse = c.picked.map(({ index: pointIndex, pa, pb }, order) => {
      const p = points[pointIndex]
      const oppositeSides = pa.signedSide * pb.signedSide < 0
      const left = oppositeSides ? (pa.signedSide < 0 ? pa.d : pb.d) : null
      const right = oppositeSides ? (pa.signedSide > 0 ? pa.d : pb.d) : null
      return {
        laneway_code: code, point_name: p.point_name || '', traverse_point_type: '导线点',
        circle_radius: p.circle_radius ?? null, block_ref_id: p.block_ref_id ?? null,
        source_circle_id: p.circle_id || null, source_circle_handle: p.source_handle || null,
        source_circle_layer: p.circle_layer ?? null, source_circle_color: p.circle_color ?? null,
        color_group: p.color_group ?? null, color_layer_order: p.color_layer_order ?? null,
        point_name_text_id: p.name_text_id || null, point_name_text_raw: p.name_text ?? null,
        point_name_text_color: p.name_text_color ?? null,
        elevation_text_id: p.elevation_text_id || null, elevation_text_raw: p.elevation_text_raw ?? p.elevation_text ?? null,
        elevation_text_color: p.elevation_text_color ?? null,
        x: p.x, y: p.y, elevation: elevations[order].value, elevation_status: elevations[order].source,
        elevation_text: p.elevation_text ?? null, elevation_suffix: p.elevation_suffix ?? null,
        elevation_anchor_point_indices: elevations[order].anchorPointIndices,
        z_top: elevations[order].value === null ? null : elevations[order].datum === 'top' ? elevations[order].value : elevations[order].value + height,
        z_bottom: elevations[order].value === null ? null : elevations[order].datum === 'top' ? elevations[order].value - height : elevations[order].value,
        elevation_datum: elevations[order].source === 'missing' ? 'unknown' : elevations[order].source === 'interpolated' ? `interpolated_${elevations[order].datum}${elevations[order].assumed ? '_assumed' : ''}` : /顶板/.test(p.elevation_suffix || '') ? 'top_explicit' : /底板/.test(p.elevation_suffix || '') ? 'bottom_explicit' : 'bottom_assumed',
        left_side: left, right_side: right, side_distance_source: oppositeSides ? 'boundary_drawing_units' : 'ambiguous', radius: null, point_order: order,
        use_second_side: null, second_left_side: null, second_right_side: null,
        coal_seam_struct: '', top_coal_thick: null, bottom_coal_thick: null,
      }
    })
    const widths = traverse.map(p => p.left_side !== null && p.right_side !== null ? p.left_side + p.right_side : null)
    const width = widths.every(Number.isFinite) ? widths.reduce((sum, value) => sum + value, 0) / widths.length : null
    if (requireCompletePointData && traverse.some(point =>
      !String(point.point_name || '').trim() ||
      !Number.isFinite(point.z_bottom)
    )) {
      skipped.incompletePointData++
      return
    }
    const boundaryColor = c.a.color === c.b.color ? c.a.color : null
    const trimmed = trimCandidateBoundaries(c, snapDist)
    const trimmedPolygon = [...trimmed.ap, ...trimmed.bp.slice().reverse()]
    if (c.picked.some(item => !contains(trimmedPolygon, [points[item.index].x, points[item.index].y]))) {
      skipped.pointOutsideTrimmedBoundary++
      return
    }
    const boundarySources = [c.a, c.b].map(side => ({
      path_indices: side.pathIndices,
      layer: side.layer,
      color: side.color,
      entities: side.pathIndices.map(pathIndex => ({
        index: pathIndex,
        handle: paths[pathIndex].handle || null,
        layer: paths[pathIndex].layer || '0',
        color: paths[pathIndex].color || null,
        color_source: paths[pathIndex].color_source || null,
        kind: paths[pathIndex].kind || null,
        point_count: paths[pathIndex].pts?.length || 0,
      })),
    }))
    records.push({
      laneway_name: '', horizontal_name: '', MineCode: '', mining_area_name: '',
      work_face_name: '', mining_name: '', laneway_type: '', laneway_sec_style: '',
      laneway_code: code, color: boundaryColor || '',
      border_line_points: [trimmed.ap, trimmed.bp].map(line => line.map(([x, y]) => ({ x, y }))),
      boundary_line_colors: [c.a.color, c.b.color],
      boundary_line_layers: [c.a.layer, c.b.layer],
      boundary_line_sources: boundarySources,
      boundary_pair_source: 'original_dxf_same_color_double_line',
      single_line_used: false,
      network_source: 'reviewed_same_color_double_line',
      material: '',
      Laneway_draw_style: '', traverse_point_count: traverse.length, traverse_point_array: traverse,
      laneway_height: height, laneway_height_source: heightSource, laneway_width: width, laneway_width_source: width === null ? 'ambiguous' : 'mean_boundary_drawing_units', into_or_out_wind: '', support_pattern: '',
      laneway_use: '', CreateDateTime: '', CreateUserId: '', CreateCompanyId: '',
      CreateDepartmentId: '', UpdateUserId: '', UpdateDateTime: '',
      geometry_review_required: geometryReview,
      boundary_pair_coverage: c.coverage,
      boundary_pair_centering_residual: c.centeringResidual,
      boundary_geometry_quality: c.geometryQuality,
      boundary_trimmed_to_paired_extent: trimmed.trimmed,
      boundary_trimmed_sides: trimmed.trimmed_sides,
      single_line_tail_removed_drawing_units: trimmed.removed_length,
    })
    review.push({
      laneway_code: code, requiresReview: true, geometryReview, sharedPointIndices,
      pointIndices: c.picked.map(p => p.index), sourcePoints: c.picked.map(p => ({ ...points[p.index] })),
      layer: c.a.layer,
      boundaryColor,
      boundaryColors: [c.a.color, c.b.color],
      boundaryColorPriority: colorPriority.has(c.a.color) ? colorPriority.get(c.a.color) : null,
      boundaryPaths: [c.a, c.b].map(w => w.pathIndices.map(i => ({ index: i, ...paths[i] }))),
      boundaryPairCoverage: c.coverage,
      boundaryPairCenteringResidual: c.centeringResidual,
      boundaryGeometryQuality: c.geometryQuality,
      pointEvidence: c.picked.map(p => ({ pointIndex: p.index, position: p.s, boundaryDistances: [p.pa.d, p.pb.d] })), elevations,
    })
  })
  if (recoverFragments && chainTol === 1.5 && minNodes > 0) {
    const extra = collectLaneCandidates(paths, points, {
      snapDist,
      minLen,
      minNodes,
      chainTol: 5,
      boundaryGapMin,
      boundaryGapMax,
      heightTexts,
      recoverFragments: false,
      boundaryColorInclude,
      boundaryColorExclude,
      boundaryColorPriority,
      allowBoundaryReuse,
      allowPointReuse,
      requireSameColorBoundaries,
      requireCompletePointData,
    })
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

export function collectLaneCandidatesWithFallback(paths, points, options = {}) {
  const baseSnap = Number(options.snapDist) > 0 ? Number(options.snapDist) : 4
  const supplementalSnap = Number(options.supplementalSnapDist)
  const base = collectLaneCandidates(paths, points, { ...options, snapDist: baseSnap })
  if (!(supplementalSnap > baseSnap)) return base
  const extra = collectLaneCandidates(paths, points, {
    ...options,
    snapDist: supplementalSnap,
    recoverFragments: false,
  })
  const records = base.records.slice()
  const review = base.review.slice()
  const usedPoints = new Set(review.flatMap(item => item.pointIndices))
  const usedPaths = new Set(review.flatMap(item =>
    item.boundaryPaths.flatMap(side => side.map(path => path.index))
  ))
  for (let index = 0; index < extra.records.length; index++) {
    const item = extra.review[index]
    if (!item || !item.boundaryGeometryQuality?.valid) continue
    if (item.pointIndices.some(pointIndex => usedPoints.has(pointIndex))) continue
    const pathIndices = item.boundaryPaths.flatMap(side => side.map(path => path.index))
    if (pathIndices.some(pathIndex => usedPaths.has(pathIndex))) continue
    if (item.sourcePoints.some(point => point.circle_color && item.boundaryColor && point.circle_color !== item.boundaryColor)) continue
    const record = extra.records[index]
    const code = `fallback-candidate-${records.length + 1}`
    record.laneway_code = code
    record.boundary_pair_source = 'adaptive_same_color_fallback'
    for (const point of record.traverse_point_array) point.laneway_code = code
    item.laneway_code = code
    records.push(record)
    review.push(item)
    for (const pointIndex of item.pointIndices) usedPoints.add(pointIndex)
    for (const pathIndex of pathIndices) usedPaths.add(pathIndex)
  }
  const skipped = { ...base.skipped }
  for (const [key, value] of Object.entries(extra.skipped)) {
    skipped[`fallback_${key}`] = value
  }
  return {
    records,
    review,
    skipped,
    fallback: {
      enabled: true,
      base_snap_distance: baseSnap,
      supplemental_snap_distance: supplementalSnap,
      added_corridors: records.length - base.records.length,
    },
  }
}
