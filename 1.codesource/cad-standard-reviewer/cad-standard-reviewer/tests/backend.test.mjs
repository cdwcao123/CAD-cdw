import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createRuleStore } from '../server/rule-store.js'
import { createLibraryStore } from '../server/library-store.js'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { gzipSync } from 'node:zlib'
import { createHash } from 'node:crypto'
import { register, unregister } from '../server.js'

const DATA_DIR = process.env.CAD_RULE_TEST_DATA || 'E:/国睿/测试数据'
const SAMPLE = `${DATA_DIR}/GW-2026-001_支架组件_A2.dxf`
const COMPLIANT = `${DATA_DIR}/GW-2026-001_支架组件_A2_合规版.dxf`
const RULE_DOCX = `${DATA_DIR}/二维图样标准化审查规则-V1_20261116.docx`
const GENERIC_RULE_DOCX = process.env.CAD_GENERIC_RULE_DOCX || 'E:/kuangshan/CAD-cdw/3.document/国睿测试数据/评审文档样例/samples/test_correct.docx'
const CHUNK = 30 * 1024

function createHarness(engine) {
  const routes = new Map()
  const logs = []
  const add = method => (pattern, handler) => routes.set(`${method} ${pattern}`, handler)
  const router = {
    get: add('GET'),
    post: add('POST'),
    put: add('PUT'),
    delete: add('DELETE'),
    patch: add('PATCH'),
    registerRoute: (method, pattern, handler) => routes.set(`${method} ${pattern}`, handler),
    log: {
      trace: (...args) => logs.push(['trace', ...args]),
      debug: (...args) => logs.push(['debug', ...args]),
      info: (...args) => logs.push(['info', ...args]),
      warn: (...args) => logs.push(['warn', ...args]),
      error: (...args) => logs.push(['error', ...args]),
    },
  }
  const dataDir = mkdtempSync(path.join(tmpdir(), 'cad-reviewer-'))
  const ctx = { id: 'cad-standard-reviewer', dataDir, engine, allowBuiltinTestFixtures: true }
  return { routes, logs, router, ctx, dataDir }
}

function match(pattern, pathname) {
  const a = pattern.split('/')
  const b = pathname.split('/')
  if (a.length !== b.length) return null
  const params = {}
  for (let i = 0; i < a.length; i += 1) {
    if (a[i].startsWith(':')) params[a[i].slice(1)] = decodeURIComponent(b[i])
    else if (a[i] !== b[i]) return null
  }
  return params
}

async function invoke(harness, method, pathname, { body, query } = {}) {
  let matched = null
  for (const [key, handler] of harness.routes) {
    const [routeMethod, pattern] = key.split(' ')
    if (routeMethod !== method) continue
    const params = match(pattern, pathname)
    if (params) {
      matched = { handler, params }
      break
    }
  }
  assert.ok(matched, `未注册路由 ${method} ${pathname}`)
  const reply = {
    statusCode: 200,
    payload: undefined,
    status(code) {
      this.statusCode = code
      return this
    },
    send(payload) {
      this.payload = payload
      return this
    },
  }
  const result = await matched.handler({ body, query: query || {}, params: matched.params, headers: {} }, reply)
  return { status: reply.statusCode, payload: reply.payload ?? result }
}

test('集合拒绝未在规则库或标准库上传的独立资料', async () => {
  const harness = createHarness()
  await register(harness.router, harness.ctx)
  try {
    const { sourceId: ruleSourceId } = await prepareCompleteSources(harness)
    const ruleFile = (await invoke(harness, 'GET', '/rule-files')).payload.files.find(item => item.sourceId === ruleSourceId)
    const uploaded = await invoke(harness, 'POST', '/sources', { body: { fileName: 'extra.txt', contentBase64: Buffer.from('独立资料').toString('base64') } })
    const response = await invoke(harness, 'POST', '/standard-collections', { body: { name: '集合', rules: [{ fileId: ruleFile.id, ruleId: 'R13' }], sourceIds: [uploaded.payload.source.id] } })
    assert.equal(response.status, 404)
    assert.match(response.payload.error.message, /规则库或标准库/)
  } finally { await unregister(); rmSync(harness.dataDir, { recursive: true, force: true }) }
})

test('未模型校准的结构化标准库可固定到集合并调用模型', async () => {
  const harness = createHarness()
  await register(harness.router, harness.ctx)
  try {
    const { sourceId } = await prepareCompleteSources(harness)
    const rule = (await invoke(harness, 'GET', '/rule-files')).payload.files.find(item => item.sourceId === sourceId)
    const csv = Buffer.from('designation,hole,shaft,type\nH7/g6,H7,g6,clearance\n')
    const library = await invoke(harness, 'POST', '/libraries', { body: { fileName: 'fits.csv', contentBase64: csv.toString('base64'), libraryType: 'tolerance' } })
    assert.equal(library.payload.ok, true)
    const created = await invoke(harness, 'POST', '/standard-collections', { body: { name: '集合', rules: [{ fileId: rule.id, ruleId: 'R13' }], sourceIds: [library.payload.entry.sourceId] } })
    assert.equal(created.status, 200, JSON.stringify(created.payload))
    const collectionPath = path.join(harness.dataDir, 'standard-collections', `${created.payload.collection.id}.json`)
    const saved = JSON.parse(readFileSync(collectionPath, 'utf8'))
    for (const snapshot of saved.versions[0].sourceSnapshots) snapshot.extraction.reason = '旧版本解析器元数据'
    const { sha256: _oldHash, ...content } = saved.versions[0]
    saved.versions[0].sha256 = createHash('sha256').update(JSON.stringify(content)).digest('hex')
    writeFileSync(collectionPath, JSON.stringify(saved, null, 2))
    harness.ctx.engine = { generate: async (request, input) => {
      const batch = JSON.parse(input.prompt.split('\n').at(-1))
      return { text: JSON.stringify({ verdict: '待确认', summary: '完成', reviewedFindings: [], additionalFindings: [], coveredBatchId: batch.批次编号 }) }
    } }
    const result = await invoke(harness, 'POST', '/review', { body: { collectionId: created.payload.collection.id, collectionVersion: 1, contentBase64: SMALL_DXF.toString('base64') } })
    assert.equal(result.status, 200, JSON.stringify(result.payload))
    assert.equal(result.payload.result.llm.ok, true)
  } finally { await unregister(); rmSync(harness.dataDir, { recursive: true, force: true }) }
})

test('标准文档可上传并固定到集合供模型审查', async () => {
  const calls = []
  const harness = createHarness({ generate: async (request, input) => {
    calls.push(input.prompt)
    const batch = JSON.parse(input.prompt.split('\n').at(-1))
    return { text: JSON.stringify({ verdict: '待确认', summary: '完成', reviewedFindings: [], additionalFindings: [], coveredBatchId: batch.批次编号 }) }
  } })
  await register(harness.router, harness.ctx)
  try {
    const { sourceId } = await prepareCompleteSources(harness)
    const rule = (await invoke(harness, 'GET', '/rule-files')).payload.files.find(item => item.sourceId === sourceId)
    const document = await invoke(harness, 'POST', '/libraries', { body: { fileName: 'standard.md', contentBase64: Buffer.from('STANDARD_REFERENCE_MARKER').toString('base64') } })
    assert.equal(document.payload.ok, true, JSON.stringify(document.payload))
    assert.equal(document.payload.entry.type, 'reference')
    const created = await invoke(harness, 'POST', '/standard-collections', { body: { name: '标准文档集合', rules: [{ fileId: rule.id, ruleId: 'R13' }], sourceIds: [document.payload.entry.sourceId] } })
    assert.equal(created.status, 200, JSON.stringify(created.payload))
    calls.length = 0
    const reviewed = await invoke(harness, 'POST', '/review', { body: { collectionId: created.payload.collection.id, collectionVersion: 1, contentBase64: SMALL_DXF.toString('base64') } })
    assert.equal(reviewed.status, 200, JSON.stringify(reviewed.payload))
    assert.equal(reviewed.payload.result.llm.ok, true)
    assert.ok(calls.some(value => value.includes('STANDARD_REFERENCE_MARKER')))
  } finally { await unregister(); rmSync(harness.dataDir, { recursive: true, force: true }) }
})

