import { TextDecoder } from 'node:util'
import { readZipEntries } from './zip.js'

function xmlText(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

export function previewXlsx(bytes) {
  try {
    const entries = readZipEntries(bytes)
    const decoder = new TextDecoder('utf-8', { fatal: true })
    const sharedXml = entries.get('xl/sharedStrings.xml')
    const shared = []
    if (sharedXml) {
      const xml = decoder.decode(sharedXml)
      for (const match of xml.matchAll(/<si(?:\s[^>]*)?>([\s\S]*?)<\/si>/g)) {
        shared.push([...match[1].matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map(item => xmlText(item[1])).join(''))
      }
    }
    const workbook = entries.get('xl/workbook.xml')
    const sheetNames = workbook
      ? [...decoder.decode(workbook).matchAll(/<sheet\b[^>]*\bname="([^"]+)"[^>]*\br:id="([^"]+)"[^>]*\/>/g)].map(item => ({ name: xmlText(item[1]), id: item[2] }))
      : []
    const relationXml = entries.get('xl/_rels/workbook.xml.rels')
    const relations = new Map()
    if (relationXml) {
      for (const match of decoder.decode(relationXml).matchAll(/<Relationship\b[^>]*\bId="([^"]+)"[^>]*\bTarget="([^"]+)"[^>]*\/>/g)) relations.set(match[1], match[2])
    }
    const sheetPaths = sheetNames.length
      ? sheetNames.map((sheet, index) => ({ ...sheet, path: `xl/${String(relations.get(sheet.id) || `worksheets/sheet${index + 1}.xml`).replace(/^\/?xl\//, '').replace(/^\.\//, '')}` }))
      : [...entries.keys()].filter(name => /^xl\/worksheets\/sheet\d+\.xml$/.test(name)).sort().map((path, index) => ({ name: `Sheet ${index + 1}`, path }))
    const fragments = []
    for (const sheet of sheetPaths.slice(0, 30)) {
      const content = entries.get(sheet.path)
      if (!content) continue
      const xml = decoder.decode(content)
      let rowNumber = 0
      for (const rowMatch of xml.matchAll(/<row\b[^>]*?(?:\br="(\d+)")?[^>]*>([\s\S]*?)<\/row>/g)) {
        rowNumber = Number(rowMatch[1]) || rowNumber + 1
        const cells = []
        for (const cellMatch of rowMatch[2].matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)) {
          const attrs = cellMatch[1]
          const body = cellMatch[2]
          const type = attrs.match(/\bt="([^"]+)"/)?.[1]
          const raw = body.match(/<v(?:\s[^>]*)?>([\s\S]*?)<\/v>/)?.[1]
          const inline = [...body.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map(item => xmlText(item[1])).join('')
          const value = inline || (type === 's' && raw !== undefined ? shared[Number(raw)] || '' : xmlText(raw || ''))
          cells.push(value)
        }
        const text = cells.join('\t').trim()
        if (text) fragments.push({ location: { type: 'xlsx-sheet', sheet: sheet.name, row: rowNumber }, text })
        if (fragments.length >= 10000) break
      }
      if (fragments.length >= 10000) break
    }
    return {
      fragments,
      reason: `Excel 工作表提取：${fragments.length} 行；合并单元格、图形、批注和复杂公式可能不完整。`,
    }
  } catch {
    return null
  }
}
