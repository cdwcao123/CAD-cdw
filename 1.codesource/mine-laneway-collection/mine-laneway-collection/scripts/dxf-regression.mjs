import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mine-dxf-test-'))
const dxf = fileURLToPath(new URL('./dxf.mjs', import.meta.url))
const lane = {
  laneway_code: 'geometry-test',
  traverse_point_array: [
    { point_name: 'P1', x: 36388000, y: 4168000, z_bottom: 12, elevation_suffix: 'T' },
    { point_name: 'P2', x: 36388500, y: 4169000, z_bottom: 13, elevation_suffix: '⊥' },
  ],
  border_line_points: [
    [{ x: 36388002, y: 4168002 }, { x: 36388502, y: 4169002 }],
    [{ x: 36387998, y: 4167998 }, { x: 36388498, y: 4168998 }],
  ],
  boundary_line_colors: ['aci:1', 'aci:1'],
  network_source: 'reviewed_same_color_double_line',
  single_line_used: false,
}
const higherLane = {
  laneway_code: 'geometry-test-high',
  traverse_point_array: [
    { point_name: 'Q1', x: 36388000, y: 4168030, z_bottom: 20 },
    { point_name: 'Q2', x: 36388500, y: 4169030, z_bottom: 21 },
  ],
  border_line_points: [
    [{ x: 36388002, y: 4168032 }, { x: 36388502, y: 4169032 }],
    [{ x: 36387998, y: 4168028 }, { x: 36388498, y: 4169028 }],
  ],
  boundary_line_colors: ['aci:1', 'aci:1'],
  network_source: 'reviewed_same_color_double_line',
  single_line_used: false,
}
const singleLine = {
  laneway_code: 'single-rejected',
  traverse_point_array: [{ point_name: 'S1', x: 36388000, y: 4168060, z_bottom: 15 }],
  border_line_points: [
    [{ x: 36388000, y: 4168060 }, { x: 36388500, y: 4169060 }],
  ],
  boundary_line_colors: ['aci:1'],
  network_source: 'single_line_geometry',
  single_line_used: true,
}
const differentColors = {
  laneway_code: 'different-color-rejected',
  traverse_point_array: [{ point_name: 'D1', x: 36388000, y: 4168090, z_bottom: 16 }],
  border_line_points: [
    [{ x: 36388002, y: 4168092 }, { x: 36388502, y: 4169092 }],
    [{ x: 36387998, y: 4168088 }, { x: 36388498, y: 4169088 }],
  ],
  boundary_line_colors: ['aci:1', 'aci:5'],
  network_source: 'reviewed_same_color_double_line',
  single_line_used: false,
}
const nonParallel = {
  laneway_code: 'nonparallel-rejected',
  traverse_point_array: [
    { point_name: 'N1', x: 36388020, y: 4168110, z_bottom: 16 },
    { point_name: 'N2', x: 36388400, y: 4168500, z_bottom: 17 },
  ],
  border_line_points: [
    [{ x: 36388000, y: 4168100 }, { x: 36388500, y: 4168100 }],
    [{ x: 36388000, y: 4168200 }, { x: 36388500, y: 4169100 }],
  ],
  boundary_line_colors: ['aci:1', 'aci:1'],
  network_source: 'reviewed_same_color_double_line',
  single_line_used: false,
}
const input = path.join(dir, 'lanes.json')
const output = path.join(dir, 'output.dxf')
fs.writeFileSync(input, JSON.stringify([higherLane, lane, singleLine, differentColors, nonParallel]))
const env = { ...process.env }
let result = spawnSync(process.execPath, [dxf, 'draw', input, output], { encoding: 'utf8', env })
if (result.status !== 0) throw new Error(result.stderr || result.stdout)
const drawReport = JSON.parse(result.stdout)
assert.equal(drawReport.lanes, 2)
assert.equal(drawReport.skipped_incomplete_lanes.length, 3)
assert(drawReport.skipped_incomplete_lanes.some(item => item.issues.includes('unstable_boundary_width') || item.issues.includes('different_boundary_direction')))
result = spawnSync(process.execPath, [dxf, 'inspect', output], { encoding: 'utf8', env })
if (result.status !== 0) throw new Error(result.stderr || result.stdout)
const report = JSON.parse(result.stdout)
assert.deepEqual(report.active_view.target, [0, 0, 0])
assert(report.extmin[0] < 36388000)
assert(report.extmax[0] > 36388500)
assert(Math.abs(report.active_view.center[0] - 36388250) < 1)
assert(Math.abs(report.active_view.center[1] - 4168515) < 1)
assert(report.active_view.height > 1100)
assert.equal(report.entity_types.INSERT, 2)
assert.equal(Object.keys(report.block_entity_types).length, 2)
for (const entities of Object.values(report.block_entity_types)) {
  if (report.renderer === 'standard-library') assert.deepEqual(entities, { POLYLINE: 2, CIRCLE: 2, TEXT: 2 })
  else assert.deepEqual(entities, { LWPOLYLINE: 2, CIRCLE: 2, TEXT: 2 })
}
if (report.renderer === 'standard-library') assert.equal(report.sortents, null)
else assert.equal(report.sortents, 16)
assert.equal(report.redraw_count, 2)
assert.deepEqual(report.redraw_block_order, ['LANE_0001', 'LANE_0002'])
assert(fs.readFileSync(output, 'utf8').includes('P1 12.000T'))
assert(fs.readFileSync(output, 'utf8').includes('P2 13.000⊥'))

const pointOutput = path.join(dir, 'points-only.dxf')
const pointsInput = path.join(dir, 'points.json')
fs.writeFileSync(pointsInput, JSON.stringify([
  ...higherLane.traverse_point_array,
  ...lane.traverse_point_array,
  { point_name: 'O1', x: 36388200, y: 4168500, elevation: 10, circle_color: 'aci:1', color_group: 'aci:1' },
  { point_name: 'O2', x: 36388200, y: 4168500, elevation: 11, circle_color: 'aci:4', color_group: 'aci:4' },
]))
result = spawnSync(process.execPath, [dxf, 'draw-points', input, pointOutput, pointsInput], { encoding: 'utf8', env })
if (result.status !== 0) throw new Error(result.stderr || result.stdout)
result = spawnSync(process.execPath, [dxf, 'inspect', pointOutput], { encoding: 'utf8', env })
if (result.status !== 0) throw new Error(result.stderr || result.stdout)
const pointReport = JSON.parse(result.stdout)
if (pointReport.renderer === 'standard-library') assert.equal(pointReport.entity_types.POLYLINE, 4)
else assert.equal(pointReport.entity_types.LWPOLYLINE, 4)
assert.equal(pointReport.entity_types.INSERT, 6)
assert.equal(pointReport.redraw_count, 6)
const overlapBlocks = Object.values(pointReport.block_entity_types).filter(entities => entities.CIRCLE === 1 && entities.TEXT === 1)
assert.equal(overlapBlocks.length, 6)
console.log('DXF large-coordinate viewport and entities: OK')
console.log('Point-only boundary DXF: OK')
console.log(`Test artifact: ${output}`)
