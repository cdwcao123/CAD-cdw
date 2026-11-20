// 规则文件导入：支持 JSON 规则包、DOCX 规则文档、Markdown/TXT 规则表。
// 规则的可执行部分由 checkType 引用内置检查原语；未知规则以 llmOnly 形式交给大模型审查。
import { readFileSync } from 'node:fs'
import { readZipEntries } from './zip.js'

const BUILTIN = (() => {
  try { return JSON.parse(readFileSync(new URL('../rules/v1.json', import.meta.url), 'utf8')) }
  catch { return { rules: [], checkpoints: [], thresholds: {} } }
})()
const BUILTIN_BY_ID = new Map(BUILTIN.rules.map(rule => [rule.id, rule]))
const SEVERITIES = new Set(['关键', '严重', '一般', '提示'])
const CLASSES = new Set(['A', 'B', 'C'])

export const CHECK_TYPES = [
  'frameMargin',
  'titleBlockFields',
  'scaleConsistency',
  'bomBalloonConsistency',
  'lineStyle',
  'textHeight',
  'dimensionElements',
  'dimensionDirection',
  'fitCode',
  'featureControlFrame',
  'surfaceFinish',
  'materialGrade',
  'llmOnly',
]

export class RuleImportError extends Error {
  constructor(message, code = 'RULE_IMPORT_FAILED') {
    super(message)
    this.name = 'RuleImportError'
    this.code = code
  }
}

export function parseRuleFile(buffer, fileName) {
  const name = String(fileName || '').toLowerCase()
  if (name.endsWith('.json')) return parseJsonRuleFile(buffer, fileName)
  if (name.endsWith('.docx')) return parseDocxRuleFile(buffer, fileName)
  if (name.endsWith('.md') || name.endsWith('.markdown') || name.endsWith('.txt')) {
    return parseMarkdownRuleFile(buffer, fileName)
  }
  throw new RuleImportError('规则文件仅支持 .json、.docx、.md、.txt', 'RULE_FILE_TYPE_UNSUPPORTED')
}

// ── JSON 规则包 ──
function parseJsonRuleFile(buffer, fileName) {
  let data
  try {
    data = JSON.parse(Buffer.from(buffer).toString('utf8'))
  } catch {
    throw new RuleImportError('规则 JSON 解析失败，请检查文件格式', 'RULE_JSON_INVALID')
  }
  const ruleSet = normalizeRuleSet(data, { sourceType: 'json', fileName })
  return { ruleSet, warnings: ruleSet.warnings || [], sourceType: 'json' }
}

