import assert from 'node:assert/strict'
import { register } from '../server.js'

const routes = {}
let logs = []
const router = { log: { info(entry) { logs.push(entry) } }, get(path, fn) { routes[path] = fn }, post(path, fn) { routes[path] = fn } }
let response = '[]'
let options
let responses
let calls = []
await register(router, { id: 'test', engine: { async generate(request, opts) { options = opts; calls.push({ request, opts }); const value = responses ? responses.shift() : response; if (value instanceof Error) throw value; return value } } })
const body = {
  circles: [{ id: 'c1', x: 1, y: 2, r: 0.5 }, { id: 'c2', x: 4, y: 2, r: 0.5 }],
  texts: [{ id: 'n', x: 1, y: 3, text: 'H14' }, { id: 'z', x: 2, y: 2, text: '855.231底板' }, { id: 'both', x: 3, y: 3, text: 'F1 1318.349' }, { id: 'bad', x: 3, y: 4, text: '114采区轨道上山' }],
}
async function call(input = body) {
  const reply = { status: 200, code(status) { this.status = status; return this }, send(value) { return value } }
  const result = await routes['/collect']({ body: input }, reply)
  return { result, status: reply.status }
}
response = JSON.stringify([{ circleId: 'c1', nameId: 'n', elevationId: 'z' }])
let { result, status } = await call()
assert.equal(status, 200)
assert.deepEqual(result.uncertainCircleIds, ['c2'])
assert.deepEqual(result.selections, [{ circleId: 'c1', nameId: 'n', elevationId: 'z' }])
assert.equal(Object.hasOwn(options, 'model'), false)
const corridor = { circleId: 'c1', sides: [[[0, 0], [10, 0]], [[0, 4], [10, 4]]], straight: true, shaftHint: true }
assert.equal((await call({ ...body, corridors: [corridor] })).result.ok, true)
assert.deepEqual(JSON.parse(options.prompt).corridors, [corridor])
assert.equal((await call({ ...body, corridors: [{ ...corridor, circleId: 'unknown' }] })).status, 400)
response = JSON.stringify([{ circleId: 'c1', nameId: 'n', elevationId: null }])
assert.deepEqual((await call()).result.selections, [{ circleId: 'c1', nameId: 'n', elevationId: null }])
assert.match(options.systemPrompt, /null/)
assert.ok(logs.some(entry => entry.outcome === 'success' && entry.missingElevationCount === 1))
calls = []
responses = [JSON.stringify([{ circleId: 'c1', nameId: 'n', elevationId: 'bad' }])]
assert.deepEqual((await call()).result.selections, [{ circleId: 'c1', nameId: 'n', elevationId: null }])
assert.equal(calls.length, 1)
assert.equal(logs.at(-1).discardedElevations, 1)
responses = undefined
response = JSON.stringify([{ circleId: 'c1', nameId: 'both', elevationId: 'both' }])
assert.equal((await call()).result.ok, true)
const numericBody = { circles: [body.circles[0]], texts: [{ id: 'number', x: 1, y: 2, text: '001' }, { id: 'height', x: 1, y: 3, text: '855.231' }] }
response = JSON.stringify([{ circleId: 'c1', nameId: 'number', elevationId: 'height' }])
assert.deepEqual((await call(numericBody)).result.selections, [{ circleId: 'c1', nameId: 'number', elevationId: 'height' }])
response = JSON.stringify([{ circleId: 'c1', nameId: 'number', elevationId: 'number' }])
assert.notDeepEqual((await call(numericBody)).result.selections, [{ circleId: 'c1', nameId: 'number', elevationId: 'number' }])
calls = []
responses = Array(3).fill(JSON.stringify([
  { circleId: 'c1', nameId: 'n', elevationId: 'z' },
  { circleId: 'c2', nameId: 'bad', elevationId: null },
]))
const partial = await call()
assert.equal(partial.status, 200)
assert.deepEqual(partial.result.selections, [{ circleId: 'c1', nameId: 'n', elevationId: 'z' }])
assert.deepEqual(partial.result.uncertainCircleIds, ['c2'])
assert.equal(calls.length, 3)
assert.ok(logs.some(entry => entry.outcome === 'partial_success' && entry.skippedCount === 1))
responses = Array(3).fill(JSON.stringify([
  { circleId: 'c1', nameId: 'bad', elevationId: null },
  { circleId: 'c2', nameId: 'n', elevationId: null },
]))
assert.deepEqual((await call()).result.selections, [{ circleId: 'c2', nameId: 'n', elevationId: null }])
responses = Array(3).fill(JSON.stringify([
  { circleId: 'c1', nameId: 'n', elevationId: null },
  { circleId: 'c2', nameId: 'n', elevationId: null },
]))
assert.deepEqual((await call()).result.selections, [{ circleId: 'c1', nameId: 'n', elevationId: null }])
responses = [JSON.stringify([{ circleId: 'c1', nameId: 'bad', elevationId: null }]), 'not json', 'not json']
assert.equal((await call()).result.code, 'INVALID_MODEL_RESPONSE')

