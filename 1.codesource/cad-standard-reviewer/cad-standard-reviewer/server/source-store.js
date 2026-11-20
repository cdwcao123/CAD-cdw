import { promises as fs } from 'node:fs'
import path from 'node:path'
import { createHash, randomUUID } from 'node:crypto'
import { TextDecoder } from 'node:util'
import { readZipEntries } from './zip.js'

const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
const TEXT_EXTENSIONS = new Set(['.json', '.csv', '.txt', '.md', '.markdown', '.yaml', '.yml', '.xml', '.html', '.htm', '.rtf', '.log'])

function validId(id) {
  if (typeof id !== 'string' || !ID.test(id)) throw new TypeError('Invalid source ID')
  return id
}

async function directory(dir, create = false) {
  if (create) {
    try { await fs.mkdir(dir, { mode: 0o700 }) } catch (error) {
      if (error.code !== 'EEXIST') throw error
    }
  }
  const stat = await fs.lstat(dir)
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error('Unsafe storage directory')
}

async function publish(file, bytes) {
  const temporary = path.join(path.dirname(file), `.${randomUUID()}.tmp`)
  let created = false
  try {
    const handle = await fs.open(temporary, 'wx', 0o600)
    created = true
    try {
      await handle.writeFile(bytes)
      await handle.sync()
    } finally { await handle.close() }
    await fs.link(temporary, file)
  } finally {
    if (created) await fs.unlink(temporary)
  }
}

