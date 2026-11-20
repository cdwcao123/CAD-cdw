import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { analyzeDxfBuffer } from '../server/analyze.js'
import { buildReviewPrompt, mergeModelReview, parseModelJson, reviewWithModel } from '../server/llm.js'
import { normalizeRuleSet } from '../server/rule-import.js'
import { parseLibraryFile } from '../server/library-import.js'

test('模型结构错误记录字段类型、阶段与批次，不记录响应正文', async () => {
  const logs = []
  const engine = { generate: async () => ({ text: JSON.stringify({ verdict: '符合', summary: '敏感正文', reviewedFindings: {}, additionalFindings: [] }) }) }
  const result = await reviewWithModel({ engine, request: {}, engineResult: { model: {}, drawing: {}, findings: [], checkedRules: [] }, ruleSet: { rules: [] }, rawSources: [], logger: { error: value => logs.push(value) } })
  assert.equal(result.parseReason, 'INVALID_STRUCTURE')
  assert.equal(result.diagnostic.fields.reviewedFindings, 'object')
  assert.equal(result.diagnostic.batch, '1-1')
  assert.equal(result.diagnostic.stage, 'review')
  assert.ok(!JSON.stringify(logs).includes('敏感正文'))
})

test('模型结构错误时重试当前批次并验证覆盖编号', async () => {
  let calls = 0
  const engine = { generate: async (request, input) => {
    calls++
    const data = JSON.parse(input.prompt.split('\n')[0] === '{' ? input.prompt : input.prompt.split('\n').find(line => line.startsWith('{')))
    return { text: JSON.stringify(calls === 1 ? { verdict: '符合' } : { verdict: '待确认', summary: '已审查', reviewedFindings: [], additionalFindings: [], coveredBatchId: data.批次编号 }) }
  } }
  const result = await reviewWithModel({ engine, request: {}, engineResult: { model: {}, drawing: {}, findings: [], checkedRules: [] }, ruleSet: { rules: [] }, rawSources: [] })
  assert.equal(result.ok, true)
  assert.equal(calls, 3)
})

const DATA_DIR = process.env.CAD_RULE_TEST_DATA || 'E:/国睿/测试数据'
const SAMPLE = `${DATA_DIR}/GW-2026-001_支架组件_A2.dxf`
const RULE_SET = normalizeRuleSet(JSON.parse(readFileSync(new URL('../rules/v1.json', import.meta.url), 'utf8')), { sourceType: 'test', fileName: 'v1.json' })
const LIBRARIES = {
  material: parseLibraryFile(readFileSync(new URL('../libraries/materials-gb.json', import.meta.url)), 'materials.json').library,
  tolerance: parseLibraryFile(readFileSync(new URL('../libraries/tolerances-gb.json', import.meta.url)), 'tolerances.json').library,
}

function analyze() {
  const analysis = analyzeDxfBuffer(readFileSync(SAMPLE), { fileName: 'sample.dxf', useLlm: false, maxEvidenceTexts: 120, ruleSet: RULE_SET, libraries: LIBRARIES })
  analysis.model = { evidence: { texts: [] } }
  return analysis
}

test('真实图纸与内置资料不会因完整 CAD 内部对象导致批次数超限', async () => {
  const analysis = analyzeDxfBuffer(readFileSync(`${DATA_DIR}/GW-2026-001_支架组件_A2_合规版 - 副本 (2).dxf`), { fileName: 'sample.dxf', maxEvidenceTexts: 140, ruleSet: RULE_SET, libraries: LIBRARIES })
  const sources = ['rules/v1.json', 'libraries/materials-gb.json', 'libraries/tolerances-gb.json'].map(file => {
    const originalText = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
    return { complete: true, fileName: file, originalText, extraction: JSON.parse(originalText), revision: { type: 'verified-original' } }
  })
  let calls = 0
  const engine = { generate: async (request, input) => {
    calls++
    const payload = JSON.parse(input.prompt.split('\n').at(-1))
    return { text: JSON.stringify({ verdict: '待确认', summary: '已检查', reviewedFindings: [], additionalFindings: [], coveredBatchId: payload.批次编号 }) }
  } }
  const result = await reviewWithModel({ engine, request: {}, engineResult: analysis, rawSources: sources, ruleSet: { name: 'test', rules: sources[0].extraction.rules } })
  assert.equal(result.ok, true, `批次数 ${result.coverage?.total}，错误 ${result.errorCode}`)
  assert.ok(calls > 0)
  assert.ok(result.coverage.total <= 100)
  assert.ok(result.coverage.drawingEvidence)
  assert.notEqual(result.review.verdict, '符合')
})