responses = undefined
for (const invalid of [
  'not json', '{}',
  JSON.stringify([{ circleId: 'c1', nameId: null, elevationId: 'z' }]),
  JSON.stringify([{ circleId: 'missing', nameId: null, elevationId: 'z' }]),
  JSON.stringify([{ circleId: 'n', nameId: null, elevationId: 'z' }]),
  JSON.stringify([{ circleId: 'c1', nameId: null, elevationId: 'bad' }]),
  JSON.stringify([{ circleId: 'c1', nameId: 'bad', elevationId: 'z' }]),
  JSON.stringify([{ circleId: 'c1', nameId: 'n', elevationId: 'missing' }]),
  JSON.stringify([{ circleId: 'c1', nameId: 'n', elevationId: null, elevation: 855 }]),
  JSON.stringify([{ circleId: 'c1', nameId: 'n', elevationId: null }, { circleId: 'c2', nameId: 'n', elevationId: null }]),
  JSON.stringify([{ circleId: 'c1', nameId: null, elevationId: 'z', z: 855 }]),
  JSON.stringify([{ circleId: 'c1', nameId: null, elevationId: 'z' }, { circleId: 'c2', nameId: null, elevationId: 'z' }]),
]) {
  response = invalid
  const out = await call()
  if (invalid === 'not json' || invalid === '{}') {
    assert.equal(out.status, 502)
    assert.equal(out.result.code, 'INVALID_MODEL_RESPONSE')
  } else {
    assert.equal(out.status, 200)
    assert.deepEqual(out.result.uncertainCircleIds, body.circles.filter(c => !out.result.selections.some(s => s.circleId === c.id)).map(c => c.id))
  }
}
calls = []
responses = ['not json SECRET_RESPONSE', JSON.stringify([{ circleId: 'c1', nameId: 'n', elevationId: 'z' }])]
const recovered = await call()
assert.equal(recovered.status, 200)
assert.ok(logs.some(entry => entry.category === 'malformed_json'))
assert.ok(logs.some(entry => entry.attempt === 2 && entry.outcome === 'success'))
assert.equal(JSON.stringify(logs).includes('SECRET_RESPONSE'), false)
assert.deepEqual(recovered.result.selections, [{ circleId: 'c1', nameId: 'n', elevationId: 'z' }])
assert.equal(calls.length, 2)
assert.equal(calls[0].request, calls[1].request)
assert.equal(JSON.stringify(calls[1].opts).includes('SECRET_RESPONSE'), false)
assert.equal(Object.hasOwn(calls[1].opts, 'model'), false)
calls = []
responses = [JSON.stringify([{ circleId: 'missing', nameId: 'n', elevationId: 'z' }]), 'not json', JSON.stringify([{ circleId: 'c1', nameId: 'n', elevationId: 'z' }])]
assert.equal((await call()).status, 200)
assert.equal(calls.length, 3)
assert.match(calls[1].opts.systemPrompt, /引用的 ID 不存在/)
assert.match(calls[2].opts.systemPrompt, /JSON 无效/)
assert.equal(calls[1].opts.systemPrompt.includes('missing'), false)

