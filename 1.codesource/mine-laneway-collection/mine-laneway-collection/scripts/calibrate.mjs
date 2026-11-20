import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { parseDxf } from '../core/parse.js'
import { extractSurvey } from '../core/survey.js'
import { parseElev } from '../core/nodes.js'
import { selectMainCoordinateArea } from '../core/lanes.js'

function readTruth(file) {
  const bytes = fs.readFileSync(file)
  for (const encoding of ['utf-8', 'gb18030']) {
    try { return JSON.parse(new TextDecoder(encoding, { fatal: true }).decode(bytes).replace(/^\uFEFF/, '')) } catch {}
  }
  throw new Error('Truth JSON must be UTF-8 or GB18030')
}

const quantile = (values, ratio) => {
  if (!values.length) return null
  const sorted = values.slice().sort((a, b) => a - b)
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor((sorted.length - 1) * ratio)))]
}

const [input, truthFile, output] = process.argv.slice(2)
if (!input || !truthFile || !output || !/\.dxf$/i.test(input)) {
  throw new Error('Usage: calibrate.mjs source.dxf truth.json new-calibration.json')
}
const truth = readTruth(truthFile)
if (!Array.isArray(truth)) throw new Error('Truth JSON must be a lane array')
const bytes = fs.readFileSync(input)
const sourceHash = createHash('sha256').update(bytes).digest('hex')
const parsed = parseDxf(bytes)
const survey = extractSurvey(bytes)
const circles = Object.values(survey.entities).filter(entity => entity.type === 'CIRCLE')
const texts = Object.values(survey.entities).filter(entity => entity.type === 'TEXT' || entity.type === 'MTEXT')
const uniquePoints = []
const seen = new Set()
for (const lane of truth) for (const point of lane.traverse_point_array || []) {
  const key = `${Math.round(point.x * 1000)}:${Math.round(point.y * 1000)}`
  if (!seen.has(key)) {
    seen.add(key)
    uniquePoints.push(point)
  }
}
const area = selectMainCoordinateArea(parsed.paths, uniquePoints)
const kept = area.pointIndices.map(index => uniquePoints[index])
const circleDistances = []
const matchedRadii = []
const matchedBlocks = []
for (const point of kept) {
  let best = null
  for (const circle of circles) {
    const distance = Math.hypot(circle.x - point.x, circle.y - point.y)
    if (!best || distance < best.distance) best = { distance, circle }
  }
  circleDistances.push(best?.distance)
  if (best?.distance <= 2) {
    matchedRadii.push(best.circle.radius)
    matchedBlocks.push(best.circle.block_ref_id ? 1 : 0)
  }
}
const spacings = [], borderSegments = []
for (const lane of truth) {
  const points = lane.traverse_point_array || []
  borderSegments.push((lane.border_line_points || []).length)
  for (let index = 1; index < points.length; index++) {
    spacings.push(Math.hypot(points[index].x - points[index - 1].x, points[index].y - points[index - 1].y))
  }
}
const laneElevations = truth.map(lane => {
  const values = (lane.traverse_point_array || []).map(point => point.z_bottom).filter(Number.isFinite)
  return values.length ? values.slice().sort((a, b) => a - b)[Math.floor(values.length / 2)] : null
})
const crossings = []
const segmentCrosses = (a, b, c, d) => {
  const denominator = (a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x)
  if (Math.abs(denominator) < 1e-12) return false
  const t = ((a.x - c.x) * (c.y - d.y) - (a.y - c.y) * (c.x - d.x)) / denominator
  const u = -((a.x - b.x) * (a.y - c.y) - (a.y - b.y) * (a.x - c.x)) / denominator
  return t > 0.02 && t < 0.98 && u > 0.02 && u < 0.98
}
for (let i = 0; i < truth.length; i++) for (let j = i + 1; j < truth.length; j++) {
  const a = truth[i].traverse_point_array || [], b = truth[j].traverse_point_array || []
  let crosses = false
  for (let ai = 1; ai < a.length && !crosses; ai++) for (let bi = 1; bi < b.length; bi++) {
    if (segmentCrosses(a[ai - 1], a[ai], b[bi - 1], b[bi])) { crosses = true; break }
  }
  if (!crosses) continue
  const z1 = laneElevations[i], z2 = laneElevations[j]
  crossings.push({
    a: truth[i].laneway_code,
    b: truth[j].laneway_code,
    elevation_difference: Number.isFinite(z1) && Number.isFinite(z2) ? Math.abs(z1 - z2) : null,
  })
}
const crossingDifferences = crossings.map(item => item.elevation_difference).filter(Number.isFinite)
const labelDistances = []
for (const point of kept) {
  const name = String(point.point_name || '').trim()
  const elevation = Number(point.z_bottom)
  if (!name) continue
  let best = Infinity
  for (const text of texts) {
    const raw = text.text || ''
    const parsedElevation = parseElev(raw)
    if (!raw.includes(name) || parsedElevation === null) continue
    if (Number.isFinite(elevation) && Math.abs(parsedElevation - elevation) > 0.01) continue
    best = Math.min(best, Math.hypot(text.x - point.x, text.y - point.y))
  }
  if (Number.isFinite(best)) labelDistances.push(best)
}
const layers = {}
for (const path of area.paths) layers[path.layer || '0'] = (layers[path.layer || '0'] || 0) + 1
const report = {
  schema_version: 'laneway-calibration-v1',
  input: { source_sha256: sourceHash, coordinate_units: 'drawing_units_only', crs: 'unknown' },
  truth: {
    lanes: truth.length,
    point_occurrences: truth.reduce((sum, lane) => sum + (lane.traverse_point_array?.length || 0), 0),
    unique_points: uniquePoints.length,
    retained_main_area_points: kept.length,
    point_spacing_drawing_units: {
      p10: quantile(spacings, .1), p25: quantile(spacings, .25), p50: quantile(spacings, .5),
      p75: quantile(spacings, .75), p90: quantile(spacings, .9), p95: quantile(spacings, .95),
    },
    border_segments_per_lane: {
      min: Math.min(...borderSegments), p25: quantile(borderSegments, .25), p50: quantile(borderSegments, .5),
      p75: quantile(borderSegments, .75), max: Math.max(...borderSegments),
    },
    crossings: {
      pair_count: crossings.length,
      different_elevation_count: crossingDifferences.filter(value => value > 0.01).length,
      same_elevation_count: crossingDifferences.filter(value => value <= 0.01).length,
      unknown_elevation_count: crossings.filter(item => item.elevation_difference === null).length,
      elevation_difference: {
        p10: quantile(crossingDifferences, .1), p50: quantile(crossingDifferences, .5),
        p90: quantile(crossingDifferences, .9), max: crossingDifferences.length ? Math.max(...crossingDifferences) : null,
      },
    },
  },
  source_match: {
    nearest_circle_distance_drawing_units: {
      p25: quantile(circleDistances, .25), p50: quantile(circleDistances, .5),
      p75: quantile(circleDistances, .75), p90: quantile(circleDistances, .9), p95: quantile(circleDistances, .95),
    },
    circles_within_2_units: matchedRadii.length,
    matched_radius_drawing_units: {
      p10: quantile(matchedRadii, .1), p50: quantile(matchedRadii, .5), p90: quantile(matchedRadii, .9),
    },
    matched_block_fraction: matchedBlocks.length ? matchedBlocks.reduce((a, b) => a + b, 0) / matchedBlocks.length : null,
    label_to_circle_distance_drawing_units: {
      sample_count: labelDistances.length, p50: quantile(labelDistances, .5),
      p90: quantile(labelDistances, .9), p95: quantile(labelDistances, .95),
    },
  },
  suggested_rules: {
    label_association_radius_drawing_units: Math.max(1, Math.ceil((quantile(labelDistances, .9) || 0) * 1.1)),
    circle_match_radius_drawing_units: Math.max(0.1, quantile(circleDistances, .5) || 0.2),
    require_same_color_boundaries: true,
    color_layering: true,
    allow_single_line_lanes: false,
    preserve_elevation_suffix: true,
    require_complete_lane_points: true,
    crossing_rule: 'Keep crossing centreline objects separate when elevations differ; draw lower elevations first and higher elevations last.',
    note: 'Thresholds are drawing units, not metres. Block-concentric circles merge only by the same block_ref_id.',
  },
  main_area: { coordinate_clusters: area.coordinateClusters || 1, dropped_named_layer_paths: area.droppedPaths, layer_path_counts: layers },
}
fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ output, ...report.suggested_rules }, null, 2))
