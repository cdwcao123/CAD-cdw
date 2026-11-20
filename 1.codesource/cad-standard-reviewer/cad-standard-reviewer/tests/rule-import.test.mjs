import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { analyzeDxfBuffer } from '../server/analyze.js'
import { parseRuleFile, BUILTIN_RULE_SET } from '../server/rule-import.js'

const DATA_DIR = process.env.CAD_RULE_TEST_DATA || 'E:/国睿/测试数据'
const DOCX = `${DATA_DIR}/二维图样标准化审查规则-V1_20261116.docx`
const SAMPLE = `${DATA_DIR}/GW-2026-001_支架组件_A2.dxf`
const COMPLIANT = `${DATA_DIR}/GW-2026-001_支架组件_A2_合规版.dxf`

test('DOCX 规则文档解析：12 条规则、22 个检查点、类别与例外', () => {
  const { ruleSet, warnings } = parseRuleFile(readFileSync(DOCX), '二维图样标准化审查规则-V1_20261116.docx')
  assert.equal(ruleSet.rules.length, 12)
  assert.equal(ruleSet.checkpoints.length, 22)
  assert.equal(warnings.length, 12)
  assert.equal(ruleSet.version, 'V1')
  assert.match(ruleSet.name, /二维图样标准化审查规则/)
  const r04 = ruleSet.rules.find(rule => rule.id === 'R04')
  assert.equal(r04.ruleClass, 'B')
  assert.equal(r04.checkType, 'llmOnly')
  assert.deepEqual(r04.checkpoints.map(item => item.id), ['D09', 'D10', 'D11'])
  assert.ok(r04.exceptions.length >= 1)
  const r12 = ruleSet.rules.find(rule => rule.id === 'R12')
  assert.equal(r12.ruleClass, 'C')
  assert.equal(r12.checkType, 'llmOnly')
})

test('未经可靠匹配的 DOCX 规则不触发本地检查', () => {
  const { ruleSet } = parseRuleFile(readFileSync(DOCX), 'rules.docx')
  for (const [file, expected] of [[SAMPLE, 0], [COMPLIANT, 0]]) {
    const result = analyzeDxfBuffer(readFileSync(file), { fileName: file, useLlm: false, ruleSet })
    assert.equal(result.findings.length, expected)
    assert.equal(result.stats.checkpoints.total, 22)
  }
})

test('JSON 规则包：自定义阈值与检查点生效', () => {
  const custom = {
    schemaVersion: 1,
    id: 'custom-frame',
    name: '企业图框规则',
    version: 'V2',
    rules: [
      {
        id: 'R01',
        name: '图框边距（企业版）',
        ruleClass: 'A',
        severity: '关键',
        standard: 'Q/GR 001-2026',
        checkType: 'frameMargin',
        params: { bindingLeft: 30, bindingOthers: 5, noBinding: 10, toleranceMm: 1 },
        checkpoints: [{ id: 'D01', defect: '左侧装订边不足', severity: '关键' }],
        enabled: true,
      },
    ],
  }
  const { ruleSet } = parseRuleFile(Buffer.from(JSON.stringify(custom)), 'custom.json')
  const result = analyzeDxfBuffer(readFileSync(SAMPLE), { fileName: 'sample.dxf', useLlm: false, ruleSet })
  assert.equal(result.findings.length, 1)
  const finding = result.findings[0]
  assert.equal(finding.ruleId, 'R01')
  assert.equal(finding.checkpoint, 'D01')
  assert.equal(finding.severity, '关键')
  assert.match(finding.title, /15 mm/)
  assert.match(finding.expected, /30 mm/)
  assert.equal(finding.basis, 'Q/GR 001-2026')
})

test('Markdown 规则表解析', () => {
  const markdown = `# 企业二维图样审查规则 V2

| 规则编号 | 规则名称与适用要素 | 判定逻辑 | 标准依据 | 严重级 | 可机检 |
| --- | --- | --- | --- | --- | --- |
| R01 | 图框边距 | 左侧应为 25 mm | GB/T 14689-2008 | 一般 | 能 |
| R06 | 字体与字高 | 名称不小于 5 号 | GB/T 14691-1993 | 一般 | 能 |

| 适用规则 | 例外情形 | 处理方式 |
| --- | --- | --- |
| R01 | 不留装订边 | 按 10 mm |
`
  const { ruleSet } = parseRuleFile(Buffer.from(markdown, 'utf8'), 'rules.md')
  assert.equal(ruleSet.rules.length, 2)
  assert.equal(ruleSet.rules[0].checkType, 'llmOnly')
  assert.equal(ruleSet.rules[1].checkType, 'llmOnly')
  assert.equal(ruleSet.rules[0].exceptions.length, 1)
  assert.match(ruleSet.name, /企业二维图样审查规则/)
})

test('已知规则指定无效检查类型时不得静默使用内置检查', () => {
  const data = { rules: [{ id: 'R01', checkType: 'frameMargn' }] }
  const { ruleSet, warnings } = parseRuleFile(Buffer.from(JSON.stringify(data)), 'rules.json')
  assert.equal(ruleSet.rules[0].checkType, 'llmOnly')
  assert.ok(warnings.some(warning => warning.includes('frameMargn')))
})

test('同编号自定义规则不会继承内置语义', () => {
  const data = { rules: [{ id: 'R01', name: '自定义颜色', logic: '图层必须为红色' }] }
  const { ruleSet, warnings } = parseRuleFile(Buffer.from(JSON.stringify(data)), 'custom.json')
  const rule = ruleSet.rules[0]
  assert.equal(rule.checkType, 'llmOnly')
  assert.equal(rule.name, '自定义颜色')
  assert.equal(rule.logic, '图层必须为红色')
  assert.deepEqual(rule.params, {})
  assert.deepEqual(rule.checkpoints, [])
  assert.ok(warnings.some(warning => warning.includes('R01')))
})

test('上传规则不继承内置规则，显式类型仍受支持', () => {
  const builtin = BUILTIN_RULE_SET.rules[0]
  const data = { rules: [
    { id: builtin.id, name: builtin.name, logic: builtin.logic },
    { id: 'R02', name: '自定义', checkType: 'frameMargin' },
  ] }
  const { ruleSet } = parseRuleFile(Buffer.from(JSON.stringify(data)), 'rules.json')
  assert.equal(ruleSet.rules[0].checkType, 'llmOnly')
  assert.deepEqual(ruleSet.rules[0].params, {})
  assert.equal(ruleSet.rules[1].checkType, 'frameMargin')
  assert.deepEqual(ruleSet.rules[1].params, {})
})

test('表格中同名但不同判定逻辑的规则不自动绑定', () => {
  const markdown = `| 规则编号 | 规则名称 | 判定逻辑 |
| --- | --- | --- |
| R01 | 图框边距 | 左侧应为 30 mm |`
  const { ruleSet, warnings } = parseRuleFile(Buffer.from(markdown), 'custom.md')
  assert.equal(ruleSet.rules[0].name, '图框边距')
  assert.equal(ruleSet.rules[0].checkType, 'llmOnly')
  assert.deepEqual(ruleSet.rules[0].checkpoints, [])
  assert.ok(warnings.some(warning => warning.includes('R01')))
})

test('无效规则文件给出明确错误', () => {
  assert.throws(() => parseRuleFile(Buffer.from('not json'), 'bad.json'), /JSON 解析失败/)
  assert.throws(() => parseRuleFile(Buffer.from('abc'), 'bad.pdf'), /仅支持/)
  assert.throws(() => parseRuleFile(Buffer.from('{"rules":[]}'), 'empty.json'), /缺少 rules/)
})
