import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { recognizeDocument } from '../server/ocr.js'

test('损坏的 DOCX 不会被视为 OCR 成功', async () => {
  const result = await recognizeDocument(Buffer.from('invalid'), 'docx')
  assert.equal(result.fragments.length, 0)
  assert.match(result.reason, /限制|Windows/)
})

test('扫描 PDF OCR 保留页码并标记不确定性', async t => {
  if (!process.env.CAD_OCR_TEST_PDF || process.platform !== 'win32') return t.skip('未提供 Windows OCR 测试文件')
  const result = await recognizeDocument(await readFile(process.env.CAD_OCR_TEST_PDF), 'pdf')
  assert.ok(result.fragments.some(item => item.location.type === 'pdf-ocr' && item.location.page === 1 && item.method === 'ocr'))
  assert.match(result.reason, /核对/)
})
