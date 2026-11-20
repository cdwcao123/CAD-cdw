/** 成图流程：DXF → 路径 → 巷道中线 → 语义 → 客户记录。 */
import { parseDxf } from './parse.js'
import { dedupeLanes, offsetPolyline, pathLength, selectClusters } from './geometry.js'
import { applyTransform, georeference, looksLikeSurvey } from './geo.js'
import { buildRecord, labelLanes } from './semantic.js'
import { learnConventions, nearestLevel } from './learning.js'
import { evaluateQuality } from './quality.js'
import { rankLayers } from './layers.js'
import { extractSurveyNodes } from './nodes.js'
import { buildLanesFromNodes } from './nodegraph.js'

const LANE_LAYER = /巷道|井巷|大巷|顺槽|石门|联络|中心线|煤巷|开拓|回采|掘进|上山|下山|车场|绕道|切眼/i
const NOISE_LAYER = /等高线|断层|钻孔|露头|煤柱|标注|文字|图框|填充|设备|水沟|风门|密闭|剖面|经纬|网格|坐标|图例|色块|岩性|支护|通风|管线|电缆|监测|排水|采区$|盘区$/i

export function detectLaneLayers(layers) {
  const picked = layers
    .filter(l => LANE_LAYER.test(l.name) && !NOISE_LAYER.test(l.name) && l.count > 0)
    .sort((a, b) => b.count - a.count)
    .map(l => l.name)
  return picked.slice(0, 12)
}

function median(list) {
  if (!list.length) return 0
  const sorted = list.slice().sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

function boundsOf(lanes) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const lane of lanes)
    for (const [x, y] of lane.pts) {
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
  return { minX, minY, maxX, maxY }
}

/** 图框、采区边界等贴合整幅外包矩形的长直线不是巷道，剔除。 */
function dropFrameLanes(lanes) {
  if (lanes.length < 3) return { lanes, dropped: 0 }
  const b = boundsOf(lanes)
  const tol = Math.max(2, Math.min(b.maxX - b.minX, b.maxY - b.minY) * 0.01)
  const onFrame = p =>
    Math.abs(p[0] - b.minX) <= tol ||
    Math.abs(p[0] - b.maxX) <= tol ||
    Math.abs(p[1] - b.minY) <= tol ||
    Math.abs(p[1] - b.maxY) <= tol
  const kept = lanes.filter(lane => {
    const ratio = lane.pts.filter(onFrame).length / lane.pts.length
    return !(ratio > 0.85 && lane.length > (b.maxX - b.minX) * 0.35)
  })
  return { lanes: kept, dropped: lanes.length - kept.length }
}

/**
 * 剔除“图例/符号区”：小范围内聚集很多短巷道，几乎都是图例、设备符号或交叉口碎线。
 * 用 60 m 网格滑窗统计，超阈值整片丢弃。
 */
function dropSymbolClusters(lanes) {
  if (lanes.length < 12) return { lanes, dropped: 0 }
  const CELL = 60
  const tiny = new Map()
  for (const lane of lanes) {
    if (lane.length > 25) continue
    const p = lane.pts[Math.floor(lane.pts.length / 2)]
    const key = `${Math.floor(p[0] / CELL)}:${Math.floor(p[1] / CELL)}`
    if (!tiny.has(key)) tiny.set(key, [])
    tiny.get(key).push(lane)
  }
  const drop = new Set()
  for (const [key, list] of tiny) {
    if (list.length < 6) continue
    for (const lane of list) drop.add(lane)
  }
  if (!drop.size) return { lanes, dropped: 0 }
  return { lanes: lanes.filter(l => !drop.has(l)), dropped: drop.size }
}

/** 图纸单位可能是毫米；按估计宽度把结果折算到米。 */
function detectScale(lanes) {
  const widths = lanes.map(l => l.width).filter(w => w > 0.3 && w < 100000)
  const m = median(widths)
  if (m > 200) return 0.001
  if (m > 20) return 0.01
  return 1
}

