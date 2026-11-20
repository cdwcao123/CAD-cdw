import { parseElev } from './nodes.js'
import { LANE_LAYER_HINTS, pathLen } from './nodegraph.js'
import { normalizeRuleColor } from './colors.js'
import {
  buildChains,
  dedupeLanes,
  mergeLanes,
  offsetPolyline,
  pairChains,
  selectClusters,
} from './geometry.js'

const NAME_HINT = /巷道|井巷|大巷|顺槽|石门|联络|中心线|煤巷|开拓|回采|掘进|上山|下山|车场|绕道|切眼|运输|轨道|皮带/
const NOISE_LAYER = /等高线|断层|钻孔|露头|煤柱|标注|文字|图框|填充|设备|水沟|风门|密闭|剖面|经纬|网格|坐标|图例|色块|岩性|支护|通风|管线|电缆|监测|排水|采区$|盘区$/i

function detectLaneLayers(paths) {
  const counts = new Map()
  for (const path of paths) counts.set(path.layer || '0', (counts.get(path.layer || '0') || 0) + 1)
  return [...counts]
    .filter(([name, count]) => count > 0 && LANE_LAYER_HINTS.test(name) && !NOISE_LAYER.test(name))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([name]) => name)
}

function projectToPolyline(point, pts) {
  let best = { distance: Infinity, position: 0 }, travelled = 0
  for (let index = 1; index < pts.length; index++) {
    const a = pts[index - 1], b = pts[index]
    const dx = b[0] - a[0], dy = b[1] - a[1]
    const length = Math.hypot(dx, dy)
    const length2 = dx * dx + dy * dy
    const t = length2 ? Math.max(0, Math.min(1, ((point.x - a[0]) * dx + (point.y - a[1]) * dy) / length2)) : 0
    const distance = Math.hypot(point.x - a[0] - t * dx, point.y - a[1] - t * dy)
    if (distance < best.distance) best = { distance, position: travelled + t * length }
    travelled += length
  }
  return best
}

function nearestTexts(lane, texts, radius) {
  const anchors = [0, 0.25, 0.5, 0.75, 1].map(ratio => lane.pts[Math.min(lane.pts.length - 1, Math.round((lane.pts.length - 1) * ratio))])
  return texts
    .map(text => ({
      ...text,
      distance: Math.min(...anchors.map(anchor => Math.hypot(anchor[0] - text.x, anchor[1] - text.y))),
    }))
    .filter(text => text.distance <= radius)
    .sort((a, b) => a.distance - b.distance)
}

function dropFrameLanes(lanes) {
  if (lanes.length < 3) return lanes
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const lane of lanes) for (const [x, y] of lane.pts) {
    minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y)
  }
  const tolerance = Math.max(2, Math.min(maxX - minX, maxY - minY) * 0.01)
  return lanes.filter(lane => {
    const onFrame = lane.pts.filter(([x, y]) =>
      Math.abs(x - minX) <= tolerance || Math.abs(x - maxX) <= tolerance ||
      Math.abs(y - minY) <= tolerance || Math.abs(y - maxY) <= tolerance).length
    return !(onFrame / lane.pts.length > 0.85 && lane.length > (maxX - minX) * 0.35)
  })
}

function median(values) {
  if (!values.length) return null
  const sorted = values.slice().sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

function laneElevation(lane) {
  const values = (lane.traverse_point_array || []).map(point => point.z_bottom).filter(Number.isFinite)
  return values.length ? median(values) : null
}

function segmentIntersection(a, b, c, d) {
  const denominator = (a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x)
  if (Math.abs(denominator) < 1e-12) return null
  const t = ((a.x - c.x) * (c.y - d.y) - (a.y - c.y) * (c.x - d.x)) / denominator
  const u = -((a.x - b.x) * (a.y - c.y) - (a.y - b.y) * (a.x - c.x)) / denominator
  if (t <= 0.02 || t >= 0.98 || u <= 0.02 || u >= 0.98) return null
  return { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) }
}

function annotateCrossings(records) {
  for (const record of records) record.crossings = []
  for (let i = 0; i < records.length; i++) {
    const a = records[i], ap = a.traverse_point_array
    for (let j = i + 1; j < records.length; j++) {
      const b = records[j], bp = b.traverse_point_array, intersections = []
      for (let ai = 1; ai < ap.length; ai++) for (let bi = 1; bi < bp.length; bi++) {
        const point = segmentIntersection(ap[ai - 1], ap[ai], bp[bi - 1], bp[bi])
        if (point) intersections.push(point)
      }
      if (!intersections.length) continue
      const delta = Number.isFinite(a.elevation_median) && Number.isFinite(b.elevation_median)
        ? Math.abs(a.elevation_median - b.elevation_median)
        : null
      const relation = { with: b.laneway_code, intersections, elevation_difference: delta }
      a.crossings.push(relation)
      b.crossings.push({ with: a.laneway_code, intersections, elevation_difference: delta })
    }
  }
}

