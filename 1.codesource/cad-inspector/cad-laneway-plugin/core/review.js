/** 大模型复核结果应用：命名归一、标高修正、剔除误识别。 */
import { lanewayDisplayName } from './semantic.js'

const NAME_LIMIT = 40

export function buildCandidates(records, labels, limit = 200) {
  const list = []
  const count = Math.min(records.length, limit)
  for (let i = 0; i < count; i++) {
    const r = records[i]
    const lane = labels[i] || {}
    const mid = r.traverse_point_array[Math.floor(r.traverse_point_count / 2)] || { x: 0, y: 0 }
    list.push({
      i,
      name: r.laneway_name.replace(/^[+\-]?\d+(?:\.\d+)?m/, '').slice(0, NAME_LIMIT) || '',
      elev: r.traverse_point_array[0] ? r.traverse_point_array[0].z_bottom : null,
      layer: (lane.layer || '').slice(0, 20),
      len: Math.round((lane.length || 0) * 10) / 10,
      width: r.laneway_width,
      x: Math.round(mid.x),
      y: Math.round(mid.y),
    })
  }
  return list
}

export function applyDecisions(records, decisions, { height = 3 } = {}) {
  if (!Array.isArray(decisions) || !decisions.length) return { records, applied: 0 }
  const byIndex = new Map()
  for (const d of decisions) {
    const i = Number(d && d.i)
    if (Number.isInteger(i) && i >= 0 && i < records.length) byIndex.set(i, d)
  }
  const out = []
  let applied = 0
  records.forEach((record, i) => {
    const d = byIndex.get(i)
    if (!d) {
      out.push(record)
      return
    }
    if (d.keep === false) {
      applied++
      return
    }
    let changed = false
    const elevation = Number(d.elev)
    // 巷道可能逐点变坡，单个复核值不能覆盖整条巷道的标高。
    const name = typeof d.name === 'string' ? d.name.replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, NAME_LIMIT) : ''
    if (name && name !== record.laneway_name) {
      const elevationValue = record.traverse_point_array[0].z_bottom
      record.laneway_name = lanewayDisplayName({
        name: name.replace(/^[+\-]?\d+(?:\.\d+)?m/, ''),
        elevation: Number.isFinite(elevationValue) ? elevationValue : null,
      })
      changed = true
    }
    if (changed) applied++
    out.push(record)
  })
  return { records: out, applied }
}
