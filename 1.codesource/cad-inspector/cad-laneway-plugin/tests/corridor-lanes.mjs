import assert from 'node:assert/strict'
import { collectLaneCandidates } from '../core/lanes.js'

const line = pts => ({ kind: 'LWPOLYLINE', layer: '巷道', pts })
const options = { minLen: 1, chainTol: 0.01, snapDist: 3 }
const point = (name, x, y, elevation = null) => ({ point_name: name, x, y, elevation })
const walls = [line([[0, 0], [20, 0], [40, 10]]), line([[0, 4], [19, 4], [38, 14]])]
const points = [point('D', 38, 12), point('B', 10, 2), point('A', 0, 2, 100), point('C', 20, 2, 120)]
const result = collectLaneCandidates(walls, points, options)
assert.equal(result.records.length, 1)
assert.deepEqual(result.records[0].traverse_point_array.map(p => p.point_name), ['A', 'B', 'C', 'D'])
assert.equal(result.records[0].border_line_points.length, 2)
assert.equal(result.records[0].laneway_height, 3)
assert.equal(result.records[0].laneway_height_source, 'default')
const annotated = collectLaneCandidates(walls, points, { ...options, heightTexts: [{ x: 10, y: 2, text: '巷高: 3600mm' }] })
assert.equal(annotated.records[0].laneway_height, 3.6)
assert.equal(annotated.records[0].laneway_height_source, 'drawing')
const conflicting = collectLaneCandidates(walls, points, { ...options, heightTexts: [{ x: 10, y: 2, text: '巷高: 3米' }, { x: 11, y: 2, text: '净高: 4米' }] })
assert.equal(conflicting.records[0].laneway_height, 3)
assert.equal(conflicting.records[0].laneway_height_source, 'default_conflicting_annotations')
assert.equal(result.review[0].boundaryPaths.length, 2)
assert.equal(result.review[0].elevations[1].source, 'interpolated')
assert.equal(result.records[0].traverse_point_array[1].elevation_status, 'interpolated')
assert.equal(result.records[0].traverse_point_array[1].elevation, result.review[0].elevations[1].value)
assert.equal(result.records[0].traverse_point_array[3].elevation, null)
assert.deepEqual(result.review[0].elevations[1].anchorPointIndices, [2, 3])
assert.ok(Math.abs(result.review[0].elevations[1].value - 110) < 1)
assert.equal(result.review[0].elevations[3].value, null)
assert.equal(result.records[0].traverse_point_array[0].z_bottom, 100)
assert.equal(result.records[0].traverse_point_array[0].z_top, 103)
assert.equal(result.records[0].traverse_point_array[0].elevation_datum, 'bottom_assumed')
assert.equal(result.records[0].traverse_point_array[3].z_top, null)
assert.equal(annotated.records[0].traverse_point_array[0].z_top, 103.6)
const mixedPoints = [point('A', 5, 2, 110), point('B', 20, 2), point('C', 35, 2, 100)]
mixedPoints[0].elevation_suffix = '顶板'
const mixed = collectLaneCandidates([straightForTest(0), straightForTest(4)], mixedPoints, options).records[0].traverse_point_array
assert.equal(mixed[0].z_top, 110)
assert.equal(mixed[0].z_bottom, 107)
assert.equal(mixed[1].z_bottom, null)
function straightForTest(y) { return line([[0, y], [40, y]]) }
assert.equal(collectLaneCandidates([walls[0]], points, options).records.length, 0)

const straight = y => line([[0, y], [40, y]])
const wider = collectLaneCandidates([straight(0), straight(7)], [point('A', 5, 3.5), point('B', 35, 3.5)])
assert.equal(wider.records.length, 1, 'points inside wider boundaries should be retained')
assert.equal(collectLaneCandidates([straight(0), straight(7)], [point('A', 5, 8), point('B', 35, 8)]).records.length, 0)
const two = collectLaneCandidates([straight(0), straight(4), straight(10), straight(14)], [
  point('A', 5, 2, 10), point('B', 35, 2, 20), point('C', 5, 12, 30), point('D', 35, 12, 40),
], options)
assert.equal(two.records.length, 2)
assert.deepEqual(two.records.map(r => r.traverse_point_array.map(p => p.point_name)), [['A', 'B'], ['C', 'D']])