test('YAML 标准库可查看正文、保存新版本并独立加入集合', async () => {
  const calls = []
  const harness = createHarness({ generate: async (request, input) => {
    calls.push(input.prompt)
    const batch = JSON.parse(input.prompt.split('\n').at(-1))
    return { text: JSON.stringify({ verdict: '待确认', summary: '完成', reviewedFindings: [], additionalFindings: [], coveredBatchId: batch.批次编号 }) }
  } })
  await register(harness.router, harness.ctx)
  try {
    const { sourceId } = await prepareCompleteSources(harness)
    const rule = (await invoke(harness, 'GET', '/rule-files')).payload.files.find(item => item.sourceId === sourceId)
    const library = await invoke(harness, 'POST', '/libraries', { body: { fileName: 'standard.yaml', contentBase64: Buffer.from('standard: YAML_FIRST_VERSION\nunit: mm\n').toString('base64') } })
    assert.equal(library.status, 200, JSON.stringify(library.payload))
    assert.equal(library.payload.entry.type, 'reference')
    const librarySourceId = library.payload.entry.sourceId
    const source = await invoke(harness, 'GET', `/sources/${librarySourceId}`)
    assert.equal(source.payload.source.originalExtraction.text, 'standard: YAML_FIRST_VERSION\nunit: mm\n')
    const originalBeforeEdit = readFileSync(path.join(harness.dataDir, 'sources', librarySourceId, 'original'))
    await invoke(harness, 'PUT', `/sources/${librarySourceId}/edit`, { body: { extraction: { text: 'standard: YAML_SECOND_VERSION\nunit: mm\n' } } })
    assert.deepEqual(readFileSync(path.join(harness.dataDir, 'sources', librarySourceId, 'original')), originalBeforeEdit)
    const created = await invoke(harness, 'POST', '/standard-collections', { body: { name: 'YAML规则集合', rules: [{ fileId: rule.id, ruleId: 'R13' }], sourceIds: [librarySourceId] } })
    assert.equal(created.status, 200, JSON.stringify(created.payload))
    const version = created.payload.collection.versions[0]
    assert.deepEqual(version.standardSourceIds, [librarySourceId])
    assert.ok(version.sourceIds.includes(sourceId))
    assert.ok(version.sourceIds.includes(librarySourceId))
    calls.length = 0
    const reviewed = await invoke(harness, 'POST', '/review', { body: { collectionId: created.payload.collection.id, collectionVersion: 1, contentBase64: SMALL_DXF.toString('base64') } })
    assert.equal(reviewed.status, 200, JSON.stringify(reviewed.payload))
    assert.ok(calls.some(prompt => prompt.includes('YAML_SECOND_VERSION')))
  } finally { await unregister(); rmSync(harness.dataDir, { recursive: true, force: true }) }
})

test('扫描 PDF 规则和补充资料固定识别片段并参与集合审查', async t => {
  if (!process.env.CAD_OCR_TEST_PDF || process.platform !== 'win32') return t.skip('未提供 Windows OCR 测试文件')
  const calls = []
  const harness = createHarness({ generate: async (request, input) => {
    calls.push(input.prompt)
    const batch = JSON.parse(input.prompt.split('\n').at(-1))
    return { text: JSON.stringify({ verdict: '符合', summary: '局部审查', reviewedFindings: [], additionalFindings: [], coveredBatchId: batch.批次编号 }) }
  } })
  delete harness.ctx.allowBuiltinTestFixtures
  await register(harness.router, harness.ctx)
  try {
    const pdf = readFileSync(process.env.CAD_OCR_TEST_PDF).toString('base64')
    const imported = await invoke(harness, 'POST', '/rule-files', { body: { fileName: 'rules.pdf', contentBase64: pdf } })
    assert.equal(imported.status, 200, JSON.stringify(imported.payload))
    const file = imported.payload.entry
    const detail = await invoke(harness, 'GET', `/rule-files/${file.id}`)
    assert.equal(detail.payload.ruleSet.sourceType, 'pdf')
    assert.ok(detail.payload.ruleSet.documentPreview.fragments.some(item => item.location.type === 'pdf-ocr'))
    const globalReview = await invoke(harness, 'POST', '/review', { body: { contentBase64: SMALL_DXF.toString('base64') } })
    assert.equal(globalReview.payload.result.llm.ok, true)
    assert.equal(globalReview.payload.result.verdict.label, '待确认')
    const extra = await invoke(harness, 'POST', '/libraries', { body: { fileName: 'reference.pdf', contentBase64: pdf } })
    const created = await invoke(harness, 'POST', '/standard-collections', { body: { name: '扫描件集合', rules: detail.payload.ruleSet.rules.map(item => ({ fileId: file.id, ruleId: item.id })), sourceIds: [extra.payload.entry.sourceId] } })
    assert.equal(created.status, 200, JSON.stringify(created.payload))
    const version = created.payload.collection.versions[0]
    assert.ok(version.sourceSnapshots.every(item => (item.documentPreview || item.pdfPreview)?.fragments?.length))
    writeFileSync(path.join(harness.dataDir, 'sources', file.sourceId, 'original'), 'changed after snapshot')
    writeFileSync(path.join(harness.dataDir, 'sources', extra.payload.entry.sourceId, 'original'), 'changed after snapshot')
    calls.length = 0
    const result = await invoke(harness, 'POST', '/review', { body: { collectionId: created.payload.collection.id, collectionVersion: 1, contentBase64: SMALL_DXF.toString('base64') } })
    assert.equal(result.status, 200, JSON.stringify(result.payload))
    assert.equal(result.payload.result.llm.ok, true)
    assert.equal(result.payload.result.verdict.label, '待确认')
    const record = await invoke(harness, 'GET', `/reviews/${result.payload.reviewId}`)
    assert.equal(record.payload.review.modelSources.filter(item => item.partial && item.fragments?.some(fragment => fragment.location.type === 'pdf-ocr')).length, 2)
    assert.ok(calls.some(prompt => prompt.includes('pdf-ocr')))
  } finally { await unregister(); rmSync(harness.dataDir, { recursive: true, force: true }) }
})

test('不完整 DOCX 的可验证片段可用于保守审查', async () => {
  let calls = 0
  const harness = createHarness({ generate: async (request, input) => {
    calls++
    const batch = JSON.parse(input.prompt.split('\n').at(-1))
    return { text: JSON.stringify({ verdict: '符合', summary: '局部审查', reviewedFindings: [], additionalFindings: [], coveredBatchId: batch.批次编号 }) }
  } })
  delete harness.ctx.allowBuiltinTestFixtures
  await register(harness.router, harness.ctx)
  try {
    const rule = await invoke(harness, 'POST', '/rule-files', { body: { fileName: 'rules.docx', contentBase64: readFileSync(RULE_DOCX).toString('base64') } })
    assert.equal(rule.payload.ok, true)
    const sourceId = rule.payload.entry.sourceId
    const original = readFileSync(path.join(harness.dataDir, 'sources', sourceId, 'original'))
    const edit = await invoke(harness, 'PUT', `/sources/${sourceId}/edit`, { body: { extraction: { text: '人工修订内容' } } })
    assert.equal(edit.payload.ok, true)
    assert.equal(edit.payload.source.history.at(-1).data.text, '人工修订内容')
    assert.deepEqual(readFileSync(path.join(harness.dataDir, 'sources', sourceId, 'original')), original)
    calls = 0
    const review = await invoke(harness, 'POST', '/review', { body: { contentBase64: SMALL_DXF.toString('base64') } })
    assert.equal(review.status, 200, JSON.stringify(review.payload))
    assert.ok(calls > 0)
    assert.equal(review.payload.result.llm.ok, true)
    assert.equal(review.payload.result.verdict.label, '待确认')
    const saved = await invoke(harness, 'GET', `/reviews/${review.payload.reviewId}`)
    assert.equal(saved.payload.review.modelSources[0].partial, true)
    assert.equal(saved.payload.review.modelSources[0].complete, false)
    assert.ok(saved.payload.review.modelSources[0].fragments.some(item => item.method === 'manual' && item.text === '人工修订内容'))
    const details = await invoke(harness, 'GET', `/rule-files/${rule.payload.entry.id}`)
    const collection = await invoke(harness, 'POST', '/standard-collections', { body: { name: '文档集合', rules: details.payload.ruleSet.rules.map(item => ({ fileId: rule.payload.entry.id, ruleId: item.id })), sourceIds: [] } })
    assert.equal(collection.status, 200, JSON.stringify(collection.payload))
    const selected = await invoke(harness, 'POST', '/review', { body: { collectionId: collection.payload.collection.id, collectionVersion: 1, contentBase64: SMALL_DXF.toString('base64') } })
    assert.equal(selected.status, 200, JSON.stringify(selected.payload))
    assert.equal(selected.payload.result.llm.ok, true)
    assert.equal(selected.payload.result.verdict.label, '待确认')
    const selectedRecord = await invoke(harness, 'GET', `/reviews/${selected.payload.reviewId}`)
    assert.ok(selectedRecord.payload.review.modelSources[0].fragments.some(item => item.method === 'manual' && item.text === '人工修订内容'))
    await invoke(harness, 'PUT', `/sources/${sourceId}/edit`, { body: { extraction: { text: '第二版修订内容' } } })
    const next = await invoke(harness, 'POST', `/standard-collections/${collection.payload.collection.id}/versions`, { body: { name: '文档集合', baseVersion: 1, rules: details.payload.ruleSet.rules.map(item => ({ fileId: rule.payload.entry.id, ruleId: item.id })), sourceIds: [] } })
    assert.equal(next.status, 200, JSON.stringify(next.payload))
    const oldReview = await invoke(harness, 'POST', '/review', { body: { collectionId: collection.payload.collection.id, collectionVersion: 1, contentBase64: SMALL_DXF.toString('base64') } })
    const oldRecord = await invoke(harness, 'GET', `/reviews/${oldReview.payload.reviewId}`)
    assert.ok(oldRecord.payload.review.modelSources[0].fragments.some(item => item.text === '人工修订内容'))
    assert.ok(!oldRecord.payload.review.modelSources[0].fragments.some(item => item.text === '第二版修订内容'))
    const newReview = await invoke(harness, 'POST', '/review', { body: { collectionId: collection.payload.collection.id, collectionVersion: 2, contentBase64: SMALL_DXF.toString('base64') } })
    const newRecord = await invoke(harness, 'GET', `/reviews/${newReview.payload.reviewId}`)
    assert.ok(newRecord.payload.review.modelSources[0].fragments.some(item => item.text === '第二版修订内容'))
  } finally { await unregister(); rmSync(harness.dataDir, { recursive: true, force: true }) }
})

