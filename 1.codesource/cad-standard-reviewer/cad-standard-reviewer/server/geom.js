// 几何工具：线段、包围盒、点在多边形内、文本估算、聚类与统计。

export const EPS = 1e-6

export function rect(x0, y0, x1, y1) {
  return { x0: Math.min(x0, x1), y0: Math.min(y0, y1), x1: Math.max(x0, x1), y1: Math.max(y0, y1) }
}

export function rectWidth(box) {
  return box ? box.x1 - box.x0 : 0
}

export function rectHeight(box) {
  return box ? box.y1 - box.y0 : 0
}

export function rectCenter(box) {
  return { x: (box.x0 + box.x1) / 2, y: (box.y0 + box.y1) / 2 }
}

export function rectContainsPoint(box, point, tolerance = 0) {
  return (
    point.x >= box.x0 - tolerance &&
    point.x <= box.x1 + tolerance &&
    point.y >= box.y0 - tolerance &&
    point.y <= box.y1 + tolerance
  )
}

export function rectContainsRect(outer, inner, tolerance = 0) {
  return (
    inner.x0 >= outer.x0 - tolerance &&
    inner.x1 <= outer.x1 + tolerance &&
    inner.y0 >= outer.y0 - tolerance &&
    inner.y1 <= outer.y1 + tolerance
  )
}

export function rectOverlapArea(a, b) {
  const width = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)
  const height = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0)
  return width > 0 && height > 0 ? width * height : 0
}

export function rectExpand(box, amount) {
  return { x0: box.x0 - amount, y0: box.y0 - amount, x1: box.x1 + amount, y1: box.y1 + amount }
}

export function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function segmentOfLine(entity) {
  return { a: { x: entity.x0, y: entity.y0 }, b: { x: entity.x1, y: entity.y1 } }
}

export function entitySegments(entity, arcSteps = 48) {
  if (!entity) return []
  switch (entity.type) {
    case 'LINE':
      return [{ a: { x: entity.x0, y: entity.y0 }, b: { x: entity.x1, y: entity.y1 } }]
    case 'LWPOLYLINE':
    case 'POLYLINE': {
      const points = entity.points || []
      const segments = []
      for (let i = 0; i < points.length - 1; i += 1) segments.push({ a: points[i], b: points[i + 1] })
      if (entity.closed && points.length > 2) segments.push({ a: points[points.length - 1], b: points[0] })
      return segments
    }
    case 'CIRCLE': {
      const segments = []
      for (let i = 0; i < arcSteps; i += 1) {
        const t0 = (i / arcSteps) * Math.PI * 2
        const t1 = ((i + 1) / arcSteps) * Math.PI * 2
        segments.push({
          a: { x: entity.cx + entity.radius * Math.cos(t0), y: entity.cy + entity.radius * Math.sin(t0) },
          b: { x: entity.cx + entity.radius * Math.cos(t1), y: entity.cy + entity.radius * Math.sin(t1) },
        })
      }
      return segments
    }
    case 'ARC': {
      const segments = []
      const start = (entity.startAngle * Math.PI) / 180
      const end = (entity.endAngle * Math.PI) / 180
      let span = end - start
      while (span <= 0) span += Math.PI * 2
      for (let i = 0; i < arcSteps; i += 1) {
        const t0 = start + (span * i) / arcSteps
        const t1 = start + (span * (i + 1)) / arcSteps
        segments.push({
          a: { x: entity.cx + entity.radius * Math.cos(t0), y: entity.cy + entity.radius * Math.sin(t0) },
          b: { x: entity.cx + entity.radius * Math.cos(t1), y: entity.cy + entity.radius * Math.sin(t1) },
        })
      }
      return segments
    }
    case 'LEADER':
    case 'HATCH':
    case 'SPLINE': {
      const points = entity.points || []
      const segments = []
      for (let i = 0; i < points.length - 1; i += 1) segments.push({ a: points[i], b: points[i + 1] })
      return segments
    }
    case 'SOLID':
    case 'TRACE': {
      const points = entity.points || []
      const segments = []
      for (let i = 0; i < points.length; i += 1) segments.push({ a: points[i], b: points[(i + 1) % points.length] })
      return segments
    }
    default:
      return []
  }
}

export function pointSegmentDistance(point, segment) {
  const { a, b } = segment
  const dx = b.x - a.x
  const dy = b.y - a.y
  const lengthSq = dx * dx + dy * dy
  if (lengthSq < EPS) return distance(point, a)
  let t = ((point.x - a.x) * dx + (point.y - a.y) * dy) / lengthSq
  t = Math.max(0, Math.min(1, t))
  return Math.hypot(point.x - (a.x + t * dx), point.y - (a.y + t * dy))
}

export function pointOnSegment(point, segment, tolerance = 0.5) {
  return pointSegmentDistance(point, segment) <= tolerance
}

export function segmentLength(segment) {
  return distance(segment.a, segment.b)
}

export function segmentAngle(segment) {
  const angle = (Math.atan2(segment.b.y - segment.a.y, segment.b.x - segment.a.x) * 180) / Math.PI
  return normalizeAngle(angle)
}

export function normalizeAngle(angle) {
  let value = angle % 180
  if (value < 0) value += 180
  return value
}

export function angleDifference(a, b) {
  const diff = Math.abs(normalizeAngle(a) - normalizeAngle(b))
  return Math.min(diff, 180 - diff)
}

