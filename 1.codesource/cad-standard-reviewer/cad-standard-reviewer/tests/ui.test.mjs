import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import component from '../index.js'
import { analyzeDxfBuffer } from '../server/analyze.js'
import { publicCatalog } from '../server/rule-catalog.js'
import { normalizeRuleSet } from '../server/rule-import.js'
import { parseLibraryFile } from '../server/library-import.js'

const DATA_DIR = process.env.CAD_RULE_TEST_DATA || 'E:/国睿/测试数据'
const SAMPLE = `${DATA_DIR}/GW-2026-001_支架组件_A2.dxf`

const h = (type, props, children) => ({ type, props: props || {}, children })

test('插件捕获 Vue 异常时记录安全的类型和位置而不阻止宿主处理', () => {
  const { vm } = createVm()
  const calls = []
  vm.logEvent = (...args) => calls.push(args)
  const error = new TypeError('文档敏感内容')
  error.stack = 'TypeError: 文档敏感内容\n    at render (http://localhost/plugin/index.js:123:45)'
  assert.equal(component.errorCaptured.call(vm, error, null, 'render function'), undefined)
  assert.equal(calls[0][2].reason, 'TypeError')
  assert.equal(calls[0][2].kind, 'render-function')
  assert.equal(calls[0][2].state, 'index.123.45')
  assert.ok(!JSON.stringify(calls).includes('文档敏感内容'))
})

test('插件自身渲染异常保留异常并记录定位信息', () => {
  const { vm } = createVm()
  const calls = []
  vm.logEvent = (...args) => calls.push(args)
  const error = new TypeError('私有数据')
  error.stack = 'TypeError: 私有数据\n    at render (http://localhost/plugin/index.js:321:4)'
  vm.renderHeader = () => { throw error }
  assert.throws(() => component.render.call(vm), err => err === error)
  assert.equal(calls[0][2].state, 'index.321.4')
  assert.equal(calls[0][2].kind, 'render')
  assert.ok(!JSON.stringify(calls).includes('私有数据'))
})

test('规则库展示读取正文并保存编辑版本，不显示资料管理入口', async () => {
  const { vm } = createVm()
  vm.tab = 'rules'
  vm.ruleFiles = [{ id: 'r', sourceId: 's', name: '规则文件' }]
  const source = { id: 's', fileName: '规则.docx', originalExtraction: { complete: false, text: null }, preview: { reason: '可能遗漏图示', fragments: [{ text: '读取的规则正文' }] }, history: [] }
  let saved = null
  vm.pluginApi.http.get = async () => ({ ok: true, source })
  vm.pluginApi.http.put = async (url, body) => { saved = body; return { ok: true, source: { ...source, history: [{ type: 'manual', data: { text: body.extraction.text } }] } } }
  await vm.openSource('s')
  let text = ''
  walk(vm.render(), node => { if (typeof node === 'string') text += node })
  assert.ok(text.includes('提取正文'))
  assert.ok(text.includes('可能遗漏图示'))
  assert.ok(!text.includes('资料管理'))
  assert.equal(vm.sourceDraft, '读取的规则正文')
  vm.sourceDraft = '用户修订正文'
  await vm.updateSource('edit')
  assert.equal(saved.extraction.text, '用户修订正文')
})

test('标准库页面只展示上传文件并可编辑正文版本', async () => {
  const { vm } = createVm()
  vm.tab = 'libraries'
  const source = { id: 'standard-source', fileName: '企业标准.yaml', originalExtraction: { complete: true, text: '标题: 企业标准\n要求: 10mm' }, history: [] }
  let sent
  vm.pluginApi.http.get = async () => ({ ok: true, source })
  vm.pluginApi.http.put = async (url, body) => { sent = body; return { ok: true, source: { ...source, history: [{ type: 'manual', data: { text: body.extraction.text } }] } } }
  await vm.openSource('standard-source')
  let text = ''
  walk(vm.render(), node => { if (typeof node === 'string') text += node })
  assert.ok(text.includes('标准库文件'))
  assert.ok(text.includes('企业标准.yaml'))
  assert.ok(!text.includes('材料牌号库'))
  assert.ok(!text.includes('公差与配合库'))
  assert.ok(!text.includes('下载模板'))
  assert.equal(vm.sourceDraft, '标题: 企业标准\n要求: 10mm')
  vm.sourceDraft = '标题: 企业标准\n要求: 12mm'
  await vm.updateSource('edit')
  assert.equal(sent.extraction.text, '标题: 企业标准\n要求: 12mm')
})

