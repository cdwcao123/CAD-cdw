import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { decodeDxfBuffer, parseDxf } from '../server/dxf.js'

const DATA_DIR = process.env.CAD_RULE_TEST_DATA || 'E:/国睿/测试数据'
const SAMPLE = `${DATA_DIR}/GW-2026-001_支架组件_A2.dxf`
const COMPLIANT = `${DATA_DIR}/GW-2026-001_支架组件_A2_合规版.dxf`

function load(file) {
  const buffer = readFileSync(file)
  const decoded = decodeDxfBuffer(buffer)
  return parseDxf(decoded.text)
}

test('DXF 解析：图幅、图层与文字', () => {
  const doc = load(SAMPLE)
  assert.equal(Math.round(doc.bbox.width), 594)
  assert.equal(Math.round(doc.bbox.height), 420)
  const layers = new Map(doc.layers.map(layer => [layer.name, layer]))
  assert.equal(layers.get('OUTLINE').lineweight, 0.5)
  assert.equal(layers.get('THIN').lineweight, 0.13)
  const texts = doc.entities.filter(entity => entity.type === 'TEXT')
  assert.ok(texts.some(entity => entity.text === '支架组件'))
  assert.ok(texts.some(entity => entity.text === '45#'))
  assert.ok(doc.entities.some(entity => entity.type === 'CIRCLE' && Math.abs(entity.radius - 20) < 0.01))
})

test('DXF 解析：两版图纸图元数量', () => {
  assert.equal(load(SAMPLE).entities.length, 383)
  assert.equal(load(COMPLIANT).entities.length, 399)
})
