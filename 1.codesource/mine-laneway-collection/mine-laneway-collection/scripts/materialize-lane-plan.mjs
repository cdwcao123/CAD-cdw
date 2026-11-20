import fs from 'node:fs'

function pointId(point, index = 0) {
  return point?.source_handle || point?.source_circle_handle || point?.source_circle_id || point?.circle_id ||
    `${point?.point_name || 'point'}@${Number(point?.x).toFixed(3)},${Number(point?.y).toFixed(3)}#${index + 1}`
}

const [networkFile, planFile, output] = process.argv.slice(2)
if (!networkFile || !planFile || !output) {
  throw new Error('Usage: materialize-lane-plan.mjs same-color-network.json model-lane-plan.json final.json')
}
const read = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''))
const network = read(networkFile)
const plan = read(planFile)
if (!Array.isArray(network) || !Array.isArray(plan?.lanes)) throw new Error('Invalid network or model plan')
const corridors = new Map(network.map((lane, index) => [lane.laneway_code || `corridor-${index + 1}`, lane]))
const usedPoints = new Set()
const result = []
for (let index = 0; index < plan.lanes.length; index++) {
  const item = plan.lanes[index]
  const corridorId = String(item?.corridor_id || '')
  const source = corridors.get(corridorId)
  if (!source) throw new Error(`Unknown corridor_id at lanes[${index}]: ${corridorId}`)
  if (source.boundary_geometry_quality?.valid !== true) throw new Error(`Invalid corridor geometry: ${corridorId}`)
  const colors = source.boundary_line_colors || []
  if (colors.length !== 2 || !colors[0] || colors[0] !== colors[1]) throw new Error(`Different boundary colors: ${corridorId}`)
  const available = new Map((source.traverse_point_array || []).map((point, pointIndex) => [pointId(point, pointIndex), point]))
  const pointIds = Array.isArray(item.point_ids) ? item.point_ids : []
  if (pointIds.length < 2 || new Set(pointIds).size !== pointIds.length) throw new Error(`Invalid point order: ${corridorId}`)
  const selected = pointIds.map(id => {
    if (!available.has(id)) throw new Error(`Point ${id} is not in corridor ${corridorId}`)
    if (usedPoints.has(id)) throw new Error(`Point reused across lanes: ${id}`)
    usedPoints.add(id)
    const point = available.get(id)
    const elevation = Number.isFinite(point.z_bottom) ? point.z_bottom : point.elevation
    if (!String(point.point_name || '').trim()) throw new Error(`Point ${id} has no name`)
    if (!Number.isFinite(elevation)) throw new Error(`Point ${id} has no elevation`)
    return point
  })
  const lane = structuredClone(source)
  lane.laneway_code = `model-${index + 1}`
  lane.model_corridor_id = corridorId
  lane.model_confidence = Number.isFinite(item.confidence) ? item.confidence : null
  lane.model_note = typeof item.note === 'string' ? item.note.slice(0, 300) : ''
  lane.traverse_point_array = selected.map((point, order) => ({ ...point, laneway_code: lane.laneway_code, point_order: order }))
  lane.traverse_point_count = selected.length
  result.push(lane)
}
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ output, lanes: result.length, used_points: usedPoints.size }))
