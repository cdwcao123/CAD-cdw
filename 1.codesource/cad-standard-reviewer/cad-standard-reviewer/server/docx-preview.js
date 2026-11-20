import { TextDecoder } from 'node:util'
import { readZipEntries } from './zip.js'

// This is a best-effort preview, never proof that all document content was read.
export function previewDocx(bytes) {
  try {
    const xml = new TextDecoder('utf-8', { fatal: true }).decode(readZipEntries(bytes).get('word/document.xml'))
    if (/<!/i.test(xml)) throw new Error('unsupported XML declaration')
    const tokens = xml.match(/<[^>]*>|[^<]+/g) || []
    if (tokens.join('') !== xml || tokens.length > 500000) throw new Error('invalid XML')
    const stack = [], fragments = [], tables = []
    let paragraph = null, paragraphNumber = 0, tableNumber = 0
    const decode = text => text.replace(/&(?:amp|lt|gt|quot|apos|#\d+|#x[\da-fA-F]+);/g, entity => {
      const known = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'" }
      if (known[entity]) return known[entity]
      const code = entity[2] === 'x' ? parseInt(entity.slice(3, -1), 16) : parseInt(entity.slice(2, -1), 10)
      if (!Number.isInteger(code) || code < 32 || code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff)) throw new Error('invalid character')
      return String.fromCodePoint(code)
    })
    for (const token of tokens) {
      if (!token.startsWith('<')) {
        if (stack.at(-1) === 'w:t' && paragraph && !stack.includes('w:del') && !stack.includes('w:moveFrom')) {
          if (/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[\da-fA-F]+);)/.test(token)) throw new Error('invalid entity')
          paragraph.text += decode(token)
        }
        continue
      }
      if (/^<\?xml\s[^?]*\?>$/.test(token)) continue
      const close = token.match(/^<\/([\w:.-]+)\s*>$/)
      if (close) {
        if (stack.pop() !== close[1]) throw new Error('invalid nesting')
        if (close[1] === 'w:p' && paragraph) { if (paragraph.text.trim()) fragments.push(paragraph); paragraph = null }
        if (close[1] === 'w:tbl') tables.pop()
        continue
      }
      const open = token.match(/^<([\w:.-]+)(?:\s[^<>]*?)?\s*(\/?)>$/)
      if (!open) throw new Error('unsupported XML')
      const [, name, self] = open
      if (name === 'w:tbl') tables.push({ table: ++tableNumber, row: 0, cell: 0 })
      if (name === 'w:tr' && tables.length) { tables.at(-1).row++; tables.at(-1).cell = 0 }
      if (name === 'w:tc' && tables.length) tables.at(-1).cell++
      if (name === 'w:p') {
        if (paragraph) throw new Error('nested paragraph')
        paragraph = { location: tables.length ? { type: 'docx-table', ...tables.at(-1) } : { type: 'docx-paragraph', paragraph: ++paragraphNumber }, text: '' }
      }
      if (paragraph && (name === 'w:tab' || name === 'w:br' || name === 'w:cr')) paragraph.text += name === 'w:tab' ? '\t' : '\n'
      if (!self) stack.push(name)
      else if (name === 'w:p') paragraph = null
    }
    if (stack.length) throw new Error('unclosed XML')
    return { fragments, reason: '仅预览正文段落和表格单元格；页眉页脚、图示、公式、修订及合并单元格等可能未提取或不完整，位置不是页码。' }
  } catch { return null }
}
