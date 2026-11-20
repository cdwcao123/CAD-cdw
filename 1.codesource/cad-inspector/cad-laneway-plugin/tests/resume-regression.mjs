import assert from 'node:assert/strict'
import component from '../index.js'

let requests = []
let pending
class FakeWorker {
  postMessage(message) {
    if (message.cmd === 'open') {
      const candidates = Array.from({ length: 6 }, (_, i) => ({ circle_id: `c${i}`, nearby_texts: [{ id: `t${i}` }] }))
      const entities = Object.fromEntries(candidates.flatMap((c, i) => [[c.circle_id, { id: c.circle_id, x: i, y: 0, radius: 1 }], [`t${i}`, { id: `t${i}`, x: i, y: 0, text: 'A1 +1' }]]))
      queueMicrotask(() => this.onmessage?.({ data: { type: 'candidates', sessionId: message.sessionId, candidates, entities } }))
    } else if (message.cmd === 'finalize') {
      assert.equal(message.decisions.length, 2)
      queueMicrotask(() => this.onmessage?.({ data: { type: 'result', sessionId: message.sessionId, points: [], lanes: [], laneReview: [] } }))
    }
  }
  terminate() {}
}
globalThis.Worker = FakeWorker
globalThis.document = { createElement: () => ({ remove() {} }), head: { appendChild() {} } }
const api = { metadata: { domId: x => x }, http: { path: x => x, post: async (_path, body) => {
  requests.push(body.circles.map(c => c.id))
  if (requests.length === 2) return new Promise(resolve => { pending = resolve })
  return { ok: true, selections: [{ circleId: body.circles[0].id, nameId: body.texts[0].id, elevationId: body.texts[0].id }] }
} } }
function mount() {
  const ctx = { ...component.data(), pluginApi: api }
  for (const [name, fn] of Object.entries(component.methods)) ctx[name] = fn.bind(ctx)
  component.mounted.call(ctx)
  return ctx
}
const tick = () => new Promise(resolve => setTimeout(resolve, 0))
const first = mount()
first.bytes = new ArrayBuffer(4); first.filename = 'test.dxf'; first.fileSize = 4
await first.start(); await tick()
assert.deepEqual(requests.map(x => x.length), [5, 1])
component.beforeUnmount.call(first)
pending({ ok: true, selections: [] }); await tick()
const second = mount()
assert.match(second.status, /暂停/)
assert.ok(second.bytes)
await second.start(); await tick()
assert.deepEqual(requests.map(x => x.length), [5, 1, 1])
assert.ok(Array.isArray(second.points))
component.beforeUnmount.call(second)
const third = mount()
assert.ok(Array.isArray(third.points))

let activeWorker
class ErrorWorker {
  constructor() { activeWorker = this }
  postMessage(message) { this.sessionId = message.sessionId }
  terminate() { this.terminated = true }
}
globalThis.Worker = ErrorWorker
const logs = []
api.logger = { error(event, payload) { logs.push({ event, payload }) } }
async function begin() {
  const ctx = mount()
  ctx.bytes = new ArrayBuffer(1)
  ctx.filename = 'SECRET_FILENAME.dxf'
  await ctx.start()
  return ctx
}
let ctx = await begin()
activeWorker.onerror({ message: 'SECRET_EXCEPTION' })
assert.equal(ctx.error, '解析进程异常。')
assert.equal(ctx.busy, false)
assert.equal(activeWorker.terminated, true)
ctx = await begin()
await activeWorker.onmessage({ data: { type: 'error', sessionId: activeWorker.sessionId, error: 'SECRET_WORKER' } })
assert.equal(ctx.error, 'SECRET_WORKER')
ctx = await begin()
api.http.post = async () => { throw new Error('SECRET_HTTP') }
const candidates = [{ circle_id: 'c', nearby_texts: [{ id: 't' }] }]
const entities = { c: { id: 'c', x: 12, y: 34, radius: 1 }, t: { id: 't', x: 12, y: 34, text: 'SECRET_TEXT' } }
await activeWorker.onmessage({ data: { type: 'candidates', sessionId: activeWorker.sessionId, candidates, entities } })
assert.doesNotMatch(ctx.error, /SECRET_HTTP/)
assert.match(ctx.error, /模型采集已暂停.*可点击继续采集/)
assert.equal(ctx.busy, false)
assert.equal(activeWorker.terminated, true)
ctx = await begin()
api.http.post = async () => ({ ok: false, error: 'SECRET_RESPONSE' })
await activeWorker.onmessage({ data: { type: 'candidates', sessionId: activeWorker.sessionId, candidates, entities } })
assert.match(ctx.error, /SECRET_RESPONSE/)
assert.deepEqual(logs.map(x => x.event), ['collect.worker_error', 'collect.business_error', 'collect.http_error', 'collect.business_error'])
for (const entry of logs) assert.deepEqual(Object.keys(entry.payload).sort(), ['kind', 'operation'])
assert.doesNotMatch(JSON.stringify(logs), /SECRET|12|34/)
api.logger.error = () => { throw new Error('logger failed') }
ctx = await begin()
activeWorker.onerror()
assert.equal(ctx.busy, false)
assert.equal(activeWorker.terminated, true)
api.logger.error = () => Promise.reject(new Error('logger failed'))
ctx = await begin()
activeWorker.onerror()
await tick()
assert.equal(ctx.busy, false)
console.log('resume regression OK')