test('分批审查逐批复查并核验覆盖确认', async () => {
  const calls = []
  const analysis = { model: { evidence: '图纸证据'.repeat(12000) }, drawing: {}, checkedRules: ['R01'], findings: [] }
  const sources = [{ complete: true, extraction: { text: '资料内容'.repeat(12000) } }]
  const engine = { generate: async (request, input) => {
    const payload = JSON.parse(input.prompt.split('\n').at(-1))
    calls.push(payload)
    return { text: JSON.stringify({ verdict: '待确认', summary: '已审查', reviewedFindings: [], additionalFindings: [], coveredBatchId: payload.批次编号 }) }
  } }
  const result = await reviewWithModel({ engine, request: {}, engineResult: analysis, ruleSet: { rules: [{ id: 'R01' }] }, rawSources: sources })
  assert.equal(result.ok, true)
  assert.ok(calls.length > 2)
  const initial = calls.filter(item => item.阶段 === '初审')
  const final = calls.filter(item => item.阶段 === '复查')
  assert.equal(final.length, initial.length)
  assert.ok(final.every(item => item.初审结果 && initial.some(first => first.批次编号 === item.批次编号)))
  assert.ok(calls.every(item => Buffer.byteLength(JSON.stringify(item), 'utf8') < 60 * 1024))
  assert.equal(result.coverage.completed, initial.length)
})

test('最终结论以复查结果为准，不保留被否定的初审结论', async () => {
  const analysis = { model: {}, drawing: {}, checkedRules: ['R01'], findings: [] }
  const engine = { generate: async (request, input) => {
    const payload = JSON.parse(input.prompt.split('\n').at(-1))
    return { text: JSON.stringify({ verdict: payload.阶段 === '初审' ? '不符合' : '符合', summary: payload.阶段, reviewedFindings: [], additionalFindings: [], coveredBatchId: payload.批次编号 }) }
  } }
  const result = await reviewWithModel({ engine, request: {}, engineResult: analysis, ruleSet: { rules: [{ id: 'R01' }] }, rawSources: [] })
  assert.equal(result.ok, true)
  assert.equal(result.review.verdict, '符合')
  assert.equal(result.review.summary, '复查')
})

test('模型重复复核不能夸大数量或覆盖本地精确不符合结论', () => {
  const finding = { id: 'local-1', ruleId: 'R01', severity: '严重', conclusion: '不符合', source: 'engine', title: '本地精确问题' }
  const analysis = { findings: [finding], checkedRules: ['R01'], stats: {}, warnings: [], verdict: { level: 'fail', label: '不符合' } }
  const review = { verdict: '符合', summary: '符合', reviewedFindings: [{ id: 'local-1', opinion: 'refute' }, { id: 'local-1', opinion: 'refute' }], additionalFindings: [] }
  const result = mergeModelReview(analysis, { ok: true, review }, { rules: [{ id: 'R01' }] })
  assert.equal(result.findings.length, 1)
  assert.equal(result.findings[0].conclusion, '不符合')
  assert.equal(result.verdict.label, '不符合')
  assert.equal(result.llm.reviewed, 1)
  assert.equal(result.llm.flagged, 1)
  assert.equal(analysis.findings[0].llmOpinion, undefined)
})