export function segmentsIntersect(s1, s2, tolerance = 0.01) {
  const d1 = cross(s2.a, s2.b, s1.a)
  const d2 = cross(s2.a, s2.b, s1.b)
  const d3 = cross(s1.a, s1.b, s2.a)
  const d4 = cross(s1.a, s1.b, s2.b)
  if (((d1 > tolerance && d2 < -tolerance) || (d1 < -tolerance && d2 > tolerance)) &&
      ((d3 > tolerance && d4 < -tolerance) || (d3 < -tolerance && d4 > tolerance))) {
    return true
  }
  if (Math.abs(d1) <= tolerance && pointSegmentDistance(s1.a, s2) <= tolerance) return true
  if (Math.abs(d2) <= tolerance && pointSegmentDistance(s1.b, s2) <= tolerance) return true
  if (Math.abs(d3) <= tolerance && pointSegmentDistance(s2.a, s1) <= tolerance) return true
  if (Math.abs(d4) <= tolerance && pointSegmentDistance(s2.b, s1) <= tolerance) return true
  return false
}

function cross(a, b, p) {
  return (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x)
}

export function pointInPolygon(point, points) {
  let inside = false
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const xi = points[i].x
    const yi = points[i].y
    const xj = points[j].x
    const yj = points[j].y
    if (yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi || EPS) + xi) {
      inside = !inside
    }
  }
  return inside
}

// 估算文字包围盒（按旋转角度返回四角与轴对齐盒）
export function textBox(text, x, y, height, rotation = 0, hAlign = 0, vAlign = 0) {
  const content = String(text ?? '')
  const width = textWidth(content, height)
  let anchorX = x
  if (hAlign === 1 || hAlign === 4) anchorX = x - width / 2
  else if (hAlign === 2) anchorX = x - width
  let bottom = y
  if (vAlign === 2) bottom = y - height / 2
  else if (vAlign === 3) bottom = y - height
  const corners = [
    { x: anchorX, y: bottom },
    { x: anchorX + width, y: bottom },
    { x: anchorX + width, y: bottom + height },
    { x: anchorX, y: bottom + height },
  ]
  if (rotation) {
    const rad = (rotation * Math.PI) / 180
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)
    for (const corner of corners) {
      const dx = corner.x - x
      const dy = corner.y - y
      corner.x = x + dx * cos - dy * sin
      corner.y = y + dx * sin + dy * cos
    }
  }
  const xs = corners.map(point => point.x)
  const ys = corners.map(point => point.y)
  return {
    x0: Math.min(...xs),
    y0: Math.min(...ys),
    x1: Math.max(...xs),
    y1: Math.max(...ys),
    corners,
    width,
    height,
    center: { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2 },
  }
}

export function textWidth(text, height) {
  let units = 0
  for (const char of String(text ?? '')) {
    const code = char.codePointAt(0)
    if (code > 0x2e80) units += 1
    else if (/[A-Za-z0-9]/.test(char)) units += 0.62
    else if (char === ' ') units += 0.35
    else units += 0.4
  }
  return units * height
}

export function isHorizontal(angle, tolerance = 3) {
  const normalized = normalizeAngle(angle)
  return normalized <= tolerance || normalized >= 180 - tolerance
}

export function isVertical(angle, tolerance = 3) {
  return Math.abs(normalizeAngle(angle) - 90) <= tolerance
}

export function clusterValues(values, tolerance = 0.6) {
  const sorted = [...values].sort((a, b) => a - b)
  const clusters = []
  for (const value of sorted) {
    const last = clusters[clusters.length - 1]
    if (last && Math.abs(value - last.center) <= tolerance) {
      last.values.push(value)
      last.center = last.values.reduce((sum, item) => sum + item, 0) / last.values.length
    } else {
      clusters.push({ center: value, values: [value] })
    }
  }
  return clusters
}

export function mode(values) {
  if (!values.length) return null
  const counts = new Map()
  for (const value of values) {
    const key = Math.round(value * 1000) / 1000
    counts.set(key, (counts.get(key) || 0) + 1)
  }
  let best = null
  let bestCount = -1
  for (const [value, count] of counts) {
    if (count > bestCount || (count === bestCount && value > best)) {
      best = value
      bestCount = count
    }
  }
  return best
}

export function median(values) {
  if (!values.length) return null
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}

export function formatMm(value) {
  if (!Number.isFinite(value)) return '—'
  const rounded = Math.round(value * 100) / 100
  return `${rounded} mm`
}

export function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) return '—'
  const factor = 10 ** digits
  return String(Math.round(value * factor) / factor)
}

// 判断矩形是否为四条线/一条闭合多段线，返回 {box, entity}
export function asRect(entity, tolerance = 0.5) {
  if (!entity) return null
  if (entity.type === 'LWPOLYLINE' || entity.type === 'POLYLINE') {
    if (!entity.closed || !entity.points || entity.points.length < 4) return null
    const xs = [...new Set(entity.points.map(point => Math.round(point.x / tolerance) * tolerance))]
    const ys = [...new Set(entity.points.map(point => Math.round(point.y / tolerance) * tolerance))]
    if (xs.length === 2 && ys.length === 2) {
      return { box: rect(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)), entity }
    }
  }
  return null
}
