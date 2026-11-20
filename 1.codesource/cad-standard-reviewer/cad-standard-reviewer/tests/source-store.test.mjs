import test from 'node:test'
import assert from 'node:assert/strict'
import { promises as fs } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { crc32, deflateRawSync } from 'node:zlib'
import { readZipEntries } from '../server/zip.js'
import { createSourceStore, extractSource } from '../server/source-store.js'
import { previewDocx } from '../server/docx-preview.js'

function zip(files) {
  const locals = [], centrals = []
  let offset = 0
  for (const [name, value] of files) {
    const n = Buffer.from(name), data = Buffer.from(value)
    const local = Buffer.alloc(30), central = Buffer.alloc(46)
    local.writeUInt32LE(0x04034b50); local.writeUInt16LE(20, 4)
    local.writeUInt32LE(crc32(data), 14); local.writeUInt32LE(data.length, 18); local.writeUInt32LE(data.length, 22); local.writeUInt16LE(n.length, 26)
    central.writeUInt32LE(0x02014b50); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6)
    central.writeUInt32LE(crc32(data), 16); central.writeUInt32LE(data.length, 20); central.writeUInt32LE(data.length, 24); central.writeUInt16LE(n.length, 28); central.writeUInt32LE(offset, 42)
    locals.push(local, n, data); centrals.push(central, n)
    offset += local.length + n.length + data.length
  }
  const directory = Buffer.concat(centrals), end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10)
  end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16)
  return Buffer.concat([...locals, directory, end])
}

test('DOCX preview locates text conservatively without treating it as complete', () => {
  const xml = '<w:document><w:body><w:p><w:r><w:t>标题 &amp; 说明</w:t></w:r></w:p><w:tbl><w:tr><w:tc><w:p><w:r><w:t>材料</w:t></w:r><w:del><w:r><w:t>已删除</w:t></w:r></w:del></w:p></w:tc></w:tr></w:tbl></w:body></w:document>'
  const bytes = zip([['word/document.xml', xml]])
  const preview = previewDocx(bytes)
  assert.deepEqual(preview.fragments.map(item => item.text), ['标题 & 说明', '材料'])
  assert.deepEqual(preview.fragments[1].location, { type: 'docx-table', table: 1, row: 1, cell: 1 })
  assert.equal(extractSource(bytes, 'sample.docx').complete, false)
  assert.equal(previewDocx(zip([['word/document.xml', '<!DOCTYPE x><x/>']])), null)
  assert.equal(previewDocx(Buffer.from('invalid')), null)
})

test('YAML、HTML 和 RTF 文本可作为标准资料提取且保留原件', async t => {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'source-store-'))
  t.after(() => fs.rm(dataDir, { recursive: true, force: true }))
  const store = createSourceStore({ dataDir })
  const yaml = Buffer.from('code: Q235\nstandard: GB/T 700\n')
  const yamlSource = await store.importFile(yaml, 'materials.yaml')
  assert.equal(yamlSource.extraction.complete, true)
  assert.match(yamlSource.extraction.text, /Q235/)
  assert.deepEqual(await store.readOriginal(yamlSource.id), yaml)
  const html = await store.importFile(Buffer.from('<h1>标准</h1><p>尺寸 10 mm</p><script>忽略</script>'), 'standard.html')
  assert.equal(html.extraction.text, '标准\n尺寸 10 mm\n')
})

test('DOCX text is extracted without changing the original', async t => {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'source-store-'))
  t.after(() => fs.rm(dataDir, { recursive: true, force: true }))
  const store = createSourceStore({ dataDir })
  const xml = '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>中文 &amp; A</w:t><w:tab/><w:t>B</w:t></w:r></w:p><w:p><w:r><w:t>第二行</w:t></w:r></w:p></w:body></w:document>'
  const bytes = zip([['word/document.xml', xml]])
  const result = await store.importFile(bytes, 'rules.docx')
  assert.equal(result.extraction.complete, true)
  assert.equal(result.extraction.text, '中文 & A\tB\n第二行')
  assert.equal(result.extraction.lineBasis, 'extracted-text')
  assert.deepEqual(result.extraction.lines, [{ line: 1, text: '中文 & A\tB' }, { line: 2, text: '第二行' }])
  assert.equal(result.sha256, createHash('sha256').update(bytes).digest('hex'))
  assert.deepEqual(await store.readOriginal(result.id), bytes)
})

