/**
 * 结果质量评估：给每次识别打一个 0-100 分并列出问题，
 * 用来回答"换一张图会不会出错"——分数低时前端会阻止自动下载并提示人工复核。
 */

const clamp01 = v => Math.max(0, Math.min(1, v))

export function evaluateQuality({ summary, lanes, warnings, parsedPaths = 0, lanesLayerPaths = 0, clusters = 1 }) {
  const issues = []
  const laneCount = lanes.length
  const nameRate = laneCount ? summary.named / laneCount : 0
  const elevRate = laneCount ? summary.withElevation / laneCount : 0
  const coverage = lanesLayerPaths ? clamp01(summary.lanes / Math.max(1, Math.min(lanesLayerPaths / 25, laneCount))) : 0
  const pairRate = (summary.corridors || 0) / Math.max(1, (summary.corridors || 0) + (summary.freeChains || 0))
  const geoOk = summary.geoReferenced || summary.surveyCoordinates ? 1 : 0
  const width = summary.medianWidth || 0
  const widthOk = width >= 1.8 && width <= 8 ? 1 : 0

  let score = 0
  score += 30 * clamp01(nameRate)
  score += 20 * clamp01(elevRate)
  score += 20 * clamp01(pairRate)
  score += 15 * clamp01(coverage)
  score += 10 * geoOk
  score += 5 * widthOk
  score = Math.round(Math.max(0, Math.min(100, score)))

  const grade = score >= 80 ? 'A' : score >= 65 ? 'B' : score >= 50 ? 'C' : 'D'

  if (laneCount < 3) issues.push('识别到的巷道少于 3 条，图纸可能不是采掘工程平面图，或巷道图层未被选中。')
  if (nameRate < 0.35) issues.push(`仅 ${Math.round(nameRate * 100)}% 的巷道匹配到名称，建议调大“标注搜索半径”或在上传后人工补名。`)
  if (elevRate < 0.3) issues.push(`仅 ${Math.round(elevRate * 100)}% 的巷道有标高，导出的顶底板标高可能不准，请复核。`)
  issues.push('当前结果为实验性节点候选，评分不是经过真值验证的识别准确率；宽度需人工核验。')
  if (!geoOk) issues.push('图纸坐标不在矿区测量坐标系，导入客户系统前需要填写“坐标缩放/平移”。')
  if (!widthOk) issues.push(`典型巷道宽度 ${width} 米超出常见范围（1.8–8 米），请检查单位或图层。`)
  if (clusters > 1) issues.push(`图纸含 ${clusters} 个成规模的坐标区，已一并成图；如其中有局部放大图，请关闭对应簇后再跑。`)
  if (summary.totalLength > 2000000) issues.push(`总长度 ${Math.round(summary.totalLength / 1000)} km 明显偏大，可能把边界线/图框识别成了巷道。`)
  for (const w of warnings || []) if (/50%|偏低|未匹配|忽略/.test(w) && issues.length < 8) issues.push(w)

  return {
    score,
    grade,
    metrics: {
      laneCount,
      nameRate: Math.round(nameRate * 100) / 100,
      elevRate: Math.round(elevRate * 100) / 100,
      pairRate: Math.round(pairRate * 100) / 100,
      coverage: Math.round(coverage * 100) / 100,
      medianWidth: width,
      clusters,
    },
    issues: issues.slice(0, 8),
    blocked: grade === 'D' || laneCount < 3,
  }
}