// ── Markdown / TXT ──
function parseMarkdownRuleFile(buffer, fileName) {
  const text = Buffer.from(buffer).toString('utf8')
  const tables = parseMarkdownTables(text)
  const ruleTable = tables.find(table => table.header.some(cell => /规则编号|规则号/.test(cell)))
  if (!ruleTable) throw new RuleImportError('未在 Markdown 中找到「规则编号」表格', 'RULE_MD_TABLE_MISSING')
  const exceptionTable = tables.find(table => table.header.some(cell => /适用规则/.test(cell)))
  const defectTable = tables.find(table => table.header.some(cell => /缺陷序号|缺陷编号/.test(cell)))
  const title = text.match(/^#\s+(.+)$/m)?.[1]?.trim() || baseName(fileName)
  const version = text.match(/V\d+(?:\.\d+)*/)?.[0] || 'V1'
  const warnings = []
  const rules = rowsToRules(ruleTable, exceptionTable, defectTable, { sourceType: 'markdown', warnings })
  const ruleSet = finalizeRuleSet(
    {
      id: slug(title),
      name: title,
      version,
      scope: '',
      boundary: '',
      thresholds: {},
      rules,
    },
    { sourceType: 'markdown', fileName, warnings }
  )
  return { ruleSet, warnings: ruleSet.warnings, sourceType: 'markdown' }
}

function parseMarkdownTables(text) {
  const lines = text.split(/\r?\n/)
  const tables = []
  let current = null
  for (const line of lines) {
    if (/^\s*\|.*\|\s*$/.test(line)) {
      const cells = line
        .trim()
        .replace(/^\||\|$/g, '')
        .split('|')
        .map(cell => cell.trim())
      if (!current) current = { header: cells, rows: [] }
      else if (cells.every(cell => /^:?-{2,}:?$/.test(cell))) continue
      else current.rows.push(cells)
    } else if (current) {
      tables.push(current)
      current = null
    }
  }
  if (current) tables.push(current)
  return tables
}

// ── DOCX ──
function parseDocxRuleFile(buffer, fileName) {
  let entries
  try {
    entries = readZipEntries(buffer)
  } catch (error) {
    throw new RuleImportError(`DOCX 读取失败：${error.message}`, 'RULE_DOCX_ZIP_INVALID')
  }
  const documentXml = entries.get('word/document.xml')
  if (!documentXml) throw new RuleImportError('DOCX 中未找到 word/document.xml', 'RULE_DOCX_XML_MISSING')
  const xml = documentXml.toString('utf8')
  const tables = parseWordTables(xml)
  const ruleTable = tables.find(table => table.header.some(cell => /规则编号/.test(cell)))
  if (!ruleTable) throw new RuleImportError('未在 DOCX 中找到「规则编号」表格', 'RULE_DOCX_TABLE_MISSING')
  const exceptionTable = tables.find(table => table.header.some(cell => /适用规则/.test(cell)))
  const defectTable = tables.find(table => table.header.some(cell => /缺陷序号|缺陷编号/.test(cell)))
  const classTable = tables.find(table => table.header.some(cell => /包含规则/.test(cell)))
  const title = extractTitle(xml) || baseName(fileName)
  const version = extractVersion(title, fileName)
  const scope = extractParagraph(xml, /适用范围/) || ''
  const boundary = extractParagraph(xml, /只判规范性/) || ''
  const warnings = []
  const rules = rowsToRules(ruleTable, exceptionTable, defectTable, { classTable, sourceType: 'docx', warnings })
  const ruleSet = finalizeRuleSet(
    {
      id: slug(title),
      name: title,
      version,
      scope,
      boundary,
      thresholds: {},
      rules,
    },
    { sourceType: 'docx', fileName, warnings }
  )
  return { ruleSet, warnings: ruleSet.warnings, sourceType: 'docx' }
}

function parseWordTables(xml) {
  const tables = []
  const tableRegex = /<w:tbl[^>]*>([\s\S]*?)<\/w:tbl>/g
  let tableMatch
  while ((tableMatch = tableRegex.exec(xml))) {
    const rows = []
    const rowRegex = /<w:tr[^>]*>([\s\S]*?)<\/w:tr>/g
    let rowMatch
    while ((rowMatch = rowRegex.exec(tableMatch[1]))) {
      const cells = []
      const cellRegex = /<w:tc[^>]*>([\s\S]*?)<\/w:tc>/g
      let cellMatch
      while ((cellMatch = cellRegex.exec(rowMatch[1]))) {
        cells.push(wordCellText(cellMatch[1]))
      }
      if (cells.length) rows.push(cells)
    }
    if (rows.length >= 2) tables.push({ header: rows[0], rows: rows.slice(1) })
  }
  return tables
}

function wordCellText(xml) {
  const withBreaks = xml
    .replace(/<w:br[^>]*\/>/g, '\n')
    .replace(/<w:tab[^>]*\/>/g, ' ')
    .replace(/<w:cr[^>]*\/>/g, '\n')
  const texts = []
  const textRegex = /<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g
  let match
  while ((match = textRegex.exec(withBreaks))) texts.push(decodeXml(match[1]))
  return texts.join('').replace(/\n{3,}/g, '\n\n').trim()
}

function decodeXml(value) {
  return String(value)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/<[^>]+>/g, '')
}

function extractTitle(xml) {
  const paragraphs = []
  const regex = /<w:p[ >][\s\S]*?<\/w:p>/g
  let match
  while ((match = regex.exec(xml))) {
    const text = wordCellText(match[0])
    if (text) paragraphs.push(text)
  }
  return paragraphs.find(text => /规则/.test(text) && /V\d|审查规则/.test(text)) || paragraphs[0] || ''
}

function extractParagraph(xml, pattern) {
  const matches = xml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) || []
  for (const paragraph of matches) {
    const text = wordCellText(paragraph)
    if (pattern.test(text)) return text
  }
  return ''
}