test('普通 DOCX 集合保存识别快照，并兼容旧集合缺失来源预览', async () => {
  let calls = 0
  const harness = createHarness({ generate: async (request, input) => {
    calls++
    if (input.prompt.includes('整理以下规则文件')) return { text: JSON.stringify({ text: '普通 DOCX 正文', categories: ['规则'], uncertainties: [] }) }
    const batch = JSON.parse(input.prompt.split('\n').at(-1))
    return { text: JSON.stringify({ verdict: '待确认', summary: '完成', reviewedFindings: [], additionalFindings: [], coveredBatchId: batch.批次编号 }) }
  } })
  await register(harness.router, harness.ctx)
  try {
    const imported = await invoke(harness, 'POST', '/rule-files', { body: { fileName: 'test_correct.docx', contentBase64: readFileSync(GENERIC_RULE_DOCX).toString('base64') } })
    assert.equal(imported.status, 200, JSON.stringify(imported.payload))
    const detail = await invoke(harness, 'GET', `/rule-files/${imported.payload.entry.id}`)
    assert.ok(detail.payload.ruleSet.documentPreview?.fragments.length >= 1)
    const collection = await invoke(harness, 'POST', '/standard-collections', { body: {
      name: '普通 DOCX 集合',
      rules: detail.payload.ruleSet.rules.map(rule => ({ fileId: imported.payload.entry.id, ruleId: rule.id })),
      sourceIds: [],
    } })
    assert.equal(collection.status, 200, JSON.stringify(collection.payload))
    const version = collection.payload.collection.versions[0]
    const sourceSnapshot = version.sourceSnapshots.find(source => source.id === imported.payload.entry.sourceId)
    assert.ok(sourceSnapshot.documentPreview?.fragments.length >= 1)
    assert.equal(sourceSnapshot.documentPreview.sha256, detail.payload.ruleSet.documentPreview.sha256)

    const collectionPath = path.join(harness.dataDir, 'standard-collections', `${collection.payload.collection.id}.json`)
    const saved = JSON.parse(readFileSync(collectionPath, 'utf8'))
    const legacySource = saved.versions[0].sourceSnapshots.find(source => source.id === imported.payload.entry.sourceId)
    delete legacySource.documentPreview
    const { sha256: _oldHash, ...content } = saved.versions[0]
    saved.versions[0].sha256 = createHash('sha256').update(JSON.stringify(content)).digest('hex')
    writeFileSync(collectionPath, JSON.stringify(saved, null, 2))

    calls = 0
    const review = await invoke(harness, 'POST', '/review', { body: {
      collectionId: collection.payload.collection.id,
      collectionVersion: 1,
      contentBase64: SMALL_DXF.toString('base64'),
      fileName: 'legacy.docx.dxf',
    } })
    assert.equal(review.status, 400, JSON.stringify(review.payload))
    assert.equal(review.payload.error.code, 'RULE_FILE_NOT_APPLICABLE')
    assert.match(review.payload.error.message, /工艺文件/)
    assert.match(review.payload.error.message, /CAD/)
    assert.equal(calls, 0)
    assert.ok(harness.logs.some(([level, fields]) => level === 'warn' && fields.operation === 'review.preflight_failed' && fields.nonCadSignals.includes('工艺文件')))
    const audit = await invoke(harness, 'GET', '/logs')
    assert.ok(audit.payload.entries.some(entry => entry.event === 'review.preflight_failed' && entry.errorCode === 'RULE_FILE_NOT_APPLICABLE'))
  } finally { await unregister(); rmSync(harness.dataDir, { recursive: true, force: true }) }
})

test('配套 CAD 文档的旧集合缺少来源预览时可恢复并继续审查', async () => {
  const harness = createHarness({ generate: async (request, input) => {
    if (input.prompt.includes('整理以下规则文件')) return { text: JSON.stringify({ text: 'CAD 图样图框与尺寸审查规则', categories: ['规则'], uncertainties: [] }) }
    const batch = JSON.parse(input.prompt.split('\n').at(-1))
    return { text: JSON.stringify({ verdict: '待确认', summary: '完成', reviewedFindings: [], additionalFindings: [], coveredBatchId: batch.批次编号 }) }
  } })
  await register(harness.router, harness.ctx)
  try {
    const content = 'CAD图样审查规则\n图框边距应符合标准。\n尺寸标注必须完整。\n'
    const imported = await invoke(harness, 'POST', '/rule-files', { body: { fileName: 'cad-rules.md', contentBase64: Buffer.from(content).toString('base64') } })
    assert.equal(imported.status, 200, JSON.stringify(imported.payload))
    const detail = await invoke(harness, 'GET', `/rule-files/${imported.payload.entry.id}`)
    assert.ok(detail.payload.ruleSet.documentPreview?.fragments.length)
    const collection = await invoke(harness, 'POST', '/standard-collections', { body: {
      name: 'CAD Markdown 集合',
      rules: detail.payload.ruleSet.rules.map(rule => ({ fileId: imported.payload.entry.id, ruleId: rule.id })),
      sourceIds: [],
    } })
    const collectionPath = path.join(harness.dataDir, 'standard-collections', `${collection.payload.collection.id}.json`)
    const saved = JSON.parse(readFileSync(collectionPath, 'utf8'))
    delete saved.versions[0].sourceSnapshots.find(source => source.id === imported.payload.entry.sourceId).documentPreview
    const { sha256: _oldHash, ...versionContent } = saved.versions[0]
    saved.versions[0].sha256 = createHash('sha256').update(JSON.stringify(versionContent)).digest('hex')
    writeFileSync(collectionPath, JSON.stringify(saved, null, 2))
    const review = await invoke(harness, 'POST', '/review', { body: { collectionId: collection.payload.collection.id, collectionVersion: 1, contentBase64: SMALL_DXF.toString('base64') } })
    assert.equal(review.status, 200, JSON.stringify(review.payload))
    assert.equal(review.payload.result.llm.ok, true)
  } finally { await unregister(); rmSync(harness.dataDir, { recursive: true, force: true }) }
})

test('删除集合后不可再选择，资料与历史快照仍保留', async () => {
  const harness = createHarness()
  await register(harness.router, harness.ctx)
  try {
    const ruleFile = (await invoke(harness, 'GET', '/rule-files')).payload.files[0]
    const rule = (await invoke(harness, 'GET', `/rule-files/${ruleFile.id}`)).payload.ruleSet.rules[0]
    const lib = (await invoke(harness, 'POST', '/libraries', { body: { fileName: 'ref.md', contentBase64: Buffer.from('规则原文').toString('base64') } })).payload.entry
    const source = (await invoke(harness, 'GET', `/sources/${lib.sourceId}`)).payload.source
    const created = await invoke(harness, 'POST', '/standard-collections', { body: { name: '待删除', rules: [{ fileId: ruleFile.id, ruleId: rule.id }], sourceIds: [source.id] } })
    const id = created.payload.collection.id
    assert.equal((await invoke(harness, 'DELETE', `/standard-collections/${id}`)).payload.ok, true)
    assert.equal((await invoke(harness, 'GET', `/standard-collections/${id}`)).status, 404)
    assert.ok(!(await invoke(harness, 'GET', '/standard-collections')).payload.collections.some(item => item.id === id))
    assert.equal((await invoke(harness, 'GET', `/sources/${source.id}`)).payload.source.fileName, 'ref.md')
    const saved = JSON.parse(readFileSync(path.join(harness.dataDir, 'standard-collections', `${id}.json`), 'utf8'))
    assert.ok(saved.deletedAt)
    assert.equal(saved.versions[0].sourceSnapshots.find(item => item.id === source.id).sha256, source.sha256)
    assert.equal((await invoke(harness, 'DELETE', `/standard-collections/${id}`)).status, 404)
  } finally { await unregister(); rmSync(harness.dataDir, { recursive: true, force: true }) }
})

test('用户上传模式不会显示或使用已有内置资料', async () => {
  const harness = createHarness()
  await register(harness.router, harness.ctx)
  try {
    const builtin = (await invoke(harness, 'GET', '/rule-files')).payload.files[0]
    await unregister()
    delete harness.ctx.allowBuiltinTestFixtures
    await register(harness.router, harness.ctx)
    assert.deepEqual((await invoke(harness, 'GET', '/rule-files')).payload.files, [])
    assert.deepEqual((await invoke(harness, 'GET', '/libraries')).payload.files, [])
    assert.deepEqual((await invoke(harness, 'GET', '/sources')).payload.sources, [])
    const response = await invoke(harness, 'POST', '/review', { body: { contentBase64: Buffer.from('sample').toString('base64') } })
    assert.equal(response.payload.error.code, 'NO_ENABLED_RULES')
    const collection = await invoke(harness, 'POST', '/standard-collections', { body: { name: '旧资料', rules: [], sourceIds: [builtin.sourceId] } })
    assert.equal(collection.payload.error.code, 'COLLECTION_REFERENCE_NOT_FOUND')
    const input = { id: 'user-file', name: '上传规则', version: '1', rules: [{ id: 'R13', name: '上传的检查要求', ruleClass: 'B', severity: '一般', checkType: 'llmOnly' }] }
    const imported = await invoke(harness, 'POST', '/rule-files', { body: { fileName: 'uploaded.json', contentBase64: Buffer.from(JSON.stringify(input)).toString('base64') } })
    assert.equal(imported.payload.ok, true)
    const files = (await invoke(harness, 'GET', '/rule-files')).payload.files
    assert.equal(files.length, 1)
    assert.equal(files[0].sourceId, imported.payload.entry.sourceId)
    assert.equal((await invoke(harness, 'GET', '/rules')).payload.catalog.rules[0].name, '上传的检查要求')
  } finally { await unregister(); rmSync(harness.dataDir, { recursive: true, force: true }) }
})