calls = []
responses = ['secret invalid response', '{}', '{}']
const exhausted = await call()
assert.equal(exhausted.status, 502)
assert.equal(exhausted.result.code, 'INVALID_MODEL_RESPONSE')
assert.match(exhausted.result.error, /结果不是数组/)
assert.match(exhausted.result.error, /3/)
assert.equal(JSON.stringify(exhausted).includes('secret invalid response'), false)
assert.equal(calls.length, 3)

calls = []
responses = ['not json', new Error('SECRET_ENGINE_ERROR')]
const retryFailure = await call()
assert.equal(retryFailure.status, 502)
assert.equal(retryFailure.result.code, 'MODEL_FAILED')
assert.match(retryFailure.result.error, /2/)
assert.equal(JSON.stringify(retryFailure).includes('SECRET_ENGINE_ERROR'), false)
assert.equal(calls.length, 2)
responses = undefined
response = new Error('timeout')
assert.equal((await call()).result.code, 'MODEL_FAILED')
assert.equal((await call({ ...body, circles: [...body.circles, body.circles[0]] })).status, 400)
assert.equal((await call({ ...body, circles: Array(41).fill(body.circles[0]) })).status, 400)
assert.equal((await routes['/health']()).engine, true)

const categoryCases = [
  ['not json SECRET_RESPONSE', 'malformed_json', 'JSON 无效'],
  ['{}', 'result_not_array', '结果不是数组'],
  [JSON.stringify([{ circleId: 'c1', nameId: null, elevationId: 'z' }]), 'field_format', '字段格式无效'],
  [JSON.stringify([{ circleId: 'missing', nameId: 'n', elevationId: 'z' }]), 'unknown_id', '引用的 ID 不存在'],
  [JSON.stringify([{ circleId: 'c1', nameId: 'n', elevationId: 'z' }, { circleId: 'c2', nameId: 'n', elevationId: 'z' }]), 'duplicate', '实体重复使用'],
  [JSON.stringify([{ circleId: 'c1', nameId: 'bad', elevationId: 'z' }]), 'point_name', '点名解析失败'],
]
for (const [invalid, category, description] of categoryCases) {
  logs = []
  calls = []
  responses = [invalid, invalid, invalid]
  const result = (await call()).result
  if (category === 'malformed_json' || category === 'result_not_array') assert.equal(result.code, 'INVALID_MODEL_RESPONSE')
  else assert.equal(result.ok, true)
  assert.deepEqual(logs.filter(entry => entry.outcome === 'validation_failed').map(entry => entry.category), [category, category, category])
  assert.equal(logs.at(-1).outcome, category === 'malformed_json' || category === 'result_not_array' ? 'exhausted' : 'partial_success')
  assert.match(calls[1].opts.systemPrompt, new RegExp(description))
  assert.equal(new Set(logs.map(entry => entry.requestId)).size, 1)
  assert.ok(logs.every(entry => Number.isFinite(entry.durationMs) && entry.circleCount === 2 && entry.textCount === 4))
}
logs = []
const engineError = new Error('SECRET_ENGINE_ERROR')
engineError.code = 'ETIMEDOUT'
responses = [engineError]
await call()
assert.equal(logs.find(entry => entry.outcome === 'model_failed').modelCode, 'ETIMEDOUT')
engineError.code = 'SECRET_TOKEN'
responses = [engineError]
await call()
assert.equal(logs.filter(entry => entry.outcome === 'model_failed')[1].modelCode, undefined)
assert.doesNotMatch(JSON.stringify(logs.map(({ requestId, ...entry }) => entry)), /SECRET|855\.231|H14|c1|missing|114采区/)
logs = []
responses = ['[]']
await call({ ...body, sessionId: '123-abc', batchIndex: 5 })
assert.ok(logs.every(entry => entry.sessionId === '123-abc' && entry.batchIndex === 5))
logs = []
responses = ['[]']
await call({ ...body, sessionId: 'SECRET CONTENT', batchIndex: -1 })
assert.doesNotMatch(JSON.stringify(logs), /SECRET CONTENT/)
router.log.info = () => { throw new Error('SECRET_LOG_ERROR') }
responses = ['[]']
assert.equal((await call()).status, 200)
delete router.log
responses = ['[]']
assert.equal((await call()).status, 200)
console.log('model collection: ok')
