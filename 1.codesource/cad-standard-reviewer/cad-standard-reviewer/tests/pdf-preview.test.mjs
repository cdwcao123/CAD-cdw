import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { previewPdf } from '../server/pdf-preview.js'

test('PDF 提取真实样本的页面文字并说明覆盖限制', async () => {
  const file = `${process.env.CAD_RULE_TEST_DATA || 'E:/国睿/测试数据'}/GW-2026-001_支架组件_A2.pdf`
  const result = await previewPdf(readFileSync(file))
  assert.ok(result.fragments.length > 0, result.reason)
  assert.equal(result.fragments[0].location.page, 1)
  assert.match(result.reason, /可能不完整/)
})

test('无效 PDF 和缺失运行时给出失败原因', async () => {
  assert.equal((await previewPdf(Buffer.from('invalid'))).fragments.length, 0)
  assert.match((await previewPdf(Buffer.from('x'), 'missing-cad-python-executable')).reason, /不可用或版本低于 3\.10/)
})