test('待核对的本地初查候选可查看和导出但不作为最终问题', () => {
  const { vm, result } = createVm()
  vm.result = { ...result, findings: [], localAnalysis: { notice: '须核对规范', findings: [{ ruleId: 'R01', title: '<候选>', measured: '2', detail: '偏差' }] }, llm: { ...result.llm, verdict: '不符合', added: 0, reviewed: 0 } }
  let text = ''
  walk(vm.render(), node => { if (typeof node === 'string') text += node })
  assert.ok(text.includes('本地初查候选'))
  assert.ok(text.includes('没有可展示的具体问题'))
  let html = ''
  vm.download = (name, value) => { html = value }
  vm.exportHtml()
  assert.ok(html.includes('&lt;候选&gt;'))
  assert.ok(html.includes('不能据此认定图纸符合'))
})

function createVm() {
  const testRuleSet = normalizeRuleSet(JSON.parse(readFileSync(new URL('../rules/v1.json', import.meta.url), 'utf8')), { sourceType: 'test', fileName: 'v1.json' })
  const testLibraries = {
    material: parseLibraryFile(readFileSync(new URL('../libraries/materials-gb.json', import.meta.url)), 'materials.json').library,
    tolerance: parseLibraryFile(readFileSync(new URL('../libraries/tolerances-gb.json', import.meta.url)), 'tolerances.json').library,
  }
  const analysis = analyzeDxfBuffer(readFileSync(SAMPLE), { fileName: 'sample.dxf', useLlm: false, maxEvidenceTexts: 30, ruleSet: testRuleSet, libraries: testLibraries })
  const result = {
    fileName: 'sample.dxf',
    elapsedMs: 120,
    createdAt: new Date().toISOString(),
    ruleSet: analysis.ruleSet,
    verdict: analysis.verdict,
    stats: analysis.stats,
    findings: analysis.findings,
    drawing: analysis.drawing,
    summary: analysis.summary,
    warnings: [],
    llm: {
      enabled: true,
      ok: true,
      model: { providerId: 'p', modelId: 'm' },
      reviewed: 22,
      added: 1,
      summary: '建议优先整改关键项。',
      notes: ['先整改关键项'],
      elapsedMs: 900,
    },
  }
  const vm = {
    ...component.data(),
    pluginApi: { metadata: { version: '1.0.0' }, http: { path: suffix => `/elvespuck/api/plugins/cad-standard-reviewer${suffix}` } },
    vueH: h,
    $refs: {},
  }
  for (const [key, method] of Object.entries(component.methods)) vm[key] = method.bind(vm)
  vm.render = component.render.bind(vm)
  for (const [key, getter] of Object.entries(component.computed || {})) {
    Object.defineProperty(vm, key, { get: getter.bind(vm), configurable: true })
  }
  vm.booting = false
  vm.bootError = ''
  vm.health = {
    ok: true,
    pluginVersion: '1.0.0',
    capabilities: { llm: true },
    logs: { pluginLog: 'plugins/cad-standard-reviewer.log', auditFile: 'logs/audit-2026-11-16.ndjson' },
  }
  vm.catalog = publicCatalog(testRuleSet)
  vm.settings = {
    useLlm: true,
    model: '',
    llmTimeoutMs: 90000,
    strict: false,
    enabledRules: publicCatalog(testRuleSet).rules.map(rule => rule.id),
    thresholds: { frameToleranceMm: 1, scaleTolerancePct: 1, lineWidthToleranceMm: 0.1, titleNameMinHeight: 5, techRequirementMinHeight: 3.5 },
    retentionDays: 90,
    maxReviews: 200,
  }
  vm.draft = vm.cloneSettings(vm.settings)
  vm.result = result
  vm.history = [
    {
      id: 'r1',
      createdAt: new Date().toISOString(),
      fileName: 'sample.dxf',
      verdict: '不符合',
      findings: 22,
      sheet: 'A2',
      llmOk: true,
      llmAdded: 1,
      elapsedMs: 120,
    },
  ]
  vm.logs = [
    {
      time: new Date().toISOString(),
      event: 'review.completed',
      fileName: 'sample.dxf',
      verdict: '不符合',
      findings: 22,
      llmOk: true,
      llmAdded: 1,
      elapsedMs: 120,
    },
  ]
  vm.logLocations = {
    audit: '插件数据目录/logs/audit-YYYY-MM-DD.ndjson',
    hostPluginLog: '<日志目录>/plugins/cad-standard-reviewer.log',
    note: '审计日志只记录审查元数据，不保存图纸正文。',
  }
  vm.file = { name: 'sample.dxf', size: 137038, lastModified: Date.now() }
  vm.ruleFiles = [
    {
      id: 'user-rule',
      sourceId: 'rule-source',
      name: '企业制图规则',
      version: 'V2',
      sourceType: 'docx',
      sourceFile: '企业制图规则.docx',
      ruleCount: 12,
      checkpointCount: 22,
      active: true,
      builtin: false,
    },
  ]
  vm.ruleSummary = { files: 1, activeFiles: 1, activeNames: ['企业制图规则'] }
  vm.libraries = [
    { id: 'standard-doc', type: 'reference', name: '企业标准', version: 'V1', sourceType: 'yaml', sourceFile: '企业标准.yaml', sourceId: 'standard-source', itemCount: 12, active: true, builtin: false },
    { id: 'material-upload', type: 'material', name: '材料标准', version: 'V1', sourceType: 'csv', sourceFile: '材料标准.csv', sourceId: 'material-source', itemCount: 8, active: true, builtin: false },
  ]
  vm.librarySummary = { total: 2, material: 1, tolerance: 0 }
  vm.logPaths = {
    hostLogFile: 'C:////Users////admin////AppData////Local////logs////plugins////cad-standard-reviewer.log',
    hostLogDir: 'C:////Users////admin////AppData////Local////logs////plugins',
    hostLogExists: true,
    hostLogSize: 2048,
    hostLogMtime: new Date().toISOString(),
    auditFile: 'C:////Users////admin////AppData////Local////data////plugins////cad-standard-reviewer////logs////audit-2026-11-16.ndjson',
    auditDir: 'C:////Users////admin////AppData////Local////data////plugins////cad-standard-reviewer////logs',
    auditStat: { exists: true, size: 512 },
    reviewsDir: 'C:////Users////admin////AppData////Local////data////plugins////cad-standard-reviewer////reviews',
    rulesDir: 'C:////Users////admin////AppData////Local////data////plugins////cad-standard-reviewer////rules',
    dataDir: 'C:////Users////admin////AppData////Local////data////plugins////cad-standard-reviewer',
  }
  return { vm, result }
}

