import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { analyzeDxfBuffer } from '../server/analyze.js'
import { normalizeRuleSet } from '../server/rule-import.js'
import { parseLibraryFile } from '../server/library-import.js'

const DIR = process.env.CAD_RULE_TEST_DATA || 'E:/国睿/测试数据'
const SAMPLE = `${DIR}/GW-2026-001_支架组件_A2.dxf`
const COMPLIANT = `${DIR}/GW-2026-001_支架组件_A2_合规版.dxf`
const RULE_SET = normalizeRuleSet(JSON.parse(readFileSync(new URL('../rules/v1.json', import.meta.url), 'utf8')), { sourceType: 'test', fileName: 'v1.json' })
const LIBRARIES = {
  material: parseLibraryFile(readFileSync(new URL('../libraries/materials-gb.json', import.meta.url)), 'materials.json').library,
  tolerance: parseLibraryFile(readFileSync(new URL('../libraries/tolerances-gb.json', import.meta.url)), 'tolerances.json').library,
}

function analyze(file) {
  return analyzeDxfBuffer(readFileSync(file), { fileName: file.split(/[\\/]/).pop(), useLlm: false, maxEvidenceTexts: 20, ruleSet: RULE_SET, libraries: LIBRARIES })
}

test('审查样本：22 个检查点全部命中', () => {
  const result = analyze(SAMPLE)
  assert.equal(result.findings.length, 22)
  const hit = new Set(result.findings.map(item => item.checkpoint).filter(Boolean))
  const expected = RULE_SET.checkpoints.map(item => item.id)
  for (const checkpoint of expected) {
    assert.ok(hit.has(checkpoint), `缺少检查点 ${checkpoint}`)
  }
  assert.equal(hit.size, 22)
  assert.equal(result.verdict.label, '不符合')
  assert.equal(result.stats.bySeverity['关键'], 6)
  assert.equal(result.stats.bySeverity['严重'], 8)
  assert.equal(result.stats.bySeverity['一般'], 8)
})

test('合规版：0 命中', () => {
  const result = analyze(COMPLIANT)
  assert.equal(result.findings.length, 0)
  assert.equal(result.verdict.label, '符合')
  assert.equal(result.stats.total, 0)
})

test('问题卡包含七项必需字段', () => {
  const result = analyze(SAMPLE)
  for (const item of result.findings) {
    assert.ok(item.ruleId, '缺规则编号')
    assert.ok(item.location && typeof item.location.x === 'number', '缺命中位置')
    assert.ok(item.measured && item.measured !== '—', `缺实测值：${item.title}`)
    assert.ok(item.expected && item.expected !== '—', `缺标准值：${item.title}`)
    assert.ok(item.basis, '缺依据条款')
    assert.ok(item.severity, '缺严重级')
    assert.ok(item.suggestion, '缺修改建议')
  }
})

test('只启用的规则参与判定', () => {
  const result = analyzeDxfBuffer(readFileSync(SAMPLE), {
    fileName: 'sample.dxf',
    useLlm: false,
    enabledRules: ['R01', 'R06'],
    maxEvidenceTexts: 10,
    ruleSet: RULE_SET,
    libraries: LIBRARIES,
  })
  assert.ok(result.findings.length > 0)
  assert.ok(result.findings.every(item => ['R01', 'R06'].includes(item.ruleId)))
  assert.deepEqual(result.skippedRules.sort(), RULE_SET.rules.map(rule => rule.id).filter(id => !['R01', 'R06'].includes(id)).sort())
})
