import { promises as fs } from 'node:fs'
import path from 'node:path'
import { createHash, randomUUID } from 'node:crypto'

const queues = new Map()
const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

function invalid(message, code = 'COLLECTION_INVALID') {
  const error = new Error(message)
  error.code = code
  return error
}

export function createStandardCollectionStore({ dataDir, uploadedOnly = false }, ruleStore, sourceStore, libraryStore, buildDocumentPreview = null) {
  const dir = path.join(dataDir, 'standard-collections')
  const serialize = operation => {
    const next = (queues.get(dir) || Promise.resolve()).catch(() => {}).then(operation)
    queues.set(dir, next)
    next.finally(() => { if (queues.get(dir) === next) queues.delete(dir) }).catch(() => {})
    return next
  }
  async function read(id) {
    if (typeof id !== 'string' || !ID.test(id)) return null
    try { return JSON.parse(await fs.readFile(path.join(dir, `${id}.json`), 'utf8')) }
    catch (error) { if (error.code === 'ENOENT') return null; throw error }
  }
  async function write(collection) {
    await fs.mkdir(dir, { recursive: true, mode: 0o700 })
    const file = path.join(dir, `${collection.id}.json`)
    const temp = `${file}.${randomUUID()}.tmp`
    try {
      await fs.writeFile(temp, JSON.stringify(collection, null, 2), { flag: 'wx', mode: 0o600 })
      await fs.rename(temp, file)
    } finally { await fs.rm(temp, { force: true }).catch(() => {}) }
  }
  async function version(body, number) {
    if (!body || typeof body !== 'object' || Array.isArray(body) || typeof body.name !== 'string' || !body.name.trim() || body.name.length > 200 || !Array.isArray(body.rules) || !Array.isArray(body.sourceIds)) throw invalid('名称、规则引用和资料引用无效')
    const files = await ruleStore.listFiles()
    const rules = []
    const seen = new Set()
    for (const ref of body.rules) {
      if (!ref || typeof ref.fileId !== 'string' || typeof ref.ruleId !== 'string') throw invalid('规则引用无效')
      const key = JSON.stringify([ref.fileId, ref.ruleId])
      if (seen.has(key)) throw invalid('规则引用重复')
      seen.add(key)
      const entry = files.find(item => item.id === ref.fileId)
      const file = entry && await ruleStore.getFile(entry.id)
      const rule = file?.rules?.find(item => item.id === ref.ruleId)
      if (!rule) throw invalid('引用的规则不存在', 'COLLECTION_REFERENCE_NOT_FOUND')
      rules.push({ fileId: ref.fileId, ruleId: ref.ruleId, fileVersion: entry.version, sourceId: entry.sourceId || null, fileSnapshot: file, fileSha256: createHash('sha256').update(JSON.stringify(file)).digest('hex'), sha256: createHash('sha256').update(JSON.stringify(rule)).digest('hex'), snapshot: rule })
    }
    const libraryEntries = await libraryStore.listLibraries()
    const standardSourceIds = [...body.sourceIds]
    const ruleSourceIds = [...new Set(rules.map(ref => ref.sourceId).filter(Boolean))]
    if (!ruleSourceIds.length || rules.some(ref => !ref.sourceId)) throw invalid('规则文件缺少可固定的原件', 'COLLECTION_REFERENCE_NOT_FOUND')
    const allSourceIds = [...new Set([...ruleSourceIds, ...standardSourceIds])]
    const sources = new Set((await sourceStore.listSources()).map(source => source.id))
    const allowedSources = new Set(libraryEntries.map(file => file.sourceId).filter(Boolean))
    if (body.sourceIds.some(id => !allowedSources.has(id))) throw invalid('集合只能引用规则库或标准库上传的文件', 'COLLECTION_REFERENCE_NOT_FOUND')
    if (uploadedOnly) {
      const builtinSources = new Set([...(await ruleStore.builtinSourceIds()), ...(await libraryStore.builtinSourceIds())])
      if (body.sourceIds.some(id => builtinSources.has(id))) throw invalid('集合只能引用用户上传的资料')
    }
    if (allSourceIds.some(id => typeof id !== 'string' || !sources.has(id))) throw invalid('引用的文件不存在', 'COLLECTION_REFERENCE_NOT_FOUND')
    if (new Set(body.sourceIds).size !== body.sourceIds.length) throw invalid('标准库引用重复')
    const sourceSnapshots = []
    for (const id of allSourceIds) {
      const source = await sourceStore.getSource(id)
      const original = await sourceStore.readOriginal(id)
      if (original.length !== source.size || createHash('sha256').update(original).digest('hex') !== source.sha256) throw invalid('资料原文校验失败', 'COLLECTION_INVALID')
      const history = await sourceStore.history(id)
      const revisions = history.filter(item => item.data?.extraction && typeof item.data.extraction === 'object' && !Array.isArray(item.data.extraction))
      const latest = revisions.at(-1)
      const textRevision = history.filter(item => typeof item.data?.text === 'string').at(-1)
      if (latest && revisions.length > 1 && latest.createdAt === revisions.at(-2).createdAt) throw invalid('资料修订顺序不明确')
      const referenceEntry = libraryEntries.find(item => item.sourceId === id && item.type === 'reference')
      const ruleFile = rules.find(ref => ref.sourceId === id)?.fileSnapshot
      let documentPreview = referenceEntry ? (await libraryStore.getLibrary(referenceEntry.id))?.documentPreview : null
      if (!documentPreview && ruleFile?.documentPreview?.sha256 === source.sha256) documentPreview = ruleFile.documentPreview
      if (!documentPreview && /\.(pdf|docx|xlsx)$/i.test(source.fileName) && buildDocumentPreview) {
        const built = await buildDocumentPreview(original, source.fileName)
        documentPreview = built ? { ...built, sha256: source.sha256 } : null
      }
      if (documentPreview && documentPreview.sha256 !== source.sha256) throw invalid('标准文档识别结果与原件不一致')
      const pdfPreview = /\.pdf$/i.test(source.fileName) ? documentPreview : null
      sourceSnapshots.push({ id, fileName: source.fileName, sha256: source.sha256, size: source.size, originalBase64: original.toString('base64'), extraction: source.extraction, revision: latest || null, ...(textRevision ? { textRevision } : {}), ...(latest ? { modelRevision: latest } : {}), ...(pdfPreview ? { pdfPreview } : {}), ...(documentPreview ? { documentPreview } : {}) })
    }
    const libraries = []
    const entries = libraryEntries
    for (const id of standardSourceIds) {
      const matches = entries.filter(entry => entry.sourceId === id)
      if (matches.length > 1) throw invalid('标准库资料引用不唯一')
      if (!matches.length) continue
      const entry = matches[0]
      if (entry.type === 'reference') continue
      if (libraries.some(item => item.type === entry.type)) throw invalid('同一类型只能引用一个标准库')
      const library = await libraryStore.getLibrary(entry.id)
      if (!library || library.id !== entry.id || library.type !== entry.type || library.version !== entry.version) throw invalid('引用的标准库不存在或已变化', 'COLLECTION_REFERENCE_NOT_FOUND')
      libraries.push({ id: entry.id, type: entry.type, version: entry.version, sourceId: id, snapshot: library, sha256: createHash('sha256').update(JSON.stringify(library)).digest('hex') })
    }
    const snapshot = { version: number, name: body.name.trim(), rules, sourceIds: allSourceIds, standardSourceIds, sourceSnapshots, libraries, createdAt: new Date().toISOString() }
    return { ...snapshot, sha256: createHash('sha256').update(JSON.stringify(snapshot)).digest('hex') }
  }
  async function create(body) {
    return serialize(async () => {
      const collection = { id: randomUUID(), versions: [await version(body, 1)] }
      await write(collection)
      return collection
    })
  }
  async function addVersion(id, body) {
    return serialize(async () => {
      const collection = await read(id)
      if (!collection || collection.deletedAt) return null
      if (!Number.isSafeInteger(body?.baseVersion) || body.baseVersion !== collection.versions.length) throw invalid('集合版本已变化，请重新读取后再提交', 'COLLECTION_VERSION_CONFLICT')
      collection.versions.push(await version(body, collection.versions.length + 1))
      await write(collection)
      return collection.versions.at(-1)
    })
  }
  async function remove(id) {
    return serialize(async () => {
      const collection = await read(id)
      if (!collection || collection.deletedAt) return false
      collection.deletedAt = new Date().toISOString()
      await write(collection)
      return true
    })
  }
  async function list() {
    let names
    try { names = await fs.readdir(dir) } catch (error) { if (error.code === 'ENOENT') return []; throw error }
    const collections = await Promise.all(names.filter(name => name.endsWith('.json') && ID.test(name.slice(0, -5))).map(name => read(name.slice(0, -5))))
    return collections.filter(collection => collection && !collection.deletedAt).map(collection => ({ id: collection.id, latest: collection.versions.at(-1) })).sort((a, b) => a.id.localeCompare(b.id))
  }
  return { create, addVersion, remove, get: read, list }
}
