import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { parseDxf } from '../core/parse.js'
import { collectLaneCandidatesWithFallback } from '../core/lanes.js'
import { extractSurvey } from '../core/survey.js'
import { inventorySurveyPoints } from '../core/point-inventory.js'
import { validateRuleFile } from '../core/rule-validation.js'
import { filterParsedRegion, normalizeRegion, parseRegionArgument } from '../core/region.js'

const rawArgs = process.argv.slice(2)
const multiArea = rawArgs.includes('--all-areas')
const rulesIndex = rawArgs.indexOf('--rules')
const rulesFile = rulesIndex >= 0 ? rawArgs[rulesIndex + 1] : null
const regionIndex = rawArgs.indexOf('--region')
const regionValue = regionIndex >= 0 ? rawArgs[regionIndex + 1] : null
let withoutOptions = rawArgs
for (const index of [rulesIndex, regionIndex].filter(value => value >= 0).sort((a, b) => b - a)) {
  withoutOptions = withoutOptions.filter((_, itemIndex) => itemIndex !== index && itemIndex !== index + 1)
}
const args = withoutOptions.filter(value => value !== '--all-areas')
const [mode, input, output, decisionsFile, approvalsFile] = args
if (!['evidence', 'points', 'lanes', 'final', 'network'].includes(mode) || !input || !output || !/\.dxf$/i.test(input)) throw new Error('Usage: collect.mjs evidence input.dxf evidence.json [--rules calibration.json] [--region xmin,ymin,xmax,ymax] | points input.dxf points.json [decisions.json] [--rules calibration.json] [--region ...] [--all-areas] | lanes input.dxf draft.json decisions.json [--rules calibration.json] [--region ...] | final input.dxf final.json decisions.json approvals.json [--rules calibration.json] [--region ...] | network input.dxf network.json [final.json] [--rules calibration.json] [--region ...]')
const read = name => JSON.parse(fs.readFileSync(name, 'utf8').replace(/^\uFEFF/, ''))
const rules = rulesFile ? read(rulesFile) : null
if (rules) {
  const validation = validateRuleFile(rules)
  if (!validation.valid) throw new Error(`Invalid rules file: ${validation.errors.join('; ')}`)
}
const effectiveRules = {
  ...(rules?.suggested_rules || {}),
  ...(rules?.collection_rules || {}),
}
const analysisRegion = regionValue
  ? parseRegionArgument(regionValue)
  : effectiveRules.analysis_region
    ? normalizeRegion(effectiveRules.analysis_region)
    : null
