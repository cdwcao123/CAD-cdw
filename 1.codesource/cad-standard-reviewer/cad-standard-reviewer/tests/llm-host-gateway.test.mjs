import test from 'node:test'
import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'
import { reviewWithModel } from '../server/llm.js'

const gatewayPath = process.env.CAD_HOST_GATEWAY || 'E:/project/elvespuck/06sourcecode/server/dist/plugin-engine-gateway.js'
const { createPluginEngineGateway } = await import(pathToFileURL(gatewayPath).href)
const analysis = {
  model: { balloons: [], fcf: [], roughness: [] },
  checkedRules: [], findings: [], drawing: {}, stats: {},
  verdict: { level: 'review', label: '待确认' },
}
const valid = JSON.stringify({ verdict: '待确认', summary: '已复核', reviewedFindings: [], additionalFindings: [] })

function fixture(finish, text = valid) {
  let messages = 0
  const paths = []
  const gateway = createPluginEngineGateway({
    resolveTarget: async () => ({ instanceId: 'fixture', baseUrl: 'http://fixture.test', workspaceDir: '/fixture', defaultModel: 'fixture-provider/fixture-model' }),
    fetchImplementation: async (url, init = {}) => {
      const pathname = new URL(url).pathname
      paths.push(`${init.method || 'GET'} ${pathname}`)
      let body = {}
      if (pathname === '/provider') body = { all: [{ id: 'fixture-provider', models: { 'fixture-model': {} } }], connected: ['fixture-provider'] }
      else if (pathname === '/session' && init.method === 'POST') body = { id: 'session-fixture' }
      else if (pathname.endsWith('/message') && init.method === 'POST') {
        messages += 1
        const requestBody = JSON.parse(init.body)
        const prompt = JSON.stringify(requestBody)
        const match = prompt.match(/批次编号[^0-9]*([0-9]+-[0-9]+)/)
        const responseText = text === valid && match ? JSON.stringify({ ...JSON.parse(valid), coveredBatchId: match[1] }) : text
        body = { info: { role: 'assistant', finish: Array.isArray(finish) ? finish[Math.min(messages - 1, finish.length - 1)] : finish }, parts: [{ type: 'text', text: responseText }] }
      }
      return new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } })
    },
  })
  const request = { raw: { aborted: false } }
  return { engine: { generate: (req, input) => gateway.generate(req, 'cad-standard-reviewer', input) }, request, paths, calls: () => messages }
}

async function run(f) {
  return reviewWithModel({ engine: f.engine, request: f.request, engineResult: analysis, rawSources: [] })
}

test('真实宿主网关拒绝未完成的上游响应，插件保留宿主错误', async () => {
  const f = fixture('length')
  const result = await run(f)
  assert.equal(result.ok, false)
  assert.equal(result.errorCode, 'PLUGIN_ENGINE_RESPONSE_INVALID')
  assert.equal(result.failedStage, 'review')
  assert.equal(result.parseReason, 'HOST_INCOMPLETE')
  assert.equal(result.rawLength, 0)
  assert.match(result.errorDetail, /模型未返回完整的纯文本结果/)
  assert.equal(f.calls(), 2)
  assert.ok(f.paths.includes('DELETE /session/session-fixture'))
})

test('同一响应仅改变完成状态为 stop 时两阶段成功', async () => {
  const f = fixture('stop')
  const result = await run(f)
  assert.equal(result.ok, true)
  assert.deepEqual(result.stages, { review: true, finalReview: true })
  assert.equal(f.calls(), 2)
})

test('宿主报告不完整时重试同一批次并继续复查', async () => {
  const f = fixture(['length', 'stop'])
  const result = await run(f)
  assert.equal(result.ok, true)
  assert.deepEqual(result.stages, { review: true, finalReview: true })
  assert.equal(f.calls(), 3)
})

test('完整非 JSON 文本不应被误诊为截断', async () => {
  const f = fixture('stop', 'No JSON')
  const result = await run(f)
  assert.equal(result.errorCode, 'PLUGIN_ENGINE_RESPONSE_INVALID')
  assert.equal(result.failedStage, 'review')
  assert.equal(f.calls(), 1)
  assert.equal(result.suspectedTruncation, false, '完整非 JSON 文本不代表发生截断')
})
