import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { selectMainCoordinateArea } from '../core/lanes.js'
import { assignNearestTexts, mergeConcentricCandidates } from '../core/priority.js'
import { extractSurvey } from '../core/survey.js'
import { parseDxf } from '../core/parse.js'
import { buildSurveyPointCandidates, inventorySurveyPoints } from '../core/point-inventory.js'
import { validateRuleFile } from '../core/rule-validation.js'
import { collectLaneCandidates } from '../core/lanes.js'

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mine-lane-test-'))
const cli = fileURLToPath(new URL('./collect.mjs', import.meta.url))
const file = name => path.join(dir, name)
const run = (...args) => execFileSync(process.execPath, [cli, ...args], { stdio: 'pipe' })
const read = name => JSON.parse(fs.readFileSync(file(name), 'utf8'))
fs.writeFileSync(file('sample.dxf'), '0\nSECTION\n2\nENTITIES\n0\nLINE\n8\n0\n10\n0\n20\n-2\n11\n20\n21\n-2\n0\nLINE\n8\n0\n10\n0\n20\n2\n11\n20\n21\n2\n0\nCIRCLE\n10\n0\n20\n0\n40\n0.5\n0\nTEXT\n10\n0\n20\n1\n1\nH1 855.123T\n0\nCIRCLE\n10\n20\n20\n0\n40\n0.5\n0\nTEXT\n10\n20\n20\n1\n1\nH2 856.456T\n0\nCIRCLE\n10\n10\n20\n20\n40\n0.5\n0\nTEXT\n10\n10\n20\n21\n1\nOUTSIDE 857.001T\n0\nENDSEC\n0\nEOF\n')
run('evidence', file('sample.dxf'), file('evidence.json'))
const evidence = read('evidence.json')
assert.equal(evidence.candidates.length, 3)
run('points', file('sample.dxf'), file('point-inventory.json'))
const inventory = read('point-inventory.json')
assert.equal(inventory.length, 3)
assert.deepEqual(inventory.map(point => point.point_name).sort(), ['H1', 'H2', 'OUTSIDE'])
assert.deepEqual(Object.fromEntries(inventory.map(point => [point.point_name, point.elevation])), {
  H1: 855.123,
  H2: 856.456,
  OUTSIDE: 857.001,
})
assert(inventory.every(point => point.elevation_suffix === 'T'))
assert(inventory.every(point => point.circle_color === 'aci:7'))
assert.equal(inventory.filter(point => point.boundary_status === 'inside_same_color_candidate').length, 2)
assert.equal(inventory.find(point => point.point_name === 'OUTSIDE').boundary_status, 'not_in_same_color_candidate')
run('network', file('sample.dxf'), file('network.json'), file('point-inventory.json'))
const network = read('network.json')
assert.equal(network.length, 1)
assert.deepEqual(network[0].boundary_line_colors, ['aci:7', 'aci:7'])
assert.equal(network[0].boundary_geometry_quality.valid, true)
const modelPacketScript = fileURLToPath(new URL('./model-packet.mjs', import.meta.url))
const materializeScript = fileURLToPath(new URL('./materialize-lane-plan.mjs', import.meta.url))
const validateLanesScript = fileURLToPath(new URL('./validate-lanes.mjs', import.meta.url))
execFileSync(process.execPath, [modelPacketScript, file('point-inventory.json'), file('network.json'), file('model-packet.json')], { stdio: 'pipe' })
const modelPacket = read('model-packet.json')
assert.equal(modelPacket.schema_version, 'mine-laneway-model-packet-v1')
assert.equal(modelPacket.points.length, 3)
assert.equal(modelPacket.unmatched_point_ids.length, 1)
assert.equal(modelPacket.corridor_index.length, 1)
fs.writeFileSync(file('model-plan.json'), JSON.stringify({
  schema_version: 'mine-laneway-model-plan-v1',
  lanes: [{
    lane_id: 'model-lane-1',
    corridor_id: modelPacket.corridor_index[0].corridor_id,
    point_ids: modelPacket.corridor_index[0].point_ids.slice().reverse(),
    confidence: 0.95,
    note: 'synthetic model ordering',
  }],
}))
execFileSync(process.execPath, [materializeScript, file('network.json'), file('model-plan.json'), file('model-final.json')], { stdio: 'pipe' })
const modelFinal = read('model-final.json')
assert.equal(modelFinal.length, 1)
assert.deepEqual(modelFinal[0].traverse_point_array.map(point => point.point_name), ['H2', 'H1'])
execFileSync(process.execPath, [validateLanesScript, file('model-final.json')], { stdio: 'pipe' })
const sampleParsed = parseDxf(fs.readFileSync(file('sample.dxf')))
assert(sampleParsed.paths.filter(path => path.kind === 'LINE').every(path => path.color === 'aci:7'))
const sampleSurvey = extractSurvey(fs.readFileSync(file('sample.dxf')))
const redOnlyInventory = inventorySurveyPoints(sampleSurvey, sampleParsed.paths, {
  rules: { boundary_color_include: ['红色'] },
})
assert.equal(redOnlyInventory.points.length, 3)
assert.equal(redOnlyInventory.summary.inside_same_color_candidate, 0)
const gapOnlyInventory = inventorySurveyPoints(sampleSurvey, sampleParsed.paths, {
  rules: { boundary_gap_min: 5, boundary_gap_max: 8 },
})
assert.equal(gapOnlyInventory.points.length, 3)
assert.equal(gapOnlyInventory.summary.inside_same_color_candidate, 0)
const referenced = new Set(evidence.candidates.flatMap(c => [c.circle_id, ...c.nearby_texts.map(t => t.id)]))
assert.deepEqual(new Set(Object.keys(evidence.entities)), referenced)
const decisions = evidence.candidates.map(c => ({ candidate_id: c.id, accept: true, name_text_id: c.nearby_texts[0].id, elevation_text_id: c.nearby_texts[0].id }))
fs.writeFileSync(file('decisions.json'), JSON.stringify({ evidence_sha256: evidence.evidence_sha256, decisions }))
run('lanes', file('sample.dxf'), file('draft.json'), file('decisions.json'))
const draft = read('draft.json')
assert.equal(draft.lanes.length, 1)
fs.writeFileSync(file('approvals.json'), JSON.stringify({ draft_sha256: draft.draft_sha256, approvals: [{ index: 0, order: ['p1', 'p0'] }] }))
run('final', file('sample.dxf'), file('final.json'), file('decisions.json'), file('approvals.json'))
const finalLane = read('final.json')[0]
execFileSync(process.execPath, [validateLanesScript, file('final.json')], { stdio: 'pipe' })
assert.deepEqual(finalLane.traverse_point_array.map(p => p.point_name), ['H2', 'H1'])
assert.deepEqual(finalLane.traverse_point_array.map(p => p.z_bottom), [856.456, 855.123])
assert.deepEqual(finalLane.traverse_point_array.map(p => p.circle_radius), [0.5, 0.5])
assert.throws(() => run('evidence', file('sample.dxf'), file('evidence.json')))
fs.writeFileSync(file('wrong.json'), JSON.stringify({ evidence_sha256: 'wrong', decisions }))
assert.throws(() => run('lanes', file('sample.dxf'), file('other.json'), file('wrong.json')))
const mainArea = selectMainCoordinateArea([
  { layer: '巷道', pts: [[100, 100], [110, 100]] },
  { layer: '巷道', pts: [[120, 100], [130, 100]] },
  { layer: '巷道', pts: [[50000, 50000], [50010, 50000]] },
], [{ x: 105, y: 100 }, { x: 50500, y: 50000 }])
assert.deepEqual(mainArea.points, [{ x: 105, y: 100 }])
assert.equal(mainArea.pointIndices[0], 0)
const standalone = mergeConcentricCandidates([
  { id: 'outer', circle_id: 'outer', nearby_texts: [{ id: 't1', distance: 4 }] },
  { id: 'inner', circle_id: 'inner', nearby_texts: [{ id: 't1', distance: 1 }, { id: 't2', distance: 3 }] },
], {
  outer: { x: 10, y: 20, radius: 0.75 },
  inner: { x: 10.001, y: 20, radius: 0.35 },
})
assert.equal(standalone.unique.length, 2)
assert.equal(standalone.concentricGroups, 0)
const concentric = mergeConcentricCandidates([
  { id: 'outer', circle_id: 'outer', nearby_texts: [{ id: 't1', distance: 4 }] },
  { id: 'inner', circle_id: 'inner', nearby_texts: [{ id: 't1', distance: 1 }, { id: 't2', distance: 3 }] },
], {
  outer: { x: 10, y: 20, radius: 0.75, block_ref_id: 'block-1' },
  inner: { x: 10.001, y: 20, radius: 0.35, block_ref_id: 'block-1' },
})
assert.equal(concentric.unique.length, 1)
assert.equal(concentric.unique[0].id, 'inner')
assert.equal(concentric.concentricGroups, 1)
const blockDxf = [
  '0','SECTION','2','BLOCKS',
  '0','BLOCK','2','POINT','10','0','20','0',
  '0','CIRCLE','10','0','20','0','40','0.35',
  '0','CIRCLE','10','0','20','0','40','0.75',
  '0','ENDBLK','0','ENDSEC',
  '0','SECTION','2','ENTITIES',
  '0','INSERT','2','POINT','10','100','20','200',
  '0','ENDSEC','0','EOF','',
].join('\n')
const blockSurvey = extractSurvey(new TextEncoder().encode(blockDxf))
const blockCandidates = blockSurvey.candidates.map(candidate => blockSurvey.entities[candidate.circle_id])
assert.equal(blockCandidates.length, 2)
assert.equal(blockCandidates[0].block_ref_id, blockCandidates[1].block_ref_id)
assert(blockCandidates[0].block_ref_id)
const claimed = assignNearestTexts([
  { id: 'near', circle_id: 'near', nearby_texts: [{ id: 'label', distance: 2 }] },
  { id: 'far', circle_id: 'far', nearby_texts: [{ id: 'label', distance: 8 }] },
], {
  near: { x: 1, y: 2 },
  far: { x: 10, y: 20 },
})
assert.equal(claimed[0].nearby_texts.length, 1)
assert.equal(claimed[1].nearby_texts.length, 0)
const blockClaimed = assignNearestTexts([
  { id: 'same-block', circle_id: 'same-block', nearby_texts: [{ id: 'block-label', distance: 8 }] },
  { id: 'near-other', circle_id: 'near-other', nearby_texts: [{ id: 'block-label', distance: 1 }] },
], {
  'same-block': { x: 0, y: 0, color: 'aci:1', layer: 'P', block_ref_id: 'block-A' },
  'near-other': { x: 1, y: 0, color: 'aci:1', layer: 'P', block_ref_id: 'block-B' },
  'block-label': { color: 'aci:1', layer: 'P', block_ref_id: 'block-A' },
})
assert.equal(blockClaimed[0].nearby_texts.length, 1)
assert.equal(blockClaimed[0].association_tier, 0)
assert.equal(blockClaimed[1].nearby_texts.length, 0)
const overlapDxf = [
  '0','SECTION','2','ENTITIES',
  '0','CIRCLE','8','0','62','1','10','0','20','0','40','0.5',
  '0','CIRCLE','8','0','62','4','10','0','20','0','40','0.5',
  '0','TEXT','8','0','62','1','10','2','20','1','40','1','1','R1 855.111T',
  '0','TEXT','8','0','62','4','10','-2','20','1','40','1','1','C2 856.222T',
  '0','ENDSEC','0','EOF','',
].join('\n')
const overlapSurvey = extractSurvey(new TextEncoder().encode(overlapDxf))
const overlapClaimed = assignNearestTexts(overlapSurvey.candidates, overlapSurvey.entities)
const overlapByCircleColor = new Map(overlapClaimed.map(candidate => [
  overlapSurvey.entities[candidate.circle_id].color,
  candidate.nearby_texts.map(link => overlapSurvey.entities[link.id].text),
]))
assert.deepEqual(overlapByCircleColor.get('aci:1'), ['R1 855.111T'])
assert.deepEqual(overlapByCircleColor.get('aci:4'), ['C2 856.222T'])
const screenshotLabelDxf = [
  '0','SECTION','2','ENTITIES',
  '0','CIRCLE','8','导线点注记','62','30','10','0','20','0','40','0.5',
  '0','TEXT','8','导线点注记','62','30','10','2','20','1','40','3.6','1','ZB 1017.534',
  '0','CIRCLE','8','0','62','30','10','20','20','0','40','0.5',
  '0','TEXT','8','0','62','30','10','22','20','1','40','4','1','F13 962.373',
  '0','ENDSEC','0','EOF','',
].join('\n')
const screenshotLabels = buildSurveyPointCandidates(
  extractSurvey(new TextEncoder().encode(screenshotLabelDxf))
).points
assert.deepEqual(screenshotLabels.map(point => point.point_name).sort(), ['F13', 'ZB'])
assert.deepEqual(Object.fromEntries(screenshotLabels.map(point => [point.point_name, point.elevation])), {
  F13: 962.373,
  ZB: 1017.534,
})
const tripleOverlapDxf = [
  '0','SECTION','2','ENTITIES',
  '0','CIRCLE','8','0','62','1','10','0','20','0','40','0.5',
  '0','CIRCLE','8','0','62','5','10','0','20','0','40','0.5',
  '0','CIRCLE','8','0','62','4','10','0','20','0','40','0.5',
  '0','TEXT','8','0','62','1','10','2','20','1','40','1','1','R10 855.101T',
  '0','TEXT','8','0','62','5','10','-2','20','1','40','1','1','B20 856.202T',
  '0','TEXT','8','0','62','4','10','0','20','2.5','40','1','1','C30 857.303T',
  '0','ENDSEC','0','EOF','',
].join('\n')
const tripleOverlap = buildSurveyPointCandidates(extractSurvey(new TextEncoder().encode(tripleOverlapDxf)))
assert.equal(tripleOverlap.points.length, 3)
assert(tripleOverlap.points.every(point => point.overlap_group_size === 3))
assert(tripleOverlap.points.every(point => point.overlap_color_count === 3))
assert.deepEqual(
  tripleOverlap.points.map(point => `${point.circle_color}:${point.point_name}`).sort(),
  ['aci:1:R10', 'aci:4:C30', 'aci:5:B20'],
)
const mixedColorDxf = [
  '0','SECTION','2','ENTITIES',
  '0','LINE','8','0','62','1','10','0','20','-2','11','20','21','-2',
  '0','LINE','8','0','62','5','10','0','20','2','11','20','21','2',
  '0','CIRCLE','8','0','62','1','10','10','20','0','40','0.5',
  '0','TEXT','8','0','62','1','10','10','20','1','40','1','1','M1 855.333T',
  '0','ENDSEC','0','EOF','',
].join('\n')
const mixedSurvey = extractSurvey(new TextEncoder().encode(mixedColorDxf))
const mixedInventory = inventorySurveyPoints(mixedSurvey, parseDxf(new TextEncoder().encode(mixedColorDxf)).paths)
assert.equal(mixedInventory.points.length, 1)
assert.equal(mixedInventory.summary.points_outside_same_color_boundaries, 1)
assert.equal(mixedInventory.summary.inside_same_color_candidate, 0)
const resolvedColorDxf = [
  '0','SECTION','2','TABLES',
  '0','LAYER','2','RED_LAYER','62','1','70','0',
  '0','ENDSEC',
  '0','SECTION','2','BLOCKS',
  '0','BLOCK','2','BYBLOCK_PAIR','10','0','20','0','70','0',
  '0','LINE','8','0','62','0','10','0','20','0','11','1','21','0',
  '0','ENDBLK',
  '0','ENDSEC',
  '0','SECTION','2','ENTITIES',
  '0','LINE','8','RED_LAYER','10','0','20','0','11','2','21','0',
  '0','LINE','8','0','62','0','10','0','20','2','11','2','21','2',
  '0','LINE','8','0','420','16711680','10','0','20','4','11','2','21','4',
  '0','INSERT','8','0','62','5','2','BYBLOCK_PAIR','10','20','20','20',
  '0','ENDSEC','0','EOF','',
].join('\n')
const resolvedColors = parseDxf(new TextEncoder().encode(resolvedColorDxf)).paths.map(path => path.color)
assert(resolvedColors.includes('aci:1'))
assert(resolvedColors.includes('rgb:16711680'))
assert(resolvedColors.includes('aci:5'))
const farSameColorDxf = [
  '0','SECTION','2','ENTITIES',
  '0','LINE','8','巷道','62','5','10','0','20','-10','11','40','21','-10',
  '0','LINE','8','巷道','62','5','10','0','20','10','11','40','21','10',
  '0','LINE','8','白色辅助线','62','7','10','0','20','1','11','40','21','1',
  '0','CIRCLE','8','巷道','62','5','10','10','20','0','40','0.5',
  '0','TEXT','8','巷道','62','5','10','10','20','2','40','1','1','F1 855.111T',
  '0','CIRCLE','8','巷道','62','5','10','30','20','0','40','0.5',
  '0','TEXT','8','巷道','62','5','10','30','20','2','40','1','1','F2 856.222T',
  '0','CIRCLE','8','巷道','62','5','10','100','20','100','40','0.5',
  '0','TEXT','8','巷道','62','5','10','100','20','102','40','1','1','OUT 857.333T',
  '0','ENDSEC','0','EOF','',
].join('\n')
const farBytes = new TextEncoder().encode(farSameColorDxf)
fs.writeFileSync(file('far-color.dxf'), farSameColorDxf)
const farSurvey = extractSurvey(farBytes)
const farPoints = buildSurveyPointCandidates(farSurvey).points.filter(point => point.y === 0)
const farLanes = collectLaneCandidates(parseDxf(farBytes).paths, farPoints, {
  snapDist: 12,
  minLen: 5,
  minNodes: 1,
  recoverFragments: false,
  requireCompletePointData: false,
})
assert.equal(farLanes.records.length, 1)
assert.deepEqual(farLanes.records[0].boundary_line_colors, ['aci:5', 'aci:5'])
assert(farLanes.records[0].boundary_line_sources.every(side => side.entities.every(entity => entity.color === 'aci:5')))
assert(farLanes.records[0].boundary_line_sources.every(side => side.entities.every(entity => entity.layer === '巷道')))
const regionPointsFile = file('far-region-points.json')
run('points', file('far-color.dxf'), regionPointsFile, '--region', '0,-15,40,15')
const regionPoints = read('far-region-points.json')
assert.deepEqual(regionPoints.map(point => point.point_name), ['F1', 'F2'])
const regionReportScript = fileURLToPath(new URL('./region-report.mjs', import.meta.url))
execFileSync(process.execPath, [regionReportScript, file('far-color.dxf'), file('region-evidence.json'), '--region', '0,-15,40,15'], { stdio: 'pipe' })
const regionEvidence = read('region-evidence.json')
assert.equal(regionEvidence.schema_version, 'mine-laneway-region-evidence-v1')
assert.equal(regionEvidence.statistics.named_survey_points_in_region, 2)
assert.equal(regionEvidence.statistics.same_color_corridors, 1)
assert.deepEqual(regionEvidence.colors_with_complete_same_color_corridors, ['aci:5'])
const trimmedDxf = [
  '0','SECTION','2','ENTITIES',
  '0','LINE','8','巷道','62','5','10','0','20','0','11','100','21','0',
  '0','LINE','8','巷道','62','5','10','20','20','20','11','80','21','20',
  '0','CIRCLE','8','巷道','62','5','10','35','20','10','40','0.5',
  '0','TEXT','8','巷道','62','5','10','35','20','12','40','1','1','T1 855.111T',
  '0','CIRCLE','8','巷道','62','5','10','50','20','10','40','0.5',
  '0','TEXT','8','巷道','62','5','10','50','20','12','40','1','1','T2 856.222T',
  '0','CIRCLE','8','巷道','62','5','10','65','20','10','40','0.5',
  '0','TEXT','8','巷道','62','5','10','65','20','12','40','1','1','T3 857.333T',
  '0','ENDSEC','0','EOF','',
].join('\n')
const trimmedBytes = new TextEncoder().encode(trimmedDxf)
const trimmedSurvey = extractSurvey(trimmedBytes)
const trimmedPoints = buildSurveyPointCandidates(trimmedSurvey).points
const trimmedLanes = collectLaneCandidates(parseDxf(trimmedBytes).paths, trimmedPoints, {
  snapDist: 25,
  minLen: 5,
  minNodes: 1,
  recoverFragments: false,
  requireCompletePointData: false,
})
assert.equal(trimmedLanes.records.length, 1)
const trimmedRecord = trimmedLanes.records[0]
const trimmedLengths = trimmedRecord.border_line_points.map(line => {
  let length = 0
  for (let index = 1; index < line.length; index++) length += Math.hypot(line[index].x - line[index - 1].x, line[index].y - line[index - 1].y)
  return length
})
assert(trimmedRecord.boundary_trimmed_to_paired_extent)
assert(trimmedRecord.single_line_tail_removed_drawing_units > 0)
assert(trimmedLengths.every(length => length < 90))
const divergingDxf = [
  '0','SECTION','2','ENTITIES',
  '0','LINE','8','巷道','62','1','10','0','20','0','11','100','21','0',
  '0','LINE','8','巷道','62','1','10','0','20','10','11','100','21','100',
  '0','CIRCLE','8','巷道','62','1','10','25','20','15','40','0.5',
  '0','TEXT','8','巷道','62','1','10','25','20','17','40','1','1','X1 855.111T',
  '0','CIRCLE','8','巷道','62','1','10','70','20','40','40','0.5',
  '0','TEXT','8','巷道','62','1','10','70','20','42','40','1','1','X2 856.222T',
  '0','ENDSEC','0','EOF','',
].join('\n')
const divergingBytes = new TextEncoder().encode(divergingDxf)
const divergingPoints = buildSurveyPointCandidates(extractSurvey(divergingBytes)).points
const divergingLanes = collectLaneCandidates(parseDxf(divergingBytes).paths, divergingPoints, {
  snapDist: 100,
  minLen: 5,
  minNodes: 1,
  recoverFragments: false,
  requireCompletePointData: false,
})
assert.equal(divergingLanes.records.length, 0)
assert(divergingLanes.skipped.nonParallelBoundary > 0)
const validComplexRules = validateRuleFile({
  schema_version: 'mine-laneway-rules-v1',
  collection_rules: { boundary_color_include: ['红色'] },
  complex_case_rules: [{
    rule_id: 'case-test',
    source_image: 'case.png',
    source_image_sha256: 'a'.repeat(64),
    source_region: { x: 0, y: 0, width: 100, height: 80 },
    user_instruction: '保留后缀',
    observed_pattern: '图中标高带有 T 后缀',
    applies_to: { scope: 'single_case' },
    derived_rules: { preserve_elevation_suffix: true },
    action: 'review_required',
    confidence: 0.9,
  }],
})
assert.equal(validComplexRules.valid, true)
assert.equal(validComplexRules.complexCases, 1)
const validRegionRules = validateRuleFile({
  schema_version: 'mine-laneway-rules-v1',
  collection_rules: {
    analysis_region: { x_min: 0, y_min: -15, x_max: 40, y_max: 15 },
  },
  complex_case_rules: [{
    rule_id: 'region-test',
    source_kind: 'dxf_region',
    source_file: 'source.dxf',
    source_sha256: 'b'.repeat(64),
    source_region: { x_min: 0, y_min: -15, x_max: 40, y_max: 15 },
    user_instruction: '只复核此区域',
    observed_pattern: '蓝色双边线夹住蓝色导线点',
    applies_to: { scope: 'single_case' },
    derived_rules: { boundary_color_priority: ['aci:5'] },
    action: 'review_required',
    confidence: 0.9,
  }],
})
assert.equal(validRegionRules.valid, true)
const invalidComplexRules = validateRuleFile({
  schema_version: 'mine-laneway-rules-v1',
  collection_rules: { require_same_color_boundaries: false },
})
assert.equal(invalidComplexRules.valid, false)
assert(invalidComplexRules.errors.some(error => error.includes('require_same_color_boundaries')))
console.log('Synthetic review, reverse direction, hash binding and no-overwrite: OK')
console.log('Dominant coordinate area: OK')
console.log('Concentric circle merge: OK')
console.log('Same-color boundary and color-layered overlap: OK')
console.log('Adaptive same-color pairing, region scope and boundary trimming: OK')
console.log('ACI, true color, BYLAYER and BYBLOCK resolution: OK')
console.log('Natural-language and image-derived rule validation: OK')
console.log(`Test artifacts: ${dir}`)