test('缺少模型审查结果不能报告模型完成', () => {
  const analysis = { findings: [], checkedRules: [], stats: {}, warnings: [] }
  const result = mergeModelReview(analysis, { enabled: true, ok: true })
  assert.equal(result.llm.ok, false)
  assert.equal(result.verdict.label, '待确认')
  assert.ok(result.warnings.length > 0)
})

test('模型单方认为符合不能作为总体符合，须人工确认规则语义', () => {
  const analysis = { findings: [], checkedRules: ['R01'], stats: {}, warnings: [] }
  const review = { verdict: '符合', summary: '符合', reviewedFindings: [], additionalFindings: [] }
  const result = mergeModelReview(analysis, { ok: true, review }, { rules: [{ id: 'R01' }] })
  assert.equal(result.verdict.label, '待确认')
  assert.match(result.verdict.detail, /规则修订与原文.*人工确认/)
  assert.equal(result.llm.verdict, '符合')
})

test('模型只有总体不符合且无具体问题时不能给出确定结论', () => {
  const analysis = { findings: [], checkedRules: ['R01'], stats: {}, warnings: [] }
  const result = mergeModelReview(analysis, { ok: true, review: { verdict: '不符合', summary: '不符合', reviewedFindings: [], additionalFindings: [] } }, { rules: [{ id: 'R01' }] })
  assert.equal(result.verdict.label, '待确认')
  assert.equal(result.llm.verdict, '不符合')
  assert.match(result.verdict.detail, /问题|证据/)
})

test('模型补充的疑似问题不能单独构成确定不符合', () => {
  const analysis = { findings: [], checkedRules: ['R01'], stats: {}, warnings: [] }
  const review = { verdict: '不符合', summary: '疑似问题', reviewedFindings: [], additionalFindings: [{ ruleId: 'R01', title: '疑似问题' }, { ruleId: 'R99', title: '无效规则' }] }
  const result = mergeModelReview(analysis, { ok: true, review }, { rules: [{ id: 'R01', severity: '一般', ruleClass: 'A' }] })
  assert.equal(result.verdict.label, '待确认')
  assert.equal(result.findings.length, 1)
  assert.equal(result.findings[0].conclusion, '疑似不符合')
  assert.equal(result.llm.reportedAdditional, 2)
  assert.equal(result.llm.filteredAdditional, 1)
})

test('分片资料中有标准库时不向模型暗示标准库为空', async () => {
  const calls = []
  const engine = { generate: async (request, input) => {
    const batch = JSON.parse(input.prompt.split('\n').at(-1))
    calls.push(batch)
    return { text: JSON.stringify({ verdict: '待确认', summary: '完成', reviewedFindings: [], additionalFindings: [], coveredBatchId: batch.批次编号 }) }
  } }
  const result = await reviewWithModel({ engine, request: {}, engineResult: { model: {}, drawing: {}, checkedRules: [], findings: [] }, ruleSet: { rules: [] }, rawSources: [{ kind: 'library', fileName: 'materials.json', originalText: '牌号Q235', complete: true }] })
  assert.equal(result.ok, true)
  assert.doesNotMatch(calls[0].资料片段.内容, /"标准库":null/)
  assert.match(calls[0].资料片段.内容, /牌号Q235/)
})

test('资料批次数超限时不调用模型', async () => {
  let calls = 0
  const result = await reviewWithModel({
    engine: { generate: async () => { calls++ } }, request: {},
    engineResult: { model: {}, drawing: {}, checkedRules: ['R01'], findings: [] },
    ruleSet: { rules: [{ id: 'R01' }] }, rawSources: [{ complete: true, text: 'a'.repeat(1820000) }],
  })
  assert.equal(calls, 0)
  assert.equal(result.ok, false)
  assert.equal(result.errorCode, 'PLUGIN_ENGINE_INPUT_INCOMPLETE')
  assert.equal(result.coverage.completed, 0)
  assert.match(result.message, /超过 100 批上限/)
})

