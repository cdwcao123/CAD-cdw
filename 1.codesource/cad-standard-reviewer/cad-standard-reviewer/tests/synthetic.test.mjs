import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { analyzeDxfBuffer } from '../server/analyze.js'
import { normalizeRuleSet } from '../server/rule-import.js'
import { parseLibraryFile } from '../server/library-import.js'

const RULE_SET = normalizeRuleSet(JSON.parse(readFileSync(new URL('../rules/v1.json', import.meta.url), 'utf8')), { sourceType: 'test', fileName: 'v1.json' })
const LIBRARIES = {
  material: parseLibraryFile(readFileSync(new URL('../libraries/materials-gb.json', import.meta.url)), 'materials.json').library,
  tolerance: parseLibraryFile(readFileSync(new URL('../libraries/tolerances-gb.json', import.meta.url)), 'tolerances.json').library,
}

// 构造一份包含 INSERT 标题栏与原生 DIMENSION 实体的最小 DXF，验证真实 CAD 常见结构。
function g(code, value) {
  return `${code}\n${value}`
}

function buildDxf() {
  const lines = []
  const add = (...pairs) => lines.push(...pairs)

  add(g(0, 'SECTION'), g(2, 'HEADER'), g(9, '$ACADVER'), g(1, 'AC1032'), g(0, 'ENDSEC'))
  add(g(0, 'SECTION'), g(2, 'TABLES'))
  add(g(0, 'TABLE'), g(2, 'LAYER'), g(70, 4))
  for (const [name, weight] of [['0', 25], ['FRAME', 70], ['OUTLINE', 50], ['THIN', 13], ['DIM', 13], ['TITLE', 25]]) {
    add(g(0, 'LAYER'), g(2, name), g(70, 0), g(62, 7), g(6, 'CONTINUOUS'), g(370, weight))
  }
  add(g(0, 'ENDTAB'), g(0, 'ENDSEC'))

  add(g(0, 'SECTION'), g(2, 'BLOCKS'))
  add(g(0, 'BLOCK'), g(8, '0'), g(2, 'TITLE'), g(70, 0), g(10, 0), g(20, 0), g(30, 0), g(3, 'TITLE'), g(1, ''))
  add(
    g(0, 'LWPOLYLINE'), g(8, '0'), g(90, 4), g(70, 1),
    g(10, 0), g(20, 0), g(10, 180), g(20, 0), g(10, 180), g(20, 56), g(10, 0), g(20, 56)
  )
  const texts = [
    ['支架组件', 5, 135, 36],
    ['GW-2026-001', 5, 135, 24],
    ['ZL114A  GB/T 1173-2013', 3, 135, 12],
    ['比例 1:2', 3, 64, 11],
    ['设计', 3.5, 3, 50],
    ['张伟', 3, 19, 50],
    ['审核', 3.5, 3, 42],
    ['李强', 3, 19, 42],
    ['工艺', 3.5, 3, 34],
    ['王磊', 3, 19, 34],
    ['标准化', 3.5, 3, 26],
    ['赵敏', 3, 19, 26],
    ['批准', 3.5, 3, 18],
    ['陈刚', 3, 19, 18],
    ['版次 A', 3, 100, 4],
    ['共 1 张 第 1 张', 3, 160, 4],
    ['阶段标记', 2.5, 2, 11],
    ['S', 2.5, 12, 11],
  ]
  for (const [text, height, x, y] of texts) {
    add(g(0, 'TEXT'), g(8, '0'), g(1, text), g(10, x), g(20, y), g(40, height))
  }
  add(g(0, 'ENDBLK'), g(0, 'ENDSEC'))

  add(g(0, 'SECTION'), g(2, 'ENTITIES'))
  // 图纸外框 + 图框（左 25，其余 5）
  add(g(0, 'LWPOLYLINE'), g(8, 'THIN'), g(90, 4), g(70, 1), g(10, 0), g(20, 0), g(10, 594), g(20, 0), g(10, 594), g(20, 420), g(10, 0), g(20, 420))
  add(g(0, 'LWPOLYLINE'), g(8, 'FRAME'), g(90, 4), g(70, 1), g(10, 25), g(20, 5), g(10, 589), g(20, 5), g(10, 589), g(20, 415), g(10, 25), g(20, 415))
  // 零件轮廓
  add(g(0, 'LWPOLYLINE'), g(8, 'OUTLINE'), g(90, 4), g(70, 1), g(10, 100), g(20, 100), g(10, 300), g(20, 100), g(10, 300), g(20, 260), g(10, 100), g(20, 260))
  // 标题栏块引用
  add(g(0, 'INSERT'), g(8, 'TITLE'), g(2, 'TITLE'), g(10, 409), g(20, 5))
  // 原生线性标注：图上绘制 100，标注文字 200，标题栏比例 1:2
  add(
    g(0, 'DIMENSION'), g(8, 'DIM'), g(2, ''), g(70, 0),
    g(10, 150), g(20, 200), g(11, 150), g(21, 205),
    g(13, 100), g(23, 200), g(14, 200), g(24, 200),
    g(50, 0), g(1, '200'), g(42, 100)
  )
  add(g(0, 'ENDSEC'), g(0, 'EOF'))
  return lines.join('\n')
}

test('真实结构：INSERT 标题栏与原生 DIMENSION 可被识别并参与 R03', () => {
  const buffer = Buffer.from(buildDxf(), 'utf8')
  const result = analyzeDxfBuffer(buffer, { fileName: 'synthetic.dxf', useLlm: false, ruleSet: RULE_SET, libraries: LIBRARIES })
  assert.equal(result.drawing.sheet, 'A2')
  assert.equal(result.drawing.fcfCount, 0)
  assert.ok(result.findings.some(item => item.ruleId === 'R03'), '应检出比例不一致')
  assert.ok(!result.findings.some(item => item.ruleId === 'R01'), '图框边距正确时不应误报')
  const r03 = result.findings.find(item => item.ruleId === 'R03')
  assert.match(r03.title, /1:2/)
  assert.match(r03.measured, /2:1/)
})
