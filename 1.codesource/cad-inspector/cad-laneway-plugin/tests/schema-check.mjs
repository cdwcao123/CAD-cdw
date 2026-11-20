import fs from 'node:fs'

const reference = JSON.parse(fs.readFileSync('E:/kuangshan/银星图纸/银星图纸/导出巷道数据.json', 'binary').toString('binary'))
const ref = JSON.parse(Buffer.from(fs.readFileSync('E:/kuangshan/银星图纸/银星图纸/导出巷道数据.json')).toString('utf8').replace(/\uFFFD/g, ''))
const refKeys = Object.keys(ref[0])
const pointKeys = Object.keys(ref[0].traverse_point_array[0])

const target = process.argv[2]
const data = JSON.parse(fs.readFileSync(target, 'utf8'))
console.log('records', data.length, 'reference', ref.length)
let ok = true
for (const [i, r] of data.entries()) {
  const keys = Object.keys(r)
  const missing = refKeys.filter(k => !keys.includes(k))
  const extra = keys.filter(k => !refKeys.includes(k))
  if (missing.length || extra.length) {
    console.log('record', i, 'missing', missing, 'extra', extra)
    ok = false
    break
  }
  if (r.traverse_point_count !== r.traverse_point_array.length) {
    console.log('record', i, 'count mismatch')
    ok = false
    break
  }
  if (r.border_line_points.length !== 2) {
    console.log('record', i, 'border arrays', r.border_line_points.length)
    ok = false
    break
  }
  const pk = Object.keys(r.traverse_point_array[0])
  const pMissing = pointKeys.filter(k => !pk.includes(k))
  if (pMissing.length) {
    console.log('record', i, 'point missing', pMissing)
    ok = false
    break
  }
  if (r.traverse_point_array.some((p, idx) => p.point_order !== idx)) {
    console.log('record', i, 'point order broken')
    ok = false
    break
  }
  if (r.traverse_point_array.some(p => !(p.z_top > p.z_bottom))) {
    console.log('record', i, 'z_top <= z_bottom')
    ok = false
    break
  }
}
console.log(ok ? 'SCHEMA OK' : 'SCHEMA FAIL')
const total = data.reduce((s, r) => s + r.traverse_point_count, 0)
console.log('total points', total, 'avg', Math.round(total / data.length))
