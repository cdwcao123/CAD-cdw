import { readFileSync } from 'node:fs'
import { performance } from 'node:perf_hooks'
import { parseDxf } from '../core/parse.js'
import { collectLaneCandidates } from '../core/lanes.js'

const start = performance.now()
const dxfPath = process.argv[2] || 'E:/kuangshan/tools/银二井-规则复核-20261117.dxf'
const truthPath = process.argv[3] || 'E:/kuangshan/银星图纸/银星图纸/导出巷道数据.json'
const truth = JSON.parse(new TextDecoder('gb18030').decode(readFileSync(truthPath)))
const key = p => JSON.stringify([p.x, p.y])
const edgeKey = (a, b) => JSON.stringify(a < b ? [a, b] : [b, a])
const edges = records => {
  const result = new Set()
  for (const r of records) {
    const pts = r.traverse_point_array || []
    for (let i = 1; i < pts.length; i++) {
      const a = key(pts[i - 1]), b = key(pts[i])
      if (a !== b) result.add(edgeKey(a, b))
    }
  }
  return result
}
const pointMap = new Map()
for (const r of truth) for (const p of r.traverse_point_array || []) {
  if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) throw new Error('Invalid truth coordinates')
  if (!pointMap.has(key(p))) pointMap.set(key(p), { x: p.x, y: p.y, point_name: p.point_name || '' })
}
const points = [...pointMap.values()]
const parsed = parseDxf(readFileSync(dxfPath))
const parseMs = performance.now() - start
const collectStart = performance.now()
const result = collectLaneCandidates(parsed.paths, points)
const collectMs = performance.now() - collectStart
const truthEdges = edges(truth), candidateEdges = edges(result.records)
const hits = [...candidateEdges].filter(e => truthEdges.has(e)).length
const bounds = ps => ps.reduce((b, p) => [Math.min(b[0], p[0]), Math.min(b[1], p[1]), Math.max(b[2], p[0]), Math.max(b[3], p[1])], [Infinity, Infinity, -Infinity, -Infinity])
const truthBounds = bounds(points.map(p => [p.x, p.y]))
const pathBounds = bounds(parsed.paths.flatMap(p => p.pts || []))
const candidatePoints = new Set(result.records.flatMap(r => r.traverse_point_array.map(key)))
const cell = (x, y) => `${Math.floor(x / 3)},${Math.floor(y / 3)}`
const grid = new Map()
for (const path of parsed.paths) for (const [x, y] of path.pts || []) {
  const k = cell(x, y)
  if (!grid.has(k)) grid.set(k, [])
  grid.get(k).push([x, y])
}
let pointsNearVertex = 0
for (const p of points) {
  const cx = Math.floor(p.x / 3), cy = Math.floor(p.y / 3)
  let found = false
  for (let dx = -1; dx <= 1 && !found; dx++) for (let dy = -1; dy <= 1 && !found; dy++) {
    found = (grid.get(`${cx + dx},${cy + dy}`) || []).some(([x, y]) => Math.hypot(x - p.x, y - p.y) <= 3)
  }
  if (found) pointsNearVertex++
}
console.log(JSON.stringify({ coordinateCheck: { truthPointsWithin3OfDxfVertex: pointsNearVertex, totalTruthPoints: points.length, note: 'vertex proximity only; not a registration proof' } }))
console.log(JSON.stringify({ input: { dxfPath, truthPath, records: truth.length, pointOccurrences: truth.reduce((n, r) => n + (r.traverse_point_array || []).length, 0), uniquePoints: points.length, paths: parsed.paths.length, truthBounds, pathBounds }, options: { snapDist: 4, minLen: 10, minNodes: 2, chainTol: 1.5 }, output: { records: result.records.length, pointOccurrences: result.records.reduce((n, r) => n + r.traverse_point_array.length, 0), uniquePoints: candidatePoints.size, skipped: result.skipped }, edges: { truth: truthEdges.size, candidate: candidateEdges.size, hits, recall: truthEdges.size ? hits / truthEdges.size : null, precision: candidateEdges.size ? hits / candidateEdges.size : null, method: 'exact XY, undirected, unique edges' }, timingMs: { parseAndLoad: parseMs, collect: collectMs, total: performance.now() - start }, warnings: ['Truth points are input; results do not measure automatic point collection.', 'Bounding-box overlap does not prove coordinate registration; exact edge precision is relative to incomplete truth, not verified false positives.'] }, null, 2))