function extractDocx(bytes) {
  try {
    const entries = readZipEntries(bytes)
    const document = entries.get('word/document.xml')
    if (!document) throw new Error('Missing document')
    const harmlessParts = new Set(['word/document.xml', '[Content_Types].xml', '_rels/.rels', 'docProps/core.xml', 'docProps/app.xml'])
    const decode = data => new TextDecoder('utf-8', { fatal: true }).decode(data)
    let xml = decode(document)
    const relationshipPart = 'word/_rels/document.xml.rels'
    if (entries.has(relationshipPart)) {
      const relationships = decode(entries.get(relationshipPart))
      const prefix = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/'
      const match = relationships.match(/^(?:<\?xml version="1\.0" encoding="UTF-8" standalone="yes"\?>)?<Relationships xmlns="http:\/\/schemas\.openxmlformats\.org\/package\/2006\/relationships">((?:<Relationship Id="[A-Za-z0-9]+" Type="http:\/\/schemas\.openxmlformats\.org\/officeDocument\/2006\/relationships\/(?:header|footer)" Target="(?:header|footer)[0-9]+\.xml"\/>)+)<\/Relationships>$/)
      if (!match) throw new Error('Unsupported relationships')
      const rels = new Map()
      for (const item of match[1].matchAll(/<Relationship Id="([A-Za-z0-9]+)" Type="([^"]+)" Target="([^"]+)"\/>/g)) {
        const [, id, type, target] = item
        if (rels.has(id) || !target.startsWith(type.slice(prefix.length))) throw new Error('Invalid relationship')
        rels.set(id, { type: type.slice(prefix.length), name: `word/${target}` })
      }
      const refs = []
      xml = xml.replace(/<w:sectPr>((?:<w:(?:header|footer)Reference w:type="(?:default|first|even)" r:id="[A-Za-z0-9]+"\/>)+)<\/w:sectPr>(?=<\/w:body><\/w:document>$)/, (_, content) => {
        for (const ref of content.matchAll(/<w:(header|footer)Reference w:type="(?:default|first|even)" r:id="([A-Za-z0-9]+)"\/>/g)) refs.push({ type: ref[1], id: ref[2] })
        return ''
      })
      if (!refs.length || new Set(refs.map(ref => ref.id)).size !== refs.length || refs.length !== rels.size) throw new Error('Unmatched relationships')
      const contents = []
      for (const ref of refs) {
        const rel = rels.get(ref.id)
        if (!rel || rel.type !== ref.type || !entries.has(rel.name) || harmlessParts.has(rel.name)) throw new Error('Invalid header or footer')
        harmlessParts.add(rel.name)
        const part = decode(entries.get(rel.name))
        const partMatch = part.match(new RegExp(`^<w:${ref.type === 'header' ? 'hdr' : 'ftr'} xmlns:w="http://schemas\\.openxmlformats\\.org/wordprocessingml/2006/main">([\\s\\S]*)</w:${ref.type === 'header' ? 'hdr' : 'ftr'}>$`))
        if (!partMatch) throw new Error('Unsupported header or footer')
        contents.push(partMatch[1])
      }
      harmlessParts.add(relationshipPart)
      xml = xml.replace(' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"', '')
      if (!xml.endsWith('</w:body></w:document>')) throw new Error('Invalid document')
      xml = xml.replace('</w:body></w:document>', `${contents.join('')}</w:body></w:document>`)
    }
    if ([...entries.keys()].some(name => !name.endsWith('/') && !harmlessParts.has(name))) throw new Error('Additional document content')
    if (/<!|<\?(?!xml\s)/i.test(xml)) throw new Error('Unsupported XML')
    const input = xml.replace(/^\uFEFF?<\?xml\s+[^?]*\?>/, '')
    const tokens = input.match(/<[^>]*>|[^<]+/g) || []
    if (tokens.join('') !== input) throw new Error('Invalid XML')
    const stack = [], parts = []
    let paragraphs = 0, root = false, body = false
    const parents = {
      body: ['document'], p: ['body', 'tc'], r: ['p'], t: ['r'], tab: ['r'], br: ['r'], cr: ['r'],
      tbl: ['body', 'tc'], tr: ['tbl'], tc: ['tr'], tblPr: ['tbl'], tblGrid: ['tbl'], gridCol: ['tblGrid'],
      trPr: ['tr'], tcPr: ['tc'], pPr: ['p'], rPr: ['r', 'pPr'],
      tblStyle: ['tblPr'], tblW: ['tblPr'], tblLayout: ['tblPr'], gridSpan: ['tcPr'],
      tcW: ['tcPr'], vAlign: ['tcPr'], shd: ['tcPr'], cantSplit: ['trPr'], tblHeader: ['trPr'],
      spacing: ['pPr'], jc: ['pPr'], rFonts: ['rPr'], b: ['rPr'], i: ['rPr'], color: ['rPr'], sz: ['rPr']
    }
    const attributeNames = {
      tblStyle: ['val'], tblW: ['w', 'type'], tblLayout: ['type'], gridCol: ['w'], gridSpan: ['val'],
      tcW: ['w', 'type'], vAlign: ['val'], shd: ['val', 'color', 'fill'], cantSplit: ['val'], tblHeader: ['val'],
      spacing: ['before', 'after', 'line', 'lineRule'], jc: ['val'], rFonts: ['ascii', 'hAnsi', 'eastAsia', 'cs'],
      b: ['val'], i: ['val'], color: ['val'], sz: ['val']
    }
    let rows = [], cells = []
    for (const token of tokens) {
      if (!token.startsWith('<')) {
        if (stack.at(-1) !== 't') { if (token.trim()) throw new Error('Unexpected text'); continue }
        const value = token.replace(/&(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);/g, entity => {
          const named = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'" }
          if (named[entity]) return named[entity]
          const number = entity[2] === 'x' ? parseInt(entity.slice(3, -1), 16) : parseInt(entity.slice(2, -1), 10)
          if (!(number === 9 || number === 10 || number === 13 || (number >= 32 && number <= 0xd7ff) || (number >= 0xe000 && number <= 0xfffd) || (number >= 0x10000 && number <= 0x10ffff))) throw new Error('Invalid character')
          return String.fromCodePoint(number)
        })
        if (/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/.test(token) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) throw new Error('Invalid text')
        parts.push(value)
        continue
      }
      const close = token.match(/^<\/w:([a-zA-Z]+)\s*>$/)
      if (close) {
        if (stack.pop() !== close[1]) throw new Error('Invalid nesting')
        if (close[1] === 'tbl') { rows.pop(); cells.pop() }
        continue
      }
      const open = token.match(/^<w:([a-zA-Z]+)((?:\s+[^<>]*?)?)\s*(\/?)>$/)
      if (!open || (open[1] !== 'document' && !Object.hasOwn(parents, open[1]))) throw new Error('Unsupported document content')
      const [, tag, attrs, self] = open
      if (tag === 'document') {
        if (root || stack.length || !/^\s+xmlns:w=(?:"http:\/\/schemas\.openxmlformats\.org\/wordprocessingml\/2006\/main"|'http:\/\/schemas\.openxmlformats\.org\/wordprocessingml\/2006\/main')\s*$/.test(attrs)) throw new Error('Invalid document root')
        root = true
      } else {
        if (attrs.trim()) {
          const allowedAttrs = tag === 't' ? ['xml:space'] : (attributeNames[tag] || []).map(name => `w:${name}`)
          const matches = [...attrs.matchAll(/\s+([\w:]+)=(?:"([^"<&]*)"|'([^'<&]*)')/g)]
          if (matches.map(match => match[0]).join('').trim() !== attrs.trim() || new Set(matches.map(match => match[1])).size !== matches.length || matches.some(match => !allowedAttrs.includes(match[1]) || (match[1] === 'xml:space' && !['preserve', 'default'].includes(match[2] ?? match[3])))) throw new Error('Unsupported attributes')
        }
        const parent = stack.at(-1)
        if (!parents[tag].includes(parent)) throw new Error('Invalid nesting')
        if (tag === 'gridSpan') throw new Error('Merged cells are unsupported')
        if (attributeNames[tag] && !self) throw new Error('Invalid property')
      }
      if (tag === 'body') { if (body) throw new Error('Multiple bodies'); body = true }
      if (tag === 'tbl') { if (self || rows.length) throw new Error('Unsupported table'); if (parts.length) parts.push('\n'); rows.push(0); cells.push(0) }
      if (tag === 'tr') { if (self) throw new Error('Empty row'); if (rows[rows.length - 1]++) parts.push('\n'); cells[cells.length - 1] = 0 }
      if (tag === 'tc') { if (self) throw new Error('Empty cell'); if (cells[cells.length - 1]++) parts.push('\t') }
      if (tag === 'p') { if (paragraphs++ && stack.at(-1) !== 'tc') parts.push('\n'); else if (stack.at(-1) === 'tc' && stack.currentCellParagraph) parts.push('\n'); stack.currentCellParagraph = true }
      if (tag === 'tc') stack.currentCellParagraph = false
      if (tag === 'tab') parts.push('\t')
      if (tag === 'br' || tag === 'cr') parts.push('\n')
      if (!self) stack.push(tag)
    }
    if (!root || !body || stack.length || !paragraphs) throw new Error('Invalid document')
    return { complete: true, text: parts.join(''), reason: null, encoding: 'utf-8' }
  } catch {
    return { complete: false, text: null, reason: 'DOCX contains unsupported, invalid, or incomplete content' }
  }
}

function withLines(extraction, basis) {
  const lines = extraction.text.split(/\r\n|\r|\n/)
  if (lines.at(-1) === '' && /[\r\n]$/.test(extraction.text)) lines.pop()
  if (extraction.text === '') lines.length = 0
  return { ...extraction, lineBasis: basis, lines: lines.map((text, index) => ({ line: index + 1, text })) }
}

export function extractSource(bytes, fileName) {
  const extension = path.extname(fileName).toLowerCase()
  if (extension === '.docx') {
    const extraction = extractDocx(bytes)
    return extraction.complete ? withLines(extraction, 'extracted-text') : extraction
  }
  if (!TEXT_EXTENSIONS.has(extension)) {
    return { complete: false, text: null, reason: 'Unsupported format' }
  }
  try {
    let text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes)
    if (text.includes('\u0000')) return { complete: false, text: null, reason: 'Text contains NUL bytes' }
    if (extension === '.html' || extension === '.htm') {
      text = text
        .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(?:p|div|tr|li|h[1-6])>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&amp;/gi, '&')
    } else if (extension === '.rtf') {
      text = text
        .replace(/\\par[d]?/gi, '\n')
        .replace(/\\tab/gi, '\t')
        .replace(/\\'[0-9a-f]{2}/gi, ' ')
        .replace(/\\[a-z]+-?\d* ?/gi, '')
        .replace(/[{}]/g, '')
    }
    return withLines({ complete: true, text, reason: null, encoding: 'utf-8' }, 'source-text')
  } catch {
    return { complete: false, text: null, reason: 'Invalid UTF-8' }
  }
}

