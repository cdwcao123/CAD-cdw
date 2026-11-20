import createModule from './runtime/libredwg-web.mjs'
import { extractSurvey, assembleSurvey } from './core/survey.js'
import { parseDxf } from './core/parse.js'
import { collectLaneCandidatesWithFallback, selectMainCoordinateArea } from './core/lanes.js'
import { prioritizeCandidates } from './core/priority.js'
import { filterParsedRegion, normalizeRegion, pointInRegion } from './core/region.js'

const KERNEL_VERSION = '5.10.0'
let wasmModule = null
let state = null

function pointBoundaryDistance(rules, summary) {
  const explicit = Number(rules.point_boundary_distance_drawing_units)
  if (Number.isFinite(explicit) && explicit > 0) return explicit
  const textHeight = Number(summary?.medianTextHeightDrawingUnits)
  const multiplier = Number(rules.point_boundary_text_height_multiplier)
  return Math.max(4, (Number.isFinite(textHeight) ? textHeight : 0) * (Number.isFinite(multiplier) && multiplier > 0 ? multiplier : 12))
}

async function dwgToDxf(bytes) {
  if (!wasmModule) {
    const wasmUrl = new URL('./runtime/libredwg-web.wasm', import.meta.url).href
    wasmModule = await createModule({ locateFile: () => wasmUrl, print: () => {}, printErr: () => {} })
  }
  const mod = wasmModule
  try {
    mod.FS.writeFile('/input.dwg', bytes)
    const decoded = mod.dwg_read_file('/input.dwg')
    if (!decoded.data) throw new Error(`DWG 解析失败（代码 ${decoded.error}）。请确认文件未加密。`)
    const entityCount = mod.dwg_get_num_entities(decoded.data)
    mod.dwg_free(decoded.data)
    const status = mod.dwg_write_dxf('/input.dwg', '/output.dxf')
    if (status !== 0 || !mod.FS.analyzePath('/output.dxf').exists) throw new Error(`DWG 转换失败（代码 ${status}）。`)
    return { dxf: mod.FS.readFile('/output.dxf'), entityCount }
  } finally {
    for (const path of ['/input.dwg', '/output.dxf']) if (mod.FS.analyzePath(path).exists) mod.FS.unlink(path)
  }
}