test('DOCX extracts styled tables in reading order', async t => {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'source-store-'))
  t.after(() => fs.rm(dataDir, { recursive: true, force: true }))
  const store = createSourceStore({ dataDir })
  const xml = '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>标题</w:t></w:r></w:p><w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/></w:tblPr><w:tblGrid><w:gridCol w:w="100"/><w:gridCol w:w="100"/></w:tblGrid><w:tr><w:trPr><w:tblHeader/></w:trPr><w:tc><w:tcPr><w:shd w:fill="FFFFFF"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t>名称</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>规则</w:t></w:r></w:p><w:p><w:r><w:t>第二段</w:t></w:r></w:p></w:tc></w:tr><w:tr><w:tc><w:p><w:r><w:t>A</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>B</w:t></w:r></w:p></w:tc></w:tr></w:tbl><w:p><w:r><w:t>结束</w:t></w:r></w:p></w:body></w:document>'
  const result = await store.importFile(zip([['word/document.xml', xml]]), 'table.docx')
  assert.equal(result.extraction.complete, true)
  assert.equal(result.extraction.text, '标题\n名称\t规则\n第二段\nA\tB\n结束')
  for (const extra of ['<w:gridSpan w:val="2"/>', '<w:vMerge/>', '<w:txbxContent/>']) {
    const item = await store.importFile(zip([['word/document.xml', xml.replace('<w:shd', `${extra}<w:shd`)]]), 'unsupported.docx')
    assert.equal(item.extraction.complete, false, extra)
  }
})

test('DOCX extracts referenced headers and footers and rejects unsafe relationships', async t => {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'source-store-'))
  t.after(() => fs.rm(dataDir, { recursive: true, force: true }))
  const store = createSourceStore({ dataDir })
  const w = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
  const r = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
  const p = text => `<w:p><w:r><w:t>${text}</w:t></w:r></w:p>`
  const doc = `<w:document xmlns:w="${w}" xmlns:r="${r}"><w:body>${p('正文')}<w:sectPr><w:headerReference w:type="default" r:id="rId1"/><w:footerReference w:type="default" r:id="rId2"/></w:sectPr></w:body></w:document>`
  const rels = `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${r}/header" Target="header1.xml"/><Relationship Id="rId2" Type="${r}/footer" Target="footer1.xml"/></Relationships>`
  const files = [['word/document.xml', doc], ['word/_rels/document.xml.rels', rels], ['word/header1.xml', `<w:hdr xmlns:w="${w}">${p('页眉')}</w:hdr>`], ['word/footer1.xml', `<w:ftr xmlns:w="${w}">${p('页脚')}</w:ftr>`]]
  const item = await store.importFile(zip(files), 'header.docx')
  assert.equal(item.extraction.complete, true)
  assert.equal(item.extraction.text, '正文\n页眉\n页脚')
  for (const [index, value] of [
    [1, rels.replace('Target="header1.xml"', 'Target="https://example.test" TargetMode="External"')],
    [1, rels.replace('header1.xml', '../header1.xml')],
    [0, doc.replace('r:id="rId1"', 'r:id="missing"')],
    [2, `<w:hdr xmlns:w="${w}">${p('页眉')}<w:drawing/></w:hdr>`],
    [3, `<w:ftr xmlns:w="${w}">${p('页脚')}<w:object/></w:ftr>`]
  ]) {
    const changed = files.map(pair => [...pair]); changed[index][1] = value
    const result = await store.importFile(zip(changed), 'restricted.docx')
    assert.equal(result.extraction.complete, false)
    assert.equal(result.extraction.text, null)
  }
})