function detailGridTiles(paths, cellSize = 1000) {
  const tiles = new Map()
  for (const path of paths) {
    if (!path.pts?.length) continue
    let x = 0, y = 0
    for (const point of path.pts) { x += point[0]; y += point[1] }
    x /= path.pts.length; y /= path.pts.length
    const key = `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)}`
    if (!tiles.has(key)) tiles.set(key, { count: 0, layers: new Set() })
    const tile = tiles.get(key)
    tile.count++
    tile.layers.add(path.layer || '0')
  }
  // Inset plans commonly overlay buildings, rails, symbols and drafting lines.
  // A very dense tile spanning many unrelated layers is localized detail, not
  // an extension of the main roadway network.
  const marked = new Set([...tiles].filter(([, tile]) => tile.count >= 1000 && tile.layers.size >= 20).map(([key]) => key))
  for (const key of [...marked]) {
    const [gx, gy] = key.split(',').map(Number)
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
      const neighbor = `${gx + dx},${gy + dy}`
      const tile = tiles.get(neighbor)
      if (tile && tile.count >= 300 && tile.layers.size >= 20) marked.add(neighbor)
    }
  }
  return marked
}

function lanePoints(lane, surveyPoints, elevation) {
  const nearby = surveyPoints
    .map((point, index) => {
      const projection = projectToPolyline(point, lane.pts)
      return { ...point, index, distance: projection.distance, position: projection.position }
    })
    .filter(point => point.distance <= 4)
    .sort((a, b) => a.position - b.position)
  if (nearby.length >= 2) {
    return nearby.map((point, order) => ({
      x: point.x, y: point.y, point_name: point.point_name || '', point_order: order,
      circle_radius: point.circle_radius ?? null, block_ref_id: point.block_ref_id ?? null,
      source_circle_id: point.circle_id || null,
      source_circle_handle: point.source_handle || null,
      source_circle_layer: point.circle_layer ?? null,
      source_circle_color: point.circle_color ?? null,
      color_group: point.color_group ?? null,
      color_layer_order: point.color_layer_order ?? null,
      point_name_text_id: point.name_text_id || null,
      point_name_text_raw: point.name_text ?? null,
      point_name_text_color: point.name_text_color ?? null,
      elevation_text_id: point.elevation_text_id || null,
      elevation_text_raw: point.elevation_text_raw ?? point.elevation_text ?? null,
      elevation_text_color: point.elevation_text_color ?? null,
      elevation_suffix: point.elevation_suffix ?? null,
      elevation: Number.isFinite(point.elevation) ? point.elevation : null,
      point_source: Number.isFinite(point.elevation) ? 'survey_circle' : 'survey_circle_missing_elevation',
    }))
  }
  return []
}