for (const key of ['label_association_radius_drawing_units', 'point_boundary_distance_drawing_units', 'minimum_boundary_length_drawing_units',
  'minimum_point_count', 'boundary_gap_min', 'boundary_gap_max', 'boundary_chain_tolerance_drawing_units']) {
  if (rules && rules[key] != null && effectiveRules[key] == null) effectiveRules[key] = rules[key]
}
const associationRadius = Number(effectiveRules.label_association_radius_drawing_units)
const complexCaseRules = Array.isArray(rules?.complex_case_rules) ? rules.complex_case_rules : []
const workerOptions = {
  ...(Number.isFinite(associationRadius) && associationRadius > 0 ? { textRadius: associationRadius } : {}),
  collectionRules: effectiveRules,
  ...(analysisRegion ? { analysisRegion } : {}),
}
const hash = data => createHash('sha256').update(data).digest('hex')
const rulesHash = rulesFile ? hash(fs.readFileSync(rulesFile)) : null
const bytes = fs.readFileSync(input), sourceHash = hash(bytes)
if (mode === 'points') {
  const survey = extractSurvey(bytes, workerOptions)
  const parsed = filterParsedRegion(parseDxf(bytes), analysisRegion)
  const inventory = inventorySurveyPoints(survey, parsed.paths, { multiArea, rules: effectiveRules, region: analysisRegion })
  let points = inventory.points
  if (decisionsFile) {
    const decisions = read(decisionsFile)
    if (!decisions.evidence_sha256 || !Array.isArray(decisions.decisions)) throw new Error('Invalid decisions file')
    const accepted = new Set(decisions.decisions.filter(item => item.accept === true).map(item => item.candidate_id))
    points = points.filter(point => accepted.has(point.circle_id))
  }
  fs.writeFileSync(output, JSON.stringify(points) + '\n', { flag: 'wx' })
  console.log(JSON.stringify({
    ...inventory.summary,
    mode, output, source_sha256: sourceHash, points: points.length,
    rules_sha256: rulesHash, complex_case_rules: complexCaseRules.length,
    analysis_region: analysisRegion,
    with_elevation: points.filter(point => Number.isFinite(point.elevation)).length,
    missing_elevation: points.filter(point => !Number.isFinite(point.elevation)).length,
  }))
  process.exit(0)
}
if (mode === 'network') {
  const reviewed = decisionsFile ? read(decisionsFile) : []
  const points = (Array.isArray(reviewed) ? reviewed : []).flatMap(item =>
    Array.isArray(item.traverse_point_array)
      ? item.traverse_point_array
      : Number.isFinite(item.x) && Number.isFinite(item.y)
        ? [item]
        : []
  )
  if (!points.length) throw new Error('network mode requires a reviewed lane JSON or points JSON')
  const parsed = filterParsedRegion(parseDxf(bytes), analysisRegion)
  const textHeights = parsed.texts.map(text => Number(text.h)).filter(value => Number.isFinite(value) && value > 0).sort((a, b) => a - b)
  const textHeight = textHeights.length ? textHeights[Math.floor((textHeights.length - 1) * 0.1)] : 0
  const explicitBoundaryDistance = Number(effectiveRules.point_boundary_distance_drawing_units)
  const useAdaptiveFallback = !(Number.isFinite(explicitBoundaryDistance) && explicitBoundaryDistance > 0)
  const network = collectLaneCandidatesWithFallback(parsed.paths, points, {
    snapDist: useAdaptiveFallback ? 4 : explicitBoundaryDistance,
    supplementalSnapDist: useAdaptiveFallback ? Math.max(4, textHeight * 12) : null,
    minLen: Number(effectiveRules.minimum_boundary_length_drawing_units) || 5,
    minNodes: 1,
    chainTol: Number(effectiveRules.boundary_chain_tolerance_drawing_units) || 1.5,
    boundaryGapMin: Number(effectiveRules.boundary_gap_min) || 0,
    boundaryGapMax: Number(effectiveRules.boundary_gap_max) || Infinity,
    boundaryColorInclude: effectiveRules.boundary_color_include || [],
    boundaryColorExclude: effectiveRules.boundary_color_exclude || [],
    boundaryColorPriority: effectiveRules.boundary_color_priority || [],
    allowBoundaryReuse: true,
    allowPointReuse: true,
    requireSameColorBoundaries: true,
    requireCompletePointData: false,
  })
  fs.writeFileSync(output, JSON.stringify(network.records) + '\n', { flag: 'wx' })
  console.log(JSON.stringify({
    mode,
    output,
    source_sha256: sourceHash,
    rules_sha256: rulesHash,
    complex_case_rules: complexCaseRules.length,
    analysis_region: analysisRegion,
    input_points: points.length,
    same_color_corridors: network.records.length,
    accepted_points: new Set(network.review.flatMap(item => item.pointIndices)).size,
    trimmed_single_line_tails: network.records.filter(record => record.boundary_trimmed_to_paired_extent).length,
    fallback: network.fallback,
    skipped: network.skipped,
  }))
  process.exit(0)
}
const events = []
globalThis.self = { postMessage: e => events.push(e) }
await import('../worker.js')
async function send(data, expected) {
  const start = events.length
  await self.onmessage({ data: { sessionId: 'skill', ...data } })
  const generated = events.slice(start)
  const error = generated.find(e => e.type === 'error')
  if (error) throw new Error(error.error)
  const event = generated.find(e => e.type === expected)
  if (!event) throw new Error(`Missing worker result: ${expected}`)
  return event
}
const evidence = await send({ cmd: 'open', name: input, bytes: new Uint8Array(bytes), options: workerOptions }, 'candidates')
const evidenceHash = hash(JSON.stringify({ sourceHash, candidates: evidence.candidates, entities: evidence.entities }))
let result
if (mode === 'evidence') {
  const ids = new Set(evidence.candidates.flatMap(c => [c.circle_id, ...c.nearby_texts.map(t => t.id)]))
  const entities = Object.fromEntries(Object.entries(evidence.entities).filter(([id]) => ids.has(id)))
  result = {
    source_sha256: sourceHash,
    rules_sha256: rulesHash,
    complex_case_rules: complexCaseRules,
    evidence_sha256: evidenceHash,
    ...evidence,
    entities,
  }
} else {
  if (!decisionsFile) throw new Error('Missing decisions file')
  const review = read(decisionsFile)
  if (review.evidence_sha256 !== evidenceHash || !Array.isArray(review.decisions)) throw new Error('Decisions do not match evidence')
  const ids = evidence.candidates.map(c => c.id)
  if (review.decisions.length !== ids.length || new Set(review.decisions.map(d => d.candidate_id)).size !== ids.length || review.decisions.some(d => !ids.includes(d.candidate_id) || typeof d.accept !== 'boolean')) throw new Error('Review must cover every candidate exactly once')
  const draft = await send({ cmd: 'finalize', decisions: review.decisions }, 'lane-candidates')
  const draftHash = hash(JSON.stringify({ evidenceHash, decisions: review.decisions, lanes: draft.lanes }))
  if (mode === 'lanes') result = { source_sha256: sourceHash, draft_sha256: draftHash, ...draft }
  else {
    if (!approvalsFile) throw new Error('Missing approvals file')
    const approval = read(approvalsFile)
    if (approval.draft_sha256 !== draftHash || !Array.isArray(approval.approvals)) throw new Error('Approvals do not match draft')
    result = (await send({ cmd: 'approve-lanes', approvals: approval.approvals }, 'result')).lanes
  }
}
fs.writeFileSync(output, JSON.stringify(result) + '\n', { flag: 'wx' })
console.log(JSON.stringify({
  mode,
  output,
  source_sha256: sourceHash,
  rules_sha256: rulesHash,
  complex_case_rules: complexCaseRules.length,
  analysis_region: normalizeRegion(analysisRegion),
}))