function extractVersion(title, fileName) {
  const fromTitle = String(title).match(/V\d+(?:\.\d+)*/i)?.[0]
  if (fromTitle) return fromTitle.toUpperCase()
  const date = String(fileName).match(/(20\d{2})(\d{2})(\d{2})/)
  if (date) return `V1-${date[1]}-${date[2]}-${date[3]}`
  return 'V1'
}

// ── 表格 → 规则 ──
function rowsToRules(ruleTable, exceptionTable, defectTable, options = {}) {
  const header = ruleTable.header.map(normalizeHeader)
  const column = (keywords, fallback) => {
    const index = header.findIndex(cell => keywords.some(keyword => cell.includes(keyword)))
    return index >= 0 ? index : fallback
  }
  const idIndex = column(['规则编号', '规则号'], 0)
  const nameIndex = column(['规则名称', '名称'], 1)
  const logicIndex = column(['判定逻辑', '判定'], 2)
  const standardIndex = column(['标准依据', '依据'], 3)
  const severityIndex = column(['严重级', '级别'], 4)
  const machineIndex = column(['可机检'], 5)
  const exceptions = groupExceptions(exceptionTable)
  const checkpoints = groupCheckpoints(defectTable)
  const classes = groupClasses(options.classTable)
  const warnings = options.warnings || []
  const rules = []

  for (const row of ruleTable.rows) {
    const rawId = (row[idIndex] || '').trim().toUpperCase()
    const id = rawId.match(/R\d{1,3}/)?.[0]
    if (!id) continue
    const nameCell = (row[nameIndex] || '').trim()
    const logicCell = (row[logicIndex] || '').trim()
    const known = null
    const severity = normalizeSeverity(row[severityIndex]) || known?.severity || '一般'
    const ruleClass = classes.get(id) || ''
    const checkType = known?.checkType || 'llmOnly'
    if (!known) warnings.push(`规则 ${id} 未匹配内置检查原语，已作为「大模型语义审查」规则导入`)
    rules.push({
      id,
      name: nameCell || known?.name || id,
      elements: known?.elements || '',
      ruleClass,
      severity,
      standard: (row[standardIndex] || known?.standard || '').trim(),
      machineCheckable: (row[machineIndex] || known?.machineCheckable || '').trim(),
      logic: (row[logicIndex] || known?.logic || '').trim(),
      exceptions: exceptions.get(id) || known?.exceptions || [],
      checkpoints: checkpoints.get(id) || known?.checkpoints || [],
      checkType,
      params: known?.params || {},
      enabled: true,
    })
  }
  if (!rules.length) throw new RuleImportError('规则表中没有可识别的 R 编号规则', 'RULE_DOCX_NO_RULES')
  void options.sourceType
  return rules
}

function matchesBuiltin(known, name, logic) {
  const normalize = value => String(value || '').replace(/\s+/g, '')
  return Boolean(known && name && logic && normalize(name) === normalize(known.name) && normalize(logic) === normalize(known.logic))
}

function groupExceptions(table) {
  const map = new Map()
  if (!table) return map
  const header = table.header.map(normalizeHeader)
  const idIndex = header.findIndex(cell => /适用规则/.test(cell))
  const exceptionIndex = header.findIndex(cell => /例外情形/.test(cell))
  const handlingIndex = header.findIndex(cell => /处理方式/.test(cell))
  if (idIndex < 0) return map
  for (const row of table.rows) {
    const id = (row[idIndex] || '').trim().toUpperCase().match(/R\d{1,3}/)?.[0]
    if (!id) continue
    const exception = (row[exceptionIndex] || '').trim()
    const handling = handlingIndex >= 0 ? (row[handlingIndex] || '').trim() : ''
    const text = handling ? `${exception}（处理：${handling}）` : exception
    if (!text) continue
    if (!map.has(id)) map.set(id, [])
    map.get(id).push(text)
  }
  return map
}