export function reconstructLaneNetwork(paths, surveyPoints = [], texts = [], options = {}) {
  const minLength = Number(options.minLength) > 0 ? options.minLength : 20
  const minGap = Number(options.minGap) > 0 ? options.minGap : 1.5
  const maxGap = Number(options.maxGap) > minGap ? Number(options.maxGap) : 8
  const includeColors = new Set((options.boundaryColorInclude || []).map(normalizeRuleColor).filter(Boolean))
  const excludeColors = new Set((options.boundaryColorExclude || []).map(normalizeRuleColor).filter(Boolean))
  const excludeLayers = new Set(options.excludeLayers || [])
  const includeLayers = new Set(options.includeLayers || [])
  const laneLayers = detectLaneLayers(paths)
  const wanted = new Set(laneLayers)
  const lanePaths = paths.filter(path =>
    wanted.has(path.layer || '0') &&
    !excludeLayers.has(path.layer || '0') &&
    (!includeLayers.size || includeLayers.has(path.layer || '0')) &&
    path.color && path.color !== 'unknown' &&
    (!includeColors.size || includeColors.has(path.color)) &&
    !excludeColors.has(path.color) &&
    path.pts?.length >= 2 && !path.closed &&
    /^(?:LINE|LWPOLYLINE|POLYLINE|ARC|SPLINE)(?:@|$)/.test(path.kind || '') &&
    pathLen(path.pts) > 1e-6)
  if (!lanePaths.length) throw new Error('No lane-layer linework found')
  const cluster = selectClusters(lanePaths, { minRatio: 1.01 })
  const chains = buildChains(cluster.paths, 1.2)
  const paired = pairChains(chains, { minGap, maxGap })
  const single = paired.free.filter(chain => chain.length >= minLength)
  const corridors = paired.corridors
    .filter(chain => chain.color && chain.color !== 'unknown')
    .map(chain => ({ ...chain, pairConfidence: 1 }))
  const merged = dropFrameLanes(mergeLanes(corridors, 20, 3000))
    .filter(lane => lane.length >= minLength)
  const lanes = dedupeLanes(merged).sort((a, b) => b.length - a.length)
  const detailTiles = detailGridTiles(paths)
  const detailLanes = lanes.filter(lane => {
    const inside = lane.pts.filter(([x, y]) => detailTiles.has(`${Math.floor(x / 1000)},${Math.floor(y / 1000)}`)).length
    return inside / lane.pts.length >= 0.75
  })
  const networkLanes = lanes.filter(lane => !detailLanes.includes(lane))
  const records = networkLanes.map((lane, index) => {
    const close = nearestTexts(lane, texts, 80)
    const elevations = close.map(text => parseElev(text.text)).filter(Number.isFinite)
    const elevation = elevations.length ? median(elevations) : null
    const named = nearestTexts(lane, texts, 30).find(text => NAME_HINT.test(text.text || ''))
    const points = lanePoints(lane, surveyPoints, elevation)
    const half = lane.width / 2
    const code = `network-${index + 1}`
    return {
      laneway_name: named?.text?.trim().slice(0, 80) || '',
      laneway_code: code,
      laneway_type: '普通',
      laneway_sec_style: '半圆拱',
      laneway_width: lane.width,
      laneway_height: 3,
      laneway_height_source: 'default',
      color: lane.color,
      border_line_points: [
        offsetPolyline(lane.pts, half).map(([x, y]) => ({ x, y })),
        offsetPolyline(lane.pts, -half).map(([x, y]) => ({ x, y })),
      ],
      traverse_point_count: points.length,
      traverse_point_array: points.map(point => {
        const z = Number.isFinite(point.elevation) ? point.elevation : null
        return {
          laneway_code: code,
          point_name: point.point_name,
          circle_radius: point.circle_radius,
          block_ref_id: point.block_ref_id,
          traverse_point_type: '导线点',
          x: point.x,
          y: point.y,
          z_bottom: z,
          z_top: z === null ? null : z + 3,
          left_side: half,
          right_side: half,
          point_order: point.point_order,
          point_source: point.point_source,
      source_circle_id: point.source_circle_id,
      source_circle_handle: point.source_circle_handle,
      source_circle_layer: point.source_circle_layer,
      source_circle_color: point.source_circle_color,
      color_group: point.color_group,
      color_layer_order: point.color_layer_order,
      point_name_text_id: point.point_name_text_id,
      point_name_text_raw: point.point_name_text_raw,
      point_name_text_color: point.point_name_text_color,
      elevation_text_id: point.elevation_text_id,
      elevation_text_raw: point.elevation_text_raw,
      elevation_text_color: point.elevation_text_color,
      elevation_suffix: point.elevation_suffix,
        }
      }),
      boundary_line_colors: [lane.color, lane.color],
      boundary_line_layers: [lane.layer, lane.layer],
      boundary_line_source_path_indices: lane.pathIndices || [],
      boundary_line_sources: [{
        layer: lane.layer,
        color: lane.color,
        entities: (lane.pathIndices || []).map(pathIndex => ({
          index: pathIndex,
          handle: paths[pathIndex]?.handle || null,
          layer: paths[pathIndex]?.layer || '0',
          color: paths[pathIndex]?.color || null,
          color_source: paths[pathIndex]?.color_source || null,
          kind: paths[pathIndex]?.kind || null,
          point_count: paths[pathIndex]?.pts?.length || 0,
        })),
      }],
      boundary_pair_source: 'original_dxf_same_color_double_line',
      single_line_used: false,
      geometry_review_required: lane.pairConfidence === 0 || lane.geometryReview === true,
      network_source: 'double_line_geometry',
      elevation_median: median(points.map(point => point.elevation).filter(Number.isFinite)),
      elevation_max: points.map(point => point.elevation).filter(Number.isFinite).reduce((max, value) => Math.max(max, value), -Infinity),
    }
  })
  for (const record of records) {
    if (!Number.isFinite(record.elevation_median)) record.elevation_median = null
    if (!Number.isFinite(record.elevation_max)) record.elevation_max = null
  }
  annotateCrossings(records)
  const verticalOrder = records.slice().sort((a, b) => {
    const aNull = a.elevation_median === null, bNull = b.elevation_median === null
    if (aNull && bNull) return a.laneway_code.localeCompare(b.laneway_code)
    if (aNull) return -1
    if (bNull) return 1
    return a.elevation_median - b.elevation_median || a.laneway_code.localeCompare(b.laneway_code)
  })
  verticalOrder.forEach((record, index) => { record.vertical_overlay_rank = index })
  return {
    records,
    summary: {
      lane_paths: lanePaths.length,
      lane_layers: laneLayers,
      kept_paths: cluster.paths.length,
      dropped_paths: cluster.dropped,
      coordinate_clusters: cluster.total,
      chains: chains.length,
      double_line_corridors: corridors.length,
      single_line_candidates: single.length,
      single_line_rejected: single.length,
      lanes: records.length,
      detail_grid_lanes_removed: detailLanes.length,
      detail_grid_tiles: detailTiles.size,
    },
  }
}
