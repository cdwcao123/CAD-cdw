import fs from 'node:fs'

const file = process.argv[2]
if (!file || !/\.json$/i.test(file)) throw new Error('Usage: validate-lanes.mjs final-lanes.json')
const lanes = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''))
if (!Array.isArray(lanes)) throw new Error('Final lane JSON must be an array')

function insidePolygon(point, polygon) {
  let inside = false
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
    const a = polygon[previous], b = polygon[index]
    const cross = (b.x - a.x) * (point.y - a.y) - (b.y - a.y) * (point.x - a.x)
    if (Math.abs(cross) < 1e-8 &&
        point.x >= Math.min(a.x, b.x) - 1e-8 && point.x <= Math.max(a.x, b.x) + 1e-8 &&
        point.y >= Math.min(a.y, b.y) - 1e-8 && point.y <= Math.max(a.y, b.y) + 1e-8) return true
    if ((a.y > point.y) !== (b.y > point.y) &&
        point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) inside = !inside
  }
  return inside
}

const results = lanes.map((lane, index) => {
  const issues = []
  const code = lane?.laneway_code || `lane-index-${index + 1}`
  const boundaries = lane?.border_line_points
  const colors = lane?.boundary_line_colors
  if (!Array.isArray(boundaries) || boundaries.length !== 2 || boundaries.some(line => !Array.isArray(line) || line.length < 2)) {
    issues.push('requires_two_original_boundary_lines')
  }
  if (!Array.isArray(colors) || colors.length !== 2 || !colors[0] || colors[0] === 'unknown' || colors[0] !== colors[1]) {
    issues.push('different_or_unknown_boundary_colors')
  }
  if (lane?.single_line_used === true) issues.push('single_line_is_not_a_laneway')
  if (lane?.boundary_geometry_quality?.valid !== true) issues.push('nonparallel_or_unstable_boundaries')
  if (!Array.isArray(lane?.boundary_line_sources) || lane.boundary_line_sources.length !== 2) {
    issues.push('missing_original_boundary_sources')
  }
  const points = lane?.traverse_point_array
  if (!Array.isArray(points) || !points.length) issues.push('missing_survey_points')
  else {
    const polygon = boundaries?.length === 2 ? [...boundaries[0], ...boundaries[1].slice().reverse()] : []
    for (const point of points) {
      const pointName = String(point?.point_name || '').trim()
      const elevation = Number.isFinite(point?.z_bottom) ? point.z_bottom : point?.elevation
      if (!pointName) issues.push('point_missing_name')
      if (!Number.isFinite(elevation)) issues.push('point_missing_elevation')
      if (!point?.source_circle_handle && !point?.source_circle_id) issues.push('point_missing_circle_source')
      if (polygon.length && Number.isFinite(point?.x) && Number.isFinite(point?.y) && !insidePolygon(point, polygon)) {
        issues.push('point_outside_same_color_boundaries')
      }
    }
  }
  return { laneway_code: code, valid: issues.length === 0, issues: [...new Set(issues)] }
})
const invalid = results.filter(result => !result.valid)
console.log(JSON.stringify({
  file,
  lanes: results.length,
  valid: results.length - invalid.length,
  invalid: invalid.length,
  issues: invalid,
}, null, 2))
if (invalid.length) process.exitCode = 1
