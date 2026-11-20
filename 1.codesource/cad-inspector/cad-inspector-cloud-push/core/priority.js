import { collectLaneCandidates } from './lanes.js'
import { pathLen } from './nodegraph.js'

const straightness = line => {
  const length = pathLen(line)
  return length > 0 ? Math.hypot(line.at(-1)[0] - line[0][0], line.at(-1)[1] - line[0][1]) / length : 0
}

// Labels only influence order; eligibility requires an unambiguous boundary pair.
export function prioritizeCandidates(paths, texts, candidates, entities) {
  let unique = []
  const byCircle = new Map(), radiiByCenter = new Map()
  for (const candidate of candidates) {
    const circle = entities[candidate.circle_id]
    if (!circle || !Number.isFinite(circle.x) || !Number.isFinite(circle.y)) continue
    const center = JSON.stringify([circle.x, circle.y])
    if (!radiiByCenter.has(center)) radiiByCenter.set(center, new Set())
    radiiByCenter.get(center).add(circle.radius ?? null)
    const key = JSON.stringify([circle.x, circle.y, circle.radius ?? null])
    if (byCircle.has(key)) continue
    byCircle.set(key, candidate)
    unique.push(candidate)
  }
  const duplicateCount = candidates.length - unique.length
  const eligible = unique.filter(c => {
    const circle = entities[c.circle_id]
    return radiiByCenter.get(JSON.stringify([circle.x, circle.y])).size === 1
  })
  const ambiguousCircleCount = unique.length - eligible.length
  unique = eligible
  const points = unique.map(c => {
    const p = entities[c.circle_id]
    return { x: p?.x, y: p?.y }
  })
  const hints = texts.filter(t => /井口/.test(t.text || '') && Number.isFinite(t.x) && Number.isFinite(t.y))
  const distanceToHint = i => {
    let best = Infinity
    for (const hint of hints) best = Math.min(best, Math.hypot(points[i].x - hint.x, points[i].y - hint.y))
    return best
  }
  const { records, review } = collectLaneCandidates(paths, points)
  const groups = review.map((r, i) => {
    const record = records[i], sides = record.border_line_points.map(line => line.map(p => [p.x, p.y]))
    const score = Math.min(...sides.map(straightness))
    let dist = Infinity
    for (const index of r.pointIndices) dist = Math.min(dist, distanceToHint(index))
    return { indices: r.pointIndices, sides, straight: score >= 0.97, dist }
  })
  if (hints.length) groups.sort((a, b) => a.dist - b.dist)
  const nearest = hints.length ? groups.shift() : null
  groups.sort((a, b) => Number(b.straight) - Number(a.straight) || a.dist - b.dist)
  if (nearest) groups.unshift(nearest)
  const ordered = [], seen = new Set()
  for (const group of groups) {
    const indices = group.indices.slice()
    if (hints.length && indices.length > 1) {
      if (distanceToHint(indices.at(-1)) < distanceToHint(indices[0])) indices.reverse()
    }
    for (const i of indices) if (!seen.has(i)) {
      seen.add(i)
      const corridor = group.sides.every(side => side.length <= 16) ? { sides: group.sides, straight: group.straight, shaftHint: hints.length > 0 && group === groups[0] } : null
      ordered.push({ ...unique[i], corridor })
    }
  }
  return { candidates: ordered, hintCount: hints.length, priorityGroupCount: groups.length,
    duplicateCount, ambiguousCircleCount, excludedCount: unique.length - ordered.length }
}
