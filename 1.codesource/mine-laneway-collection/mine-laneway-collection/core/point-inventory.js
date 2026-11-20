import { parseElev, parsePointName } from './nodes.js'
import { assignNearestTexts, mergeConcentricCandidates } from './priority.js'
import { collectLaneCandidatesWithFallback, selectMainCoordinateArea } from './lanes.js'
import { colorLayerOrder, colorPriorityMap } from './colors.js'
import { pointInRegion } from './region.js'

const numericRule = (rules, key, fallback) => {
  const value = Number(rules?.[key])
  return Number.isFinite(value) ? value : fallback
}

function adaptivePointBoundaryDistance(rules, survey) {
  const explicit = Number(rules?.point_boundary_distance_drawing_units)
  if (Number.isFinite(explicit) && explicit > 0) return explicit
  const textHeight = Number(survey?.summary?.medianTextHeightDrawingUnits)
  const heightScale = Number.isFinite(textHeight) && textHeight > 0 ? textHeight : 0
  return Math.max(4, heightScale * numericRule(rules, 'point_boundary_text_height_multiplier', 12))
}

function annotateOverlappingColorGroups(points) {
  const parent = points.map((_, index) => index)
  const root = index => {
    let current = index
    while (parent[current] !== current) current = parent[current]
    while (parent[index] !== index) {
      const next = parent[index]
      parent[index] = current
      index = next
    }
    return current
  }
  const join = (a, b) => {
    const ra = root(a), rb = root(b)
    if (ra !== rb) parent[rb] = ra
  }
  for (let i = 0; i < points.length; i++) for (let j = i + 1; j < points.length; j++) {
    const a = points[i], b = points[j]
    const threshold = Math.max(0.5, Math.max(a.circle_radius || 0, b.circle_radius || 0) * 4)
    if (Math.hypot(a.x - b.x, a.y - b.y) <= threshold) join(i, j)
  }
  const groups = new Map()
  points.forEach((point, index) => {
    const id = root(index)
    if (!groups.has(id)) groups.set(id, [])
    groups.get(id).push(point)
  })
  let serial = 0
  for (const group of groups.values()) {
    const colors = [...new Set(group.map(point => point.color_group).filter(Boolean))].sort()
    const clusterId = `overlap-${++serial}`
    for (const point of group) {
      point.overlap_cluster_id = group.length > 1 ? clusterId : null
      point.overlap_group_size = group.length
      point.overlap_color_count = colors.length
      point.overlap_colors = colors
      point.color_layer_order = point.color_layer_order ?? 10000
    }
  }
  return points
}

