import assert from 'node:assert/strict'
import { buildLanesFromNodes } from '../core/nodegraph.js'

const segment = (a, b) => ({ kind: 'LINE', layer: '巷道', pts: [a, b] })
const nodes = [
  { x: 0, y: 0, z: 800, name: 'A1' },
  { x: 20, y: 0, z: 810, name: 'A2' },
  { x: 40, y: 0, z: 820, name: 'A3' },
]
const paths = [segment([0, 0], [10, 0]), segment([10, 0], [30, 0]), segment([30, 0], [40, 0])]
const lanes = buildLanesFromNodes(paths, nodes, { snapDist: 1, minLen: 1, chainTol: 0.1 })
assert.equal(lanes.length, 1, 'continuous segments must form one lane')
assert.deepEqual(lanes[0].names, ['A1', 'A2', 'A3'])
assert.deepEqual(lanes[0].zs, [800, 810, 820])
const junctionPaths = [segment([0, 0], [20, 0]), segment([20, 0], [40, 0]), segment([20, 0], [20, 20])]
const junctionNodes = [...nodes, { x: 20, y: 20, z: 830, name: 'B1' }]
const junctionLanes = buildLanesFromNodes(junctionPaths, junctionNodes, { snapDist: 1, minLen: 1, chainTol: 0.1 })
assert.ok(junctionLanes.every(l => !(l.names.includes('A1') && l.names.includes('B1'))), 'do not join through ambiguous junctions')
const isolated = buildLanesFromNodes([segment([0, 0], [20, 0]), segment([20.2, 0], [40, 0])], nodes, { snapDist: 1, minLen: 1, chainTol: 0.1 })
assert.ok(isolated.every(l => !(l.names.includes('A1') && l.names.includes('A3'))), 'do not bridge beyond tolerance')
const bend = buildLanesFromNodes([segment([0, 0], [0, 100]), segment([0, 100], [100, 100])], [
  { x: 0, y: 0, z: 800, name: 'C1' }, { x: 100, y: 100, z: 810, name: 'C2' },
], { snapDist: 1, minLen: 1, chainTol: 0.1 })
assert.equal(bend.length, 1)
assert.equal(bend[0].geometryReview, true, 'sparse bend must be marked for review')
console.log('nodegraph continuity: ok')