function walk(node, visit) {
  if (node === null || node === undefined || node === false) return
  if (Array.isArray(node)) {
    for (const item of node) walk(item, visit)
    return
  }
  if (typeof node === 'string' || typeof node === 'number') {
    visit(node)
    return
  }
  if (node.type) {
    visit(node)
    walk(node.children, visit)
  }
}

test('前端渲染：审查、规则、候选记录、日志、设置均可渲染', () => {
  const { vm } = createVm()
  for (const tab of ['review', 'rules', 'history', 'logs', 'settings']) {
    vm.tab = tab
    const vnode = vm.render()
    assert.ok(vnode && vnode.type === 'div')
    let count = 0
    walk(vnode, node => {
      count += 1
      if (node && typeof node === 'object' && node.type) assert.equal(typeof node.type, 'string')
    })
    assert.ok(count > 10, `${tab} 渲染节点过少`)
  }
})

test('标准集合：加载、选择文件与资料、创建和审查提示', async () => {
  const { vm } = createVm()
  const calls = []
  let collections = [{ id: 'c1', latest: { name: '已有集合', version: 3, rules: [], sourceIds: [] } }]
  vm.pluginApi.showToast = () => {}
  vm.pluginApi.http.get = async path => {
    calls.push(['get', path])
    if (path.endsWith('/standard-collections')) return { ok: true, collections }
    if (path.endsWith('/rule-files')) return { ok: true, files: [{ id: 'r/1', name: '规则文件', version: 'v1' }] }
    if (path.endsWith('/libraries')) return { ok: true, files: [{ id: 'l1', sourceId: 's1', sourceFile: '资料一' }] }
    if (path.endsWith('/rule-files/r%2F1')) return { ok: true, ruleSet: { rules: [{ id: 'R1' }, { id: 'R2' }] } }
    throw new Error(path)
  }
  vm.pluginApi.http.post = async (path, body) => {
    calls.push(['post', path, body])
    collections = [...collections, { id: 'c2', latest: { ...body, version: 1 } }]
    return { ok: true, collection: { id: 'c2' } }
  }
  await vm.loadCollectionInputs()
  vm.tab = 'collections'
  let text = ''
  let checkboxes = []
  walk(vm.render(), node => {
    if (typeof node === 'string') text += node
    if (node?.type === 'input' && node.props.type === 'checkbox') checkboxes.push(node)
  })
  assert.ok(text.includes('已有集合 · 版本 3'))
  assert.ok(text.includes('规则文件'))
  assert.ok(text.includes('资料一'))
  assert.equal(checkboxes.length, 2)
  checkboxes[0].props.onChange({ target: { checked: true } })
  checkboxes[1].props.onChange({ target: { checked: true } })
  vm.collectionName = '新集合'
  await vm.createCollection()
  assert.deepEqual(calls.find(call => call[0] === 'post')[2], { name: '新集合', rules: [{ fileId: 'r/1', ruleId: 'R1' }, { fileId: 'r/1', ruleId: 'R2' }], sourceIds: ['s1'] })
  assert.equal(vm.collections.length, 2)
  vm.tab = 'review'
  let select
  text = ''
  walk(vm.render(), node => {
    if (typeof node === 'string') text += node
    if (node?.type === 'select' && node.props.id === 'cad-review-collection') select = node
  })
  select.props.onChange({ target: { value: 'c1' } })
  assert.equal(vm.selectedCollectionId, 'c1')
  assert.equal(vm.selectedCollectionVersion, 3)
  assert.ok(text.includes('标准库不是必需项'))
  assert.ok(text.includes('已有集合 · 版本 3'))
})