export function processDxf(bytes, options = {}) {
  const started = Date.now()
  const warnings = []
  const parsed = parseDxf(bytes)
  const laneLayers = options.layers && options.layers.length ? options.layers : detectLaneLayers(parsed.layers)
  const wanted = new Set(laneLayers)
  let paths = laneLayers.length ? parsed.paths.filter(p => wanted.has(p.layer)) : parsed.paths
  if (!laneLayers.length) warnings.push('未按名称找到巷道图层，使用全部图层估计坐标；候选建图仍需人工核验。')
  if (!paths.length) throw new Error('所选图层没有可用线划，请检查图层选择。')

  // 坐标配准：图纸可能是缩放/旋转后的复制图，按 X/Y 坐标注记归一。
  let texts = parsed.texts
  let geoTransform = null
  if (options.useGeoReference !== false && !looksLikeSurvey(paths)) {
    const geo = georeference(paths, parsed.texts, warnings)
    if (geo.applied && geo.transform) {
      geoTransform = geo.transform
      paths = paths.map(p => ({ ...p, pts: applyTransform(p.pts, geoTransform) }))
      texts = texts.map(t => {
        const [x, y] = applyTransform([[t.x, t.y]], geoTransform)[0]
        return { ...t, x, y }
      })
    }
  }
  const manualScale = Number(options.geoScale) > 0 ? Number(options.geoScale) : 1
  const manualX = Number(options.geoOffsetX) || 0
  const manualY = Number(options.geoOffsetY) || 0
  if (manualScale !== 1 || manualX !== 0 || manualY !== 0) {
    const manual = { a: manualScale, b: 0, tx: manualX, ty: manualY }
    geoTransform = geoTransform ? { a: manualScale * geoTransform.a, b: manualScale * geoTransform.b, tx: manualScale * geoTransform.tx + manualX, ty: manualScale * geoTransform.ty + manualY } : manual
    paths = paths.map(p => ({ ...p, pts: applyTransform(p.pts, manual) }))
    texts = texts.map(t => {
      const [x, y] = applyTransform([[t.x, t.y]], manual)[0]
      return { ...t, x, y }
    })
    warnings.push(`已按手工配准参数变换坐标：缩放 ${manualScale}，平移 (${manualX}, ${manualY})。`)
  }
  if (!looksLikeSurvey(paths))
    warnings.push('图纸坐标不在矿区测量坐标系量级（百万级），如需导入客户系统请填写“坐标缩放/平移”配准参数，或改用已配准的底图。')

  // 图层体检：给出“按几何像不像巷道”的排名，供用户一键换层（不改默认行为，避免误伤）
  let layerRanking = []
  try {
    layerRanking = rankLayers(parsed.paths, { sampleSize: 1200 }).slice(0, 8)
  } catch {
    layerRanking = []
  }

  const cluster = options.multiArea ? selectClusters(paths) : selectClusters(paths, { minRatio: 1.01 })
  if (cluster.total > 1)
    warnings.push(`坐标区分析发现 ${cluster.total} 个坐标区；该统计仅供参考，候选建图并未按坐标区剔除线划，请检查重复区域。`)

  // 全部几何和文字必须使用同一坐标变换，再建立候选节点图。
  const graphPaths = geoTransform
    ? parsed.paths.map(p => ({
        ...p,
        pts: applyTransform(p.pts, geoTransform),
        circle: p.circle ? (() => {
          const [x, y] = applyTransform([[p.circle.x, p.circle.y]], geoTransform)[0]
          return { x, y, r: p.circle.r * Math.hypot(geoTransform.a, geoTransform.b) }
        })() : null,
      }))
    : parsed.paths
  const survey = extractSurveyNodes(graphPaths, texts)
  const ambiguousElevations = survey.nodes.filter(n => n.elevationAmbiguous).length
  if (ambiguousElevations) warnings.push(`${ambiguousElevations} 个圆圈附近存在距离相近但数值不同的标高，已保留为空，需人工复核。`)
  const nodeLanes = buildLanesFromNodes(graphPaths, survey.nodes)
  if (!nodeLanes.length) throw new Error('未找到可建图的圆圈与线划候选，已停止识别；不会回退到旧算法。')
  const maxLength = Number(options.maxLength) > 0 ? Number(options.maxLength) : 3000
  const merged = nodeLanes.map(l => {
    const zs = l.zs.filter(Number.isFinite)
    return { ...l, elevation: zs.length ? median(zs) : null, elevationSource: zs.length ? 'node' : 'none', confidence: 0 }
  })
  warnings.push(`候选建图：${survey.nodes.length} 个圆圈候选，${nodeLanes.length} 条线；圆圈和附近文字并不保证是导线点及标高，请人工复核。`)
  warnings.push('建图使用候选图层的全部坐标区；交叉口、稀疏弯道、环线和近邻平行线尚需人工复核，手动巷道图层选择不限制建图范围。')
  const scale = geoTransform ? 1 : detectScale(merged)
  if (scale !== 1) warnings.push(`图纸单位疑似为${scale === 0.001 ? '毫米' : '厘米'}，已按 1:${Math.round(1 / scale)} 折算为米。`)

  const scaled = merged.map(l => ({
    ...l,
    pts: l.pts.map(p => [p[0] * scale, p[1] * scale]),
    width: Math.max(0.5, Math.min(20, l.width * scale)),
    length: l.length * scale,
  }))

  const minLength = Number(options.minLength) > 0 ? Number(options.minLength) : 20
  const frameFiltered = dropFrameLanes(scaled.filter(l => l.length >= minLength && l.length <= maxLength * 5))
  if (frameFiltered.dropped > 0) warnings.push(`已忽略 ${frameFiltered.dropped} 条图框/边界长直线。`)
  const deduped = dedupeLanes(frameFiltered.lanes)
  if (deduped.length < frameFiltered.lanes.length) warnings.push(`已合并 ${frameFiltered.lanes.length - deduped.length} 条重复/重叠巷道。`)
  const symbolFiltered = dropSymbolClusters(deduped)
  if (symbolFiltered.dropped > 0) warnings.push(`已剔除 ${symbolFiltered.dropped} 条位于图例/符号密集区的短线。`)
  const deduped2 = symbolFiltered.lanes
  // 建图点已携带逐点属性，不能再次吸附而破坏坐标与标高的索引对应。
  const maxLanes = Number(options.maxLanes) > 0 ? Number(options.maxLanes) : 400
  const candidates = deduped2.sort((a, b) => b.length - a.length).slice(0, maxLanes)
  if (deduped2.length > candidates.length)
    warnings.push(`候选数量 ${deduped2.length} 超过输出上限 ${maxLanes}，已截取最长的 ${candidates.length} 条，结果不完整。`)
  const bendsToReview = candidates.filter(l => l.geometryReview).length
  if (bendsToReview) warnings.push(`${bendsToReview} 条候选存在测点稀疏、折线可能跨越弯道的情况，必须对照底图复核。`)

  if (!candidates.length)
    throw new Error(`未提取到长度不小于 ${minLength} 米的巷道，可调低最小长度或在 CAD 中检查图层。`)

  // 从图纸自身学习标注惯例（标高写法、名称用词、水平集合），再用于命名。
  const learned = learnConventions(texts)
  if (learned.vocabulary.length || learned.levels.length)
    warnings.push(
      `已从图纸学习：标高写法 ${Object.entries(learned.stats)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => `${k}×${v}`)
        .join('、') || '无'}；名称用词 ${learned.vocabulary.length} 个；水平 ${learned.levels.length} 个。`
    )
  const labelled = labelLanes(candidates, texts, { radius: options.labelRadius || 30, learned })

  const levelCounters = new Map()
  for (const lane of labelled) {
    if (lane.name) continue
    const level = nearestLevel(lane.elevation, learned)
    if (!level) continue
    const text = Number.isInteger(level.value) ? `${level.value}` : `${Math.round(level.value * 10) / 10}`
    const key = `${text}m水平`
    const seq = (levelCounters.get(key) || 0) + 1
    levelCounters.set(key, seq)
    lane.levelName = `+${text}m水平巷道-${seq}`
  }

  const height = Number(options.height) > 0 ? Number(options.height) : 3
  const records = []
  for (const lane of labelled) {
    const half = lane.width / 2
    const borderA = offsetPolyline(lane.pts, half)
    const borderB = offsetPolyline(lane.pts, -half)
    const record = buildRecord(lane, {
      meta: {
        mineName: options.mineName || '',
        mineCode: options.mineCode || '',
        height,
        pointName: options.pointName || '',
        lanewayType: options.lanewayType || '普通',
        sectionStyle: options.sectionStyle || '半圆拱',
        support: options.support || '锚杆支护',
        usage: options.usage || '开拓巷道',
        airMode: options.airMode || '进风',
      },
      borderLinePoints: [borderA, borderB],
    })
    if (/未命名巷道$/.test(record.laneway_name))
      record.laneway_name = record.laneway_name.replace(/未命名巷道$/, `未命名巷道-${records.length + 1}`)
    else if (/巷道$/.test(record.laneway_name) && records.some(r => r.laneway_name === record.laneway_name))
      record.laneway_name = `${record.laneway_name}-${records.length + 1}`
    records.push(record)
  }

  const named = records.filter(r => !/未命名巷道/.test(r.laneway_name))
  const elevs = labelled.map(l => l.elevation).filter(v => Number.isFinite(v))
  const summary = {
    paths: parsed.paths.length,
    texts: parsed.texts.length,
    chains: nodeLanes.length,
    corridors: 0,
    lanes: records.length,
    named: named.length,
    withElevation: elevs.length,
    totalLength: Math.round(records.reduce((s, r) => s + pathLength(r.traverse_point_array.map(p => [p.x, p.y])), 0)),
    medianWidth: Math.round(median(labelled.map(l => l.width)) * 100) / 100,
    elevationMin: elevs.length ? Math.min(...elevs) : null,
    elevationMax: elevs.length ? Math.max(...elevs) : null,
    layers: laneLayers,
    layerCandidates: layerRanking.map(r => ({ name: r.name, score: r.score, length: r.totalLength })),
    freeChains: 0,
    clusters: cluster.clusters,
    surveyCoordinates: looksLikeSurvey(paths),
    learnedStats: learned.stats,
    learnedWords: learned.vocabulary.length,
    learnedLevels: learned.levels.length,
    geoReferenced: !!geoTransform,
    geoScale: geoTransform ? Math.round(Math.hypot(geoTransform.a, geoTransform.b) * 1e4) / 1e4 : null,
    geoRotation: geoTransform ? Math.round((Math.atan2(geoTransform.b, geoTransform.a) * 180) / Math.PI * 1e3) / 1e3 : null,
    elapsedMs: Date.now() - started,
  }
  const unknownPoints = records.flatMap(r => r.traverse_point_array).filter(p => p.z_bottom === null).length
  if (unknownPoints) warnings.push(`${unknownPoints} 个点缺少标高，已输出 null；目标系统是否接受 null 尚未验证，禁止直接导入。`)
  warnings.push('候选图尚未经过巷道级精确率验证，宽度、顶板高度及标高语义需人工核验，禁止直接推送生产系统。')
  const bestOther = (layerRanking || []).filter(r => !laneLayers.includes(r.name)).sort((a, b) => b.totalLength - a.totalLength)[0]
  if (bestOther && summary.totalLength < bestOther.totalLength * 0.35)
    warnings.push(
      `当前所选图层识别到的巷道总长（${Math.round(summary.totalLength / 1000)} km）明显少于图层「${bestOther.name}」（${Math.round(bestOther.totalLength / 1000)} km），可能选错图层，建议在“巷道图层”里改用该层后重跑。`
    )

  const quality = evaluateQuality({
    summary,
    lanes: records,
    warnings,
    lanesLayerPaths: paths.length,
    clusters: cluster.clusters,
  })
  summary.quality = quality
  if (quality.grade === 'D')
    warnings.push(`结果质量评级 D（${quality.score} 分），建议不要直接导入客户系统，请按提示调整图层/参数后重跑。`)
  else if (quality.grade === 'C') warnings.push(`结果质量评级 C（${quality.score} 分），导入前请抽查前 20 条巷道。`)

  if (named.length < records.length)
    warnings.push(`${records.length - named.length} 条巷道未匹配到名称，已按“未命名巷道”输出，请人工补录。`)

  return { records, summary, warnings, labels: labelled, parsed, learned }
}