test('DOCX unsupported content is never presented as complete', async t => {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'source-store-'))
  t.after(() => fs.rm(dataDir, { recursive: true, force: true }))
  const store = createSourceStore({ dataDir })
  const root = '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>ok</w:t>CONTENT</w:r></w:p></w:body></w:document>'
  for (const content of ['<w:drawing/>', '<w:object/>', '<w:instrText>hidden</w:instrText>', '<w:t>&unknown;</w:t>', '<w:t>broken</w:r>']) {
    const bytes = zip([['word/document.xml', root.replace('CONTENT', content)]])
    const item = await store.importFile(bytes, 'input.docx')
    assert.equal(item.extraction.complete, false, content)
    assert.equal(item.extraction.text, null)
    assert.equal(item.extraction.lines, undefined)
    assert.deepEqual(await store.readOriginal(item.id), bytes)
  }
  const bytes = zip([['word/document.xml', root.replace('CONTENT', '')], ['word/header1.xml', '<header/>']])
  assert.equal((await store.importFile(bytes, 'header.docx')).extraction.complete, false)
})

test('real DOCX is not declared complete when package contents are unsupported', async t => {
  const file = process.env.REAL_DOCX_PATH
  if (!file) return t.skip('REAL_DOCX_PATH not supplied')
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'source-store-'))
  t.after(() => fs.rm(dataDir, { recursive: true, force: true }))
  const bytes = await fs.readFile(file)
  const store = createSourceStore({ dataDir })
  const result = await store.importFile(bytes, 'real.docx')
  assert.equal(result.extraction.complete, false)
  assert.equal(result.extraction.text, null)
  assert.deepEqual(await store.readOriginal(result.id), bytes)
  const preview = previewDocx(bytes)
  assert.ok(preview?.fragments.some(item => item.location.type === 'docx-table'))
})

test('ZIP rejects duplicate names, corrupt data and inflated size limits', () => {
  assert.throws(() => readZipEntries(zip([['x', 'a'], ['x', 'b']])))
  const corrupt = zip([['x', 'hello']]); corrupt[31] ^= 1
  assert.throws(() => readZipEntries(corrupt))
  const compressed = deflateRawSync(Buffer.alloc(1024 * 1024))
  const bomb = zip([['x', compressed]])
  const central = bomb.indexOf(Buffer.from([0x50, 0x4b, 0x01, 0x02]))
  bomb.writeUInt16LE(8, 8); bomb.writeUInt16LE(8, central + 10)
  bomb.writeUInt32LE(1, 22); bomb.writeUInt32LE(1, central + 24)
  assert.throws(() => readZipEntries(bomb))
})

test('uploads and revisions persist without overwriting', async t => {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'source-store-'))
  t.after(() => fs.rm(dataDir, { recursive: true, force: true }))
  const store = createSourceStore({ dataDir })
  const bytes = Buffer.from('\ufeff中文\r\nlast line')
  const first = await store.importFile(bytes, 'rules.txt', { version: 'v1' })
  const second = await store.importFile(bytes, 'rules.txt', { version: 'v2' })
  assert.notEqual(first.id, second.id)
  assert.equal(first.sha256, createHash('sha256').update(bytes).digest('hex'))
  assert.equal(first.extraction.text, '\ufeff中文\r\nlast line')
  assert.equal(first.extraction.complete, true)
  assert.deepEqual(await store.readOriginal(first.id), bytes)
  const model = await store.appendRevision(first.id, { type: 'model', data: { rules: [1] } })
  const edit = await store.appendRevision(first.id, { type: 'manual', data: { rules: [2] }, author: 'editor' })
  const reopened = createSourceStore({ dataDir })
  assert.equal((await reopened.listSources()).length, 2)
  assert.equal((await reopened.getSource(second.id)).version, 'v2')
  assert.deepEqual((await reopened.history(first.id)).map(r => r.id), [model.id, edit.id])
  assert.deepEqual((await reopened.history(first.id)).at(-1).data, { rules: [2] })
  assert.deepEqual(await reopened.readOriginal(first.id), bytes)
})