// Each upload is a separate immutable version, even when names or contents match.
export function createSourceStore({ dataDir }) {
  if (typeof dataDir !== 'string' || !path.isAbsolute(dataDir)) throw new TypeError('dataDir must be an absolute path')
  const root = path.join(dataDir, 'sources')
  const revisionQueues = new Map()

  async function sourceDir(id) {
    validId(id)
    await directory(root)
    const dir = path.join(root, id)
    await directory(dir)
    return dir
  }

  async function metadata(id) {
    const dir = await sourceDir(id)
    return JSON.parse(await fs.readFile(path.join(dir, 'metadata.json'), 'utf8'))
  }

  async function importFile(bytes, fileName, options = {}) {
    if (!(bytes instanceof Uint8Array)) throw new TypeError('bytes must be a Buffer or Uint8Array')
    if (typeof fileName !== 'string' || !fileName || fileName.length > 255 || /[\\/\u0000-\u001f\u007f]/.test(fileName) || fileName === '.' || fileName === '..') throw new TypeError('Invalid file name')
    if (options.version !== undefined && (typeof options.version !== 'string' || options.version.length > 255)) throw new TypeError('Invalid version')
    const content = Buffer.from(bytes)
    const id = randomUUID()
    const extraction = extractSource(content, fileName)
    const entry = { id, fileName, version: options.version ?? null, sha256: createHash('sha256').update(content).digest('hex'), size: content.length, createdAt: new Date().toISOString(), extraction }
    await directory(dataDir)
    await directory(root, true)
    const dir = path.join(root, id)
    await fs.mkdir(dir, { mode: 0o700 })
    await directory(path.join(dir, 'revisions'), true)
    await publish(path.join(dir, 'original'), content)
    await publish(path.join(dir, 'metadata.json'), JSON.stringify(entry))
    return entry
  }

  async function listSources() {
    try { await directory(root) } catch (error) { if (error.code === 'ENOENT') return []; throw error }
    const entries = await fs.readdir(root, { withFileTypes: true })
    const results = []
    for (const entry of entries) {
      if (!entry.isDirectory() || !ID.test(entry.name)) continue
      try { results.push(await metadata(entry.name)) } catch (error) { if (error.code !== 'ENOENT') throw error }
    }
    return results.sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id))
  }

  async function readOriginal(id) {
    const dir = await sourceDir(id)
    await metadata(id)
    return fs.readFile(path.join(dir, 'original'))
  }

  async function appendRevision(id, { type, data, author = null }) {
    if (type !== 'model' && type !== 'manual') throw new TypeError('Invalid revision type')
    if (author !== null && typeof author !== 'string') throw new TypeError('Invalid author')
    if (data === undefined) throw new TypeError('Revision data is required')
    const encoded = JSON.stringify({ data })
    if (encoded === undefined || !Object.hasOwn(JSON.parse(encoded), 'data')) throw new TypeError('Revision data must be JSON serializable')
    validId(id)
    const previous = revisionQueues.get(id) || Promise.resolve()
    const operation = previous.catch(() => {}).then(async () => {
      const dir = await sourceDir(id)
      await metadata(id)
      const revisions = path.join(dir, 'revisions')
      await directory(revisions)
      const existing = await history(id)
      const last = existing.at(-1)
      const timestamp = Math.max(Date.now(), last ? Date.parse(last.createdAt) + 1 : 0)
      const revision = { id: randomUUID(), sourceId: id, type, author, createdAt: new Date(timestamp).toISOString(), data: JSON.parse(encoded).data }
      await publish(path.join(revisions, `${revision.id}.json`), JSON.stringify(revision))
      return revision
    })
    revisionQueues.set(id, operation)
    try { return await operation } finally { if (revisionQueues.get(id) === operation) revisionQueues.delete(id) }
  }

  async function history(id) {
    const dir = await sourceDir(id)
    await metadata(id)
    const revisions = path.join(dir, 'revisions')
    await directory(revisions)
    const names = await fs.readdir(revisions)
    const result = await Promise.all(names.filter(name => name.endsWith('.json') && ID.test(name.slice(0, -5))).map(async name => JSON.parse(await fs.readFile(path.join(revisions, name), 'utf8'))))
    return result.sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id))
  }

  return { importFile, listSources, getSource: metadata, readOriginal, appendRevision, history }
}