test('标准集合可查看文件并通过更新版本增加删除文件', async () => {
  const { vm } = createVm()
  const latest = {
    name: '集合A',
    version: 2,
    rules: [{ fileId: 'r1', sourceId: 'rs1', fileSnapshot: { sourceFile: '规则A.docx' } }],
    standardSourceIds: ['s1'],
    sourceIds: ['rs1', 's1'],
    sourceSnapshots: [{ id: 'rs1', fileName: '规则A.docx' }, { id: 's1', fileName: '标准A.yaml' }],
  }
  vm.collections = [{ id: 'c1', latest }]
  vm.ruleFiles = [{ id: 'r1', name: '规则A', sourceId: 'rs1', version: 'V1' }]
  vm.sources = [{ id: 's1', fileName: '标准A.yaml' }, { id: 's2', fileName: '标准B.pdf' }]
  vm.tab = 'collections'
  vm.expandedCollectionIds = { c1: true }
  let text = ''
  walk(vm.render(), node => { if (typeof node === 'string') text += node })
  assert.ok(text.includes('规则A.docx'))
  assert.ok(text.includes('标准A.yaml'))
  vm.editCollection(vm.collections[0])
  assert.deepEqual(vm.collectionRuleFiles, ['r1'])
  assert.deepEqual(vm.collectionSourceIds, ['s1'])
  vm.collectionSourceIds = ['s2']
  const calls = []
  vm.pluginApi.http.get = async path => path.endsWith('/rule-files/r1') ? { ok: true, ruleSet: { rules: [{ id: 'R1' }] } } : { ok: true }
  vm.pluginApi.http.post = async (path, body) => { calls.push({ path, body }); return { ok: true } }
  vm.refreshCollections = async () => {}
  await vm.createCollection()
  assert.ok(calls[0].path.endsWith('/standard-collections/c1/versions'))
  assert.deepEqual(calls[0].body.sourceIds, ['s2'])
})