function groupCheckpoints(table) {
  const map = new Map()
  if (!table) return map
  const header = table.header.map(normalizeHeader)
  const indexIndex = header.findIndex(cell => /缺陷序号|缺陷编号/.test(cell))
  const defectIndex = header.findIndex(cell => /缺陷描述/.test(cell))
  const ruleIndex = header.findIndex(cell => /命中规则/.test(cell))
  const severityIndex = header.findIndex(cell => /严重级/.test(cell))
  if (indexIndex < 0 || ruleIndex < 0) return map
  for (const row of table.rows) {
    const number = Number.parseInt(row[indexIndex], 10)
    const ruleId = (row[ruleIndex] || '').trim().toUpperCase().match(/R\d{1,3}/)?.[0]
    if (!Number.isFinite(number) || !ruleId) continue
    const checkpoint = {
      id: `D${String(number).padStart(2, '0')}`,
      defect: (row[defectIndex] || '').trim(),
      severity: normalizeSeverity(row[severityIndex]) || '一般',
    }
    if (!map.has(ruleId)) map.set(ruleId, [])
    map.get(ruleId).push(checkpoint)
  }
  return map
}

function groupClasses(table) {
  const map = new Map()
  if (!table) return map
  const header = table.header.map(normalizeHeader)
  const classIndex = header.findIndex(cell => /级别|类别/.test(cell))
  const rulesIndex = header.findIndex(cell => /包含规则/.test(cell))
  if (classIndex < 0 || rulesIndex < 0) return map
  for (const row of table.rows) {
    const classMatch = (row[classIndex] || '').trim().match(/^([ABC])/i)
    if (!classMatch) continue
    const ids = expandRuleIds(row[rulesIndex] || '')
    for (const id of ids) map.set(id, classMatch[1].toUpperCase())
  }
  return map
}

function expandRuleIds(text) {
  const ids = new Set()
  const normalized = String(text)
    .replace(/[（(].*?[)）]/g, '')
    .replace(/～|~|—|–/g, '-')
  const parts = normalized.split(/[、,，;；\s]+/).filter(Boolean)
  for (const part of parts) {
    const range = part.match(/R(\d+)\s*-\s*R(\d+)/i)
    if (range) {
      const start = Number(range[1])
      const end = Number(range[2])
      for (let index = start; index <= end; index += 1) ids.add(`R${String(index).padStart(2, '0')}`)
      continue
    }
    const single = part.match(/R\d{1,3}/i)
    if (single) ids.add(single[0].toUpperCase())
  }
  return [...ids]
}

function normalizeHeader(value) {
  return String(value || '').replace(/\s+/g, '').trim()
}

function normalizeSeverity(value) {
  const text = String(value || '').trim()
  if (SEVERITIES.has(text)) return text
  if (/关键/.test(text)) return '关键'
  if (/严重/.test(text)) return '严重'
  if (/一般/.test(text)) return '一般'
  if (/提示/.test(text)) return '提示'
  return null
}

