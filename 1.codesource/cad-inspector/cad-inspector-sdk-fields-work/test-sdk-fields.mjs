import assert from 'node:assert/strict'
import { collectLaneCandidates } from './core/lanes.js'
import { prepareCloudPayload, toSdkRecords } from './core/cloud-push.js'
const line = y => ({ kind: 'LINE', layer: '巷道', pts: [[0, y], [40, y]] })
const { records } = collectLaneCandidates([line(0), line(6)], [{ x: 5, y: 2, elevation: 100, point_name: 'A1' }, { x: 35, y: 2, elevation: 101, point_name: 'A2' }], { recoverFragments: false })
assert.equal(records.length, 1)
const [p] = records[0].traverse_point_array
assert.equal(p.traverse_point_type, '导线点')
assert.equal(p.left_side, 4)
assert.equal(p.right_side, 2)
assert.equal(p.side_distance_source, 'boundary_drawing_units')
assert.equal(records[0].laneway_width, 6)
assert.equal(records[0].laneway_width_source, 'mean_boundary_drawing_units')
const checked = prepareCloudPayload([{ ...records[0], laneway_code: 'test', mineCode: 'mine', laneway_width: 6, current_footage: 0, traverse_point_array: records[0].traverse_point_array.map(q => ({ ...q, laneway_code: 'test', radius: 0, top_coal_thick: 0, bottom_coal_thick: 0, second_left_side: 0, second_right_side: 0, use_second_side: false })) }])
assert.equal(checked.ok, true)
const exported = toSdkRecords(records)[0]
assert.equal(exported.laneway_code, null)
assert.equal(exported.traverse_point_array[0].laneway_code, null)
assert.equal(exported.traverse_point_array[0].radius, null)
assert.equal(exported.laneway_name, null)
assert.equal(Object.hasOwn(exported, 'laneway_width_source'), false)
assert.equal(Object.hasOwn(exported.traverse_point_array[0], 'elevation_text'), false)
assert.equal(exported.traverse_point_array[0].left_side, 4)
console.log('SDK field extraction: ok')
