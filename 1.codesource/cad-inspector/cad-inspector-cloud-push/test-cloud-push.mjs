import assert from 'node:assert/strict'
import { prepareCloudPayload } from './core/cloud-push.js'
import { register } from './server.js'

const point = (n) => ({ laneway_code: 'T001', point_name: `P${n}`, point_order: n, radius: 0, left_side: 2, right_side: 2, top_coal_thick: 0, use_second_side: false, coal_seam_struct: '', second_left_side: 0, bottom_coal_thick: 0, second_right_side: 0, x: n, y: 2, z_top: 10, z_bottom: 7, traverse_point_type: '导线点', evidence: 'not transmitted' })
const sample = { MineCode: 'M1', laneway_code: 'T001', laneway_height: 3, laneway_width: 4, current_footage: 0, traverse_point_count: 2, traverse_point_array: [point(0), point(1)], border_line_points: [[{ x: 0, y: 1 }, { x: 1, y: 1 }]], evidence: 'not transmitted' }
const result = prepareCloudPayload([sample])
assert.equal(result.ok, true)
assert.equal(result.data.data[0].mineCode, 'M1')
assert.equal(result.data.data[0].traverse_point_array[0].evidence, undefined)
assert.equal(sample.MineCode, 'M1')
const invalid = structuredClone(sample)
invalid.laneway_code = 'candidate-1'
invalid.laneway_width = null
invalid.traverse_point_array[0].z_bottom = null
const check = prepareCloudPayload([invalid])
assert.equal(check.ok, false)
assert(check.issues.some(item => item.includes('laneway_width')))
assert(check.issues.some(item => item.includes('z_bottom')))
assert(check.issues.some(item => item.includes('候选编码')))

const routes = {}, declared = []
const router = { get: (name, fn) => { routes[name] = fn }, post: (name, fn) => { routes[name] = fn }, log: { info() {} } }
await register(router, { id: 'test', getConfigEnvVars: async () => [{ name: 'CLOUDCAD_BASE_URL', value: 'https://example.invalid' }, { name: 'CLOUDCAD_TOKEN', value: 'test-token' }], egress: { declare: o => declared.push(o) } })
assert.equal(declared.length, 1)
assert.equal(declared[0].target, 'https://example.invalid/XAYL_Designer/CADCollection/GisLaneway/CreateList')
assert.equal(declared[0].headers.token, 'test-token')
assert.deepEqual(await routes['/cloud-status'](), { ok: true, configured: true, origin: 'https://example.invalid' })
assert.equal((await routes['/cloud-validate']({ body: { records: [sample] } })).ok, true)
assert.equal((await routes['/cloud-validate']({ body: { records: [invalid] } })).ok, false)
const component = (await import('./index.js')).default
const calls = []
const view = {
  ...component.data(), cloudConfigured: true, lanes: [sample],
  pluginApi: { http: { path: p => p, post: async (path, body) => routes[path]({ body }), egress: { call: async (name, body) => { calls.push({ name, body }); return { ok: true, status: 200, body: { code: 200 } } } } } },
}
await component.methods.pushCloud.call(view)
assert.equal(calls.length, 1)
assert.equal(calls[0].name, 'cloud.laneway.create')
assert.equal(calls[0].body.data[0].mineCode, 'M1')
assert.match(view.cloudStatus, /云接口返回成功/)
view.lanes = [invalid]
await component.methods.pushCloud.call(view)
assert.equal(calls.length, 1)
assert.match(view.cloudStatus, /未推送/)
view.lanes = [sample]
view.pluginApi.http.egress.call = async () => { throw new Error('timeout') }
await component.methods.pushCloud.call(view)
assert.match(view.cloudStatus, /结果未知/)
console.log('cloud push validation and declaration: ok')
