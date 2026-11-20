import assert from 'node:assert/strict'
const events = []
globalThis.self = { postMessage: message => events.push(message) }
await import('../worker.js')
const dxf = '0\nSECTION\n2\nENTITIES\n0\nLINE\n8\n0\n10\n0\n20\n-2\n11\n20\n21\n-2\n0\nLINE\n8\n0\n10\n0\n20\n2\n11\n20\n21\n2\n0\nCIRCLE\n10\n0\n20\n0\n40\n0.5\n0\nTEXT\n10\n0\n20\n1\n1\nH1 855.123T\n0\nCIRCLE\n10\n20\n20\n0\n40\n0.5\n0\nTEXT\n10\n20\n20\n1\n1\nH2 856.456T\n0\nENDSEC\n0\nEOF\n'
const bytes = new TextEncoder().encode(dxf)
await self.onmessage({ data: { cmd: 'open', sessionId: 'test', name: 'test.dxf', bytes } })
const candidateEvent = events.find(e => e.type === 'candidates')
assert.ok(candidateEvent)
const decisions = candidateEvent.candidates.map(c => ({ candidate_id: c.id, accept: true, name_text_id: c.nearby_texts[0].id, elevation_text_id: c.nearby_texts[0].id }))
await self.onmessage({ data: { cmd: 'finalize', sessionId: 'test', decisions } })
const draft = events.find(e => e.type === 'lane-candidates')
assert.equal(draft.lanes.length, 1)
await self.onmessage({ data: { cmd: 'approve-lanes', sessionId: 'test', approvals: [{ index: 0, order: ['p1', 'p0'] }] } })
const result = events.find(e => e.type === 'result')
assert.ok(result, JSON.stringify(events))
assert.equal(result.points.length, 2)
assert.equal(result.lanes.length, 1)
assert.deepEqual(result.lanes[0].traverse_point_array.map(p => p.point_name), ['H2', 'H1'])
assert.deepEqual(result.lanes[0].traverse_point_array.map(p => p.z_bottom), [856.456, 855.123])
assert.deepEqual(result.laneReview[0].sourcePoints.map(p => p.elevation), [855.123, 856.456])
console.log('worker lanes flow: ok')
