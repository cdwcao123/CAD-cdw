import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { parseDxf } from '../core/parse.js'
import { extractSurvey } from '../core/survey.js'
import { buildSurveyPointCandidates } from '../core/point-inventory.js'
import { collectLaneCandidatesWithFallback } from '../core/lanes.js'
import { pathLen } from '../core/nodegraph.js'
import { parseElev, parsePointName } from '../core/nodes.js'
import { validateRuleFile } from '../core/rule-validation.js'
import {
  expandRegion,
  filterParsedRegion,
  normalizeRegion,
  parseRegionArgument,
  pointInRegion,
} from '../core/region.js'

function argument(name) {
  const index = process.argv.indexOf(`--${name}`)
  return index >= 0 ? process.argv[index + 1] : null
}

function quantile(values, ratio) {
  if (!values.length) return null
  const sorted = values.slice().sort((a, b) => a - b)
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor((sorted.length - 1) * ratio)))]
}

const input = process.argv[2]
const output = process.argv[3]
const regionValue = argument('region')
if (!input || !output || !regionValue || !/\.dxf$/i.test(input)) {
  throw new Error('Usage: region-report.mjs input.dxf region-evidence.json --region xmin,ymin,xmax,ymax [--padding 0] [--rules rules.json]')
}
const requestedRegion = parseRegionArgument(regionValue)
const padding = Number(argument('padding') || 0)
const region = expandRegion(requestedRegion, padding)
const rulesFile = argument('rules')
const rules = rulesFile ? JSON.parse(fs.readFileSync(rulesFile, 'utf8').replace(/^\uFEFF/, '')) : null
if (rules) {
  const validation = validateRuleFile(rules)
  if (!validation.valid) throw new Error(`Invalid rules file: ${validation.errors.join('; ')}`)
}
const effectiveRules = {
  ...(rules?.suggested_rules || {}),
  ...(rules?.collection_rules || {}),
}
const bytes = fs.readFileSync(input)
const sourceHash = createHash('sha256').update(bytes).digest('hex')
const parsed = parseDxf(bytes)
const scoped = filterParsedRegion(parsed, region)
const survey = extractSurvey(bytes)
const scopedSurvey = {
  ...survey,
  candidates: survey.candidates.filter(candidate => {
    const circle = survey.entities[candidate.circle_id]
    return circle && pointInRegion(circle, region)
  }),
}
const built = buildSurveyPointCandidates(scopedSurvey, { rules: effectiveRules })
const points = built.points.filter(point => pointInRegion(point, region))
const textHeight = Number(survey.summary.medianTextHeightDrawingUnits)
const explicitSnap = Number(effectiveRules.point_boundary_distance_drawing_units)
const snapDistance = Number.isFinite(explicitSnap) && explicitSnap > 0
  ? explicitSnap
  : Math.max(4, (Number.isFinite(textHeight) ? textHeight : 0) * 12)
const explicitBoundaryDistance = Number(effectiveRules.point_boundary_distance_drawing_units)
const useAdaptiveFallback = !(Number.isFinite(explicitBoundaryDistance) && explicitBoundaryDistance > 0)
const corridor = collectLaneCandidatesWithFallback(scoped.paths, points, {
  snapDist: useAdaptiveFallback ? 4 : explicitBoundaryDistance,
  supplementalSnapDist: useAdaptiveFallback ? snapDistance : null,
  minLen: Number(effectiveRules.minimum_boundary_length_drawing_units) || 5,
  minNodes: 1,
  chainTol: Number(effectiveRules.boundary_chain_tolerance_drawing_units) || 1.5,
  boundaryGapMin: Number(effectiveRules.boundary_gap_min) || 0,
  boundaryGapMax: Number(effectiveRules.boundary_gap_max) || Infinity,
  heightTexts: scoped.texts,
  recoverFragments: true,
  boundaryColorInclude: effectiveRules.boundary_color_include || [],
  boundaryColorExclude: effectiveRules.boundary_color_exclude || [],
  boundaryColorPriority: effectiveRules.boundary_color_priority || [],
  allowBoundaryReuse: true,
  allowPointReuse: true,
  requireSameColorBoundaries: true,
  requireCompletePointData: false,
})

