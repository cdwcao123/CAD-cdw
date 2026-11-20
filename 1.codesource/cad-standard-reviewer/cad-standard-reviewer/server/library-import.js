// 外部标准库导入：材料牌号库与公差/配合库，支持 JSON 与 CSV。
// 结论随库版本变化，C 类问题会附带 libraryVersion / libraryName。

export class LibraryImportError extends Error {
  constructor(message, code = 'LIBRARY_IMPORT_FAILED') {
    super(message)
    this.name = 'LibraryImportError'
    this.code = code
  }
}

const MATERIAL_STATUS = new Set(['current', 'old', 'obsolete'])

export function isValidLibraryId(id) {
  return typeof id === 'string' && /^[a-zA-Z0-9_-]{2,80}$/.test(id) &&
    !/^(?:index|con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(id)
}

export function parseLibraryFile(buffer, fileName, libraryType = null) {
  const name = String(fileName || '').toLowerCase()
  if (name.endsWith('.json')) return parseJsonLibrary(buffer, fileName, libraryType)
  if (name.endsWith('.csv') || name.endsWith('.txt')) return parseCsvLibrary(buffer, fileName, libraryType)
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
    throw new LibraryImportError('暂不支持 Excel 直接导入，请另存为 CSV 或 JSON 后上传', 'LIBRARY_XLSX_UNSUPPORTED')
  }
  throw new LibraryImportError('标准库仅支持 .json、.csv、.txt', 'LIBRARY_FILE_TYPE_UNSUPPORTED')
}

function parseJsonLibrary(buffer, fileName, libraryType) {
  let input
  try {
    input = JSON.parse(Buffer.from(buffer).toString('utf8'))
  } catch {
    throw new LibraryImportError('标准库 JSON 解析失败', 'LIBRARY_JSON_INVALID')
  }
  const type = input?.type || libraryType
  if (!type) throw new LibraryImportError('标准库缺少 type（material / tolerance）', 'LIBRARY_TYPE_MISSING')
  const library = normalizeLibrary({ ...input, type }, { sourceType: 'json', sourceFile: fileName })
  return { library, warnings: library.warnings || [], sourceType: 'json' }
}

function parseCsvLibrary(buffer, fileName, libraryType) {
  const text = Buffer.from(buffer).toString('utf8').replace(/^\uFEFF/u, '')
  const rows = parseCsv(text)
  if (rows.length < 2) throw new LibraryImportError('CSV 至少需要表头和一行数据', 'LIBRARY_CSV_EMPTY')
  const header = rows[0].map(cell => normalizeHeader(cell))
  const has = keyword => header.some(cell => cell.includes(keyword))
  const type = libraryType || (has('代号') || has('code') ? 'material' : has('designation') || has('hole') || has('孔') ? 'tolerance' : null)
  if (!type) throw new LibraryImportError('无法判断 CSV 类型，请从“材料库/公差库”对应入口上传', 'LIBRARY_CSV_TYPE_UNKNOWN')
  const title = String(fileName || '').replace(/\.[^.]+$/, '')
  if (type === 'material') {
    const index = indexMap(header, {
      code: ['代号', 'code', '牌号'],
      name: ['名称', 'name'],
      standard: ['标准', 'standard'],
      aliases: ['别名', 'aliases'],
      legacyAliases: ['旧写法', 'legacy'],
      status: ['状态', 'status'],
      replacement: ['替代', 'replacement'],
    })
    const grades = []
    for (const row of rows.slice(1)) {
      const code = cell(row, index.code)
      if (!code) continue
      grades.push({
        code,
        name: cell(row, index.name),
        standard: cell(row, index.standard),
        aliases: splitList(cell(row, index.aliases)),
        legacyAliases: splitList(cell(row, index.legacyAliases)),
        status: normalizeStatus(cell(row, index.status)),
        replacement: cell(row, index.replacement),
      })
    }
    const library = normalizeLibrary(
      { type, id: slug(title), name: title, version: 'V1', sourceType: 'csv', grades },
      { sourceType: 'csv', sourceFile: fileName }
    )
    return { library, warnings: library.warnings || [], sourceType: 'csv' }
  }
  const index = indexMap(header, {
    designation: ['配合', 'designation', '代号'],
    hole: ['孔', 'hole'],
    shaft: ['轴', 'shaft'],
    fitType: ['类型', 'type'],
  })
  const fits = []
  for (const row of rows.slice(1)) {
    const designation = cell(row, index.designation)
    if (!designation) continue
    const parts = designation.split('/')
    fits.push({
      designation: designation.replace(/\s+/g, ''),
      hole: cell(row, index.hole) || parts[0] || '',
      shaft: cell(row, index.shaft) || parts[1] || '',
      type: cell(row, index.fitType) || 'unknown',
    })
  }
  const library = normalizeLibrary(
    { type, id: slug(title), name: title, version: 'V1', sourceType: 'csv', fits },
    { sourceType: 'csv', sourceFile: fileName }
  )
  return { library, warnings: library.warnings || [], sourceType: 'csv' }
}