test('补充资料上传保留原件并如实报告解析和模型状态', async () => {
  const harness = createHarness()
  await register(harness.router, harness.ctx)
  try {
    const original = Buffer.from('材料说明\n允许 Q235', 'utf8')
    const response = await invoke(harness, 'POST', '/sources', { body: { fileName: 'reference.txt', contentBase64: original.toString('base64') } })
    assert.equal(response.payload.ok, true)
    assert.equal(response.payload.calibration.ok, false)
    assert.equal(response.payload.source.originalExtraction.text, original.toString())
    assert.deepEqual(readFileSync(path.join(harness.dataDir, 'sources', response.payload.source.id, 'original')), original)
    const unsupported = await invoke(harness, 'POST', '/sources', { body: { fileName: 'scan.pdf', contentBase64: Buffer.from('pdf').toString('base64') } })
    assert.equal(unsupported.payload.source.originalExtraction.complete, false)
    assert.equal(unsupported.payload.calibration.ok, false)
  } finally { await unregister(); rmSync(harness.dataDir, { recursive: true, force: true }) }
})

test('不完整 DOCX 预览可供模型理解但不会保存为完整资料', async () => {
  const calls = []
  const harness = createHarness({ generate: async (request, input) => { calls.push(input.prompt); return { text: JSON.stringify({ categories: ['图纸规则'], uncertainties: ['表格须核对'] }) } } })
  await register(harness.router, harness.ctx)
  try {
    const response = await invoke(harness, 'POST', '/sources', { body: { fileName: 'rules.docx', contentBase64: readFileSync(RULE_DOCX).toString('base64') } })
    assert.equal(response.payload.source.originalExtraction.complete, false)
    assert.ok(response.payload.source.preview.fragments.length > 0)
    const understood = await invoke(harness, 'POST', `/sources/${response.payload.source.id}/preview-understand`)
    assert.equal(understood.payload.incomplete, true)
    assert.deepEqual(understood.payload.result.categories, ['图纸规则'])
    assert.ok(calls.some(prompt => /不完整的文档预览/.test(prompt)))
    const detail = await invoke(harness, 'GET', `/sources/${response.payload.source.id}`)
    assert.equal(detail.payload.source.history.length, 1)
    assert.equal(detail.payload.source.history[0].type, 'model')
    assert.equal(detail.payload.source.originalExtraction.complete, false)
  } finally { await unregister(); rmSync(harness.dataDir, { recursive: true, force: true }) }
})

test('标准集合版本引用、并发冲突和重启持久化', async () => {
  const harness = createHarness()
  await register(harness.router, harness.ctx)
  try {
    const file = (await invoke(harness, 'GET', '/rule-files')).payload.files[0]
    const rule = (await invoke(harness, 'GET', `/rule-files/${file.id}`)).payload.ruleSet.rules[0]
    const body = { name: '集合一', rules: [{ fileId: file.id, ruleId: rule.id }], sourceIds: [] }
    const created = await invoke(harness, 'POST', '/standard-collections', { body })
    assert.equal(created.payload.collection.versions[0].rules[0].sha256.length, 64)
    assert.deepEqual(created.payload.collection.versions[0].rules[0].snapshot, rule)
    const savedSource = created.payload.collection.versions[0].sourceSnapshots.find(item => item.id === file.sourceId)
    assert.equal(savedSource.id, file.sourceId)
    assert.equal(savedSource.revision, null)
    assert.ok(Buffer.from(savedSource.originalBase64, 'base64').length > 0)
    await invoke(harness, 'PUT', `/sources/${file.sourceId}/edit`, { body: { extraction: { rules: [] } } })
    const id = created.payload.collection.id
    const invalid = await invoke(harness, 'POST', '/standard-collections', { body: { ...body, sourceIds: ['missing'] } })
    assert.equal(invalid.status, 404)
    const invalidRule = await invoke(harness, 'POST', '/standard-collections', { body: { ...body, rules: [{ fileId: file.id, ruleId: 'missing' }] } })
    assert.equal(invalidRule.status, 404)
    const requests = await Promise.all([1, 2].map(() => invoke(harness, 'POST', `/standard-collections/${id}/versions`, { body: { ...body, name: '集合二', baseVersion: 1 } })))
    assert.deepEqual(requests.map(result => result.status).sort(), [200, 409])
    await unregister()
    await register(harness.router, harness.ctx)
    const detail = await invoke(harness, 'GET', `/standard-collections/${id}`)
    assert.equal(detail.payload.collection.versions.length, 2)
    assert.equal(detail.payload.collection.versions[0].name, '集合一')
    assert.deepEqual(detail.payload.collection.versions[0].sourceSnapshots.find(item => item.id === file.sourceId), savedSource)
    assert.deepEqual(detail.payload.collection.versions[0].rules[0].snapshot, rule)
    assert.deepEqual(detail.payload.collection.versions[1].sourceSnapshots.find(item => item.id === file.sourceId).revision.data.extraction, { rules: [] })
    assert.equal((await invoke(harness, 'GET', '/standard-collections')).payload.collections[0].latest.version, 2)
    assert.equal((await invoke(harness, 'GET', '/standard-collections/not-an-id')).status, 404)
  } finally {
    await unregister()
    rmSync(harness.dataDir, { recursive: true, force: true })
  }
})

test('集合审查不可安全追溯时拒绝并且不回退到当前规则', async () => {
  let calls = 0
  const harness = createHarness({ generate: async () => { calls++; throw new Error('unexpected') } })
  await register(harness.router, harness.ctx)
  try {
    const file = (await invoke(harness, 'GET', '/rule-files')).payload.files[0]
    const rule = (await invoke(harness, 'GET', `/rule-files/${file.id}`)).payload.ruleSet.rules[0]
    const created = await invoke(harness, 'POST', '/standard-collections', { body: { name: '集合', rules: [{ fileId: file.id, ruleId: rule.id }], sourceIds: [] } })
    const selection = { collectionId: created.payload.collection.id, collectionVersion: 1 }
    for (const body of [selection, { options: selection }]) {
      const response = await invoke(harness, 'POST', '/review', { body })
      assert.equal(response.status, 409)
      assert.equal(response.payload.error.code, 'COLLECTION_REVIEW_UNSUPPORTED')
    }
    for (const body of [{ collection: null }, { standardCollectionId: 'missing' }]) {
      const response = await invoke(harness, 'POST', '/review', { body })
      assert.equal(response.status, 400)
      assert.equal(response.payload.error.code, 'COLLECTION_SELECTION_INVALID')
    }
    assert.equal(calls, 0)
    assert.deepEqual((await invoke(harness, 'GET', '/reviews')).payload.reviews, [])
  } finally {
    await unregister()
    rmSync(harness.dataDir, { recursive: true, force: true })
  }
})

const SMALL_DXF = Buffer.from('0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n0\nLWPOLYLINE\n8\n0\n90\n4\n70\n1\n10\n0\n20\n0\n10\n594\n20\n0\n10\n594\n20\n420\n10\n0\n20\n420\n0\nTEXT\n8\n0\n1\nUPLOAD_MARKER\n10\n1\n20\n2\n40\n3\n0\nENDSEC\n0\nEOF\n')

async function prepareCompleteSources(harness) {
  for (const entry of (await invoke(harness, 'GET', '/rule-files')).payload.files.filter(item => item.active)) {
    await invoke(harness, 'PUT', `/rule-files/${entry.id}`, { body: { active: false } })
  }
  for (const entry of (await invoke(harness, 'GET', '/libraries')).payload.files.filter(item => item.active)) {
    await invoke(harness, 'PUT', `/libraries/${entry.id}`, { body: { active: false } })
  }
  const content = JSON.stringify({ schemaVersion: 1, id: 'test-rule', name: '测试规则', version: '1', rules: [{ id: 'R13', name: '测试', ruleClass: 'A', severity: '一般', checkType: 'textHeight', params: { titleMinHeight: 5, techMinHeight: 3.5 }, checkpoints: [] }] })
  const imported = await invoke(harness, 'POST', '/rule-files', { body: { fileName: 'test.json', contentBase64: Buffer.from(content).toString('base64') } })
  assert.equal(imported.payload.ok, true)
  const sourceId = imported.payload.entry.sourceId
  await invoke(harness, 'PUT', `/sources/${sourceId}/edit`, { body: { extraction: JSON.parse(content) } })
  return { content, sourceId }
}

test('未提供外部标准库时不应仅因规则类型拒绝集合审查', async () => {
  const harness = createHarness({ generate: async (request, input) => {
    const batch = JSON.parse(input.prompt.split('\n').at(-1))
    return { text: JSON.stringify({ verdict: '待确认', summary: '完成', reviewedFindings: [], additionalFindings: [], coveredBatchId: batch.批次编号 }) }
  } })
  await register(harness.router, harness.ctx)
  try {
    const { sourceId, content } = await prepareCompleteSources(harness)
    const file = (await invoke(harness, 'GET', '/rule-files')).payload.files.find(item => item.sourceId === sourceId)
    const collection = (await invoke(harness, 'POST', '/standard-collections', { body: { name: '无需外部库', rules: [{ fileId: file.id, ruleId: 'R13' }], sourceIds: [] } })).payload.collection
    const result = await invoke(harness, 'POST', '/review', { body: { collectionId: collection.id, collectionVersion: 1, contentBase64: SMALL_DXF.toString('base64') } })
    assert.equal(result.status, 200, JSON.stringify(result.payload))
    assert.equal(result.payload.result.llm.ok, true)
    assert.ok(content)
  } finally { await unregister(); rmSync(harness.dataDir, { recursive: true, force: true }) }
})