test('审查请求固定所选集合版本，未选择时不传集合', async () => {
  const { vm, result } = createVm()
  const calls = []
  vm.fileBytes = new Uint8Array([1, 2])
  vm.collections = [{ id: 'c1', latest: { name: '集合', version: 3 } }]
  vm.pluginApi.showToast = () => {}
  vm.pluginApi.http.post = async (path, body) => {
    calls.push({ path, body })
    if (path.endsWith('/uploads')) return { ok: true, uploadId: 'u1' }
    if (path.endsWith('/chunks')) return { ok: true }
    if (path.endsWith('/review')) return { ok: true, result }
    throw new Error(path)
  }
  vm.refreshHistory = async () => {}
  vm.refreshLogs = async () => {}
  let select
  walk(vm.render(), node => { if (node?.type === 'select' && node.props.id === 'cad-review-collection') select = node })
  select.props.onChange({ target: { value: 'c1' } })
  vm.collections[0].latest.version = 4
  await vm.runReview()
  let body = calls.find(call => call.path.endsWith('/review')).body
  assert.equal(body.collectionId, 'c1')
  assert.equal(body.collectionVersion, 3)
  calls.length = 0
  select.props.onChange({ target: { value: '' } })
  await vm.runReview()
  body = calls.find(call => call.path.endsWith('/review')).body
  assert.ok(!('collectionId' in body))
  assert.ok(!('collectionVersion' in body))
})

test('批量审查固定版本，逐张显示成功与失败', async () => {
  const { vm, result } = createVm()
  const calls = []
  vm.selectedCollectionId = 'c1'
  vm.selectedCollectionVersion = 3
  vm.pluginApi.showToast = () => {}
  vm.refreshHistory = async () => {}
  vm.refreshLogs = async () => {}
  vm.pluginApi.http.post = async (path, body) => {
    if (path.endsWith('/uploads')) return { ok: true, uploadId: body.fileName }
    if (path.endsWith('/chunks')) return { ok: true }
    calls.push(body)
    vm.selectedCollectionVersion = 4
    return body.fileName === 'bad.dxf' ? { ok: false, error: { message: '审查失败原因' } } : { ok: true, result: { ...result, fileName: body.fileName } }
  }
  const file = name => ({ name, size: 1, arrayBuffer: async () => new Uint8Array([1]).buffer })
  await vm.acceptFiles([file('one.dxf'), file('bad.dxf'), file('two.dxf')])
  await vm.runBatchReview()
  assert.deepEqual(calls.map(call => call.collectionVersion), [3, 3, 3])
  assert.equal(vm.batchResults.length, 3)
  assert.equal(vm.batchResults[1].error, '审查失败原因')
  let text = ''
  walk(vm.render(), node => { if (typeof node === 'string') text += node })
  for (const expected of ['one.dxf', 'bad.dxf', 'two.dxf', '审查失败原因', '查看报告']) assert.ok(text.includes(expected), expected)
})

test('历史报告不展示模型资料，导出仍可追溯且转义 HTML', () => {
  const { vm, result } = createVm()
  vm.historyDetail = { fileName: 'sample.dxf', result, modelSources: [{ extraction: { text: '<script>原文</script>' }, complete: false, reason: '不完整' }] }
  vm.tab = 'history'
  let text = ''
  walk(vm.render(), node => { if (typeof node === 'string') text += node })
  assert.ok(!text.includes('<script>原文</script>'))
  let html = ''
  vm.download = (name, content) => { html = content }
  vm.exportHtml()
  assert.ok(html.includes('&lt;script&gt;原文&lt;/script&gt;'))
  assert.ok(!html.includes('<script>原文</script>'))
  vm.exportJson()
  assert.equal(JSON.parse(html).modelSources[0].extraction.text, '<script>原文</script>')
})

