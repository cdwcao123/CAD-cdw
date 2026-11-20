import fs from 'node:fs'
import { createHash } from 'node:crypto'

function pointId(point, index = 0) {
  return point?.source_handle || point?.source_circle_handle || point?.source_circle_id || point?.circle_id ||
    `${point?.point_name || 'point'}@${Number(point?.x).toFixed(3)},${Number(point?.y).toFixed(3)}#${index + 1}`
}

const [pointsFile, networkFile, output] = process.argv.slice(2)
if (!pointsFile || !networkFile || !output) {
  throw new Error('Usage: model-packet.mjs all-points.json same-color-network.json model-packet.json')
}
const read = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''))
const points = read(pointsFile)
const network = read(networkFile)
if (!Array.isArray(points) || !Array.isArray(network)) throw new Error('Points and network files must be arrays')
const corridorPointIds = new Map()
const corridors = network.map((lane, laneIndex) => {
  const corridorId = lane.laneway_code || `corridor-${laneIndex + 1}`
  const lanePointIds = (lane.traverse_point_array || []).map((point, index) => pointId(point, index))
  corridorPointIds.set(corridorId, new Set(lanePointIds))
  return {
    corridor_id: corridorId,
    boundary_colors: lane.boundary_line_colors || [],
    point_ids: lanePointIds,
    row: [
      corridorId,
      lane.boundary_line_colors || [],
      lane.boundary_line_layers || [],
      (lane.boundary_line_sources || []).flatMap(side => side.entities?.map(entity => entity.handle).filter(Boolean) || []),
      lane.boundary_geometry_quality ? [
        lane.boundary_geometry_quality.valid === true,
        lane.boundary_geometry_quality.coverage,
        lane.boundary_geometry_quality.width_median_drawing_units,
        lane.boundary_geometry_quality.width_spread_ratio,
        lane.boundary_geometry_quality.endpoint_parallelism,
        lane.boundary_geometry_quality.centering_residual,
      ] : null,
      (lane.border_line_points || []).map(line => {
        const start = line[0] || {}, end = line[line.length - 1] || {}
        return [start.x ?? null, start.y ?? null, end.x ?? null, end.y ?? null, line.length]
      }),
      lanePointIds,
      lane.boundary_trimmed_to_paired_extent === true,
    ],
  }
})
const modelPoints = points.map((point, index) => {
  const id = pointId(point, index)
  return {
    point_id: id,
    candidate_corridor_ids: point.same_color_corridor_ids || [],
    row: [
      id,
      point.point_name,
      point.x,
      point.y,
      point.elevation ?? null,
      point.elevation_suffix || '',
      point.circle_color || null,
      point.circle_layer || null,
      point.block_ref_id || null,
      point.same_color_corridor_ids || [],
      point.boundary_status || 'unknown',
    ],
  }
})
const packet = {
  schema_version: 'mine-laneway-model-packet-v1',
  source_hashes: {
    points: createHash('sha256').update(fs.readFileSync(pointsFile)).digest('hex'),
    network: createHash('sha256').update(fs.readFileSync(networkFile)).digest('hex'),
  },
  task: [
    '为每个导线点选择至多一条同色双线候选，并按巷道走向排序。',
    '按 corridor_fields 解码 corridors；只能使用 corridors[].point_ids 中的点，异色、单线、几何质量无效的候选不得使用。',
    '同一导线点不得在多个输出巷道中重复使用，除非用户明确说明交叉共享点。',
    '无法确定的点保持未分配，不得凭空补造编号、标高或边界。',
  ],
  point_fields: [
    'point_id', 'point_name', 'x', 'y', 'elevation', 'elevation_suffix',
    'circle_color', 'circle_layer', 'block_ref_id', 'candidate_corridor_ids', 'boundary_status',
  ],
  corridor_fields: [
    'corridor_id', 'boundary_colors', 'boundary_layers', 'boundary_handles',
    'quality[valid,coverage,width_median,width_spread,parallelism,centering]',
    'boundary_endpoints[start_x,start_y,end_x,end_y,point_count]',
    'point_ids', 'trimmed_single_line_tail',
  ],
  points: modelPoints.map(point => point.row),
  corridors: corridors.map(corridor => corridor.row),
  corridor_index: corridors.map(corridor => ({
    corridor_id: corridor.corridor_id,
    boundary_colors: corridor.boundary_colors,
    point_ids: corridor.point_ids,
  })),
  unmatched_point_ids: modelPoints.filter(point => point.candidate_corridor_ids.length === 0).map(point => point.point_id),
  output_schema: {
    schema_version: 'mine-laneway-model-plan-v1',
    lanes: [{
      lane_id: 'model-lane-1',
      corridor_id: 'must reference packet.corridor_index[].corridor_id',
      point_ids: ['ordered point_id values from the corridor'],
      confidence: '0..1',
      note: 'optional short reason',
    }],
  },
}
fs.writeFileSync(output, JSON.stringify(packet) + '\n', { flag: 'wx' })
console.log(JSON.stringify({
  output,
  points: packet.points.length,
  corridors: packet.corridor_index.length,
  unmatched_points: packet.unmatched_point_ids.length,
  source_hashes: packet.source_hashes,
}))