test('首次使用内置资料时可核验的原文应能送入模型审查', async () => {
  let calls = 0
  const harness = createHarness({ generate: async (request, input) => {
    calls++
    const batch = JSON.parse(input.prompt.split('\n').at(-1))
    return { text: JSON.stringify({ verdict: '待确认', summary: '已复核', reviewedFindings: [], additionalFindings: [], coveredBatchId: batch.批次编号 }) }
  } })
  await register(harness.router, harness.ctx)
  try {
    const result = await invoke(harness, 'POST', '/review', { body: { fileName: 'sample.dxf', contentBase64: SMALL_DXF.toString('base64') } })
    assert.equal(result.status, 200, JSON.stringify(result.payload))
    assert.equal(result.payload.result.llm.ok, true, result.payload.result.llm.errorCode)
    assert.ok(calls > 0)
  } finally { await unregister(); rmSync(harness.dataDir, { recursive: true, force: true }) }
})

test('真实合规图纸和内置资料可进入两阶段模型审查', async () => {
  let calls = 0
  const harness = createHarness({ generate: async (request, input) => {
    calls++
    const batch = JSON.parse(input.prompt.split('\n').at(-1))
    return { text: JSON.stringify({ verdict: '待确认', summary: '已复核', reviewedFindings: [], additionalFindings: [], coveredBatchId: batch.批次编号 }) }
  } })
  await register(harness.router, harness.ctx)
  try {
    const file = `${DATA_DIR}/GW-2026-001_支架组件_A2_合规版 - 副本 (2).dxf`
    const response = await invoke(harness, 'POST', '/review', { body: { fileName: 'drawing.dxf', contentBase64: readFileSync(file).toString('base64') } })
    assert.equal(response.payload.result.llm.ok, true, JSON.stringify(response.payload.result.llm))
    assert.ok(calls > 0 && calls <= 200)
    assert.equal(response.payload.result.llm.coverage.completed, response.payload.result.llm.coverage.total)
    assert.ok(response.payload.result.llm.coverage.drawingEvidence)
    assert.notEqual(response.payload.result.verdict.label, '符合')
  } finally { await unregister(); rmSync(harness.dataDir, { recursive: true, force: true }) }
})

test('已修改的内置库不能以原始内置资料名义送审', async () => {
  let calls = 0
  const harness = createHarness({ generate: async () => { calls++; return { text: '{}' } } })
  await register(harness.router, harness.ctx)
  try {
    const libraryPath = path.join(harness.dataDir, 'libraries', 'materials-gb.json')
    const library = JSON.parse(readFileSync(libraryPath, 'utf8'))
    library.name = '已修改的库'
    writeFileSync(libraryPath, JSON.stringify(library))
    const response = await invoke(harness, 'POST', '/review', { body: { contentBase64: SMALL_DXF.toString('base64') } })
    assert.equal(response.payload.result.llm.errorCode, 'PLUGIN_ENGINE_INPUT_INCOMPLETE')
    assert.match(response.payload.result.llm.message, /尚无已保存/)
    assert.equal(calls, 0)
    const record = await invoke(harness, 'GET', `/reviews/${response.payload.reviewId}`)
    assert.ok(record.payload.review.sourceSnapshot.some(item => item.entryId === 'materials-gb' && !item.complete))
  } finally { await unregister(); rmSync(harness.dataDir, { recursive: true, force: true }) }
})

test('集合审查将补充资料固定并发送给模型', async () => {
  const calls = []
  const harness = createHarness({ generate: async (request, input) => {
    calls.push(input.prompt)
    const batch = JSON.parse(input.prompt.split('\n').at(-1))
    return { text: JSON.stringify({ verdict: '符合', summary: '已复核', reviewedFindings: [], additionalFindings: [], coveredBatchId: batch.批次编号 }) }
  } })
  await register(harness.router, harness.ctx)
  try {
    const { sourceId } = await prepareCompleteSources(harness)
    const file = (await invoke(harness, 'GET', '/rule-files')).payload.files.find(item => item.sourceId === sourceId)
    const extra = await invoke(harness, 'POST', '/libraries', { body: { fileName: 'note.md', contentBase64: Buffer.from('REFERENCE_MARKER').toString('base64') } })
    const created = await invoke(harness, 'POST', '/standard-collections', { body: { name: '补充资料', rules: [{ fileId: file.id, ruleId: 'R13' }], sourceIds: [extra.payload.entry.sourceId] } })
    calls.length = 0
    const result = await invoke(harness, 'POST', '/review', { body: { collectionId: created.payload.collection.id, collectionVersion: 1, contentBase64: SMALL_DXF.toString('base64') } })
    assert.equal(result.status, 200, JSON.stringify(result.payload))
    assert.ok(calls.join('').includes('REFERENCE_MARKER'))
    const saved = await invoke(harness, 'GET', `/reviews/${result.payload.reviewId}`)
    assert.ok(saved.payload.review.modelSources.some(item => item.kind === 'reference' && item.fragments?.some(fragment => fragment.text === 'REFERENCE_MARKER')))
  } finally { await unregister(); rmSync(harness.dataDir, { recursive: true, force: true }) }
})

test('集合审查固定外部标准库且不混入后续全局库', async () => {
  const calls = []
  const harness = createHarness({ generate: async (request, input) => {
    calls.push(input.prompt)
    const batch = JSON.parse(input.prompt.split('\n').at(-1))
    return { text: JSON.stringify({ verdict: '符合', summary: '已复核', reviewedFindings: [], additionalFindings: [], coveredBatchId: batch.批次编号 }) }
  } })
  await register(harness.router, harness.ctx)
  try {
    const { sourceId } = await prepareCompleteSources(harness)
    const file = (await invoke(harness, 'GET', '/rule-files')).payload.files.find(item => item.sourceId === sourceId)
    const library = { type: 'material', id: 'fixed-library', name: '固定材料库', version: 'v1', grades: [{ code: 'FIXED_MARKER' }] }
    const imported = await invoke(harness, 'POST', '/libraries', { body: { fileName: 'fixed.json', contentBase64: Buffer.from(JSON.stringify(library)).toString('base64') } })
    const librarySource = imported.payload.entry.sourceId
    await invoke(harness, 'PUT', `/sources/${librarySource}/edit`, { body: { extraction: library } })
    const created = await invoke(harness, 'POST', '/standard-collections', { body: { name: '固定集合', rules: [{ fileId: file.id, ruleId: 'R13' }], sourceIds: [librarySource] } })
    assert.equal(created.status, 200, JSON.stringify(created.payload))
    assert.equal(created.payload.collection.versions[0].libraries[0].sourceId, librarySource)
    await invoke(harness, 'DELETE', `/libraries/${imported.payload.entry.id}`)
    const other = { ...library, id: 'other-library', name: '全局材料库', grades: [{ code: 'GLOBAL_MARKER' }] }
    await invoke(harness, 'POST', '/libraries', { body: { fileName: 'other.json', contentBase64: Buffer.from(JSON.stringify(other)).toString('base64') } })
    calls.length = 0
    const response = await invoke(harness, 'POST', '/review', { body: { collectionId: created.payload.collection.id, collectionVersion: 1, contentBase64: SMALL_DXF.toString('base64') } })
    assert.equal(response.status, 200, JSON.stringify(response.payload))
    assert.equal(response.payload.result.llm.ok, true)
    assert.ok(calls.join('').includes('FIXED_MARKER'))
    assert.ok(!calls.join('').includes('GLOBAL_MARKER'))
    const saved = await invoke(harness, 'GET', `/reviews/${response.payload.reviewId}`)
    assert.ok(saved.payload.review.sourceSnapshot.some(item => item.kind === 'library' && item.sourceId === librarySource))
  } finally {
    await unregister()
    rmSync(harness.dataDir, { recursive: true, force: true })
  }
})

test('集合审查使用固定规则和来源而不读取后续全局资料', async () => {
  const calls = []
  const harness = createHarness({ generate: async (request, input) => {
    calls.push(input.prompt)
    const batch = JSON.parse(input.prompt.split('\n').at(-1))
    return { text: JSON.stringify({ verdict: '符合', summary: '已复核', reviewedFindings: [], additionalFindings: [], coveredBatchId: batch.批次编号 }) }
  } })
  await register(harness.router, harness.ctx)
  try {
    const { sourceId, content } = await prepareCompleteSources(harness)
    const file = (await invoke(harness, 'GET', '/rule-files')).payload.files.find(item => item.sourceId === sourceId)
    const created = await invoke(harness, 'POST', '/standard-collections', { body: { name: '固定集合', rules: [{ fileId: file.id, ruleId: 'R13' }], sourceIds: [] } })
    const id = created.payload.collection.id
    await invoke(harness, 'PUT', `/sources/${sourceId}/edit`, { body: { extraction: { rules: [{ id: 'R13', name: '后续修改标记' }] } } })
    await invoke(harness, 'DELETE', `/rule-files/${file.id}`)
    calls.length = 0
    const response = await invoke(harness, 'POST', '/review', { body: { collectionId: id, collectionVersion: 1, contentBase64: SMALL_DXF.toString('base64') } })
    assert.equal(response.status, 200, JSON.stringify(response.payload))
    assert.equal(response.payload.result.llm.ok, true)
    assert.equal(response.payload.result.collection.version, 1)
    assert.ok(calls[0].includes(content.replaceAll('"', '\\"')) || calls[0].includes('测试规则'))
    assert.ok(!calls.join('').includes('后续修改标记'))
    const saved = await invoke(harness, 'GET', `/reviews/${response.payload.reviewId}`)
    assert.equal(saved.payload.review.collection.id, id)
    assert.equal(saved.payload.review.sourceSnapshot.length, 1)
  } finally {
    await unregister()
    rmSync(harness.dataDir, { recursive: true, force: true })
  }
})

