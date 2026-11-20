import { test } from 'node:test'
import assert from 'node:assert/strict'
import { extractSurveyNodes, parseElev, parsePointName } from './nodes.js'

const circle = (x, y = 0) => ({ kind: 'CIRCLE', circle: { x, y, r: 0.5 }, pts: [[x - 0.5, y], [x + 0.5, y]] })
const text = (x, y, value) => ({ x, y, text: value, layer: '0' })

test('编号与高程必须相互靠近', () => {
  const node = extractSurveyNodes([circle(0)], [text(-10, 0, 'A1'), text(10, 0, '+1200.25')]).nodes[0]
  assert.equal(node.name, null)
  assert.equal(node.z, null)
})

test('组合文字和附近另一个编号不能混成标注', () => {
  const node = extractSurveyNodes([circle(0)], [text(1, 0, 'A1 +1200.25'), text(-1, 0, 'B2')]).nodes[0]
  assert.equal(node.name, null)
  assert.equal(node.z, null)
})

test('包含多份编号高程的混合文字不得被忽略后凑成标注', () => {
  const node = extractSurveyNodes([circle(0)], [text(1, 0, 'A1 +1200.25 B2 +1201.25'), text(-1, 0, 'C3 +1202.25')]).nodes[0]
  assert.equal(node.z, null)
  assert.equal(node.elevationAmbiguous, true)
})

test('多份整数高程混合文字须待核', () => {
  const node = extractSurveyNodes([circle(0)], [text(1, 0, 'A1 +1200 B2 +1201'), text(-1, 0, 'C3 +1202')]).nodes[0]
  assert.equal(node.z, null)
  assert.equal(node.elevationAmbiguous, true)
})

test('一个编号和两个整数高程的混合文字阻止附近候选并保留冲突信息', () => {
  const mixed = text(1, 0, 'A1 +1200 1201')
  const node = extractSurveyNodes([circle(0)], [mixed, text(-1, 0, 'B2 +1202')]).nodes[0]
  assert.equal(node.z, null)
  assert.equal(node.name, null)
  assert.equal(node.elevationAmbiguous, true)
  assert.deepEqual(node.mixedTexts, [mixed])
})

test('分离的编号和标高可位于圆圈任意方向', () => {
  const node = extractSurveyNodes([circle(0)], [text(0, -2, 'A1'), text(2, 0, '+1200.25底板')]).nodes[0]
  assert.deepEqual([node.name, node.z, node.elevationSuffix], ['A1', 1200.25, '底板'])
})

test('一个编号被两个圆圈等距竞争时不重复使用', () => {
  const nodes = extractSurveyNodes([circle(0), circle(4)], [text(0, 1, '+1200.25'), text(4, 1, '+1201.25'), text(2, 0, 'A1')]).nodes
  assert.deepEqual(nodes.map(n => n.name), [null, null])
  assert.ok(nodes.every(n => n.nameAmbiguous))
})

test('高程在前的组合文字允许编号与后缀', () => {
  assert.equal(parseElev('+1201.5 B2（底）'), 1201.5)
  assert.equal(parsePointName('+1201.5 B2（底）'), 'B2')
})

test('同一高程文字被两个圆圈等距竞争时不应分配', () => {
  const { nodes } = extractSurveyNodes([circle(0), circle(2)], [text(1, 0, 'A1 +1200.25')])
  assert.deepEqual(nodes.map(n => [n.name, n.z]), [[null, null], [null, null]])
  assert.ok(nodes.every(n => n.elevationAmbiguous))
})