test('缺失批次确认不能报告覆盖完成', async () => {
  const analysis = { model: {}, drawing: {}, checkedRules: ['R01'], findings: [] }
  const result = await reviewWithModel({ engine: { generate: async () => ({ text: JSON.stringify({ verdict: '符合', summary: '完成', reviewedFindings: [], additionalFindings: [] }) }) }, request: {}, engineResult: analysis, ruleSet: { rules: [{ id: 'R01' }] }, rawSources: [] })
  assert.equal(result.ok, false)
  assert.equal(result.parseReason, 'INVALID_COVERAGE')
  assert.equal(result.coverage.completed, 0)
  assert.equal(mergeModelReview(analysis, result).verdict.label, '待确认')
})

test('提示词包含规则、证据与本地结论，且不超过模型输入上限', () => {
  const analysis = analyze()
  const { systemPrompt, prompt } = buildReviewPrompt({ engineResult: analysis, options: { strict: false }, ruleSet: RULE_SET })
  assert.ok(systemPrompt.includes('标准化审查专家'))
  assert.ok(prompt.includes('"R01"'))
  assert.ok(prompt.includes('本地规则结论'))
  assert.ok(prompt.includes('exceptions'))
  assert.ok(prompt.length < 64 * 1024, `提示词过长：${prompt.length}`)
})

test('大模型复核：补充去重、保留本地结论、记录复核意见', async () => {
  const analysis = analyze()
  const first = analysis.findings[0]
  const second = analysis.findings[1]
  const review = {
    verdict: '不符合',
    summary: '图框边距与比例均存在明显偏差，建议优先整改关键项。',
    reviewedFindings: [
      { id: first.id, opinion: 'confirm', reason: '几何数据支持该结论' },
      { id: second.id, opinion: 'refute', reason: '该件号在其他视图已标注' },
    ],
    additionalFindings: [
      {
        ruleId: 'R02',
        severity: '一般',
        title: 'ZZTOP9',
        detail: 'ZQX 标记与批量输出检查项一致。',
        location: { x: 9000, y: 9000, label: '标题栏图样名称栏' },
        measured: 'ZQX-1',
        expected: 'ZQX-2',
        basis: 'GB/T 10609.1-2008',
        suggestion: '按企业模板修正。',
        confidence: 0.7,
      },
      {
        ruleId: 'R03',
        severity: '关键',
        title: first.title,
        detail: '重复问题',
        location: { x: first.location.x, y: first.location.y, label: '重复' },
        measured: '1:1',
        expected: '1:2',
        basis: 'GB/T 14690-1993',
        suggestion: '重复',
        confidence: 0.9,
      },
      {
        ruleId: 'R99',
        severity: '关键',
        title: '不存在的规则',
        location: { x: 0, y: 0, label: '—' },
      },
    ],
    notes: ['先整改关键项，再处理一般项'],
  }
  const engine = {
    generate: async (request, input) => {
      assert.equal(request.__test, true)
      assert.ok(input.prompt.length < 64 * 1024)
      assert.ok(input.maxOutputChars <= 64000)
      return { text: JSON.stringify({ ...review, coveredBatchId: JSON.parse(input.prompt.split('\n').at(-1)).批次编号 }), model: { providerId: 'p', modelId: 'm' }, usage: { total: 100 } }
    },
  }
  const llmResult = await reviewWithModel({
    engine,
    request: { __test: true },
    engineResult: analysis, rawSources: [], ruleSet: RULE_SET,
    options: { useLlm: true },
    settings: { llmTimeoutMs: 30000 },
  })
  assert.equal(llmResult.ok, true)
  const merged = mergeModelReview(analysis, llmResult, RULE_SET)
  assert.equal(merged.llm.ok, true)
  assert.equal(merged.llm.reviewed, 2)
  assert.equal(merged.llm.added, 1)
  assert.equal(merged.findings.length, analysis.findings.length + 1)
  assert.equal(merged.findings.find(item => item.id === first.id).llmOpinion, 'confirm')
  assert.equal(merged.findings.find(item => item.id === second.id).llmOpinion, 'refute')
  assert.ok(merged.findings.some(item => item.source === 'llm' && item.ruleId === 'R02'))
  assert.ok(!merged.findings.some(item => item.ruleId === 'R99'))
  assert.ok(merged.llm.notes.length === 1)
})