export function normalizeLibrary(input, meta = {}) {
  const type = input?.type
  if (type !== 'material' && type !== 'tolerance') {
    throw new LibraryImportError('标准库 type 必须是 material 或 tolerance', 'LIBRARY_TYPE_INVALID')
  }
  const warnings = []
  const name = String(input.name || '').trim() || (type === 'material' ? '材料牌号库' : '公差与配合库')
  const version = String(input.version || 'V1').trim()
  const id = input.id === undefined ? slug(name) : input.id
  if (!isValidLibraryId(id)) throw new LibraryImportError('标准库 ID 无效', 'LIBRARY_ID_INVALID')
  const library = {
    schemaVersion: 1,
    type,
    id,
    name,
    version,
    standard: String(input.standard || '').trim(),
    sourceType: meta.sourceType || input.sourceType || 'json',
    sourceFile: meta.sourceFile || input.sourceFile || '',
    importedAt: new Date().toISOString(),
    warnings,
  }
  if (type === 'material') {
    const rawGrades = Array.isArray(input.grades) ? input.grades : []
    const grades = []
    for (const item of rawGrades) {
      const code = String(item?.code || item?.grade || '').trim()
      if (!code) {
        warnings.push('忽略缺少 code 的材料牌号行')
        continue
      }
      grades.push({
        code,
        name: String(item.name || '').trim(),
        standard: String(item.standard || '').trim(),
        aliases: toStringList(item.aliases),
        legacyAliases: toStringList(item.legacyAliases),
        status: normalizeStatus(item.status),
        replacement: String(item.replacement || '').trim(),
      })
    }
    if (!grades.length) throw new LibraryImportError('材料库没有有效牌号', 'LIBRARY_MATERIAL_EMPTY')
    library.grades = grades
  } else {
    const rawFits = Array.isArray(input.fits) ? input.fits : []
    const fits = []
    for (const item of rawFits) {
      let designation = String(item?.designation || '').trim().replace(/\s+/g, '')
      let hole = String(item?.hole || '').trim()
      let shaft = String(item?.shaft || '').trim()
      if (!designation && hole && shaft) designation = `${hole}/${shaft}`
      if (!designation) continue
      if (!hole || !shaft) {
        const parts = designation.split('/')
        hole = hole || parts[0] || ''
        shaft = shaft || parts[1] || ''
      }
      fits.push({ designation, hole, shaft, type: String(item.type || 'unknown').trim() })
    }
    const letters = toStringList(input.letters)
    const grades = (Array.isArray(input.grades) ? input.grades : [])
      .map(value => Number.parseInt(value, 10))
      .filter(value => Number.isFinite(value))
    if (!fits.length && !letters.length) throw new LibraryImportError('公差库没有有效配合或公差带', 'LIBRARY_TOLERANCE_EMPTY')
    library.fits = fits
    library.letters = letters.length
      ? letters
      : [...new Set(fits.flatMap(item => [item.hole, item.shaft]).map(code => code.replace(/\d+/g, '')).filter(Boolean))]
    library.grades = grades.length ? grades : [...new Set(fits.flatMap(item => [item.hole, item.shaft]).map(code => Number.parseInt(code.replace(/\D+/g, ''), 10)).filter(Number.isFinite))]
  }
  library.itemCount = type === 'material' ? library.grades.length : library.fits.length
  return library
}

function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"'
        index += 1
      } else if (char === '"') quoted = false
      else field += char
    } else if (char === '"') quoted = true
    else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else if (char !== '\r') field += char
  }
  if (field || row.length) {
    row.push(field)
    rows.push(row)
  }
  return rows.filter(item => item.some(cell => cell.trim()))
}

function indexMap(header, spec) {
  const map = {}
  for (const [key, keywords] of Object.entries(spec)) {
    map[key] = header.findIndex(cell => keywords.some(keyword => cell.includes(normalizeHeader(keyword))))
  }
  return map
}

function cell(row, index) {
  return index >= 0 ? String(row[index] || '').trim() : ''
}

function splitList(value) {
  return String(value || '')
    .split(/[|;；]/)
    .map(item => item.trim())
    .filter(Boolean)
}

function toStringList(value) {
  if (Array.isArray(value)) return value.map(item => String(item).trim()).filter(Boolean)
  return splitList(value)
}

function normalizeStatus(value) {
  const text = String(value || '').trim().toLowerCase()
  if (MATERIAL_STATUS.has(text)) return text
  if (/old|旧|淘汰/.test(text)) return 'old'
  if (/obsolete|废止|作废/.test(text)) return 'obsolete'
  return 'current'
}

function normalizeHeader(value) {
  return String(value || '').replace(/\s+/g, '').trim().toLowerCase()
}

function slug(value) {
  const text = String(value || '')
  const ascii = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  if (ascii.length >= 3) return ascii.slice(0, 60)
  let hash = 0
  for (const char of text) hash = (hash * 31 + char.codePointAt(0)) % 1_000_000_007
  return `library-${hash.toString(36)}`
}
