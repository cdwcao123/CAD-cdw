import assert from 'node:assert/strict'
import { collectLaneCandidates } from '../core/lanes.js'

const segment = (a, b) => ({ kind: 'LINE', layer: '0', pts: [a, b] })
const options = { snapDist: 1, minLen: 1, chainTol: 0.1 }
const points = [
  { point_name: 'A3', x: 40, y: 0, elevation: null, elevation_text: '', elevation_suffix: '' },
  { point_name: 'A1', x: 0, y: 0, elevation: 855, elevation_text: '855 bottom', elevation_suffix: 'bottom' },
  { point_name: 'A2', x: 20, y: 0, elevation: 856, elevation_text: '856', elevation_suffix: '' },
]
assert.equal(collectLaneCandidates([segment([0, 0], [20, 0]), segment([20, 0], [40, 0])], points, options).records.length, 0)
const out = collectLaneCandidates([segment([0, -1], [20, -1]), segment([20, -1], [40, -1]), segment([0, 1], [20, 1]), segment([20, 1], [40, 1])], points, options)
assert.equal(out.records.length, 1)
const record = out.records[0]
assert.equal(record.laneway_height_source, 'default')
assert.equal(record.traverse_point_count, 3)
assert.deepEqual(record.traverse_point_array.map(p => p.point_name), ['A1', 'A2', 'A3'])
assert.deepEqual(record.traverse_point_array.map(p => p.point_order), [0, 1, 2])
assert.deepEqual(record.traverse_point_array.map(p => [p.z_bottom, p.z_top]), [[855, 858], [856, 859], [null, null]])
assert.ok(record.traverse_point_array.every(p => p.laneway_code === record.laneway_code))
assert.equal(record.laneway_width, null)
assert.equal(out.review[0].sourcePoints[0].elevation_text, '855 bottom')
assert.equal(out.review[0].sourcePoints[2].elevation, null)
assert.equal(out.review[0].requiresReview, true)
const parallel = collectLaneCandidates([segment([0, 0], [40, 0]), segment([0, 1], [40, 1])], points, options)
assert.equal(parallel.records.length, 0) // Points on a boundary are not inside the corridor.
const bend = collectLaneCandidates([segment([0, 0], [0, 100]), segment([0, 100], [100, 100])], [
  { x: 0, y: 0 }, { x: 100, y: 100 },
], options)
assert.equal(bend.records.length, 0)
assert.deepEqual(JSON.parse(JSON.stringify(out)), out)
console.log('lanes collection: ok')