async function uploadDrawing(harness, buffer, fileName, compressed = false, kind = 'drawing') {
  const payload = compressed ? gzipSync(buffer) : buffer
  const totalChunks = Math.max(1, Math.ceil(payload.length / CHUNK))
  const created = await invoke(harness, 'POST', '/uploads', {
    body: { fileName, totalChunks, compressed: compressed ? 'gzip' : 'none', fileSize: buffer.length, kind },
  })
  assert.equal(created.payload.ok, true)
  const uploadId = created.payload.uploadId
  for (let index = 0; index < totalChunks; index += 1) {
    const slice = payload.subarray(index * CHUNK, Math.min(payload.length, (index + 1) * CHUNK))
    const response = await invoke(harness, 'POST', `/uploads/${uploadId}/chunks`, {
      body: { index, data: slice.toString('base64') },
    })
    assert.equal(response.payload.ok, true)
  }
  return uploadId
}

test('模型整理结果不能覆盖上传文件确定的可执行规则', async () => {
  const calls = []
  const harness = createHarness({ generate: async (request, input) => {
    calls.push(input.prompt)
    if (input.prompt.includes('整理以下规则文件')) return { text: JSON.stringify({ text: '模型整理正文', categories: ['规则'], uncertainties: [] }) }
    const batch = JSON.parse(input.prompt.split('\n').at(-1))
    return { text: JSON.stringify({ verdict: '符合', summary: '已复核', reviewedFindings: [], additionalFindings: [], coveredBatchId: batch.批次编号 }) }
  } })
  await register(harness.router, harness.ctx)
  try {
    const { sourceId } = await prepareCompleteSources(harness)
    const calibrated = await invoke(harness, 'POST', `/sources/${sourceId}/recalibrate`, { body: { kind: 'rule' } })
    assert.equal(calibrated.payload.ok, true)
    calls.length = 0
    const response = await invoke(harness, 'POST', '/review', { body: { contentBase64: SMALL_DXF.toString('base64') } })
    assert.equal(response.status, 200, JSON.stringify(response.payload))
    assert.equal(response.payload.result.llm.ok, true)
    assert.ok(calls.length > 0)
    assert.ok(calls.some(prompt => prompt.includes('模型整理正文')))
    const batch = JSON.parse(calls[0].split('\n').at(-1))
    assert.deepEqual(batch.规则集.规则.map(rule => rule.id), ['R13'])
  } finally {
    await unregister()
    rmSync(harness.dataDir, { recursive: true, force: true })
  }
})

test('文件含单独禁用规则时即使提取遗漏也拒绝调用模型', async () => {
  let calls = 0
  const harness = createHarness({ generate: async () => { calls++; return { text: '{}' } } })
  await register(harness.router, harness.ctx)
  try {
    await prepareCompleteSources(harness)
    const content = JSON.stringify({ id: 'two-rules', name: '两条规则', rules: [
      { id: 'R21', name: '启用规则', ruleClass: 'A' },
      { id: 'R22', name: '禁用规则原文标记', ruleClass: 'A' },
    ] })
    const imported = await invoke(harness, 'POST', '/rule-files', { body: { fileName: 'two.json', contentBase64: Buffer.from(content).toString('base64') } })
    assert.equal(imported.payload.ok, true)
    await invoke(harness, 'PUT', `/sources/${imported.payload.entry.sourceId}/edit`, { body: { extraction: { rules: [{ id: 'R21', name: '启用规则' }] } } })
    calls = 0
    const response = await invoke(harness, 'POST', '/review', { body: { contentBase64: SMALL_DXF.toString('base64'), options: { enabledRules: ['R13', 'R21'] } } })
    assert.equal(response.status, 400)
    assert.equal(response.payload.error.code, 'PARTIAL_RULE_FILE')
    await invoke(harness, 'PUT', '/settings', { body: { enabledRules: ['R13', 'R21'] } })
    const savedSettingsResponse = await invoke(harness, 'POST', '/review', { body: { contentBase64: SMALL_DXF.toString('base64') } })
    assert.equal(savedSettingsResponse.status, 400)
    assert.equal(savedSettingsResponse.payload.error.code, 'PARTIAL_RULE_FILE')
    assert.equal(calls, 0)
  } finally {
    await unregister()
    rmSync(harness.dataDir, { recursive: true, force: true })
  }
})

test('篡改的原文提取元数据不能作为完整资料发送', async () => {
  let calls = 0
  const harness = createHarness({ generate: async () => { calls++; return { text: '{}' } } })
  await register(harness.router, harness.ctx)
  try {
    const { sourceId } = await prepareCompleteSources(harness)
    const file = path.join(harness.dataDir, 'sources', sourceId, 'metadata.json')
    const metadata = JSON.parse(readFileSync(file, 'utf8'))
    metadata.extraction.text = '不完整'
    writeFileSync(file, JSON.stringify(metadata))
    calls = 0
    const response = await invoke(harness, 'POST', '/review', { body: { contentBase64: SMALL_DXF.toString('base64') } })
    assert.equal(calls, 0)
    assert.equal(response.payload.result.llm.ok, false)
    assert.equal(response.payload.result.verdict.label, '待确认')
  } finally {
    await unregister()
    rmSync(harness.dataDir, { recursive: true, force: true })
  }
})

test('大模型不可用时规则文档仍可由解析器导入并保留审查入口', async () => {
  const harness = createHarness()
  await register(harness.router, harness.ctx)
  try {
    const imported = await invoke(harness, 'POST', '/rule-files', { body: { fileName: 'rules.yaml', contentBase64: Buffer.from('title: 企业规则\nrequirement: 图框边距应为 10mm\n').toString('base64') } })
    assert.equal(imported.status, 200, JSON.stringify(imported.payload))
    assert.equal(imported.payload.calibration.ok, false)
    assert.ok(imported.payload.entry.ruleCount > 0)
    const detail = await invoke(harness, 'GET', `/rule-files/${imported.payload.entry.id}`)
    assert.match(detail.payload.ruleSet.rules[0].logic, /图框边距/)
    const response = await invoke(harness, 'POST', '/review', { body: { contentBase64: SMALL_DXF.toString('base64') } })
    assert.equal(response.payload.result.llm.ok, false)
    assert.equal(response.payload.result.verdict.label, '待确认')
    assert.deepEqual(response.payload.result.findings, [])
  } finally {
    await unregister()
    rmSync(harness.dataDir, { recursive: true, force: true })
  }
})

test('内置资料自动关联并在重启后保持一致', async () => {
  const harness = createHarness()
  try {
    await register(harness.router, harness.ctx)
    const rules = (await invoke(harness, 'GET', '/rule-files')).payload.files
    const libraries = (await invoke(harness, 'GET', '/libraries')).payload.files
    const entries = [...rules, ...libraries]
    assert.equal(entries.length, 3)
    assert.ok(entries.every(entry => entry.sourceId))
    const sources = (await invoke(harness, 'GET', '/sources')).payload.sources
    assert.equal(sources.length, 3)
    unregister()
    await register(harness.router, harness.ctx)
    const reopened = [...(await invoke(harness, 'GET', '/rule-files')).payload.files, ...(await invoke(harness, 'GET', '/libraries')).payload.files]
    assert.deepEqual(reopened.map(entry => entry.sourceId), entries.map(entry => entry.sourceId))
    assert.equal((await invoke(harness, 'GET', '/sources')).payload.sources.length, 3)
  } finally {
    unregister()
    rmSync(harness.dataDir, { recursive: true, force: true })
  }
})

test('旧上传资料提示重新上传且修改过的内置库不被覆盖', async () => {
  const harness = createHarness()
  try {
    const rules = createRuleStore(harness.ctx)
    const libraries = createLibraryStore(harness.ctx)
    await rules.ensureSeeded()
    await libraries.ensureSeeded()
    const original = JSON.stringify({ id: 'old-user', name: '旧规则', rules: [{ id: 'R13', name: '旧规则', ruleClass: 'A' }] })
    await rules.importFile(Buffer.from(original), 'old.json')
    const file = path.join(harness.dataDir, 'libraries', 'materials-gb.json')
    const modified = JSON.parse(readFileSync(file, 'utf8'))
    modified.name = '用户修改'
    writeFileSync(file, JSON.stringify(modified))
    await register(harness.router, harness.ctx)
    assert.equal(readFileSync(file, 'utf8'), JSON.stringify(modified))
    const entries = (await invoke(harness, 'GET', '/libraries')).payload.files
    assert.equal(entries.find(entry => entry.id === 'materials-gb').sourceId, undefined)
    const review = await invoke(harness, 'POST', '/review', { body: { fileName: 'sample.dxf', contentBase64: SMALL_DXF.toString('base64') } })
    const saved = await invoke(harness, 'GET', `/reviews/${review.payload.reviewId}`)
    const old = saved.payload.review.sourceSnapshot.find(item => item.entryId === 'old-user')
    assert.equal(old.complete, false)
    assert.match(old.reason, /重新上传/)
  } finally {
    unregister()
    rmSync(harness.dataDir, { recursive: true, force: true })
  }
})