test('模型输出非法 JSON 时降级为本地规则', async () => {
  const analysis = analyze()
  const engine = { generate: async () => ({ text: '对不起，我无法审查' }) }
  const llmResult = await reviewWithModel({
    engine,
    request: {},
    engineResult: analysis, rawSources: [],
    options: { useLlm: true },
    settings: {},
  })
  assert.equal(llmResult.ok, false)
  assert.equal(llmResult.errorCode, 'PLUGIN_ENGINE_RESPONSE_INVALID')
  const merged = mergeModelReview(analysis, llmResult)
  assert.equal(merged.findings.length, analysis.findings.length)
  assert.equal(merged.llm.ok, false)
})

test('请求不能关闭模型审查，合并后还必须独立复查', async () => {
  const calls = []
  const engine = { generate: async (request, input) => {
    calls.push(input)
    return { text: JSON.stringify({ verdict: '待确认', summary: '已审查', reviewedFindings: [], additionalFindings: [], notes: [], coveredBatchId: JSON.parse(input.prompt.split('\n').at(-1)).批次编号 }) }
  } }
  const result = await reviewWithModel({ engine, request: {}, engineResult: analyze(), rawSources: [], options: { useLlm: false, finalReview: false } })
  assert.equal(calls.length, 2)
  assert.equal(result.ok, true)
})

test('最终复查失败时保留初审结果并标记未完成', async () => {
  let calls = 0
  const result = await reviewWithModel({
    engine: { generate: async (request, input) => {
      calls += 1
      if (calls === 2) throw new Error('复查失败')
      return { text: JSON.stringify({ verdict: '待确认', summary: '初审', reviewedFindings: [], additionalFindings: [], coveredBatchId: JSON.parse(input.prompt.split('\n').at(-1)).批次编号 }) }
    } },
    request: {}, engineResult: analyze(), rawSources: [],
  })
  assert.equal(result.ok, false)
  assert.equal(result.failedStage, 'finalReview')
  assert.deepEqual(result.stages, { review: true, finalReview: false })
  assert.equal(mergeModelReview(analyze(), result).llm.summary, '初审')
})

test('空模型结果不能视为审查完成', async () => {
  const result = await reviewWithModel({ engine: { generate: async () => ({ text: '{}' }) }, request: {}, engineResult: analyze(), rawSources: [] })
  assert.equal(result.ok, false)
})

test('超预算提示词按 UTF-8 字节计量且保留完整 JSON', () => {
  const analysis = analyze()
  analysis.drawing = { text: '图'.repeat(50000) }
  const { prompt, truncated } = buildReviewPrompt({ engineResult: analysis })
  assert.equal(truncated, true)
  assert.ok(Buffer.byteLength(prompt, 'utf8') > 64 * 1024)
  assert.equal(JSON.parse(prompt.slice(prompt.lastIndexOf('\n') + 1)).图纸概况.text, analysis.drawing.text)
})

test('规则文本完整保留且不误标为证据裁剪', () => {
  const analysis = analyze()
  const ruleSet = { name: 'test', version: '1', rules: [{ id: 'CUSTOM', logic: '规则'.repeat(150), exceptions: ['例外'.repeat(100), '二', '三'] }] }
  analysis.checkedRules = ['CUSTOM']
  const { prompt, truncated } = buildReviewPrompt({ engineResult: analysis, ruleSet })
  const payload = JSON.parse(prompt.slice(prompt.lastIndexOf('\n') + 1))
  assert.equal(truncated, false)
  assert.equal(payload.规则集.规则[0].logic, ruleSet.rules[0].logic)
  assert.deepEqual(payload.规则集.规则[0].exceptions, ruleSet.rules[0].exceptions)
})