// ── 规范化 ──
export function normalizeRuleSet(input, meta = {}) {
  if (!input || typeof input !== 'object') throw new RuleImportError('规则文件内容不是对象', 'RULE_SET_INVALID')
  const sourceType = meta.sourceType || 'json'
  const fileName = meta.fileName || ''
  const rawRules = Array.isArray(input.rules) ? input.rules : Array.isArray(input) ? input : null
  if (!rawRules || rawRules.length === 0) throw new RuleImportError('规则文件缺少 rules 数组', 'RULE_RULES_MISSING')
  const warnings = []
  const rules = []
  const seen = new Set()
  for (const raw of rawRules) {
    const id = String(raw?.id || raw?.ruleId || '').trim().toUpperCase()
    if (!/^R\d{1,3}$/.test(id)) {
      warnings.push(`忽略无效规则编号：${id || '(空)'}`)
      continue
    }
    if (seen.has(id)) {
      warnings.push(`规则 ${id} 重复，保留首次出现的定义`)
      continue
    }
    seen.add(id)
    const candidate = BUILTIN_BY_ID.get(id)
    const known = sourceType === 'builtin' && matchesBuiltin(candidate, raw.name, raw.logic) ? candidate : null
    const checkType = raw.checkType ? (CHECK_TYPES.includes(raw.checkType) ? raw.checkType : 'llmOnly') : known?.checkType || 'llmOnly'
    if (!raw.checkType && !known) warnings.push(`规则 ${id} 未可靠匹配内置检查原语，已作为「大模型语义审查」规则导入`)
    if (checkType === 'llmOnly' && raw.checkType && raw.checkType !== 'llmOnly') {
      warnings.push(`规则 ${id} 的 checkType「${raw.checkType}」不受支持，已降级为大模型语义审查`)
    }
    const checkpoints = normalizeCheckpoints(raw.checkpoints, id, input.checkpoints || (known ? BUILTIN.checkpoints : []), warnings, known)
    rules.push({
      id,
      name: String(raw.name || known?.name || id).trim(),
      elements: String(raw.elements || known?.elements || '').trim(),
      ruleClass: CLASSES.has(String(raw.ruleClass || '').toUpperCase())
        ? String(raw.ruleClass).toUpperCase()
        : '',
      severity: normalizeSeverity(raw.severity) || known?.severity || '一般',
      standard: String(raw.standard || known?.standard || '').trim(),
      machineCheckable: String(raw.machineCheckable || known?.machineCheckable || '').trim(),
      logic: String(raw.logic || known?.logic || '').trim(),
      exceptions: Array.isArray(raw.exceptions) ? raw.exceptions.map(item => String(item).trim()).filter(Boolean) : known?.exceptions || [],
      checkpoints,
      checkType,
      params: { ...(known?.params || {}), ...(raw.params && typeof raw.params === 'object' ? raw.params : {}) },
      enabled: raw.enabled !== false,
    })
  }
  if (!rules.length) throw new RuleImportError('规则文件没有有效规则', 'RULE_RULES_INVALID')
  const title = String(input.name || baseName(fileName) || '自定义规则集').trim()
  return finalizeRuleSet(
    {
      id: String(input.id || slug(title)).trim(),
      name: title,
      version: String(input.version || 'V1').trim(),
      scope: String(input.scope || '').trim(),
      boundary: String(input.boundary || '').trim(),
      thresholds: { ...(sourceType === 'builtin' ? BUILTIN.thresholds : {}), ...(input.thresholds && typeof input.thresholds === 'object' ? input.thresholds : {}) },
      rules,
    },
    { sourceType, fileName, warnings }
  )
}

function normalizeCheckpoints(raw, ruleId, fallback, warnings, known) {
  const list = Array.isArray(raw) ? raw : []
  const out = []
  for (const item of list) {
    if (typeof item === 'string') {
      const known = (fallback || []).find(entry => entry.id === item)
      if (known) out.push({ id: known.id, defect: known.defect || '', severity: known.severity || '一般' })
      else out.push({ id: item, defect: '', severity: '一般' })
      continue
    }
    const id = String(item?.id || '').trim().toUpperCase()
    if (!/^D\d{1,3}$/.test(id)) {
      warnings.push(`规则 ${ruleId} 的检查点编号无效：${id || '(空)'}`)
      continue
    }
    out.push({ id, defect: String(item.defect || '').trim(), severity: normalizeSeverity(item.severity) || '一般' })
  }
  if (out.length === 0 && known && !Array.isArray(raw)) return known.checkpoints
  return out
}

function finalizeRuleSet(input, meta) {
  const ruleSet = {
    schemaVersion: 1,
    id: input.id || slug(input.name),
    name: input.name,
    version: input.version,
    scope: input.scope || '',
    boundary: input.boundary || '',
    thresholds: input.thresholds,
    rules: input.rules.map(rule => ({ ...rule, enabled: rule.enabled !== false })),
    sourceType: meta.sourceType || 'json',
    sourceFile: meta.fileName || '',
    importedAt: new Date().toISOString(),
    warnings: meta.warnings || [],
  }
  ruleSet.checkpoints = ruleSet.rules.flatMap(rule =>
    (rule.checkpoints || []).map(checkpoint => ({ ...checkpoint, ruleId: rule.id }))
  )
  return ruleSet
}

function slug(value) {
  const text = String(value || '')
  const ascii = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  if (ascii.length >= 3) return ascii.slice(0, 60)
  let hash = 0
  for (const char of text) hash = (hash * 31 + char.codePointAt(0)) % 1_000_000_007
  return `rules-${hash.toString(36)}`
}

function baseName(fileName) {
  return String(fileName || '')
    .replace(/\.[^.]+$/, '')
    .replace(/[\\/]/g, ' ')
    .trim()
}

export { BUILTIN as BUILTIN_RULE_SET }