self.onmessage = async event => {
  const msg = event.data || {}
  try {
    if (msg.cmd === 'open') {
      state = null
      const { sessionId, name, bytes, options = {} } = msg
      self.postMessage({ type: 'progress', sessionId, step: 'parse' })
      let dxf = new Uint8Array(bytes), entityCount = null
      if (/\.dwg$/i.test(name)) {
        const converted = await dwgToDxf(dxf)
        dxf = converted.dxf
        entityCount = converted.entityCount
      } else if (!/\.dxf$/i.test(name)) throw new Error('仅支持 DWG 或 ASCII DXF 文件。')
      const result = extractSurvey(dxf, options)
      const region = normalizeRegion(options.analysisRegion)
      const parsedFull = parseDxf(dxf)
      const parsed = filterParsedRegion(parsedFull, region)
      const regionCandidates = region
        ? result.candidates.filter(candidate => {
          const circle = result.entities[candidate.circle_id]
          return circle && pointInRegion(circle, region)
        })
        : result.candidates
      const priority = prioritizeCandidates(parsed.paths, parsed.texts, regionCandidates, result.entities, options.collectionRules || {})
      result.candidates = priority.candidates
      state = {
        sessionId,
        ...result,
        paths: parsed.paths,
        heightTexts: parsed.texts,
        collectionRules: options.collectionRules || {},
        analysisRegion: region,
      }
      self.postMessage({ type: 'candidates', sessionId, kernel: KERNEL_VERSION, candidates: result.candidates, entities: result.entities, summary: { ...result.summary, entityCount, shaftHints: priority.hintCount, priorityGroups: priority.priorityGroupCount, ungroupedCandidates: priority.ungroupedCount, duplicates: priority.duplicateCount, ambiguousCircles: priority.ambiguousCircleCount, concentricCircles: priority.concentricGroups, excluded: priority.excludedCount, coordinateClusters: priority.coordinateClusters, coordinateAreaPathsDropped: priority.droppedCoordinatePaths }, warnings: result.warnings })
      return
    }
    if (msg.cmd === 'finalize') {
      if (!state || state.sessionId !== msg.sessionId) throw new Error('识别会话已失效，请重新识别。')
      const points = assembleSurvey(state, msg.decisions || [], {
        colorPriority: state.collectionRules?.boundary_color_priority || [],
      })
      const main = selectMainCoordinateArea(state.paths, points)
      const rules = state.collectionRules || {}
      const explicitBoundaryDistance = Number(rules.point_boundary_distance_drawing_units)
      const useAdaptiveFallback = !(Number.isFinite(explicitBoundaryDistance) && explicitBoundaryDistance > 0)
      const { records: lanes, review: laneReview, skipped } = collectLaneCandidatesWithFallback(main.paths, main.points, {
        heightTexts: state.heightTexts,
        snapDist: useAdaptiveFallback ? 4 : explicitBoundaryDistance,
        supplementalSnapDist: useAdaptiveFallback ? pointBoundaryDistance(rules, state.summary) : null,
        minLen: Number(rules.minimum_boundary_length_drawing_units) || 10,
        minNodes: Number(rules.minimum_point_count) || 2,
        chainTol: Number(rules.boundary_chain_tolerance_drawing_units) || 1.5,
        boundaryGapMin: Number(rules.boundary_gap_min) || 0,
        boundaryGapMax: Number(rules.boundary_gap_max) || Infinity,
        boundaryColorInclude: rules.boundary_color_include || [],
        boundaryColorExclude: rules.boundary_color_exclude || [],
        boundaryColorPriority: rules.boundary_color_priority || [],
        allowBoundaryReuse: rules.allow_boundary_reuse === true,
        requireSameColorBoundaries: true,
        requireCompletePointData: true,
      })
      skipped.coordinateAreaDropped = main.droppedPaths
      state.draft = { points, lanes, laneReview, skipped }
      self.postMessage({ type: 'lane-candidates', sessionId: msg.sessionId, skipped, lanes: lanes.map((lane, index) => ({ index,
        points: lane.traverse_point_array.map((p, i) => ({ id: `p${i}`, x: p.x, y: p.y })),
        sides: lane.border_line_points.map(side => side.map(p => [p.x, p.y])) })) })
      return
    }
    if (msg.cmd === 'approve-lanes') {
      if (!state?.draft || state.sessionId !== msg.sessionId || !Array.isArray(msg.approvals)) throw new Error('巷道审查会话已失效。')
      const { points, lanes, laneReview, skipped } = state.draft
      const accepted = [], acceptedReview = [], seen = new Set()
      for (const approval of msg.approvals) {
        const i = approval?.index, lane = lanes[i]
        if (!Number.isInteger(i) || !lane || seen.has(i) || !Array.isArray(approval.order)) throw new Error('巷道审查结果无效。')
        const n = lane.traverse_point_array.length, order = approval.order
        if (order.length !== n || (!order.every((id, j) => id === `p${j}`) && !order.every((id, j) => id === `p${n - 1 - j}`))) throw new Error('巷道点顺序无效。')
        seen.add(i)
        if (order[0] !== 'p0') lane.traverse_point_array.reverse().forEach((p, j) => { p.point_order = j; [p.left_side, p.right_side] = [p.right_side, p.left_side] })
        accepted.push(lane); acceptedReview.push(laneReview[i])
      }
      state.draft = null
      self.postMessage({ type: 'result', sessionId: msg.sessionId, kernel: KERNEL_VERSION, points, lanes: accepted, laneReview: acceptedReview, summary: { ...state.summary, points: points.length, lanes: accepted.length, skipped } })
      return
    }
    if (msg.cmd === 'reset') { state = null; return }
  } catch (error) {
    self.postMessage({ type: 'error', sessionId: msg.sessionId, error: error?.message || String(error) })
  }
}
