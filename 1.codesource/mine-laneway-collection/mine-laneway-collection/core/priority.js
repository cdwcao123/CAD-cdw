import { collectLaneCandidatesWithFallback, selectMainCoordinateArea } from './lanes.js'
import { pathLen } from './nodegraph.js'
import { parsePointName } from './nodes.js'

const straightness = line => {
  const length = pathLen(line)
  return length > 0 ? Math.hypot(line.at(-1)[0] - line[0][0], line.at(-1)[1] - line[0][1]) / length : 0
}

function adaptiveSnapDistance(rules, texts) {
  const explicit = Number(rules.point_boundary_distance_drawing_units)
  if (Number.isFinite(explicit) && explicit > 0) return explicit
  const heights = texts.map(text => Number(text.h)).filter(height => Number.isFinite(height) && height > 0).sort((a, b) => a - b)
  const reference = heights.length ? heights[Math.floor((heights.length - 1) * 0.1)] : 0
  const multiplier = Number(rules.point_boundary_text_height_multiplier)
  return Math.max(4, reference * (Number.isFinite(multiplier) && multiplier > 0 ? multiplier : 12))
}

function pointKey(candidate, entities) {
  const circle = entities[candidate.circle_id]
  if (!circle) return null
  return circle.block_ref_id
    ? `block:${circle.block_ref_id}:${circle.x.toFixed(2)}:${circle.y.toFixed(2)}`
    : `circle:${candidate.circle_id}`
}

function colorMatchTier(circle, text) {
  if (circle?.block_ref_id && text?.block_ref_id && circle.block_ref_id === text.block_ref_id) return 0
  const sameColor = circle?.color && text?.color && circle.color === text.color
  const sameLayer = circle?.layer && text?.layer && circle.layer === text.layer
  if (sameColor && sameLayer) return 1
  if (sameColor) return 2
  if (sameLayer) return 3
  return 6
}

export function assignNearestTexts(candidates, entities, ambiguousTolerance = 0.25) {
  const claims = new Map()
  for (const candidate of candidates) {
    const owner = pointKey(candidate, entities)
    if (!owner) continue
    const circle = entities[candidate.circle_id]
    for (const text of candidate.nearby_texts || []) {
      const distance = Number(text.distance)
      if (!Number.isFinite(distance)) continue
      if (!claims.has(text.id)) claims.set(text.id, [])
      claims.get(text.id).push({
        owner,
        distance,
        colorTier: colorMatchTier(circle, entities[text.id]),
        textId: text.id,
      })
    }
  }
  const ownerByText = new Map()
  const ambiguousTexts = new Set()
  for (const [textId, values] of claims) {
    values.sort((a, b) =>
      a.colorTier - b.colorTier ||
      a.distance - b.distance ||
      a.owner.localeCompare(b.owner) ||
      a.textId.localeCompare(b.textId)
    )
    const first = values[0], second = values[1]
    ownerByText.set(textId, first.owner)
    if (
      second &&
      second.owner !== first.owner &&
      second.colorTier === first.colorTier &&
      Math.abs(second.distance - first.distance) <= ambiguousTolerance
    ) ambiguousTexts.add(textId)
  }
  return candidates.map(candidate => {
    const owner = pointKey(candidate, entities)
    const nearbyTexts = (candidate.nearby_texts || []).filter(text => ownerByText.get(text.id) === owner)
    return {
      ...candidate,
      nearby_texts: nearbyTexts,
      association_tier: nearbyTexts.length
        ? Math.min(...nearbyTexts.map(text => colorMatchTier(entities[candidate.circle_id], entities[text.id])))
        : null,
      association_ambiguous: nearbyTexts.some(text => ambiguousTexts.has(text.id)),
    }
  })
}