export function buildSurveyPointCandidates(survey, { rules = {} } = {}) {
  const priority = colorPriorityMap(rules.boundary_color_priority || [])
  const claimed = assignNearestTexts(survey.candidates, survey.entities)
  const merged = mergeConcentricCandidates(claimed, survey.entities).unique
  const raw = []
  for (const candidate of merged) {
    const circle = survey.entities[candidate.circle_id]
    if (!circle) continue
    const owned = (candidate.nearby_texts || [])
      .map(link => ({ ...link, entity: survey.entities[link.id] }))
      .filter(link => link.entity && (link.entity.type === 'TEXT' || link.entity.type === 'MTEXT'))
    const names = owned.filter(link => {
      const text = link.entity.text.trim()
      return parsePointName(text) !== null || /^[A-Za-z]{1,4}\d{1,5}['′]?$/.test(text)
    })
    if (!names.length) continue
    const nameLink = names.sort((a, b) => a.distance - b.distance)[0]
    const elevationLinks = owned.filter(link => parseElev(link.entity.text) !== null)
    const elevationLink = elevationLinks.sort((a, b) => a.distance - b.distance)[0] || null
    const elevationText = elevationLink?.entity.text || ''
    const elevation = elevationLink ? parseElev(elevationText) : null
    const suffix = elevationText.match(/[+\-]?\d{2,4}(?:\.\d{1,4})?\s*([A-Za-z\u4e00-\u9fff⊥·]+|[（(][^()（）]+[）)])\s*$/)?.[1] || ''
    raw.push({
      point_name: (parsePointName(nameLink.entity.text.trim()) || nameLink.entity.text.trim()).trim(),
      x: circle.x,
      y: circle.y,
      elevation,
      elevation_text: elevationText || null,
      elevation_suffix: suffix || null,
      circle_radius: circle.radius,
      block_ref_id: circle.block_ref_id || null,
      block_path: circle.block_path || [],
      circle_id: candidate.circle_id,
      name_text_id: nameLink.id,
      name_text: nameLink.entity.raw_text ?? nameLink.entity.text,
      name_text_color: nameLink.entity.color || null,
      elevation_text_id: elevationLink?.id || null,
      elevation_text_raw: elevationLink?.entity.raw_text ?? null,
      elevation_text_color: elevationLink?.entity.color || null,
      circle_layer: circle.layer || '0',
      circle_color: circle.color || null,
      color_group: circle.color || `layer:${circle.layer || '0'}`,
      color_layer_order: colorLayerOrder(circle.color, priority),
      source_handle: circle.handle || null,
      source_block_path: circle.block_path || [],
      label_distance: nameLink.distance,
      label_association_tier: candidate.association_tier ?? null,
      association_ambiguous: candidate.association_ambiguous === true,
    })
  }
  return { points: annotateOverlappingColorGroups(raw), priority }
}

export function inventorySurveyPoints(survey, paths, { multiArea = false, rules = {}, region = null } = {}) {
  const scopedSurvey = region
    ? {
      ...survey,
      candidates: survey.candidates.filter(candidate => {
        const circle = survey.entities[candidate.circle_id]
        return circle && pointInRegion(circle, region)
      }),
    }
    : survey
  const built = buildSurveyPointCandidates(scopedSurvey, { rules })
  const raw = built.points
  const area = selectMainCoordinateArea(paths, raw, { multiArea })
  const areaPoints = area.pointIndices.map(index => raw[index])
  const explicitBoundaryDistance = Number(rules?.point_boundary_distance_drawing_units)
  const useAdaptiveFallback = !(Number.isFinite(explicitBoundaryDistance) && explicitBoundaryDistance > 0)
  const corridor = collectLaneCandidatesWithFallback(area.paths, areaPoints, {
    snapDist: useAdaptiveFallback ? 4 : explicitBoundaryDistance,
    supplementalSnapDist: useAdaptiveFallback ? adaptivePointBoundaryDistance(rules, survey) : null,
    minLen: numericRule(rules, 'minimum_boundary_length_drawing_units', 5),
    minNodes: 1,
    chainTol: numericRule(rules, 'boundary_chain_tolerance_drawing_units', 1.5),
    boundaryGapMin: numericRule(rules, 'boundary_gap_min', 0),
    boundaryGapMax: numericRule(rules, 'boundary_gap_max', Infinity),
    recoverFragments: true,
    boundaryColorInclude: rules?.boundary_color_include || [],
    boundaryColorExclude: rules?.boundary_color_exclude || [],
    boundaryColorPriority: rules?.boundary_color_priority || [],
    allowBoundaryReuse: true,
    allowPointReuse: true,
    requireSameColorBoundaries: true,
    requireCompletePointData: false,
  })
  const corridorIdsByPoint = new Map()
  corridor.review.forEach((item, index) => {
    const corridorId = corridor.records[index]?.laneway_code || `corridor-${index + 1}`
    for (const pointIndex of item.pointIndices) {
      if (!corridorIdsByPoint.has(pointIndex)) corridorIdsByPoint.set(pointIndex, [])
      corridorIdsByPoint.get(pointIndex).push(corridorId)
    }
  })
  const points = areaPoints
    .map((point, index) => ({
      ...point,
      same_color_corridor_ids: corridorIdsByPoint.get(index) || [],
      boundary_status: corridorIdsByPoint.has(index) ? 'inside_same_color_candidate' : 'not_in_same_color_candidate',
    }))
    .sort((a, b) => a.color_layer_order - b.color_layer_order ||
      String(a.color_group).localeCompare(String(b.color_group)) ||
      a.x - b.x || a.y - b.y || String(a.point_name).localeCompare(String(b.point_name)))
  const blocks = new Set(points.filter(point => point.block_ref_id).map(point => point.block_ref_id))
  const colorGroups = new Set(points.map(point => point.color_group))
  return {
    points,
    summary: {
      circles: survey.summary.circles,
      texts: survey.summary.texts,
      candidates: survey.candidates.length,
      points: points.length,
      named_candidates_in_main_area: areaPoints.length,
      with_elevation: points.filter(point => Number.isFinite(point.elevation)).length,
      missing_elevation: points.filter(point => !Number.isFinite(point.elevation)).length,
      inside_same_color_candidate: points.filter(point => point.same_color_corridor_ids.length > 0).length,
      outside_same_color_candidate: points.filter(point => point.same_color_corridor_ids.length === 0).length,
      block_point_groups: blocks.size,
      color_groups: colorGroups.size,
      overlapping_color_clusters: new Set(points.map(point => point.overlap_cluster_id).filter(Boolean)).size,
      overlapping_color_points: points.filter(point => point.overlap_group_size > 1).length,
      ambiguous_label_associations: points.filter(point => point.association_ambiguous).length,
      points_outside_same_color_boundaries: points.filter(point => point.same_color_corridor_ids.length === 0).length,
      same_color_boundary_corridors: corridor.records.length,
      boundary_pairs_rejected_for_shared_points: corridor.skipped.conflictingCorridor || 0,
      adaptive_same_color_fallback_corridors: corridor.fallback?.added_corridors || 0,
      boundary_tails_trimmed: corridor.records.filter(record => record.boundary_trimmed_to_paired_extent).length,
      coordinate_clusters: area.coordinateClusters || 1,
      dropped_coordinate_paths: area.droppedPaths,
      text_radius_drawing_units: survey.summary.textRadiusDrawingUnits,
      point_boundary_distance_drawing_units: adaptivePointBoundaryDistance(rules, survey),
    },
  }
}
