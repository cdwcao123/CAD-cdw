// 规则文件库：内置规则只是首次播种的一个文件；上传、启停、合并与删除都在本机数据目录完成。
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { isDeepStrictEqual } from 'node:util'
import { normalizeRuleSet, parseRuleFile } from './rule-import.js'

const BUILTIN_PATH = new URL('../rules/v1.json', import.meta.url)
const BUILTIN_ID = 'cn-mech-2d-v1'
const BUILTIN_NAME = '二维图样标准化审查规则（V1）'
const queues = new Map()

export function createRuleStore(ctx, logger) {
  const uploadedOnly = ctx.uploadedOnly === true
  const dir = path.join(ctx.dataDir, 'rules')
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
        logger?.warn?.({ operation: 'rules.read', errorCode: 'RULES_JSON_INVALID' }, '规则索引损坏，已重建')
        return fallback
      }
      throw error
    }
  }

  async function readIndex() {
    const index = await readJson(indexFile, null)
    if (Array.isArray(index)) return index
    return null
  }

  async function seedBuiltin() {
    const index = await readIndex()
    if (uploadedOnly) return index || []
    if (index) {
      const entry = index.find(item => item.id === BUILTIN_ID && item.builtin && item.sourceType === 'builtin')
      if (entry) {
        const file = path.join(dir, `${BUILTIN_ID}.json`)
        const installed = await readJson(file, null)
        const raw = JSON.parse(readFileSync(BUILTIN_PATH, 'utf8'))
        const current = normalizeRuleSet(raw, { sourceType: 'builtin', fileName: 'rules/v1.json' })
        current.id = BUILTIN_ID
        current.name = raw.name || BUILTIN_NAME
        current.sourceType = 'builtin'
        current.sourceFile = 'rules/v1.json'
        current.importedAt = installed?.importedAt
        const legacy = JSON.parse(JSON.stringify(current))
        for (const rule of legacy.rules) {
          if (rule.id === 'R04' || rule.id === 'R09') rule.ruleClass = 'A'
        }
        if (isDeepStrictEqual(installed, legacy)) await writeJson(file, current)
      }
      return index
    }
    await ensureDir()
    // 索引丢失时不能覆盖已有内置文件或猜测其启用状态。
    try {
      await fs.access(path.join(dir, `${BUILTIN_ID}.json`))
      return []
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error
    }
    const raw = JSON.parse(readFileSync(BUILTIN_PATH, 'utf8'))
    const ruleSet = normalizeRuleSet(raw, { sourceType: 'builtin', fileName: 'rules/v1.json' })
    ruleSet.id = BUILTIN_ID
    ruleSet.name = raw.name || BUILTIN_NAME
    ruleSet.sourceType = 'builtin'
    ruleSet.sourceFile = 'rules/v1.json'
    await writeJson(path.join(dir, `${BUILTIN_ID}.json`), ruleSet)
    const entry = {
      id: BUILTIN_ID,
      name: ruleSet.name,
      version: ruleSet.version,
      sourceType: 'builtin',
      sourceFile: 'rules/v1.json',
      importedAt: new Date().toISOString(),
      ruleCount: ruleSet.rules.length,
      checkpointCount: ruleSet.checkpoints.length,
      active: true,
      builtin: true,
    }
    await writeJson(indexFile, [entry])
    return [entry]
  }

  async function listFiles() {
    return serialize(async () => ((await seedBuiltin()) || []).filter(entry => !uploadedOnly || !entry.builtin).map(entry => ({ ...entry })))
  }

  async function getFile(id) {
    if (!/^[a-zA-Z0-9_-]{2,80}$/.test(String(id || ''))) return null
    const ruleSet = await readJson(path.join(dir, `${id}.json`), null)
    if (!ruleSet) return null
    return ruleSet
  }

  async function importFile(buffer, fileName, options = {}) {
    return serialize(async () => {
      await ensureDir()
      const parsed = options.parsed || parseRuleFile(buffer, fileName)
      const ruleSet = parsed.ruleSet
      let id = ruleSet.id
      const index = (await readIndex()) || (await seedBuiltin()) || []
      if (index.some(item => item.id === id && item.builtin) || (options.id && options.id !== id)) {
        id = `${id}-${Date.now().toString(36)}`
      }
      ruleSet.id = id
      ruleSet.importedAt = new Date().toISOString()
      ruleSet.sourceFile = fileName
      await writeJson(path.join(dir, `${id}.json`), ruleSet)
      const entry = {
        id,
        name: ruleSet.name,
        version: ruleSet.version,
        sourceType: ruleSet.sourceType,
        sourceFile: fileName,
        sourceId: options.sourceId || null,
        importedAt: ruleSet.importedAt,
        ruleCount: ruleSet.rules.length,
        checkpointCount: ruleSet.checkpoints?.length || 0,
        active: options.active !== false,
        builtin: false,
        warnings: ruleSet.warnings || [],
      }
      const next = [entry, ...index.filter(item => item.id !== id)]
      await writeJson(indexFile, next)
      logger?.info?.(
        { operation: 'rules.import', count: entry.ruleCount, statusCode: 200 },
        '规则文件已导入'
      )
      return { entry, warnings: ruleSet.warnings || [] }
    })
  }

  async function setActive(id, active) {
    return serialize(async () => {
      const index = (await readIndex()) || []
      const target = index.find(item => item.id === id)
      if (!target) return null
      target.active = Boolean(active)
      await writeJson(indexFile, index)
      return target
    })
  }

  async function deleteFile(id) {
    return serialize(async () => {
      const index = (await readIndex()) || []
      const target = index.find(item => item.id === id)
      if (!target) return false
      if (target.builtin) {
        // 内置规则可以停用，但保留文件作为兜底，避免误删后无法审查。
        target.active = false
        await writeJson(indexFile, index)
          return true
      }
      await fs.rm(path.join(dir, `${id}.json`), { force: true })
      await writeJson(indexFile, index.filter(item => item.id !== id))
      return true
    })
  }

  async function getActiveRuleSet() {
    return serialize(async () => {
    const index = (await seedBuiltin()) || []
    const active = index.filter(item => item.active && (!uploadedOnly || !item.builtin))
    const ruleSets = []
    for (const entry of active) {
      const ruleSet = await getFile(entry.id)
      if (ruleSet) ruleSets.push({ entry, ruleSet })
    }
    const merged = mergeRuleSets(ruleSets)
    return merged
    })
  }

  async function associateBuiltinSource(createSource) {
    return serialize(async () => {
      const index = await seedBuiltin()
      const entry = index.find(item => item.id === BUILTIN_ID && item.builtin === true && item.sourceType === 'builtin' && item.sourceFile === 'rules/v1.json')
      if (!entry || entry.sourceId) return
      const bytes = await fs.readFile(BUILTIN_PATH)
      const raw = JSON.parse(bytes.toString('utf8'))
      const expected = normalizeRuleSet(raw, { sourceType: 'builtin', fileName: 'rules/v1.json' })
      expected.id = BUILTIN_ID
      expected.name = raw.name || BUILTIN_NAME
      expected.sourceType = 'builtin'
      expected.sourceFile = 'rules/v1.json'
      const installed = await getFile(BUILTIN_ID)
      if (installed && Object.hasOwn(installed, 'importedAt')) expected.importedAt = installed.importedAt
      if (!isDeepStrictEqual(installed, expected)) return
      const source = await createSource(bytes, 'v1.json')
      entry.sourceId = source.id
      await writeJson(indexFile, index)
    })
  }

  function mergeRuleSets(list) {
    const warnings = []
    const ruleMap = new Map()
    for (const { entry, ruleSet } of list) {
      for (const rule of ruleSet.rules) {
        if (ruleMap.has(rule.id)) {
          warnings.push(`规则 ${rule.id} 在多个规则文件中重复，保留「${ruleMap.get(rule.id).sourceFileName}」的定义`)
          continue
        }
        ruleMap.set(rule.id, { ...rule, sourceFileId: entry.id, sourceFileName: entry.name })
      }
    }
    const rules = [...ruleMap.values()]
    const thresholds = list.reduce((acc, item) => ({ ...acc, ...(item.ruleSet.thresholds || {}) }), {})
    const names = [...new Set(list.map(item => item.ruleSet.name))]
    const versions = [...new Set(list.map(item => item.ruleSet.version))]
    return {
      schemaVersion: 1,
      id: list[0]?.ruleSet.id || '',
      name: names.join(' + '),
      version: versions.join(' + '),
      scope: list.map(item => item.ruleSet.scope).filter(Boolean).join('；'),
      boundary: list.map(item => item.ruleSet.boundary).filter(Boolean).join('；'),
      thresholds,
      rules,
      checkpoints: rules.flatMap(rule => (rule.checkpoints || []).map(cp => ({ ...cp, ruleId: rule.id }))),
      sources: list.map(item => ({
        id: item.entry.id,
        name: item.entry.name,
        version: item.entry.version,
        sourceType: item.entry.sourceType,
        sourceFile: item.entry.sourceFile,
        importedAt: item.entry.importedAt,
        ruleCount: item.entry.ruleCount,
        builtin: item.entry.builtin,
      })),
      warnings,
    }
  }

  async function summary() {
    const files = await listFiles()
    const active = files.filter(item => item.active)
    return {
      directory: dir,
      files: files.length,
      activeFiles: active.length,
      activeNames: active.map(item => item.name),
      totalRules: files.reduce((sum, item) => sum + (item.ruleCount || 0), 0),
    }
  }

  return {
    dir,
    indexFile,
    builtinSourceIds: async () => ((await readIndex()) || []).filter(item => item.builtin && item.sourceId).map(item => item.sourceId),
    ensureSeeded: () => serialize(seedBuiltin),
    associateBuiltinSource,
    listFiles,
    getFile,
    importFile,
    setActive,
    deleteFile,
    getActiveRuleSet,
    summary,
  }
}