export function mergeConcentricCandidates(candidates, entities) {
  const groups = new Map()
  for (const candidate of candidates) {
    const circle = entities[candidate.circle_id]
    if (!circle || !Number.isFinite(circle.x) || !Number.isFinite(circle.y) || !Number.isFinite(circle.radius)) continue
    // Only multiple rings from the same block instance describe one survey
    // point. Independent circles remain independent even at identical centers.
    const key = circle.block_ref_id
      ? `block:${circle.block_ref_id}:${circle.x.toFixed(2)}:${circle.y.toFixed(2)}`
      : `single:${candidate.circle_id}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(candidate)
  }
  const unique = []
  let concentricGroups = 0
  for (const group of groups.values()) {
    if (group.length > 1) concentricGroups++
    group.sort((a, b) => {
      const ac = entities[a.circle_id], bc = entities[b.circle_id]
      const textDelta = (b.nearby_texts?.length || 0) - (a.nearby_texts?.length || 0)
      if (textDelta) return textDelta
      const ad = a.nearby_texts?.[0]?.distance ?? Infinity
      const bd = b.nearby_texts?.[0]?.distance ?? Infinity
      if (ad !== bd) return ad - bd
      const aa = a.association_ambiguous ? 1 : 0
      const ba = b.association_ambiguous ? 1 : 0
      if (aa !== ba) return aa - ba
      return (bc?.radius || 0) - (ac?.radius || 0)
    })
    unique.push(group[0])
  }
  return { unique, duplicateCount: candidates.length - unique.length, concentricGroups }
}

// Labels only influence order; eligibility requires an unambiguous boundary pair.
export function prioritizeCandidates(paths, texts, candidates, entities, rules = {}) {
  const named = assignNearestTexts(candidates, entities).filter(candidate =>
    candidate.nearby_texts.some(({ id }) => {
      const text = entities[id]?.text?.trim() || ''
      return parsePointName(text) !== null || /^[A-Za-z]{1,4}\d{1,5}['′]?$/.test(text)
    })
  )
  const merged = mergeConcentricCandidates(named, entities)
  const unique = merged.unique
  const duplicateCount = merged.duplicateCount
  const ambiguousCircleCount = 0
  const points = unique.map(c => {
    const p = entities[c.circle_id]
    return { x: p?.x, y: p?.y }
  })
  const main = selectMainCoordinateArea(paths, points)
  const mainCandidates = main.pointIndices.map(index => unique[index])
  const hints = texts.filter(t => /井口/.test(t.text || '') && Number.isFinite(t.x) && Number.isFinite(t.y))
  const distanceToHint = i => {
    let best = Infinity
    for (const hint of hints) best = Math.min(best, Math.hypot(points[i].x - hint.x, points[i].y - hint.y))
    return best
  }
  const explicitBoundaryDistance = Number(rules.point_boundary_distance_drawing_units)
  const useAdaptiveFallback = !(Number.isFinite(explicitBoundaryDistance) && explicitBoundaryDistance > 0)
  const { records, review } = collectLaneCandidatesWithFallback(main.paths, main.points, {
    snapDist: useAdaptiveFallback ? 4 : explicitBoundaryDistance,
    supplementalSnapDist: useAdaptiveFallback ? adaptiveSnapDistance(rules, texts) : null,
    minLen: Number(rules.minimum_boundary_length_drawing_units) || 10,
    minNodes: Number(rules.minimum_point_count) || 2,
    chainTol: Number(rules.boundary_chain_tolerance_drawing_units) || 1.5,
    boundaryGapMin: Number(rules.boundary_gap_min) || 0,
    boundaryGapMax: Number(rules.boundary_gap_max) || Infinity,
    boundaryColorInclude: rules.boundary_color_include || [],
    boundaryColorExclude: rules.boundary_color_exclude || [],
    boundaryColorPriority: rules.boundary_color_priority || [],
    allowBoundaryReuse: true,
    allowPointReuse: true,
    requireSameColorBoundaries: true,
    requireCompletePointData: false,
  })
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
      ordered.push({ ...mainCandidates[i], corridor })
    }
  }
  let ungroupedCount = 0
  for (let index = 0; index < mainCandidates.length; index++) {
    if (seen.has(index)) continue
    ungroupedCount++
    ordered.push({ ...mainCandidates[index], corridor: null })
  }
  return { candidates: ordered, hintCount: hints.length, priorityGroupCount: groups.length,
    duplicateCount, ambiguousCircleCount, concentricGroups: merged.concentricGroups,
    excludedCount: 0, ungroupedCount,
    droppedCoordinatePaths: main.droppedPaths, coordinateClusters: main.coordinateClusters || 1 }
}