test('资料上传保留原文并支持人工编辑和模型校准历史', async () => {
  const calls = []
  const harness = createHarness({ generate: async (request, input) => {
    calls.push(input)
    return { text: JSON.stringify({ rules: ['模型提取'] }), model: { modelId: 'default' } }
  } })
  await register(harness.router, harness.ctx)
  try {
    const bytes = Buffer.from(JSON.stringify({ type: 'material', id: 'source-test', name: '测试库', version: 'v1', grades: [{ code: 'Q235' }] }))
    const imported = await invoke(harness, 'POST', '/libraries', { body: { contentBase64: bytes.toString('base64'), fileName: 'source.json', libraryType: 'material' } })
    assert.equal(imported.payload.ok, true)
    const list = await invoke(harness, 'GET', '/sources')
    assert.equal(list.payload.sources.length, 4)
    const source = list.payload.sources.find(item => item.id === imported.payload.entry.sourceId)
    assert.equal(readFileSync(path.join(harness.dataDir, 'sources', source.id, 'original')).toString(), bytes.toString())
    const edited = await invoke(harness, 'PUT', `/sources/${source.id}/edit`, { body: { extraction: { rules: ['人工'] } } })
    assert.equal(edited.payload.ok, true)
    assert.deepEqual(edited.payload.source.extraction, { rules: ['人工'] })
    assert.equal(edited.payload.source.fileName, 'source.json')
    assert.equal(edited.payload.source.history.at(-1).type, 'manual')
    const calibrated = await invoke(harness, 'POST', `/sources/${source.id}/recalibrate`)
    assert.equal(calibrated.payload.ok, true)
    const detail = await invoke(harness, 'GET', `/sources/${source.id}`)
    assert.equal(detail.payload.source.history.length, 3)
    assert.ok(detail.payload.source.history.some(item => item.type === 'model' && item.data.model.modelId === 'default'))
    assert.equal(calls.length, 2)
    assert.equal(calls[0].model, undefined)
    assert.equal(imported.payload.entry.sourceId, source.id)
    assert.equal(imported.payload.calibration.ok, true)
    const review = await invoke(harness, 'POST', '/review', { body: { fileName: 'sample.dxf', contentBase64: readFileSync(SAMPLE).toString('base64') } })
    const saved = await invoke(harness, 'GET', `/reviews/${review.payload.reviewId}`)
    const snapshot = saved.payload.review.sourceSnapshot
    assert.ok(snapshot.some(item => item.sourceId === source.id && item.complete && item.revision?.type === 'model'))
    assert.ok(snapshot.every(item => item.sourceId))
    assert.ok(snapshot.some(item => item.complete && item.revision?.type === 'verified-original'))
  } finally {
    await unregister()
    rmSync(harness.dataDir, { recursive: true, force: true })
  }
})

test('后端：分片上传 + 审查 + 记录 + 日志', async () => {
  const harness = createHarness(undefined)
  await register(harness.router, harness.ctx)
  try {
    const buffer = readFileSync(SAMPLE)
    const uploadId = await uploadDrawing(harness, buffer, 'GW-2026-001_支架组件_A2.dxf')
    const review = await invoke(harness, 'POST', '/review', {
      body: { uploadId, options: { useLlm: true } },
    })
    assert.equal(review.payload.ok, true)
    assert.equal(review.payload.result.findings.length, 0)
    assert.ok(review.payload.result.localAnalysis.findings.length > 0, '模型不可用时仍应保留本地检查发现供核对')
    assert.equal(review.payload.result.verdict.label, '待确认')
    assert.equal(review.payload.result.llm.ok, false)
    assert.equal(review.payload.result.llm.errorCode, 'PLUGIN_ENGINE_UNAVAILABLE')

    const list = await invoke(harness, 'GET', '/reviews')
    assert.equal(list.payload.reviews.length, 1)
    assert.equal(list.payload.reviews[0].findings, 0)

    const detail = await invoke(harness, 'GET', `/reviews/${review.payload.reviewId}`)
    assert.equal(detail.payload.review.result.findings.length, 0)

    const logs = await invoke(harness, 'GET', '/logs')
    assert.ok(logs.payload.entries.some(entry => entry.event === 'review.incomplete'))
    assert.ok(logs.payload.locations.hostLog.endsWith('cad-standard-reviewer.log'))
    assert.ok(logs.payload.paths.auditFile.includes('audit-'))
    assert.ok(logs.payload.paths.reviewsDir.includes('reviews'))
    assert.ok(harness.logs.some(entry => entry[0] === 'info' && String(entry[2]).includes('图纸审查未完成')))

    const removed = await invoke(harness, 'DELETE', `/reviews/${review.payload.reviewId}`)
    assert.equal(removed.payload.ok, true)
    const after = await invoke(harness, 'GET', '/reviews')
    assert.equal(after.payload.reviews.length, 0)
  } finally {
    await unregister()
    rmSync(harness.dataDir, { recursive: true, force: true })
  }
})

test('后端：gzip 分片与设置持久化', async () => {
  const harness = createHarness(undefined)
  await register(harness.router, harness.ctx)
  try {
    const buffer = readFileSync(SAMPLE)
    const uploadId = await uploadDrawing(harness, buffer, 'sample.dxf', true)
    const review = await invoke(harness, 'POST', '/review', { body: { uploadId, options: { useLlm: false } } })
    assert.equal(review.payload.ok, true)
    assert.equal(review.payload.result.findings.length, 0)
    assert.equal(review.payload.result.llm.skipped, false)
    assert.equal(review.payload.result.options.useLlm, true)
    assert.equal(review.payload.result.llm.ok, false)

    const saved = await invoke(harness, 'PUT', '/settings', {
      body: { retentionDays: 120, thresholds: { frameToleranceMm: 2 } },
    })
    assert.equal(saved.payload.ok, true)
    assert.equal(saved.payload.settings.retentionDays, 120)
    assert.equal(saved.payload.settings.thresholds.frameToleranceMm, 2)

    const settings = await invoke(harness, 'GET', '/settings')
    assert.equal(settings.payload.settings.thresholds.frameToleranceMm, 2)
  } finally {
    await unregister()
    rmSync(harness.dataDir, { recursive: true, force: true })
  }
})

test('后端：请求关闭选项不能跳过两阶段模型审查', async () => {
  const calls = []
  const engine = { generate: async (request, input) => {
    calls.push(input)
    const batch = JSON.parse(input.prompt.split('\n').at(-1))
    return { text: JSON.stringify({ verdict: '待确认', summary: '已复核', reviewedFindings: [], additionalFindings: [], coveredBatchId: batch.批次编号 }) }
  } }
  const harness = createHarness(engine)
  await register(harness.router, harness.ctx)
  try {
    const source = await prepareCompleteSources(harness)
    calls.length = 0
    const uploadId = await uploadDrawing(harness, SMALL_DXF, 'sample.dxf')
    const response = await invoke(harness, 'POST', '/review', { body: { uploadId, options: { useLlm: false, finalReview: false } } })
    assert.equal(response.payload.ok, true, JSON.stringify(response.payload.error))
    assert.ok(calls[0]?.prompt.includes('UPLOAD_MARKER'), JSON.stringify(response.payload.result.llm))
    const batch = JSON.parse(calls[0].prompt.split('\n').at(-1))
    assert.deepEqual(JSON.parse(batch.资料片段.内容).资料快照[0].extraction.rules.map(rule => ({ id: rule.id, name: rule.name, checkType: rule.checkType })), JSON.parse(source.content).rules.map(rule => ({ id: rule.id, name: rule.name, checkType: rule.checkType })))
    assert.equal(JSON.parse(batch.资料片段.内容).资料快照[0].originalText, source.content)
    assert.ok(calls[1]?.prompt.includes('初审结果'))
    const saved = await invoke(harness, 'GET', `/reviews/${response.payload.reviewId}`)
    assert.ok(saved.payload.review.sourceSnapshot.some(item => item.sourceId === source.sourceId && item.complete))
    assert.equal(response.payload.result.options.useLlm, true)
    assert.equal(calls.length, 2)
    assert.equal(response.payload.result.llm.ok, true)
    assert.deepEqual(response.payload.result.llm.stages, { review: true, finalReview: true })
    assert.ok((await invoke(harness, 'GET', '/logs')).payload.entries.some(entry => entry.event === 'review.completed'))
  } finally {
    await unregister()
    rmSync(harness.dataDir, { recursive: true, force: true })
  }
})

test('后端：DWG/二进制文件给出明确错误', async () => {
  const harness = createHarness(undefined)
  await register(harness.router, harness.ctx)
  try {
    const dwg = Buffer.concat([Buffer.from('AC1032'), Buffer.from([0]), Buffer.alloc(64)])
    const review = await invoke(harness, 'POST', '/review', {
      body: { fileName: 'part.dwg', contentBase64: dwg.toString('base64'), options: { useLlm: false } },
    })
    assert.equal(review.payload.ok, false)
    assert.equal(review.payload.error.code, 'DXF_DWG_UNSUPPORTED')
    const logs = await invoke(harness, 'GET', '/logs')
    assert.ok(logs.payload.entries.some(entry => entry.event === 'review.failed' && entry.errorCode === 'DXF_DWG_UNSUPPORTED'))
  } finally {
    await unregister()
    rmSync(harness.dataDir, { recursive: true, force: true })
  }
})