test('标准集合：接口失败保留输入并显示错误', async () => {
  const { vm } = createVm()
  vm.collectionName = '保留名称'
  vm.collectionRuleFiles = ['user-rule']
  vm.pluginApi.http.get = async path => path.endsWith('/standard-collections')
    ? { ok: false, error: { message: '集合不可用' } }
    : { ok: true, ruleSet: { rules: [{ id: 'R1' }] } }
  await vm.refreshCollections()
  assert.equal(vm.collectionLoadError, '集合不可用')
  vm.pluginApi.http.post = async () => ({ ok: false, error: { message: '创建失败' } })
  await vm.createCollection()
  assert.equal(vm.collectionFormError, '创建失败')
  assert.equal(vm.collectionName, '保留名称')
})

test('集合表单校验错误不会在图纸审查页面显示', async () => {
  const { vm } = createVm()
  vm.pluginApi.showToast = () => {}
  await vm.createCollection()
  assert.match(vm.collectionFormError, /集合名称/)
  vm.tab = 'review'
  let text = ''
  walk(vm.render(), node => { if (typeof node === 'string') text += node })
  assert.ok(!text.includes('集合加载失败'))
  assert.ok(!text.includes('请输入不超过 200 字的集合名称'))
})

test('导入规则与标准库时显示自动校准失败原因', async () => {
  const { vm } = createVm()
  vm.pluginApi.showToast = () => {}
  vm.gzip = async bytes => ({ bytes, compressed: false })
  vm.refreshRules = async () => {}
  vm.refreshLibraries = async () => {}
  vm.pluginApi.http.post = async path => {
    if (path.endsWith('/uploads')) return { ok: true, uploadId: 'upload' }
    if (path.endsWith('/chunks')) return { ok: true }
    return { ok: true, entry: { name: '测试', ruleCount: 1 }, calibration: { ok: false, error: { message: '宿主模型不可用' } } }
  }
  const file = { name: 'test.json', size: 2, arrayBuffer: async () => new Uint8Array([123, 125]).buffer }
  await vm.uploadRuleFile(file)
  assert.ok(vm.ruleWarnings.some(item => item.includes('宿主模型不可用')))
  await vm.uploadLibraryFile(file)
  assert.ok(vm.libraryWarnings.some(item => item.includes('宿主模型不可用')))
})

test('前端渲染：历史详情与问题展开', () => {
  const { vm, result } = createVm()
  vm.tab = 'history'
  vm.historyDetail = { id: 'r1', fileName: 'sample.dxf', createdAt: new Date().toISOString(), fileSize: 137038, sha256: 'abc', result }
  vm.expanded = { [result.findings[0].id]: true }
  vm.showEvidence = { [result.findings[0].id]: true }
  const vnode = vm.render()
  let text = ''
  walk(vnode, node => {
    if (typeof node === 'string') text += node
  })
  assert.ok(text.includes('问题清单'))
  assert.ok(text.includes('导出 HTML'))
})

test('前端渲染：规则文件与绝对日志路径', () => {
  const { vm } = createVm()
  vm.tab = 'rules'
  let text = ''
  walk(vm.render(), node => {
    if (typeof node === 'string') text += node
  })
  assert.ok(text.includes('规则文件'))
  assert.ok(text.includes('企业制图规则'))
  assert.ok(!text.includes('内置'))
  assert.ok(!text.includes('[object Object]'))

  vm.tab = 'logs'
  text = ''
  walk(vm.render(), node => {
    if (typeof node === 'string') text += node
  })
  assert.ok(text.includes('cad-standard-reviewer.log'))
  assert.ok(text.includes('打开位置'))
  assert.ok(text.includes('复制路径'))
})

test('前端渲染：空状态与引导态', () => {
  const { vm } = createVm()
  vm.result = null
  vm.tab = 'review'
  const vnode = vm.render()
  let text = ''
  walk(vnode, node => {
    if (typeof node === 'string') text += node
  })
  assert.ok(text.includes('选择图纸'))
  assert.ok(text.includes('审查依据'))
})