test('concurrent revisions retain submission order', async t => {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'source-store-'))
  t.after(() => fs.rm(dataDir, { recursive: true, force: true }))
  const store = createSourceStore({ dataDir })
  const source = await store.importFile(Buffer.from('original'), 'rules.txt')
  const revisions = await Promise.all(Array.from({ length: 20 }, (_, index) =>
    store.appendRevision(source.id, { type: 'manual', data: { extraction: { index } } })))
  const reopened = createSourceStore({ dataDir })
  assert.deepEqual((await reopened.history(source.id)).map(revision => revision.id), revisions.map(revision => revision.id))
})

test('line snippets preserve physical source lines, including multiline CSV fields', () => {
  const text = '\ufeffname,value\r\n"first\nsecond",42\rblank\n'
  const extraction = extractSource(Buffer.from(text), 'input.csv')
  assert.equal(extraction.text, text)
  assert.equal(extraction.lineBasis, 'source-text')
  assert.deepEqual(extraction.lines, [
    { line: 1, text: '\ufeffname,value' },
    { line: 2, text: '"first' },
    { line: 3, text: 'second",42' },
    { line: 4, text: 'blank' }
  ])
  assert.deepEqual(extractSource(Buffer.from(''), 'empty.txt').lines, [])
  assert.deepEqual(extractSource(Buffer.from('a\n\n'), 'lines.txt').lines, [
    { line: 1, text: 'a' }, { line: 2, text: '' }
  ])
  assert.equal(extractSource(Buffer.from('not a PDF'), 'input.pdf').lines, undefined)
  assert.equal(extractSource(Buffer.from([0xff]), 'input.csv').lines, undefined)
})

test('extraction is conservative and never truncates', async t => {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'source-store-'))
  t.after(() => fs.rm(dataDir, { recursive: true, force: true }))
  const store = createSourceStore({ dataDir })
  const text = 'a'.repeat(200000)
  for (const ext of ['json', 'csv', 'txt', 'md']) {
    const item = await store.importFile(Buffer.from(text), `input.${ext}`)
    assert.equal(item.extraction.complete, true)
    assert.equal(item.extraction.text, text)
  }
  for (const [name, bytes] of [['x.docx', Buffer.from('fake')], ['x.txt', Buffer.from([0xff])], ['x.txt', Buffer.from([0])], ['x.pdf', Buffer.from('text')]]) {
    const item = await store.importFile(bytes, name)
    assert.equal(item.extraction.complete, false)
    assert.ok(item.extraction.reason)
    assert.deepEqual(await store.readOriginal(item.id), bytes)
  }
})

test('rejects unsafe names, IDs, revisions, and symlink directories', async t => {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'source-store-'))
  t.after(() => fs.rm(dataDir, { recursive: true, force: true }))
  const store = createSourceStore({ dataDir })
  await assert.rejects(store.importFile(Buffer.from('x'), '../x.txt'))
  await assert.rejects(store.getSource('../outside'))
  const source = await store.importFile(Buffer.from('x'), 'x.txt')
  await assert.rejects(store.appendRevision(source.id, { type: 'other', data: {} }))
  await assert.rejects(store.appendRevision(source.id, { type: 'manual', data: undefined }))
  const outside = await fs.mkdtemp(path.join(os.tmpdir(), 'source-outside-'))
  t.after(() => fs.rm(outside, { recursive: true, force: true }))
  const other = await fs.mkdtemp(path.join(os.tmpdir(), 'source-other-'))
  t.after(() => fs.rm(other, { recursive: true, force: true }))
  try { await fs.symlink(outside, path.join(other, 'sources'), 'junction') } catch (error) { if (error.code === 'EPERM') return; throw error }
  await assert.rejects(createSourceStore({ dataDir: other }).importFile(Buffer.from('x'), 'x.txt'), /Unsafe/)
})
