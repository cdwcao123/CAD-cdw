import fs from 'node:fs'
import path from 'node:path'
import createModule from '../runtime/libredwg-web.mjs'
import { processDxf } from '../core/pipeline.js'
import { buildDwg } from '../core/dwg.js'

const input = process.argv[2]
const outDir = process.argv[3] || 'E:/kuangshan/cad-laneway-test-out'
fs.mkdirSync(outDir, { recursive: true })

let bytes = new Uint8Array(fs.readFileSync(input))
if (/\.dwg$/i.test(input)) {
  const wasmUrl = new URL('../runtime/libredwg-web.wasm', import.meta.url).href
  const mod = await createModule({ locateFile: () => wasmUrl, print: () => {}, printErr: () => {} })
  mod.FS.writeFile('/input.dwg', bytes)
  const decoded = mod.dwg_read_file('/input.dwg')
  if (!decoded.data) throw new Error('DWG 读取失败')
  mod.dwg_free(decoded.data)
  const status = mod.dwg_write_dxf('/input.dwg', '/output.dxf')
  if (status !== 0) throw new Error('DWG 转 DXF 失败')
  bytes = new Uint8Array(mod.FS.readFile('/output.dxf'))
  console.log('dxf bytes', bytes.length)
}

const options = {
  width: 4,
  height: 3,
  minLength: Number(process.env.MIN_LEN || 20),
  mineName: '银星二号煤矿',
  mineCode: 'hrmyxyk',
}
const t0 = Date.now()
const result = processDxf(bytes, options)
console.log('pipeline ms', Date.now() - t0)
console.log('summary', JSON.stringify(result.summary, null, 1))
console.log('warnings', result.warnings)
console.log(
  'sample lanes',
  result.records.slice(0, 8).map(r => `${r.laneway_name}[${r.laneway_code}] pts=${r.traverse_point_count} w=${r.laneway_width}`)
)

const base = path.basename(input).replace(/\.(dwg|dxf)$/i, '')
fs.writeFileSync(path.join(outDir, `${base}.json`), JSON.stringify(result.records, null, 2), 'utf8')
const dwg = buildDwg(result.records, { title: base })
fs.writeFileSync(path.join(outDir, `${base}.dwg`), Buffer.from(dwg))
console.log('wrote', path.join(outDir, `${base}.json`), path.join(outDir, `${base}.dwg`), dwg.byteLength)

// 回归检查：任何图元都不应落在原点附近，否则会污染图纸范围（EXTMIN），AutoCAD 打开就像空白。
const { DwgReader } = await import('../vendor/acad-bundle.js')
const doc = DwgReader.readFromStream(dwg.buffer.slice(dwg.byteOffset, dwg.byteOffset + dwg.byteLength))
const ms = doc.blockRecords.get('*Model_Space')
const stray = []
for (const entity of ms.entities) {
  const pts = []
  if (entity.insertPoint) pts.push(entity.insertPoint)
  if (Array.isArray(entity.vertices))
    for (const v of entity.vertices) if (v.location) pts.push(v.location)
  if (pts.some(p => Math.abs(p.x) < 1000 && Math.abs(p.y) < 1000)) stray.push(entity.constructor.name)
}
console.log('entities', ms.entities.count, 'strayNearOrigin', stray.length, stray.slice(0, 5).join(','))
if (stray.length) {
  console.log('REGRESSION: 有图元落在原点附近，打开图纸会看不到内容')
  process.exit(1)
}