const ambiguous = collectLaneCandidates([straight(0), straight(4), straight(5)], [point('A', 5, 2), point('B', 35, 2)], options)
assert.ok(ambiguous.records.length === 0 || ambiguous.review.every(r => r.geometryReview && r.requiresReview))
const crossing = collectLaneCandidates([straight(0), line([[0, 4], [40, -4]])], [point('A', 5, 1), point('B', 35, -1)], options)
assert.equal(crossing.records.length, 0)
const dense = Array.from({ length: 3000 }, (_, i) => line([[0, 0], [10 + i * 0.001, 0]]))
assert.equal(collectLaneCandidates(dense, [], options).records.length, 0)
const denseResult = collectLaneCandidates(dense, [point('A', 1, 0), point('B', 2, 0)], options)
assert.equal(denseResult.records.length, 0)
assert.ok(denseResult.skipped.ambiguousChain > 0)
assert.equal(collectLaneCandidates(walls, [point('invalid', NaN, 0)], options).records.length, 0)
assert.equal(collectLaneCandidates([straight(0), straight(4)], [], { ...options, minNodes: 0 }).records.length, 1)
const joined = [line([[0, 0], [10, 0]]), line([[10.005, 0], [40, 0]]), straight(4)]
assert.equal(collectLaneCandidates(joined, [point('A', 5, 2), point('B', 35, 2)], options).records.length, 1)
const manyWalls = Array.from({ length: 700 }, (_, i) => straight(i * 0.001))
const crowded = collectLaneCandidates(manyWalls, [point('A', 5, 0.35), point('B', 35, 0.35)], { ...options, chainTol: -1 })
assert.equal(crowded.records.length, 0)
assert.ok(crowded.skipped.crowdedPoint > 0)
const separate = collectLaneCandidates([...manyWalls, line([[100, 0], [140, 0]]), line([[100, 4], [140, 4]])], [
  point('crowd1', 5, 0.35), point('crowd2', 35, 0.35), point('safe1', 105, 2), point('safe2', 135, 2),
], { ...options, chainTol: -1 })
assert.equal(separate.records.length, 1)
assert.deepEqual(separate.records[0].traverse_point_array.map(p => p.point_name), ['safe1', 'safe2'])
const longWall = line(Array.from({ length: 1100 }, (_, i) => [i, 0]))
const oversized = collectLaneCandidates([longWall, line([[0, 4], [1099, 4]])], [point('A', 2, 2), point('B', 3, 2)], options)
assert.equal(oversized.records.length, 0)
assert.ok(oversized.skipped.geometry > 0)
const duplicateWalls = [straight(0), line([[40, 0], [0, 0]]), straight(4), straight(4)]
const duplicateResult = collectLaneCandidates(duplicateWalls, [point('A', 5, 2), point('B', 35, 2)], options)
const branchedWalls = [line([[0, 0], [20, 0]]), line([[20, 0], [40, 0]]), line([[20, 0], [20, -10]]), straight(4)]
const branchResult = collectLaneCandidates(branchedWalls, [point('A', 5, 2), point('B', 15, 2)], options)
assert.equal(branchResult.records.length, 1, 'a branch should only cut the chain at the junction')
assert.equal(duplicateResult.records.length, 1, 'duplicate boundaries should not create ambiguity')
assert.equal(collectLaneCandidates([straight(0), straight(4)], [point('A', 5, 0), point('B', 35, 0)], options).records.length, 0)
assert.equal(collectLaneCandidates([straight(0), straight(4)], [point('A', 5, -1), point('B', 35, -1)], options).records.length, 0)
const crossLayerWalls = [straight(0), { ...straight(4), layer: '巷道边线' }]
const crossLayer = collectLaneCandidates(crossLayerWalls, [point('A', 5, 2), point('B', 35, 2)], options)
assert.equal(crossLayer.records.length, 1, 'real boundaries on different lane layers should pair')
assert.deepEqual(crossLayer.review[0].boundaryPaths.map(side => side[0].layer), ['巷道', '巷道边线'])
const fragmented = [line([[10, 0], [20, 0]]), line([[0, 0], [10, 0]]), line([[20, 0], [40, 0]]), straight(4)]
const fragmentResult = collectLaneCandidates(fragmented, [point('A', 5, 2), point('B', 35, 2)], options)
assert.equal(fragmentResult.records.length, 1, 'fragments from distinct entities should extend in both directions')
assert.equal(fragmentResult.review[0].boundaryPaths[0].length, 3)
const gaps = [line([[0, 0], [20, 0]]), line([[24, 0], [40, 0]]), line([[0, 6], [20, 6]]), line([[24, 6], [40, 6]])]
const gapPoints = [point('G1', 10, 3), point('G2', 34, 3)]
assert.equal(collectLaneCandidates(gaps, gapPoints, { recoverFragments: false }).records.length, 0)
const recovered = collectLaneCandidates(gaps, gapPoints)
assert.equal(recovered.records.length, 1)
assert.deepEqual(recovered.records[0].traverse_point_array.map(p => p.point_name), ['G1', 'G2'])
assert.match(recovered.records[0].laneway_code, /^fragment-candidate-/)
const duplicatePass = collectLaneCandidates([straight(0), straight(4)], [point('A', 5, 2), point('B', 35, 2)])
assert.equal(duplicatePass.records.length, 1, 'recovery must not duplicate already accepted points')
const farDiagonals = Array.from({ length: 40 }, (_, i) => line([[-100, -100 - i], [100, 100 - i]]))
const denseIsolation = collectLaneCandidates([...farDiagonals, straight(0), straight(4)], [point('A', 20, 2), point('B', 35, 2)], { ...options, chainTol: -1 })
assert.equal(denseIsolation.records.length, 1, 'distant geometry with overlapping bounding boxes must not crowd out local walls')
assert.deepEqual(denseIsolation.records[0].traverse_point_array.map(p => p.point_name), ['A', 'B'])
console.log('corridor lanes: ok')
