import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { createLibraryStore } from '../server/library-store.js'
import { analyzeDrawing } from '../server/rules.js'
import { analyzeDxfBuffer } from '../server/analyze.js'
import { parseLibraryFile } from '../server/library-import.js'

const DATA_DIR = process.env.CAD_RULE_TEST_DATA || 'E:/国睿/测试数据'
const SAMPLE = `${DATA_DIR}/GW-2026-001_支架组件_A2.dxf`
const COMPLIANT = `${DATA_DIR}/GW-2026-001_支架组件_A2_合规版.dxf`
const RULE_SET = JSON.parse(readFileSync(new URL('../rules/v1.json', import.meta.url), 'utf8'))

function defaultLibraries() {
  const material = parseLibraryFile(readFileSync(new URL('../libraries/materials-gb.json', import.meta.url)), 'materials.json').library
  const tolerance = parseLibraryFile(readFileSync(new URL('../libraries/tolerances-gb.json', import.meta.url)), 'tolerances.json').library
  return { material, tolerance }
}

test('内置材料库/公差库可解析并包含样例所需条目', () => {
  const { material, tolerance } = defaultLibraries()
  assert.equal(material.type, 'material')
  assert.ok(material.grades.some(grade => grade.code === '45' && grade.legacyAliases.includes('45#')))
  assert.ok(tolerance.fits.some(fit => fit.designation === 'H7/k6'))
  assert.ok(tolerance.letters.includes('H'))
})

test('外部材料库缺失牌号时给出带库版本的 C 类结论', () => {
  const { tolerance } = defaultLibraries()
  const custom = parseLibraryFile(
    Buffer.from(
      JSON.stringify({
        schemaVersion: 1,
        type: 'material',
        id: 'custom-material',
        name: '企业材料库',
        version: '2026.99',
        standard: 'Q/GR 001-2026',
        grades: [{ code: 'Q235', name: '碳素结构钢', standard: 'GB/T 700-2006' }],
      })
    ),
    'custom-material.json'
  ).library
  const result = analyzeDxfBuffer(readFileSync(SAMPLE), {
    fileName: 'sample.dxf',
    useLlm: false,
    libraries: { material: custom, tolerance },
    ruleSet: RULE_SET,
  })
  const finding = result.findings.find(item => item.ruleId === 'R12')
  assert.ok(finding)
  assert.match(finding.title, /未收录/)
  assert.equal(finding.libraryVersion, '2026.99')
  assert.equal(finding.libraryName, '企业材料库')
  assert.equal(result.libraries.material.version, '2026.99')
})

test('外部材料库把 45 标为现行时，45# 仍按旧写法处理', () => {
  const { tolerance } = defaultLibraries()
  const custom = parseLibraryFile(
    Buffer.from(
      JSON.stringify({
        type: 'material',
        id: 'custom-45',
        name: '企业材料库',
        version: 'V2',
        grades: [{ code: '45', name: '优质碳素结构钢', standard: 'GB/T 699-2015', status: 'current' }],
      })
    ),
    'custom-45.json'
  ).library
  const result = analyzeDxfBuffer(readFileSync(SAMPLE), {
    fileName: 'sample.dxf',
    useLlm: false,
    libraries: { material: custom, tolerance },
    ruleSet: RULE_SET,
  })
  const finding = result.findings.find(item => item.ruleId === 'R12' && item.checkpoint === 'D08')
  assert.ok(finding)
  assert.match(finding.title, /旧习惯写法/)
  assert.equal(finding.libraryVersion, 'V2')
})

test('外部公差库缺少配合时给出带库版本的 R09 结论', () => {
  const { material } = defaultLibraries()
  const custom = parseLibraryFile(
    Buffer.from(
      JSON.stringify({
        type: 'tolerance',
        id: 'custom-fit',
        name: '企业公差库',
        version: '2027',
        standard: 'Q/GR 002-2027',
        fits: [{ designation: 'H7/g6', hole: 'H7', shaft: 'g6' }],
        letters: ['H', 'g', 'k'],
        grades: [6, 7],
      })
    ),
    'custom-fit.json'
  ).library
  const result = analyzeDxfBuffer(readFileSync(COMPLIANT), {
    fileName: 'compliant.dxf',
    useLlm: false,
    libraries: { material, tolerance: custom },
    ruleSet: RULE_SET,
  })
  const finding = result.findings.find(item => item.ruleId === 'R09')
  assert.ok(finding)
  assert.match(finding.detail, /不在当前公差库/)
  assert.equal(finding.libraryVersion, '2027')
  assert.equal(finding.libraryName, '企业公差库')
})