const pathsByColor = new Map()
for (const path of scoped.paths) {
  if (!path.pts || path.pts.length < 2 || path.closed) continue
  if (!/^(?:LINE|LWPOLYLINE|POLYLINE|ARC|SPLINE)(?:@|$)/.test(path.kind || '')) continue
  const color = path.color || 'unknown'
  if (!pathsByColor.has(color)) pathsByColor.set(color, [])
  pathsByColor.get(color).push(path)
}
const colorEvidence = [...pathsByColor].map(([color, paths]) => ({
  color,
  path_count: paths.length,
  layers: [...new Set(paths.map(path => path.layer || '0'))].sort(),
  total_length_drawing_units: paths.reduce((sum, path) => sum + pathLen(path.pts), 0),
  handles: paths.map(path => path.handle).filter(Boolean),
})).sort((a, b) => b.path_count - a.path_count || a.color.localeCompare(b.color))
const corridorWidths = corridor.review.map(item =>
  item.pointEvidence.map(evidence => evidence.boundaryDistances[0] + evidence.boundaryDistances[1])
).flat()
const boundaryDistances = corridor.review.map(item =>
  item.pointEvidence.flatMap(evidence => evidence.boundaryDistances)
).flat()
const boundaryLengths = corridor.records.map(record =>
  (record.border_line_points || []).map(line => pathLen(line.map(point => [point.x, point.y])))
).flat()
const colorsInCorridors = corridor.records.map(record => record.color).filter(Boolean)
const colorPriority = [...new Set([...colorsInCorridors, ...colorEvidence.map(item => item.color)])].filter(color => color !== 'unknown')
const suggestedRules = {
  point_boundary_distance_drawing_units: Math.max(4, Number(((quantile(boundaryDistances, 0.95) || 0) * 1.15).toFixed(6))),
  point_boundary_text_height_multiplier: 12,
  minimum_boundary_length_drawing_units: Math.max(5, Number((quantile(boundaryLengths, 0.25) || 5).toFixed(6))),
  minimum_lane_length_drawing_units: Math.max(10, Number((quantile(boundaryLengths, 0.25) || 10).toFixed(6))),
  minimum_point_count: 2,
  boundary_gap_min: Math.max(0, Number((quantile(corridorWidths, 0.1) || 0).toFixed(6))),
  boundary_gap_max: Math.max(0.01, Number(((quantile(corridorWidths, 0.9) || 0) * 1.25).toFixed(6))),
  boundary_color_priority: colorPriority,
  require_same_color_boundaries: true,
  allow_single_line_lanes: false,
  preserve_elevation_suffix: true,
  require_complete_lane_points: true,
}
const texts = scoped.texts.map(text => {
  const pointName = parsePointName(text.text)
  const elevation = parseElev(text.text)
  return {
    handle: text.handle || null,
    layer: text.layer || '0',
    color: text.color || null,
    x: text.x,
    y: text.y,
    text: text.text,
    classification: elevation !== null ? 'elevation_or_combined' : pointName ? 'point_name' : 'other',
    parsed_point_name: pointName,
    parsed_elevation: elevation,
  }
})
const report = {
  schema_version: 'mine-laneway-region-evidence-v1',
  evidence_status: 'model_review_required',
  source: {
    path: input,
    source_sha256: sourceHash,
    coordinate_units: 'drawing_units_only',
  },
  requested_region: requestedRegion,
  analysis_region: region,
  padding_drawing_units: Number.isFinite(padding) ? padding : 0,
  rules_sha256: rulesFile ? createHash('sha256').update(fs.readFileSync(rulesFile)).digest('hex') : null,
  statistics: {
    paths_in_region: scoped.paths.length,
    linear_boundary_paths_in_region: colorEvidence.reduce((sum, item) => sum + item.path_count, 0),
    texts_in_region: texts.length,
    survey_circles_in_region: scopedSurvey.candidates.length,
    named_survey_points_in_region: points.length,
    same_color_corridors: corridor.records.length,
    paired_survey_points: new Set(corridor.review.flatMap(item => item.pointIndices)).size,
    different_color_pairs_rejected: corridor.skipped.differentColorBoundary,
    single_or_competing_pairs_rejected: corridor.skipped.competingBoundaryPair + corridor.skipped.conflictingCorridor,
    incomplete_point_lanes_rejected: corridor.skipped.incompletePointData,
  },
  color_evidence: colorEvidence,
  colors_with_complete_same_color_corridors: [...new Set(colorsInCorridors)].sort(),
  survey_points: points,
  corridors: corridor.review.map((item, index) => ({
    relationship_id: `region-corridor-${index + 1}`,
    boundary_colors: item.boundaryColors,
    boundary_layers: [item.layer],
    boundary_handles: item.boundaryPaths.flat().map(path => path.handle).filter(Boolean),
    boundary_pair_coverage: item.boundaryPairCoverage,
    point_count: item.pointIndices.length,
    point_names: item.sourcePoints.map(point => point.point_name),
    boundary_distances: item.pointEvidence.map(evidence => evidence.boundaryDistances),
    requires_review: item.geometryReview || item.boundaryPairCoverage < 0.8,
  })),
  text_evidence: texts,
  suggested_rule_values: suggestedRules,
  model_actions_required: [
    'Compare this region evidence with the user instruction and identify deliberate exceptions before writing collection_rules.',
    'Keep require_same_color_boundaries=true and allow_single_line_lanes=false.',
    'Mark uncertain or conflicting observations review_required.',
    'Run rule-check.mjs before collection.',
  ],
}
fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({
  output,
  source_sha256: sourceHash,
  analysis_region: region,
  ...report.statistics,
  suggested_rule_values: suggestedRules,
}, null, 2))
