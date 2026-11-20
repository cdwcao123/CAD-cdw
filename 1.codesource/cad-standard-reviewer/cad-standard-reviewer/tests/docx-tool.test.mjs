import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { extractDocxWithTool } from '../server/docx-tool.js'

test('外部 DOCX 工具提取真实规则文档及表格位置', async t => {
  const file = `${process.env.CAD_RULE_TEST_DATA || 'E:/国睿/测试数据'}/二维图样标准化审查规则-V1_20261116.docx`
  const result = await extractDocxWithTool(readFileSync(file), process.env.CAD_REVIEW_DOCX_PYTHON || null)
  assert.ok(result?.fragments.length > 100)
  assert.ok(result.fragments.some(item => item.location.type === 'docx-table' && item.text.includes('图框')))
  assert.match(result.reason, /可能不完整/)
})

test('DOCX 解析器拒绝损坏文件', async () => {
  assert.equal(await extractDocxWithTool(Buffer.from('invalid')), null)
})
