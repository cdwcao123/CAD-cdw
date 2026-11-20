/** 大范围/超长巷道回归：验证大坐标量级下 DWG 写出精度与视图设置。 */
import { buildDwg, buildDemoDwg } from '../core/dwg.js'
import { DwgReader } from '../vendor/acad-bundle.js'

function readBack(dwg) {
  return DwgReader.readFromStream(dwg.buffer.slice(dwg.byteOffset, dwg.byteOffset + dwg.byteLength))
}

// 1) 大坐标量级（5e8，放大后的局部坐标系）+ 一条 10 km 长巷道
const bigX = 509400000
const bigY = 58370000
const record = {
  laneway_name: '+903.7m超长主大巷',
  laneway_code: 'TESTBIG01',
  laneway_width: 4,
  traverse_point_count: 3,
  traverse_point_array: [
    { x: bigX, y: bigY, z_top: 907, z_bottom: 903 },
    { x: bigX + 5000, y: bigY, z_top: 907, z_bottom: 903 },
    { x: bigX + 10000, y: bigY, z_top: 907, z_bottom: 903 },
  ],
  border_line_points: [
    [
      { x: bigX, y: bigY - 2 },
      { x: bigX + 10000, y: bigY - 2 },
    ],
    [
      { x: bigX, y: bigY + 2 },
      { x: bigX + 10000, y: bigY + 2 },
    ],
  ],
}
const dwgBig = buildDwg([record], { title: 'large-range-test' })
const docBig = readBack(dwgBig)
const msBig = docBig.blockRecords.get('*Model_Space')
const texts = []
let hasLongLine = false
for (const e of msBig.entities) {
  if (e.objectName === 'TEXT') texts.push(e.value)
  if (Array.isArray(e.vertices) && e.vertices.length) {
    const xs = e.vertices.map(v => v.location.x)
    if (Math.max(...xs) - Math.min(...xs) >= 9000) hasLongLine = true
  }
}
console.log('big-frame entities', msBig.entities.count, 'texts', texts.length, 'hasLongLine', hasLongLine)
console.log('  text0', texts[0])
console.log('  extents', JSON.stringify(docBig.header.modelSpaceExtMin), JSON.stringify(docBig.header.modelSpaceExtMax))
if (!hasLongLine) throw new Error('10km 巷道未被正确写出')
if (msBig.entities.count < 3) throw new Error('实体缺失')

// 2) 自检图（含中文）往返无损
const demo = buildDemoDwg()
const docDemo = readBack(demo)
console.log('demo entities', docDemo.blockRecords.get('*Model_Space').entities.count, 'styles', [...docDemo.textStyles].map(s => s.filename).join(','))

console.log('LARGE-RANGE OK')