test('超预算证据分批审查，完整覆盖仍须人工确认', async () => {
  const analysis = analyze()
  analysis.model.evidence.texts = ['文字'.repeat(40000)]
  const calls = []
  const result = await reviewWithModel({ engine: { generate: async (request, input) => {
    const batch = JSON.parse(input.prompt.split('\n').at(-1))
    calls.push(batch)
    return { text: JSON.stringify({ verdict: '符合', summary: '完成', reviewedFindings: [], additionalFindings: [], coveredBatchId: batch.批次编号 }) }
  } }, request: {}, engineResult: analysis, rawSources: [] })
  assert.equal(result.ok, true)
  assert.ok(result.coverage.completed > 1)
  assert.equal(calls.length, result.coverage.total * 2)
  assert.equal(result.review.verdict, '待确认')
})

test('超出字节预算时标记裁剪并保留可解析 JSON', () => {
  const analysis = analyze()
  analysis.drawing = { text: 'a'.repeat(70000) }
  const result = buildReviewPrompt({ engineResult: analysis })
  assert.equal(result.truncated, true)
  assert.doesNotThrow(() => JSON.parse(result.prompt.slice(result.prompt.lastIndexOf('\n') + 1)))
})

test('完整资料、启用规则与日志隔离', async () => {
  const analysis = { model: { texts: ['图纸秘密'] }, drawing: {}, checkedRules: ['R01'], findings: [], stats: {}, warnings: [] }
  const ruleSet = { rules: [{ id: 'R01', logic: '启用规则', params: { limit: 8 } }, { id: 'R02', logic: '禁用规则' }] }
  const libraries = { material: { grades: [{ code: '库末尾' }] } }
  const built = buildReviewPrompt({ engineResult: analysis, ruleSet, libraries })
  const data = JSON.parse(built.prompt.split('\n').at(-1))
  assert.deepEqual(data.规则集.规则, [ruleSet.rules[0]])
  assert.deepEqual(data.标准库, libraries)
  const logs = []
  const result = await reviewWithModel({ engine: { generate: async () => { throw new Error('图纸秘密') } }, request: {}, engineResult: analysis, ruleSet, libraries, logger: { error: (...args) => logs.push(args) } })
  assert.equal(result.ok, false)
  assert.doesNotMatch(JSON.stringify(logs), /图纸秘密/)
})

test('超限不调用模型且不使用本地结论作为最终结论', async () => {
  const analysis = { model: { texts: ['图'.repeat(30000)] }, drawing: {}, checkedRules: ['R01'], findings: [{ id: 'x', source: 'engine' }], stats: {}, warnings: [], verdict: { level: 'fail', label: '不符合' } }
  let calls = 0
  const ruleSet = { rules: [{ id: 'R01' }] }
  const result = await reviewWithModel({ engine: { generate: async () => { calls++ } }, request: {}, engineResult: analysis, ruleSet })
  assert.equal(calls, 0)
  assert.equal(result.errorCode, 'PLUGIN_ENGINE_INPUT_INCOMPLETE')
  const merged = mergeModelReview(analysis, result, ruleSet)
  assert.equal(merged.verdict.label, '待确认')
  assert.deepEqual(merged.findings, analysis.findings)
})

test('完整来源的最终复查包含初审结果，超预算则不发送复查', async () => {
  const analysis = { model: {}, drawing: {}, checkedRules: ['R01'], findings: [], stats: {}, warnings: [] }
  const ruleSet = { rules: [{ id: 'R01' }] }
  const calls = []
  const initial = { verdict: '待确认', summary: '初审专属结果', reviewedFindings: [], additionalFindings: [] }
  const engine = { generate: async (request, input) => { calls.push(input); return { text: JSON.stringify({ ...initial, coveredBatchId: JSON.parse(input.prompt.split('\n').at(-1)).批次编号 }) } } }
  const result = await reviewWithModel({ engine, request: {}, engineResult: analysis, ruleSet, rawSources: [{ complete: true, text: '原文' }] })
  assert.equal(result.ok, true)
  assert.equal(calls.length, 2)
  assert.match(calls[1].prompt, /初审专属结果/)
  const oversizedCalls = []
  const oversized = await reviewWithModel({ engine: { generate: async (request, input) => { oversizedCalls.push(input); return { text: JSON.stringify({ ...initial, summary: '大'.repeat(30000), coveredBatchId: JSON.parse(input.prompt.split('\n').at(-1)).批次编号 }) } } }, request: {}, engineResult: analysis, ruleSet, rawSources: [] })
  assert.equal(oversized.ok, false)
  assert.equal(oversized.failedStage, 'finalReview')
  assert.equal(oversizedCalls.length, 1)
  assert.equal(oversized.errorCode, 'PLUGIN_ENGINE_INPUT_INCOMPLETE')
})

