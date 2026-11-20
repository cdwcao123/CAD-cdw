// 外部标准库存储：材料牌号库、公差与配合库；每种类型同一时间只启用一个库，保证结论可追溯。
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { isDeepStrictEqual } from 'node:util'
import { isValidLibraryId, normalizeLibrary, parseLibraryFile } from './library-import.js'

const queues = new Map()
const BUILTIN_FILES = [
  { type: 'material', file: 'materials-gb.json', id: 'materials-gb' },
  { type: 'tolerance', file: 'tolerances-gb.json', id: 'tolerances-gb' },
]

export function createLibraryStore(ctx, logger) {
  const uploadedOnly = ctx.uploadedOnly === true
  const dir = path.join(ctx.dataDir, 'libraries')
  const indexFile = path.join(dir, 'index.json')
  const serialize = operation => {
    const next = (queues.get(dir) || Promise.resolve()).catch(() => undefined).then(operation)
    queues.set(dir, next)
    next.finally(() => { if (queues.get(dir) === next) queues.delete(dir) }).catch(() => undefined)
    return next
  }

  async function ensureDir() {
    await fs.mkdir(dir, { recursive: true, mode: 0o700 })
  }

  async function writeJson(file, value) {
    await ensureDir()
    const temporary = `${file}.${randomUUID()}.tmp`
    try {
      await fs.writeFile(temporary, JSON.stringify(value, null, 2), { encoding: 'utf8', mode: 0o600, flag: 'wx' })
      await fs.rename(temporary, file)
    } finally {
      await fs.rm(temporary, { force: true }).catch(() => undefined)
    }
  }

  async function readJson(file, fallback) {
    try {
      return JSON.parse(await fs.readFile(file, 'utf8'))
    } catch (error) {
      if (error?.code === 'ENOENT') return fallback
      if (error instanceof SyntaxError) {
        logger?.warn?.({ operation: 'libraries.read', errorCode: 'LIBRARY_INDEX_INVALID' }, '标准库索引损坏，已重建')
        return fallback
      }
      throw error
    }
  }

  async function seedBuiltin() {
    const index = await readJson(indexFile, null)
    if (uploadedOnly) return Array.isArray(index) ? index : []
    if (Array.isArray(index)) return index
    await ensureDir()
    for (const item of BUILTIN_FILES) {
      try {
        await fs.access(path.join(dir, `${item.id}.json`))
        return []
      } catch (error) {
        if (error.code !== 'ENOENT') throw error
      }
    }
    const entries = []
    for (const item of BUILTIN_FILES) {
      const raw = JSON.parse(readFileSync(new URL(`../libraries/${item.file}`, import.meta.url), 'utf8'))
      const library = normalizeLibrary(raw, { sourceType: 'builtin', sourceFile: `libraries/${item.file}` })
      library.id = item.id
      library.sourceType = 'builtin'
      await writeJson(path.join(dir, `${item.id}.json`), library)
      entries.push({
        id: item.id,
        type: item.type,
        name: library.name,
        version: library.version,
        standard: library.standard,
        sourceType: 'builtin',
        sourceFile: `libraries/${item.file}`,
        importedAt: new Date().toISOString(),
        itemCount: library.itemCount,
        active: true,
        builtin: true,
      })
    }
    await writeJson(indexFile, entries)
    return entries
  }

  async function listLibraries() {
    return serialize(async () => ((await seedBuiltin()) || []).filter(entry => !uploadedOnly || !entry.builtin).map(entry => ({ ...entry })))
  }

  async function getLibrary(id) {
    if (!isValidLibraryId(id)) return null
    return readJson(path.join(dir, `${id}.json`), null)
  }

  async function importLibrary(buffer, fileName, libraryType = null, options = {}) {
    return serialize(async () => {
      await ensureDir()
      let parsed
      try {
        parsed = parseLibraryFile(buffer, fileName, libraryType)
      } catch (error) {
        if (!options.documentPreview?.fragments?.length) throw error
        const extension = path.extname(fileName).toLowerCase().replace(/^\./, '') || 'document'
        parsed = {
          library: {
            id: `document-${randomUUID()}`,
            type: 'reference',
            name: fileName,
            version: 'V1',
            sourceType: extension,
            sourceFile: fileName,
            itemCount: options.documentPreview.fragments.length,
            documentPreview: options.documentPreview,
            allExtractedContent: true,
          },
          warnings: [`${error.message || '未识别为结构化标准库'}；已将文件作为通用标准资料导入。`],
        }
      }
      const library = parsed.library
      let id = library.id
      const index = (await readJson(indexFile, null)) || (await seedBuiltin()) || []
      if (index.some(item => item.id.toLowerCase() === id.toLowerCase() && item.builtin)) id = `${id.slice(0, 43)}-${randomUUID()}`
      library.id = id
      await writeJson(path.join(dir, `${id}.json`), library)
      const entry = {
        id,
        type: library.type,
        name: library.name,
        version: library.version,
        standard: library.standard,
        sourceType: library.sourceType,
        sourceFile: fileName,
        sourceId: options.sourceId || null,
        importedAt: new Date().toISOString(),
        itemCount: library.itemCount,
        active: true,
        builtin: false,
        warnings: parsed.warnings || [],
      }
      const next = [
        entry,
        ...index
          .filter(item => String(item.id).toLowerCase() !== id.toLowerCase())
          .map(item => (item.type === library.type && item.type !== 'reference' ? { ...item, active: false } : item)),
      ]
      await writeJson(indexFile, next)
      logger?.info?.({ operation: 'libraries.import', count: entry.itemCount, statusCode: 200 }, '标准库已导入')
      return { entry, warnings: parsed.warnings || [] }
    })
  }

  async function setActive(id, active) {
    return serialize(async () => {
      const index = (await readJson(indexFile, null)) || []
      const target = index.find(item => item.id === id)
      if (!target) return null
      target.active = Boolean(active)
      if (target.active) {
        for (const item of index) {
          if (item.id !== id && item.type === target.type && item.type !== 'reference') item.active = false
        }
      }
      await writeJson(indexFile, index)
      return target
    })
  }

  async function deleteLibrary(id) {
    if (!isValidLibraryId(id)) return false
    return serialize(async () => {
      const index = (await readJson(indexFile, null)) || []
      const target = index.find(item => item.id === id)
      if (!target) return false
      if (target.builtin) {
        target.active = false
        await writeJson(indexFile, index)
          return true
      }
      await fs.rm(path.join(dir, `${id}.json`), { force: true })
      await writeJson(indexFile, index.filter(item => item.id !== id))
      return true
    })
  }

  async function getActiveLibraries() {
    return serialize(async () => {
    const index = (await seedBuiltin()) || []
    const active = index.filter(item => item.active && (!uploadedOnly || !item.builtin))
    const materialEntry = active.find(item => item.type === 'material') || null
    const toleranceEntry = active.find(item => item.type === 'tolerance') || null
    const material = materialEntry ? await getLibrary(materialEntry.id) : null
    const tolerance = toleranceEntry ? await getLibrary(toleranceEntry.id) : null
    const value = {
      material,
      tolerance,
      sources: [materialEntry, toleranceEntry].filter(Boolean).map(item => ({
        id: item.id,
        type: item.type,
        name: item.name,
        version: item.version,
        standard: item.standard,
        sourceType: item.sourceType,
      })),
    }
    return value
    })
  }

  async function associateBuiltinSources(createSource) {
    return serialize(async () => {
      const index = await seedBuiltin()
      for (const item of BUILTIN_FILES) {
        const entry = index.find(value => value.id === item.id && value.type === item.type && value.builtin === true && value.sourceType === 'builtin' && value.sourceFile === `libraries/${item.file}`)
        if (!entry || entry.sourceId) continue
        const bytes = await fs.readFile(new URL(`../libraries/${item.file}`, import.meta.url))
        const expected = normalizeLibrary(JSON.parse(bytes.toString('utf8')), { sourceType: 'builtin', sourceFile: `libraries/${item.file}` })
        expected.id = item.id
        expected.sourceType = 'builtin'
        const installed = await getLibrary(item.id)
        if (installed && Object.hasOwn(installed, 'importedAt')) expected.importedAt = installed.importedAt
        if (!isDeepStrictEqual(installed, expected)) continue
        const source = await createSource(bytes, item.file)
        entry.sourceId = source.id
        await writeJson(indexFile, index)
      }
    })
  }

  async function summary() {
    const libraries = await listLibraries()
    return {
      directory: dir,
      total: libraries.length,
      material: libraries.filter(item => item.type === 'material' && item.active).length,
      tolerance: libraries.filter(item => item.type === 'tolerance' && item.active).length,
    }
  }

  return {
    dir,
    builtinSourceIds: async () => ((await readJson(indexFile, [])) || []).filter(item => item.builtin && item.sourceId).map(item => item.sourceId),
    ensureSeeded: () => serialize(seedBuiltin),
    associateBuiltinSources,
    listLibraries,
    getLibrary,
    importLibrary,
    setActive,
    deleteLibrary,
    getActiveLibraries,
    summary,
  }
}
