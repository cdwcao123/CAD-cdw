import assert from 'node:assert/strict'
import { parseElev, parsePointName, extractSurveyNodes } from '../core/nodes.js'
import { buildRecord, labelLanes } from '../core/semantic.js'
import { applyDecisions } from '../core/review.js'
import { parseDxf } from '../core/parse.js'
import { register } from '../server.js'

assert.equal(parseElev('114采区轨道上山'), null)
assert.equal(parseElev('F1 1318.349'), 1318.349)
assert.equal(parseElev('1160.55'), 1160.55)
assert.equal(parsePointName('F1 1318.349'), 'F1')
assert.equal(parseElev('855.231丅'), 855.231)
assert.equal(parseElev('944.754丄'), 944.754)
assert.equal(parseElev('855.231⊥'), 855.231)
assert.equal(parseElev('855.231·'), 855.231)
assert.equal(parseElev('864.215 B9'), 864.215)
assert.equal(parsePointName('864.215 B9'), 'B9')
assert.equal(parseElev('H3 1070.038(底)'), 1070.038)
assert.equal(parseElev('H3 1070.038(顶)'), 1070.038)
assert.equal(parseElev('H3 1070.038底板'), 1070.038)
assert.equal(parseElev('H3 1070.038ABC'), 1070.038)
assert.equal(parseElev('114采区轨道上山'), null)
assert.equal(parseElev('F8 1115.8887'), 1115.8887)
const dxf = '0\nSECTION\n2\nENTITIES\n0\nCIRCLE\n8\n0\n10\n100\n20\n200\n40\n0.55\n0\nENDSEC\n0\nEOF\n'
const preciseCircle = extractSurveyNodes(parseDxf(new TextEncoder().encode(dxf)).paths, []).nodes[0]
assert.ok(Math.abs(preciseCircle.x - 100) < 1e-9 && Math.abs(preciseCircle.y - 200) < 1e-9, 'circle center must use original DXF coordinates')
const alignedDxf = '0\nSECTION\n2\nENTITIES\n0\nTEXT\n8\n0\n10\n0\n20\n0\n11\n20\n21\n30\n40\n2\n72\n1\n73\n0\n1\n855.231T\n0\nENDSEC\n0\nEOF\n'
const alignedText = parseDxf(new TextEncoder().encode(alignedDxf)).texts[0]
assert.deepEqual([alignedText.x, alignedText.y], [20, 30], 'center-aligned text should use its alignment point')
const circle = (x, y) => ({ kind: 'CIRCLE', pts: [[x - 0.5, y], [x, y + 0.5], [x + 0.5, y], [x, y - 0.5], [x - 0.5, y]] })
for (const [dx, dy] of [[5, 0], [-5, 0], [0, 5], [0, -5], [3, 4]]) {
  const result = extractSurveyNodes([circle(0, 0)], [
    { x: -dx, y: -dy, text: 'H14', rot: 37.8 },
    { x: dx, y: dy, text: '855.231丅', rot: 37.8 },
  ])
  assert.equal(result.nodes[0].z, 855.231)
  assert.equal(result.nodes[0].name, 'H14')
  assert.equal(result.nodes[0].elevationText, '855.231丅')
  assert.equal(result.nodes[0].elevationSuffix, '丅')
}
const noReuse = extractSurveyNodes([circle(0, 0), circle(3, 0)], [{ x: 0, y: 1, text: '855.231T' }])
assert.equal(noReuse.nodes.filter(n => n.z !== null).length, 1)
const ambiguous = extractSurveyNodes([circle(0, 0)], [
  { x: 1, y: 0, text: 'H14' },
  { x: 0, y: 2, text: '855.231T' },
  { x: 0, y: -2, text: '950.321T' },
])
assert.equal(ambiguous.nodes[0].z, null, 'equally near conflicting elevations must remain unknown')
const lane = { source: 'nodegraph', pts: [[0, 0], [10, 0]], zs: [856.184, null], names: ['F1', null], width: 4, elevation: 856.184 }
const labelled = labelLanes([lane], [])[0]
assert.equal(labelled.elevation, 856.184)
const points = buildRecord(labelled).traverse_point_array
assert.equal(points[0].z_bottom, 856.184)
assert.equal(points[0].point_name, 'F1')
assert.equal(points[1].z_bottom, null)
assert.equal(points[1].z_top, null)
assert.equal(buildRecord({ ...lane, zs: [856.1847, null] }).traverse_point_array[0].z_bottom, 856.1847)
const record = buildRecord({ ...lane, zs: [856.184, 900.5] })
applyDecisions([record], [{ i: 0, elev: 800 }])
assert.deepEqual(record.traverse_point_array.map(p => p.z_bottom), [856.184, 900.5])
assert.throws(() => buildRecord({ ...lane, zs: [856.184] }), /数量不一致/)
const routes = {}
let reviewPrompt = ''
const router = { log: { info() {}, warn() {} }, get(path, handler) { routes[path] = handler }, post(path, handler) { routes[path] = handler } }
await register(router, { id: 'test', engine: { async generate(request, options) { reviewPrompt = options.prompt; return '[]' } } })
const reviewResult = await routes['/review']({ body: { candidates: [{ i: 0, elev: null }] } }, {})
assert.equal(reviewResult.ok, true)
assert.match(reviewPrompt, /"elev":null/, 'unknown elevation must not be sent as zero')
let requestedTimeout = 0
await register(router, { id: 'test', engine: { async generate(request, options) {
  requestedTimeout = options.timeoutMs
  if (requestedTimeout <= 20000) throw Object.assign(new Error('simulated timeout at 20 seconds'), { code: 'PLUGIN_ENGINE_TIMEOUT' })
  return '[]'
} } })
const reply = { code(status) { this.status = status; return this }, send(body) { return body } }
const slowReview = await routes['/review']({ body: { candidates: [{ i: 0, elev: 850 }] } }, reply)
assert.equal(slowReview.ok, true, 'a response taking longer than 20 seconds should not be cut off by the plugin')
assert.ok(requestedTimeout > 20000)
await register(router, { id: 'test', engine: { async generate() { return 'not valid JSON' } } })
const badReply = { code(status) { this.status = status; return this }, send(body) { return body } }
const invalidReview = await routes['/review']({ body: { candidates: [{ i: 0 }] } }, badReply)
assert.equal(invalidReview.ok, false, 'invalid model output must not be reported as a successful review')
console.log('elevation regression: ok')