test('页面状态：离开再回来可恢复审查结果与页签', async () => {
  const { vm } = createVm()
  const store = new Map()
  const storage = {
    get: async key => (store.has(key) ? store.get(key) : null),
    set: async (key, value) => {
      store.set(key, value)
      return true
    },
    remove: async key => {
      store.delete(key)
      return true
    },
  }
  vm.pluginApi.storage = storage
  vm.tab = 'review'
  vm.filterSeverity = '关键'
  await vm.saveSession()
  assert.ok(store.has('cad-reviewer-session-v1'))

  const { vm: restored } = createVm()
  restored.pluginApi.storage = storage
  restored.result = null
  restored.file = null
  restored.tab = 'review'
  const ok = await restored.restoreSession()
  assert.equal(ok, true)
  assert.equal(restored.restored, true)
  assert.equal(restored.tab, 'review')
  assert.equal(restored.result.findings.length, 22)
  assert.equal(restored.file.name, 'sample.dxf')
  assert.equal(restored.fileBytes, null)
  assert.equal(restored.filterSeverity, '关键')
  await restored.clearSession()
  assert.ok(!store.has('cad-reviewer-session-v1'))
})


test('前端渲染：恢复上次结果与大模型失败诊断', () => {
  const { vm } = createVm()
  vm.tab = 'review'
  vm.fileBytes = null
  vm.restored = true
  vm.restoredAt = new Date().toISOString()
  vm.result.llm = {
    enabled: true,
    ok: false,
    errorCode: 'PLUGIN_ENGINE_RESPONSE_INVALID',
    message: '模型返回内容不符合约定 JSON 结构，已仅使用本地规则引擎。',
    errorDetail: '错误码 PLUGIN_ENGINE_RESPONSE_INVALID；原因 TRUNCATED_JSON；模型输出 24000 字；输出接近上限，可能被截断',
  }
  let text = ''
  walk(vm.render(), node => {
    if (typeof node === 'string') text += node
  })
  assert.ok(text.includes('已恢复上次审查结果'))
  assert.ok(text.includes('原始文件内容未保留'))
  assert.ok(text.includes('诊断：'))
  assert.ok(text.includes('查看本机日志'))
  assert.ok(text.includes('问题清单'))
})


test('前端渲染：标准库页面与库版本', () => {
  const { vm, result } = createVm()
  vm.tab = 'libraries'
  let text = ''
  walk(vm.render(), node => {
    if (typeof node === 'string') text += node
  })
  assert.ok(text.includes('标准库文件'))
  assert.ok(text.includes('企业标准.yaml'))
  assert.ok(text.includes('材料标准.csv'))
  assert.ok(!text.includes('下载模板'))
  assert.ok(!text.includes('内置'))
  assert.ok(!text.includes('[object Object]'))

  vm.tab = 'review'
  result.libraries = {
    material: { name: '企业材料库', version: '2026.99' },
    tolerance: { name: '企业公差库', version: '2027' },
  }
  text = ''
  walk(vm.render(), node => {
    if (typeof node === 'string') text += node
  })
  assert.ok(text.includes('材料库 企业材料库 2026.99'))
  assert.ok(text.includes('公差库 企业公差库 2027'))
})


test('前端渲染：不再出现严格模式/大模型开关/模型配置', () => {
  const { vm } = createVm()
  vm.tab = 'review'
  let text = ''
  walk(vm.render(), node => {
    if (typeof node === 'string') text += node
  })
  assert.ok(!text.includes('严格模式'))
  assert.ok(!text.includes('启用大模型审查'))
  assert.ok(text.includes('每次审查自动执行'))

  vm.tab = 'settings'
  text = ''
  walk(vm.render(), node => {
    if (typeof node === 'string') text += node
  })
  assert.ok(!text.includes('模型（providerId/modelId'))
  assert.ok(!text.includes('调用超时'))
  assert.ok(!text.includes('模型只收到结构化图纸证据'))
  assert.ok(text.includes('审查与存储'))
  assert.ok(text.includes('材料库'))
})