test('外部库 ID 不得穿越目录或覆盖索引', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'cad-libraries-'))
  try {
    const store = createLibraryStore({ dataDir: root })
    await store.ensureSeeded()
    const sentinel = path.join(root, 'outside.json')
    await writeFile(sentinel, 'keep')
    for (const id of ['../outside', '..\\outside', 'index', 'a', 'x'.repeat(81), 'CON']) {
      const payload = Buffer.from(JSON.stringify({ type: 'material', id, grades: [{ code: '45' }] }))
      await assert.rejects(store.importLibrary(payload, 'library.json'), { code: 'LIBRARY_ID_INVALID' })
    }
    assert.equal(await readFile(sentinel, 'utf8'), 'keep')
    const imported = await store.importLibrary(Buffer.from(JSON.stringify({
      type: 'material', id: 'MATERIALS-GB', grades: [{ code: '45' }],
    })), 'library.json')
    assert.notEqual(imported.entry.id.toLowerCase(), 'materials-gb')
    assert.equal((await store.getLibrary('materials-gb')).sourceType, 'builtin')
    assert.ok(await store.getLibrary(imported.entry.id))
    const indexPath = path.join(root, 'libraries', 'index.json')
    const index = JSON.parse(await readFile(indexPath, 'utf8'))
    index.push({ id: '../outside', type: 'material', builtin: false })
    await writeFile(indexPath, JSON.stringify(index))
    assert.equal(await store.deleteLibrary('../outside'), false)
    assert.equal(await readFile(sentinel, 'utf8'), 'keep')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('未收录的配合待确认，大小写错误仍为不符合', () => {
  const tolerance = parseLibraryFile(Buffer.from(JSON.stringify({
    type: 'tolerance', id: 'partial', fits: [{ designation: 'H7/g6' }],
  })), 'partial.json').library
  const check = text => analyzeDrawing({
    texts: [{ text, x: 1, y: 1 }], sheet: { format: 'A4', width: 210, height: 297 },
  }, { enabledRules: ['R09'], libraries: { tolerance }, ruleSet: RULE_SET })
  const missing = check('φ20 H7/k6')
  assert.equal(missing.findings[0].conclusion, '待确认')
  assert.equal(missing.verdict.level, 'review')
  assert.equal(check('φ20 H7/g6').findings.length, 0)
  const noLibrary = analyzeDrawing({ texts: [{ text: 'φ20 H7/K6', x: 1, y: 1 }], sheet: { format: 'A4', width: 210, height: 297 } }, { enabledRules: ['R09'], ruleSet: RULE_SET })
  assert.equal(noLibrary.findings[0].conclusion, '不符合')
  const incorrect = check('φ20 H7/K6')
  assert.equal(incorrect.findings[0].conclusion, '不符合')
  assert.equal(incorrect.verdict.level, 'fail')
})

test('CSV 外部库导入', () => {
  const materialCsv = 'code,name,standard,aliases,legacyAliases,status,replacement\n45,优质碳素结构钢,GB/T 699-2015,,45#,current,\nQ235,碳素结构钢,GB/T 700-2006,,,,'
  const material = parseLibraryFile(Buffer.from(materialCsv, 'utf8'), 'materials.csv', 'material').library
  assert.equal(material.type, 'material')
  assert.equal(material.grades.length, 2)
  assert.deepEqual(material.grades[0].legacyAliases, ['45#'])

  const toleranceCsv = 'designation,hole,shaft,type\nH7/k6,H7,k6,transition\nH7/g6,H7,g6,clearance\n'
  const tolerance = parseLibraryFile(Buffer.from(toleranceCsv, 'utf8'), 'fits.csv', 'tolerance').library
  assert.equal(tolerance.type, 'tolerance')
  assert.equal(tolerance.fits.length, 2)
  assert.ok(tolerance.letters.includes('H'))
})
