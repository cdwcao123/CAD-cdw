// 插件本机存储：设置、审查记录、审计日志（NDJSON）。
// 所有写入都在 ctx.dataDir 下，使用临时文件 + 原子 rename，避免中断造成半截 JSON。
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { createHash, randomUUID } from 'node:crypto'
import { RULE_SET } from './rule-catalog.js'

export const DEFAULT_SETTINGS = {
  enabledRules: RULE_SET.rules.map(rule => rule.id),
  thresholds: {
    frameToleranceMm: RULE_SET.thresholds.frameToleranceMm,
    scaleTolerancePct: RULE_SET.thresholds.scaleTolerancePct,
    lineWidthToleranceMm: RULE_SET.thresholds.lineWidthToleranceMm,
    titleNameMinHeight: RULE_SET.thresholds.titleNameMinHeight,
    techRequirementMinHeight: RULE_SET.thresholds.techRequirementMinHeight,
  },
  retentionDays: 90,
  maxReviews: 200,
}

export function sanitizeFileName(value) {
  const base = path.basename(String(value || 'drawing.dxf')).replace(/[\\/\u0000-\u001f]/g, '_')
  return base.slice(0, 120) || 'drawing.dxf'
}

export function createStore(ctx, logger) {
  const root = ctx.dataDir
  const reviewsDir = path.join(root, 'reviews')
  const logsDir = path.join(root, 'logs')
  const settingsFile = path.join(root, 'settings.json')
  const indexFile = path.join(reviewsDir, 'index.json')
  let queue = Promise.resolve()
  let settingsCache = null

  const serialize = operation => {
    const next = queue.catch(() => undefined).then(operation)
    queue = next
    return next
  }

  async function ensureDirs() {
    await fs.mkdir(reviewsDir, { recursive: true, mode: 0o700 })
    await fs.mkdir(logsDir, { recursive: true, mode: 0o700 })
  }

  async function writeJson(file, value) {
    await fs.mkdir(path.dirname(file), { recursive: true, mode: 0o700 })
    const tmp = `${file}.${randomUUID()}.tmp`
    try {
      await fs.writeFile(tmp, JSON.stringify(value, null, 2), { encoding: 'utf8', mode: 0o600, flag: 'wx' })
      await fs.rename(tmp, file)
    } finally {
      await fs.rm(tmp, { force: true }).catch(() => undefined)
    }
  }

  async function readJson(file, fallback) {
    try {
      const raw = await fs.readFile(file, 'utf8')
      return JSON.parse(raw)
    } catch (error) {
      if (error && error.code === 'ENOENT') return fallback
      if (error instanceof SyntaxError) {
        logger?.warn?.({ operation: 'store.read', code: 'STORE_JSON_INVALID' }, '本地记录损坏，已使用默认值')
        return fallback
      }
      throw error
    }
  }

  async function getSettings() {
    if (settingsCache) return settingsCache
    const stored = await readJson(settingsFile, null)
    settingsCache = normalizeSettings(stored)
    return settingsCache
  }

  async function saveSettings(patch) {
    return serialize(async () => {
      const current = await getSettings()
      const next = normalizeSettings({ ...current, ...patch, thresholds: { ...current.thresholds, ...(patch?.thresholds || {}) } })
      await writeJson(settingsFile, next)
      settingsCache = next
      return next
    })
  }

  async function listReviews(limit = 30) {
    const index = await readJson(indexFile, [])
    if (!Array.isArray(index)) return []
    return index.slice(0, Math.max(1, Math.min(200, limit)))
  }

  async function getReview(id) {
    if (!/^[a-zA-Z0-9_-]{4,80}$/.test(String(id || ''))) return null
    return readJson(path.join(reviewsDir, `${id}.json`), null)
  }

  async function saveReview(review, settings) {
    return serialize(async () => {
      await ensureDirs()
      await writeJson(path.join(reviewsDir, `${review.id}.json`), review)
      const index = await readJson(indexFile, [])
      const summary = {
        id: review.id,
        createdAt: review.createdAt,
        fileName: review.fileName,
        fileSize: review.fileSize,
        sha256: review.sha256,
        verdict: review.result?.verdict?.label || '—',
        findings: review.result?.findings?.length || 0,
        bySeverity: review.result?.stats?.bySeverity || {},
        sheet: review.result?.drawing?.sheet || '',
        llmOk: Boolean(review.result?.llm?.ok),
        llmAdded: review.result?.llm?.added || 0,
        elapsedMs: review.elapsedMs,
      }
      const next = [summary, ...(Array.isArray(index) ? index : [])]
      await writeJson(indexFile, next.slice(0, Math.max(20, settings?.maxReviews || 200)))
      await pruneReviews(settings)
      return summary
    })
  }

  async function deleteReview(id) {
    return serialize(async () => {
      if (!/^[a-zA-Z0-9_-]{4,80}$/.test(String(id || ''))) return false
      await fs.rm(path.join(reviewsDir, `${id}.json`), { force: true })
      const index = await readJson(indexFile, [])
      const next = (Array.isArray(index) ? index : []).filter(item => item.id !== id)
      await writeJson(indexFile, next)
      return true
    })
  }

  async function pruneReviews(settings) {
    const index = await readJson(indexFile, [])
    if (!Array.isArray(index)) return
    const max = Math.max(20, Math.min(2000, Number(settings?.maxReviews) || 200))
    const days = Math.max(0, Math.min(3650, Number(settings?.retentionDays) || 90))
    const cutoff = days > 0 ? Date.now() - days * 24 * 60 * 60 * 1000 : 0
    const kept = []
    for (let i = 0; i < index.length; i += 1) {
      const item = index[i]
      const expired = cutoff > 0 && item.createdAt && new Date(item.createdAt).getTime() < cutoff
      if (i >= max || expired) {
        await fs.rm(path.join(reviewsDir, `${item.id}.json`), { force: true }).catch(() => undefined)
        continue
      }
      kept.push(item)
    }
    if (kept.length !== index.length) await writeJson(indexFile, kept)
  }

  function auditFile(day = new Date()) {
    return path.join(logsDir, `audit-${localDay(day)}.ndjson`)
  }

  async function appendAudit(record) {
    await ensureDirs()
    const line = `${JSON.stringify(record)}\n`
    await fs.appendFile(auditFile(), line, { encoding: 'utf8', mode: 0o600 })
  }

  async function readRecentAudit(limit = 100) {
    const max = Math.max(1, Math.min(500, limit))
    const files = [auditFile(), auditFile(new Date(Date.now() - 24 * 60 * 60 * 1000))]
    const records = []
    for (const file of files) {
      try {
        const raw = await fs.readFile(file, 'utf8')
        const lines = raw.split('\n').filter(Boolean)
        for (const line of lines) {
          try {
            records.push(JSON.parse(line))
          } catch {
            // 跳过损坏行
          }
        }
      } catch (error) {
        if (!error || error.code !== 'ENOENT') throw error
      }
    }
    records.sort((a, b) => String(b.time || '').localeCompare(String(a.time || '')))
    return records.slice(0, max)
  }

  async function auditSummary() {
    const index = await readJson(indexFile, [])
    const today = localDay()
    const todayRecords = (Array.isArray(index) ? index : []).filter(
      item => localDay(new Date(item.createdAt || Date.now())) === today
    )
    return {
      totalReviews: Array.isArray(index) ? index.length : 0,
      todayReviews: todayRecords.length,
      auditFileLabel: `logs/audit-${today}.ndjson`,
      pluginLogLabel: 'plugins/cad-standard-reviewer.log（宿主插件日志目录）',
      retentionDays: (await getSettings()).retentionDays,
    }
  }

  function sha256(buffer) {
    return createHash('sha256').update(buffer).digest('hex')
  }

  return {
    root,
    reviewsDir,
    logsDir,
    ensureDirs,
    getSettings,
    saveSettings,
    listReviews,
    getReview,
    saveReview,
    deleteReview,
    appendAudit,
    readRecentAudit,
    auditSummary,
    sha256,
  }
}

