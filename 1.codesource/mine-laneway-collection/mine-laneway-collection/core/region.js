const finite = value => typeof value === 'number' && Number.isFinite(value)

export function normalizeRegion(region) {
  if (!region) return null
  const xMin = Number(region.x_min ?? region.xMin ?? region.x)
  const yMin = Number(region.y_min ?? region.yMin ?? region.y)
  const xMaxSource = region.x_max ?? region.xMax
  const yMaxSource = region.y_max ?? region.yMax
  const width = Number(region.width)
  const height = Number(region.height)
  const xMax = Number.isFinite(Number(xMaxSource)) ? Number(xMaxSource) : xMin + width
  const yMax = Number.isFinite(Number(yMaxSource)) ? Number(yMaxSource) : yMin + height
  if (![xMin, yMin, xMax, yMax].every(Number.isFinite) || xMax <= xMin || yMax <= yMin) {
    throw new Error('Region requires x_min < x_max and y_min < y_max in drawing units')
  }
  return { x_min: xMin, y_min: yMin, x_max: xMax, y_max: yMax }
}

export function parseRegionArgument(value) {
  if (Array.isArray(value)) return normalizeRegion({
    x_min: value[0], y_min: value[1], x_max: value[2], y_max: value[3],
  })
  const parts = String(value || '').split(',').map(Number)
  if (parts.length !== 4) throw new Error('Region must be xmin,ymin,xmax,ymax')
  return normalizeRegion({
    x_min: parts[0], y_min: parts[1], x_max: parts[2], y_max: parts[3],
  })
}

export function expandRegion(region, padding = 0) {
  const normalized = normalizeRegion(region)
  const pad = Number(padding)
  if (!normalized) return null
  if (!finite(pad) || pad < 0) throw new Error('Region padding must be a non-negative drawing-unit value')
  return {
    x_min: normalized.x_min - pad,
    y_min: normalized.y_min - pad,
    x_max: normalized.x_max + pad,
    y_max: normalized.y_max + pad,
  }
}

export function pointInRegion(point, region) {
  const bounds = normalizeRegion(region)
  return Boolean(bounds && finite(point?.x) && finite(point?.y) &&
    point.x >= bounds.x_min && point.x <= bounds.x_max &&
    point.y >= bounds.y_min && point.y <= bounds.y_max)
}

function clipSegment(a, b, region) {
  let t0 = 0, t1 = 1
  const dx = b[0] - a[0], dy = b[1] - a[1]
  const checks = [
    [-dx, a[0] - region.x_min],
    [dx, region.x_max - a[0]],
    [-dy, a[1] - region.y_min],
    [dy, region.y_max - a[1]],
  ]
  for (const [p, q] of checks) {
    if (Math.abs(p) < 1e-12) {
      if (q < 0) return null
      continue
    }
    const ratio = q / p
    if (p < 0) {
      if (ratio > t1) return null
      if (ratio > t0) t0 = ratio
    } else {
      if (ratio < t0) return null
      if (ratio < t1) t1 = ratio
    }
  }
  if (t1 - t0 < 1e-12) return null
  return [
    [a[0] + t0 * dx, a[1] + t0 * dy],
    [a[0] + t1 * dx, a[1] + t1 * dy],
  ]
}

export function clipPolylineToRegion(points, region) {
  const bounds = normalizeRegion(region)
  if (!bounds || !Array.isArray(points) || points.length < 2) return []
  const output = []
  const append = point => {
    const last = output[output.length - 1]
    if (!last || Math.hypot(last[0] - point[0], last[1] - point[1]) > 1e-8) output.push(point)
  }
  for (let index = 1; index < points.length; index++) {
    const clipped = clipSegment(points[index - 1], points[index], bounds)
    if (!clipped) continue
    if (!output.length || Math.hypot(output[output.length - 1][0] - clipped[0][0], output[output.length - 1][1] - clipped[0][1]) > 1e-8) {
      append(clipped[0])
    }
    append(clipped[1])
  }
  return output.length >= 2 ? output : []
}

export function filterParsedRegion(parsed, region) {
  const bounds = normalizeRegion(region)
  if (!bounds) return parsed
  const paths = []
  for (const path of parsed.paths || []) {
    const clipped = clipPolylineToRegion(path.pts, bounds)
    if (clipped.length < 2) continue
    paths.push({
      ...path,
      pts: clipped,
      closed: false,
      source_point_count: path.pts.length,
      region_clipped: true,
    })
  }
  return {
    ...parsed,
    paths,
    texts: (parsed.texts || []).filter(text => pointInRegion(text, bounds)),
  }
}