test('规则文件：上传 DOCX 后未校准时不能完成审查', async () => {
  const harness = createHarness(undefined)
  await register(harness.router, harness.ctx)
  try {
    const ruleBuffer = readFileSync(RULE_DOCX)
    const ruleUpload = await uploadDrawing(harness, ruleBuffer, '二维图样标准化审查规则-V1_20261116.docx', false, 'rule')
    const imported = await invoke(harness, 'POST', '/rule-files', { body: { uploadId: ruleUpload } })
    assert.equal(imported.payload.ok, true)
    assert.equal(imported.payload.entry.ruleCount, 12)
    assert.equal(imported.payload.entry.checkpointCount, 22)
    assert.equal(imported.payload.catalog.rules.length, 12)

    const files = await invoke(harness, 'GET', '/rule-files')
    assert.ok(files.payload.files.some(item => item.id === imported.payload.entry.id && item.active))

    const drawingUpload = await uploadDrawing(harness, readFileSync(SAMPLE), 'sample.dxf')
    const review = await invoke(harness, 'POST', '/review', {
      body: { uploadId: drawingUpload, options: { useLlm: false } },
    })
    assert.equal(review.status, 400)
    assert.equal(review.payload.error.code, 'PARTIAL_RULE_FILE')
  } finally {
    await unregister()
    rmSync(harness.dataDir, { recursive: true, force: true })
  }
})

test('规则文件：停用/启用与删除', async () => {
  const harness = createHarness(undefined)
  await register(harness.router, harness.ctx)
  try {
    const ruleUpload = await uploadDrawing(harness, readFileSync(RULE_DOCX), 'rules.docx', false, 'rule')
    const imported = await invoke(harness, 'POST', '/rule-files', { body: { uploadId: ruleUpload } })
    const id = imported.payload.entry.id

    const off = await invoke(harness, 'PUT', `/rule-files/${id}`, { body: { active: false } })
    assert.equal(off.payload.ok, true)
    assert.equal(off.payload.entry.active, false)
    const on = await invoke(harness, 'PUT', `/rule-files/${id}`, { body: { active: true } })
    assert.equal(on.payload.entry.active, true)

    const removed = await invoke(harness, 'DELETE', `/rule-files/${id}`)
    assert.equal(removed.payload.ok, true)
    const files = await invoke(harness, 'GET', '/rule-files')
    assert.ok(!files.payload.files.some(item => item.id === id))
  } finally {
    await unregister()
    rmSync(harness.dataDir, { recursive: true, force: true })
  }
})


test('规则文件：自定义 R13 自动启用但未校准不能完成审查', async () => {
  const harness = createHarness(undefined)
  await register(harness.router, harness.ctx)
  try {
    const custom = {
      schemaVersion: 1,
      id: 'custom-r13',
      name: '企业补充规则',
      version: 'V1',
      rules: [
        {
          id: 'R13',
          name: '企业图样名称字高',
          ruleClass: 'A',
          severity: '一般',
          standard: 'Q/GR 002-2026',
          checkType: 'textHeight',
          params: { titleMinHeight: 10, techMinHeight: 3.5 },
          checkpoints: [{ id: 'D23', defect: '图样名称字高低于企业要求', severity: '一般' }],
        },
      ],
    }
    const uploadId = await uploadDrawing(harness, Buffer.from(JSON.stringify(custom)), 'custom-r13.json', false, 'rule')
    const imported = await invoke(harness, 'POST', '/rule-files', { body: { uploadId } })
    assert.equal(imported.payload.ok, true)
    assert.equal(imported.payload.entry.ruleCount, 1)

    const drawingUpload = await uploadDrawing(harness, readFileSync(SAMPLE), 'sample.dxf')
    const review = await invoke(harness, 'POST', '/review', {
      body: { uploadId: drawingUpload, options: { useLlm: false } },
    })
    assert.equal(review.payload.ok, true)
    assert.equal(review.payload.result.llm.ok, false)
    assert.deepEqual(review.payload.result.findings, [])
    const saved = await invoke(harness, 'GET', `/reviews/${review.payload.reviewId}`)
    assert.ok(saved.payload.review.options.enabledRules.includes('R13'))
    assert.ok(saved.payload.review.sourceSnapshot.some(item => item.sourceId === imported.payload.entry.sourceId && item.complete))
  } finally {
    await unregister()
    rmSync(harness.dataDir, { recursive: true, force: true })
  }
})


test('大模型返回非法格式：标记未完成并写入 llm.failed 审计', async () => {
  const engine = {
    generate: async () => ({ text: '{"verdict":"符合","summary":"被截断' }),
  }
  const harness = createHarness(engine)
  await register(harness.router, harness.ctx)
  try {
    await prepareCompleteSources(harness)
    const uploadId = await uploadDrawing(harness, SMALL_DXF, 'sample.dxf')
    const review = await invoke(harness, 'POST', '/review', {
      body: { uploadId, options: { useLlm: true } },
    })
    assert.equal(review.payload.ok, true, JSON.stringify(review.payload.error))
    assert.equal(review.payload.result.verdict.label, '待确认')
    assert.equal(review.payload.result.llm.ok, false)
    assert.match(review.payload.result.llm.errorDetail, /TRUNCATED_JSON|INVALID_JSON/)

    const logs = await invoke(harness, 'GET', '/logs')
    const failed = logs.payload.entries.find(entry => entry.event === 'llm.failed')
    assert.ok(failed, '应写入 llm.failed 审计')
    assert.equal(failed.reviewId, review.payload.reviewId)
    assert.ok(failed.errorCode)
    assert.ok(harness.logs.some(entry => String(entry[2]).includes('大模型审查未完成')))
  } finally {
    await unregister()
    rmSync(harness.dataDir, { recursive: true, force: true })
  }
})


test('外部标准库：材料库未校准时不产生本地结论', async () => {
  const harness = createHarness(undefined)
  await register(harness.router, harness.ctx)
  try {
    const initial = await invoke(harness, 'GET', '/libraries')
    assert.equal(initial.payload.ok, true)
    assert.ok(initial.payload.files.some(item => item.type === 'material' && item.active))
    assert.ok(initial.payload.files.some(item => item.type === 'tolerance' && item.active))

    const custom = {
      schemaVersion: 1,
      type: 'material',
      id: 'custom-material',
      name: '企业材料库',
      version: '2026.99',
      standard: 'Q/GR 001-2026',
      grades: [{ code: 'Q235', name: '碳素结构钢', standard: 'GB/T 700-2006' }],
    }
    const uploadId = await uploadDrawing(harness, Buffer.from(JSON.stringify(custom)), 'custom-material.json', false, 'library')
    const imported = await invoke(harness, 'POST', '/libraries', { body: { uploadId, libraryType: 'material' } })
    assert.equal(imported.payload.ok, true)
    assert.equal(imported.payload.entry.type, 'material')
    assert.equal(imported.payload.active.material.version, '2026.99')

    const drawingUpload = await uploadDrawing(harness, readFileSync(SAMPLE), 'sample.dxf')
    const review = await invoke(harness, 'POST', '/review', {
      body: { uploadId: drawingUpload, options: { useLlm: false } },
    })
    assert.equal(review.payload.ok, true)
    assert.equal(review.payload.result.libraries.material.version, '2026.99')
    assert.equal(review.payload.result.llm.ok, false)
    assert.deepEqual(review.payload.result.findings, [])
    const saved = await invoke(harness, 'GET', `/reviews/${review.payload.reviewId}`)
    assert.ok(saved.payload.review.sourceSnapshot.some(item => item.sourceId === imported.payload.entry.sourceId && item.complete && item.revision?.type === 'verified-original'))
  } finally {
    await unregister()
    rmSync(harness.dataDir, { recursive: true, force: true })
  }
})

test('外部标准库：公差库可按原文件核验，无模型时不产生最终结论', async () => {
  const harness = createHarness(undefined)
  await register(harness.router, harness.ctx)
  try {
    const csv = 'designation,hole,shaft,type\nH7/g6,H7,g6,clearance\n'
    const uploadId = await uploadDrawing(harness, Buffer.from(csv), 'custom-fit.csv', false, 'library')
    const imported = await invoke(harness, 'POST', '/libraries', { body: { uploadId, libraryType: 'tolerance' } })
    assert.equal(imported.payload.ok, true)
    assert.equal(imported.payload.entry.type, 'tolerance')

    const drawingUpload = await uploadDrawing(harness, readFileSync(COMPLIANT), 'compliant.dxf')
    const review = await invoke(harness, 'POST', '/review', {
      body: { uploadId: drawingUpload, options: { useLlm: false } },
    })
    assert.equal(review.payload.ok, true)
    assert.equal(review.payload.result.llm.ok, false)
    assert.deepEqual(review.payload.result.findings, [])
    const saved = await invoke(harness, 'GET', `/reviews/${review.payload.reviewId}`)
    assert.ok(saved.payload.review.sourceSnapshot.some(item => item.sourceId === imported.payload.entry.sourceId && item.complete && item.revision?.type === 'verified-original'))
  } finally {
    await unregister()
    rmSync(harness.dataDir, { recursive: true, force: true })
  }
})