function normalizeSettings(input) {
  const source = input && typeof input === 'object' ? input : {}
  const enabled = Array.isArray(source.enabledRules)
    ? source.enabledRules.filter(id => typeof id === 'string' && /^R\d{1,3}$/.test(id))
    : DEFAULT_SETTINGS.enabledRules
  const thresholds = source.thresholds && typeof source.thresholds === 'object' ? source.thresholds : {}
  return {
    enabledRules: enabled,
    thresholds: {
      frameToleranceMm: clampNumber(thresholds.frameToleranceMm, 0.1, 5, DEFAULT_SETTINGS.thresholds.frameToleranceMm),
      scaleTolerancePct: clampNumber(thresholds.scaleTolerancePct, 0.1, 10, DEFAULT_SETTINGS.thresholds.scaleTolerancePct),
      lineWidthToleranceMm: clampNumber(thresholds.lineWidthToleranceMm, 0.01, 1, DEFAULT_SETTINGS.thresholds.lineWidthToleranceMm),
      titleNameMinHeight: clampNumber(thresholds.titleNameMinHeight, 2.5, 14, DEFAULT_SETTINGS.thresholds.titleNameMinHeight),
      techRequirementMinHeight: clampNumber(
        thresholds.techRequirementMinHeight,
        2.5,
        10,
        DEFAULT_SETTINGS.thresholds.techRequirementMinHeight
      ),
    },
    retentionDays: Math.round(clampNumber(source.retentionDays, 0, 3650, DEFAULT_SETTINGS.retentionDays)),
    maxReviews: Math.round(clampNumber(source.maxReviews, 20, 2000, DEFAULT_SETTINGS.maxReviews)),
  }
}

function localDay(date = new Date()) {
  const value = date instanceof Date && !Number.isNaN(date.getTime()) ? date : new Date()
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value)
  if (!Number.isFinite(number)) return fallback
  return Math.min(max, Math.max(min, number))
}
