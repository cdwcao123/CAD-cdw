import assert from 'node:assert/strict'
import { prioritizeCandidates } from '../core/priority.js'

const line = (y, x = 0) => ({ kind: 'LINE', layer: '巷道', pts: [[x, y], [x + 40, y]] })
const paths = [line(0), line(4), line(0, 100), line(4, 100)]
const coords = [[5, 2], [35, 2], [105, 2], [135, 2], [300, 300]]
const candidates = coords.map((_, i) => ({ circle_id: `c${i}` }))
const entities = Object.fromEntries(coords.map(([x, y], i) => [`c${i}`, { x, y }]))
const out = prioritizeCandidates(paths, [{ x: 138, y: 2, text: '井口房' }], candidates, entities)
assert.deepEqual(out.candidates.map(c => c.circle_id), ['c3', 'c2', 'c1', 'c0'])
assert.equal(out.hintCount, 1)
assert.equal(out.excludedCount, 1)
const withoutHint = prioritizeCandidates(paths, [], candidates, entities)
assert.equal(withoutHint.candidates.length, 4)
const duplicateCandidates = [...candidates, { circle_id: 'duplicate' }]
const duplicateEntities = { ...entities, duplicate: { ...entities.c0 } }
const deduped = prioritizeCandidates(paths, [], duplicateCandidates, duplicateEntities)
assert.equal(deduped.duplicateCount, 1)
assert.equal(deduped.candidates.length, 4)
const ambiguous = prioritizeCandidates(paths, [], duplicateCandidates, { ...entities, duplicate: { ...entities.c0, radius: 1 } })
assert.equal(ambiguous.ambiguousCircleCount, 2)
assert.ok(!ambiguous.candidates.some(c => c.circle_id === 'c0' || c.circle_id === 'duplicate'))
console.log('priority: ok')
