import assert from 'node:assert/strict'
import { register } from '../server.js'
const routes = {}, logs = []
let output = '["p1","p0"]'
const router = { get(p, f) { routes[p] = f }, post(p, f) { routes[p] = f }, log: { info(x) { logs.push(x) } } }
await register(router, { engine: { async generate(_request, options) { assert.equal(Object.hasOwn(options, 'model'), false); return output } } })
const body = { points: [{ id: 'p0', x: 1, y: 2 }, { id: 'p1', x: 3, y: 2 }], sides: [[[0, 0], [4, 0]], [[0, 4], [4, 4]]] }
async function call(input = body) { const reply = { status: 200, code(x) { this.status = x; return this }, send(x) { return x } }; return [await routes['/connect']({ body: input }, reply), reply.status] }
assert.deepEqual((await call())[0].order, ['p1', 'p0'])
output = '[]'; assert.deepEqual((await call())[0].order, [])
output = '["p0","p0"]'; assert.equal((await call())[1], 502)
output = '["p0","unknown"]'; assert.equal((await call())[1], 502)
output = 'SECRET'; assert.equal((await call())[1], 502)
assert.equal((await call({ ...body, sides: [] }))[1], 400)
assert.doesNotMatch(JSON.stringify(logs), /SECRET|\"x\"|\"y\"/)
console.log('model connect: ok')