test('接近输出上限的有效 JSON 也不能视为完成', async () => {
  const result = await reviewWithModel({
    engine: { generate: async () => ({ text: JSON.stringify({ verdict: '符合', summary: 'a'.repeat(31500), reviewedFindings: [], additionalFindings: [] }) }) },
    request: {}, engineResult: { model: {}, drawing: {}, checkedRules: [], findings: [] }, rawSources: [],
  })
  assert.equal(result.ok, false)
  assert.equal(result.suspectedTruncation, true)
})

test('非 JSON、无效 JSON 与不完整 JSON 分类不同', () => {
  for (const [text, reason] of [['No JSON', 'INVALID_JSON'], ['{"a":}', 'INVALID_JSON'], ['{"a":"未结束', 'TRUNCATED_JSON']]) {
    assert.throws(() => parseModelJson(text), error => error.reason === reason)
  }
})

test('JSON 解析容忍代码块与前后缀', () => {
  assert.deepEqual(parseModelJson('```json\n{"a":1}\n```'), { a: 1 })
  assert.deepEqual(parseModelJson('结论如下：{"a":2} 以上'), { a: 2 })
})


test('纯文本 JSON 模式：两阶段均携带超时', async () => {
  const analysis = analyze()
  const calls = []
  const engine = {
    generate: async (request, input) => {
      calls.push({ format: input.format, timeoutMs: input.timeoutMs, maxOutputChars: input.maxOutputChars })
      return { text: JSON.stringify({ verdict: '符合', summary: '模型复核通过', reviewedFindings: [], additionalFindings: [], coveredBatchId: JSON.parse(input.prompt.split('\n').at(-1)).批次编号 }) }
    },
  }
  const logs = []
  const logger = { info: (...args) => logs.push(args), warn: (...args) => logs.push(args), error: (...args) => logs.push(args) }
  const llmResult = await reviewWithModel({
    engine,
    request: {},
    engineResult: analysis, rawSources: [],
    options: { useLlm: true },
    settings: {},
    logger,
  })
  assert.equal(llmResult.ok, true)
  assert.equal(llmResult.formatMode, 'text')
  assert.equal(calls.length, 2)
  assert.equal(calls[0].format, undefined)
  assert.equal(calls[0].timeoutMs, 120000)
  assert.ok(calls[0].maxOutputChars >= 32000)
  assert.ok(logs.some(entry => String(entry[1]).includes('大模型审查完成')))
})

test('模型输出持续非法时返回可诊断信息', async () => {
  const analysis = analyze()
  const engine = { generate: async () => ({ text: '{"verdict": "符合", "summary": "截断' }) }
  const logs = []
  const logger = { info: (...args) => logs.push(args), warn: (...args) => logs.push(args), error: (...args) => logs.push(args) }
  const llmResult = await reviewWithModel({
    engine,
    request: {},
    engineResult: analysis, rawSources: [],
    options: { useLlm: true },
    settings: {},
    logger,
  })
  assert.equal(llmResult.ok, false)
  assert.equal(llmResult.errorCode, 'PLUGIN_ENGINE_RESPONSE_INVALID')
  assert.match(llmResult.errorDetail, /TRUNCATED_JSON|INVALID_JSON/)
  assert.ok(llmResult.rawLength > 0)
  assert.ok(logs.some(entry => String(entry[1]).includes('大模型审查未完成')))
})
