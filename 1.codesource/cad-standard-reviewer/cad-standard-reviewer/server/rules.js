// 规则引擎：R01 ~ R12 的确定性判定。所有结论都带规则号、位置、实测值、标准值、依据条款与修改建议。
import { RULE_SET, SEVERITY_ORDER } from './rule-catalog.js'
import { median, mode, normalizeAngle, pointInPolygon, rectCenter, rectContainsPoint, rectHeight, rectWidth } from './geom.js'

const MATERIAL_LIBRARY = {
  version: 'GB-MAT-2026.11',
  grades: new Set([
    'Q195', 'Q215', 'Q235', 'Q255', 'Q275', 'Q345', 'Q390', 'Q420', 'Q460',
    '08', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60', '65', '70',
    '15Mn', '20Mn', '25Mn', '30Mn', '35Mn', '40Mn', '45Mn', '50Mn',
    '20Cr', '30Cr', '35Cr', '40Cr', '45Cr', '50Cr', '20CrMnTi', '40CrNiMoA', '35CrMo', '42CrMo',
    '65Mn', '60Si2Mn', '50CrVA', 'T7', 'T8', 'T10', 'T12',
    'HT150', 'HT200', 'HT250', 'HT300', 'QT400-18', 'QT450-10', 'QT500-7', 'QT600-3',
    'ZL101A', 'ZL104', 'ZL105', 'ZL114A', 'ZL201', 'ZL301',
    '1Cr18Ni9', '0Cr18Ni9', '06Cr19Ni10', '12Cr18Ni9', '304', '316', '316L',
    'H62', 'H68', 'T2', 'T3', 'TU1', 'QSn6.5-0.1', 'ZCuSn10P1', 'ZCuZn38',
    '6061', '7075', '2A12', '5A06', 'TA2', 'TC4',
  ]),
  oldStyle: [
    { pattern: /#\s*$/u, message: '含「#」后缀（如 45#）属于旧习惯写法' },
    { pattern: /^[A-Z]\d{3}\s*-\s*[A-Z]$/u, message: '老牌号写法（如 Q235-A）应改为 Q235A' },
    { pattern: /^[A-Z]\d{3}\s*-\s*[A-Z]\s*$/u, message: '老牌号写法（如 Q235-A）应改为 Q235A' },
  ],
}

const RULE_HANDLERS = {
  frameMargin: ruleR01,
  titleBlockFields: ruleR02,
  scaleConsistency: ruleR03,
  bomBalloonConsistency: ruleR04,
  lineStyle: ruleR05,
  textHeight: ruleR06,
  dimensionElements: ruleR07,
  dimensionDirection: ruleR08,
  fitCode: ruleR09,
  featureControlFrame: ruleR10,
  surfaceFinish: ruleR11,
  materialGrade: ruleR12,
}

export function analyzeDrawing(model, options = {}) {
  const ruleSet = options.ruleSet || RULE_SET
  const allRules = (ruleSet.rules || []).filter(rule => rule.enabled !== false)
  const enabled = new Set(options.enabledRules || allRules.map(rule => rule.id))
  const thresholds = { ...(ruleSet.thresholds || RULE_SET.thresholds), ...(options.thresholds || {}) }
  const findings = []
  const libraries = options.libraries || {}
  const context = {
    model,
    thresholds,
    options,
    findings,
    ruleSet,
    libraries,
    materialIndex: buildMaterialIndex(libraries.material),
    toleranceIndex: buildToleranceIndex(libraries.tolerance),
  }

  for (const rule of allRules) {
    if (!enabled.has(rule.id)) continue
    const handler = RULE_HANDLERS[rule.checkType] || RULE_HANDLERS[rule.id]
    if (!handler) continue
    try {
      handler(context, rule)
    } catch (error) {
      findings.push(
        makeFinding(context, rule, null, {
          title: `${rule.id} 规则执行失败`,
          detail: `规则内部异常：${error instanceof Error ? error.message : String(error)}`,
          location: { x: 0, y: 0, label: '—' },
          measured: '—',
          expected: '—',
          suggestion: '请将图纸与插件日志反馈给维护人员。',
          confidence: 0.1,
          internalError: true,
        })
      )
    }
  }

  const sorted = dedupeFindings(findings).sort((a, b) => {
    const severity = (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9)
    if (severity !== 0) return severity
    return a.ruleId.localeCompare(b.ruleId)
  })
  const stats = summarizeFindings(sorted, model, ruleSet)
  return {
    ruleSet: { id: ruleSet.id, version: ruleSet.version, name: ruleSet.name, sourceType: ruleSet.sourceType || 'builtin', sources: ruleSet.sources || [] },
    thresholds,
    findings: sorted,
    stats,
    verdict: decideVerdict(sorted, stats),
    checkedRules: allRules.filter(rule => enabled.has(rule.id)).map(rule => rule.id),
    skippedRules: allRules.filter(rule => !enabled.has(rule.id)).map(rule => rule.id),
  }
}

function makeFinding(context, ruleOrId, checkpoint, input) {
  const rule =
    typeof ruleOrId === 'string'
      ? (context.ruleSet.rules || []).find(item => item.id === ruleOrId)
      : ruleOrId
  const ruleId = rule?.id || String(ruleOrId || '')
  const checkpointDef = (rule?.checkpoints || []).find(item => item.id === checkpoint)
  const severity = input.severity || checkpointDef?.severity || rule?.severity || '一般'
  const ruleClass = rule?.ruleClass || 'A'
  const conclusion = ruleClass === 'A' ? '不符合' : '不符合'
  return {
    id: `${ruleId}-${checkpoint || 'X'}-${Math.round((input.location?.x || 0) * 10)}-${Math.round((input.location?.y || 0) * 10)}-${context.findings.length + 1}`,
    ruleId,
    ruleName: rule?.name || '',
    checkpoint: checkpoint || null,
    checkpointDefect: checkpointDef?.defect || null,
    ruleClass,
    severity,
    conclusion: input.internalError ? '待确认' : input.conclusion || (ruleClass === 'B' ? '疑似不符合' : conclusion),
    title: input.title,
    detail: input.detail || '',
    location: input.location || { x: 0, y: 0, label: '—' },
    measured: input.measured ?? '—',
    expected: input.expected ?? '—',
    basis: input.basis || rule?.standard || '',
    clause: input.clause || '',
    suggestion: input.suggestion || '',
    confidence: input.confidence ?? 0.9,
    source: 'engine',
    libraryVersion: input.libraryVersion || null,
    libraryName: input.libraryName || null,
    evidence: input.evidence || null,
    ruleSource: rule?.sourceFileName || null,
  }
}

function severityOf(rule, checkpoint) {
  const def = (rule?.checkpoints || []).find(item => item.id === checkpoint)
  return def?.severity || rule?.severity || '一般'
}

function checkpointId(rule, index, fallback) {
  return rule?.checkpoints?.[index]?.id || fallback
}

function normalizeMaterialCode(value) {
  return String(value || '').replace(/\s+/g, '').toUpperCase()
}

function buildMaterialIndex(library) {
  const index = new Map()
  if (!library || !Array.isArray(library.grades)) return index
  for (const grade of library.grades) {
    const keys = [
      [grade.code, false],
      ...[...(grade.aliases || [])].map(alias => [alias, false]),
      ...[...(grade.legacyAliases || [])].map(alias => [alias, true]),
    ]
    for (const [key, legacy] of keys) {
      const normalized = normalizeMaterialCode(key)
      if (!normalized) continue
      const existing = index.get(normalized)
      if (existing && existing.status === 'current') continue
      index.set(normalized, { ...grade, matchedLegacy: legacy })
    }
  }
  return index
}

function buildToleranceIndex(library) {
  const fits = new Map()
  const letters = new Set()
  const grades = new Set()
  if (!library) return { fits, letters, grades, library: null }
  for (const fit of library.fits || []) {
    const designation = String(fit.designation || `${fit.hole || ''}/${fit.shaft || ''}`)
      .replace(/\s+/g, '')
      .replace(/[-—–]/g, '/')
    if (designation.includes('/')) fits.set(designation, fit)
    if (fit.hole) letters.add(String(fit.hole).replace(/\d+/g, ''))
    if (fit.shaft) letters.add(String(fit.shaft).replace(/\d+/g, ''))
  }
  for (const letter of library.letters || []) letters.add(String(letter))
  for (const grade of library.grades || []) grades.add(Number(grade))
  return { fits, letters, grades, library }
}

// ── R01 图框边距 ──
function ruleR01(context, rule) {
  const p = rule?.params || {}
  const { model, thresholds } = context
  const { sheet, frame } = model
  if (!frame?.found || !frame.margins) return
  const margins = frame.margins
  const topRightBottom = [margins.top, margins.right, margins.bottom]
  const average = median(topRightBottom) || 0
  const binding = average <= 7.5
  const base = String(sheet.formatBase || '')
  const bindingOthers = p.bindingOthers ?? 5
  const a0a1Others = p.a0a1BindingOthers ?? 10
  const noBinding = p.noBinding ?? 10
  const others = binding ? (base === 'A0' || base === 'A1' ? a0a1Others : bindingOthers) : noBinding
  const expected = { left: binding ? (p.bindingLeft ?? 25) : noBinding, right: others, top: others, bottom: others }
  const frameTolerance = p.toleranceMm ?? thresholds.frameToleranceMm
  const sides = [
    ['left', '左侧（装订边）'],
    ['right', '右侧'],
    ['top', '上侧'],
    ['bottom', '下侧'],
  ]
  for (const [key, label] of sides) {
    const actual = margins[key]
    if (!Number.isFinite(actual)) continue
    if (Math.abs(actual - expected[key]) <= frameTolerance) continue
    context.findings.push(
      makeFinding(context, rule, key === 'left' ? checkpointId(rule, 0, 'D01') : null, {
        title: `图框${label}边距 ${formatMm(actual)}，应为 ${expected[key]} mm`,
        detail: binding
          ? `检测到装订边版式（${sheet.format} 留装订边），左侧应为 25 mm，其余三边应为 ${others} mm。`
          : `检测到不留装订边版式，四边应统一为 10 mm。`,
        location: { x: frame.box.x0, y: (frame.box.y0 + frame.box.y1) / 2, label: `图框${label}` },
        measured: `${formatMm(actual)}（偏差 ${formatMm(actual - expected[key])}）`,
        expected: `${expected[key]} mm`,
        basis: rule.standard,
        clause: '图框格式与尺寸（a、c、e 尺寸系列）',
        suggestion:
          key === 'left'
            ? `将图框左边线移动到距纸边 ${expected[key]} mm 处，其余三边保持 ${others} mm。`
            : `将图框${label.replace('（装订边）', '')}边线调整到距纸边 ${expected[key]} mm。`,
        confidence: 0.98,
      })
    )
  }
}

// ── R02 标题栏字段 ──
function ruleR02(context, rule) {
  const p = rule?.params || {}
  const { model } = context
  const block = model.titleBlock
  if (!block) {
    context.findings.push(
      makeFinding(context, rule, null, {
        title: '未识别到标题栏',
        detail: '图框中未找到包含签署栏的标题栏区域，无法核验字段完整性。',
        location: { x: model.frame?.box.x1 || 0, y: model.frame?.box.y0 || 0, label: '图框右下角' },
        measured: '未识别',
        expected: '位于图框右下角的标题栏',
        basis: rule.standard,
        clause: '标题栏及其填写内容',
        suggestion: '确认标题栏是否使用标准图框，或按 GB/T 10609.1 补齐标题栏。',
        confidence: 0.7,
        severity: '严重',
      })
    )
    return
  }
  const fields = block.fields
  const missing = []
  if (!fields.name?.text?.trim()) missing.push({ key: 'name', label: '图样名称', severity: '严重' })
  if (!fields.code?.text?.trim()) missing.push({ key: 'code', label: '图样代号', severity: '严重' })
  if (!fields.material?.text?.trim()) missing.push({ key: 'material', label: '材料', severity: '严重' })
  if (!fields.scale) missing.push({ key: 'scale', label: '比例', severity: '严重' })

  for (const item of missing) {
    context.findings.push(
      makeFinding(context, rule, null, {
        title: `标题栏缺少「${item.label}」`,
        detail: `标题栏中未找到 ${item.label} 字段或字段为空。`,
        location: { x: block.box.x0, y: block.box.y1 - 8, label: '标题栏' },
        measured: '缺失',
        expected: `${item.label}（非空）`,
        basis: rule.standard,
        clause: '标题栏字段组成',
        suggestion: `在标题栏中补充${item.label}并填写完整。`,
        confidence: 0.9,
        severity: item.severity,
      })
    )
  }

  if (!fields.version?.value?.trim()) {
    context.findings.push(
      makeFinding(context, rule, checkpointId(rule, 0, 'D02'), {
        title: '标题栏缺版次栏或版次为空',
        detail: '标题栏中未找到「版次」字段，或版次栏没有填写内容。',
        location: { x: block.box.x0 + rectWidth(block.box) * 0.55, y: block.box.y0 + 3, label: '标题栏下方' },
        measured: '缺失',
        expected: '版次（如 A）',
        basis: rule.standard,
        clause: '标题栏字段组成——版次',
        suggestion: '在标题栏中增加版次栏并填写当前版次，如「版次 A」。',
        confidence: 0.9,
        severity: '严重',
      })
    )
  }

  if (!fields.sheetCount) {
    context.findings.push(
      makeFinding(context, rule, checkpointId(rule, 1, 'D03'), {
        title: '标题栏缺「共 X 张 第 X 张」',
        detail: '标题栏中未找到张次标注，无法判断图纸总张数与当前张次。',
        location: { x: block.box.x1 - 20, y: block.box.y0 + 3, label: '标题栏右下角' },
        measured: '缺失',
        expected: '共 X 张  第 X 张',
        basis: rule.standard,
        clause: '标题栏字段组成——张次',
        suggestion: '在标题栏右下角补充「共 X 张  第 X 张」并填写实际张数。',
        confidence: 0.9,
        severity: '一般',
      })
    )
  }

  if (fields.stage?.value === null || fields.stage?.value === undefined) {
    context.findings.push(
      makeFinding(context, rule, checkpointId(rule, 3, 'D05'), {
        title: '阶段标记栏空白',
        detail: fields.stage?.labelMissing
          ? '标题栏中未找到「阶段标记」栏。'
          : '「阶段标记」栏存在，但没有填写阶段标记值。',
        location: fields.stage?.labelRef
          ? { x: fields.stage.labelRef.x, y: fields.stage.labelRef.y, label: '标题栏阶段标记栏' }
          : { x: block.box.x0 + 4, y: block.box.y0 + 10, label: '标题栏' },
        measured: '空白',
        expected: '阶段标记（如 S、A、B）',
        basis: rule.standard,
        clause: '标题栏字段组成——阶段标记',
        suggestion: '按产品研制阶段填写阶段标记，如样机试制阶段填「S」。',
        confidence: 0.88,
        severity: '严重',
      })
    )
  }

  for (const [label, info] of Object.entries(fields.signatures || {})) {
    if (!info.present) {
      context.findings.push(
        makeFinding(context, rule, label === '标准化' ? checkpointId(rule, 2, 'D04') : null, {
          title: `标题栏缺少「${label}」签署栏`,
          detail: `未找到 ${label} 签署栏，签署责任无法追溯。`,
          location: { x: block.box.x0 + 4, y: block.box.y0 + 20, label: '标题栏签署区' },
          measured: '缺失',
          expected: `${label}签署栏`,
          basis: rule.standard,
          clause: '签署栏组成',
          suggestion: `按标准标题栏补充${label}签署栏。`,
          confidence: 0.85,
          severity: '严重',
        })
      )
      continue
    }
    if (!info.value?.text?.trim()) {
      context.findings.push(
        makeFinding(context, rule, label === '标准化' ? checkpointId(rule, 2, 'D04') : null, {
          title: `${label}签署栏空白`,
          detail: `「${label}」栏存在，但没有签署人或日期。`,
          location: info.labelRef
            ? { x: info.labelRef.x, y: info.labelRef.y, label: `标题栏${label}栏` }
            : { x: block.box.x0, y: block.box.y0, label: '标题栏' },
          measured: '空白',
          expected: `${label}签署人（及日期）`,
          basis: rule.standard,
          clause: '签署栏填写要求',
          suggestion: `由${label}责任人完成签署并填写日期。`,
          confidence: label === '标准化' ? 0.95 : 0.9,
          severity: '严重',
        })
      )
    }
  }
}

// ── R03 比例一致性 ──
function ruleR03(context, rule) {
  const p = rule?.params || {}
  const { model, thresholds } = context
  const scale = model.titleBlock?.fields?.scale
  if (!scale || !scale.ratio) return
  const allText = model.texts.map(item => item.text).join(' ')
  if ((p.skipKeywords || ['不按比例', '示意']).some(keyword => allText.includes(keyword))) return
  const ratios = []
  const samples = []
  for (const dim of model.dimensions) {
    if (!['linear', 'tolerance'].includes(dim.kind)) continue
    if (dim.leader || dim.extLineCount < 2) continue
    if (!Number.isFinite(dim.measured) || dim.measured < 1) continue
    if (!Number.isFinite(dim.value) || dim.value < 1) continue
    const ratio = dim.value / dim.measured
    if (!Number.isFinite(ratio) || ratio <= 0) continue
    ratios.push(ratio)
    samples.push({ text: dim.text, value: dim.value, measured: dim.measured, ratio, position: dim.position })
  }
  if (ratios.length < 1) return
  const measuredRatio = median(ratios)
  const actualScale = measuredRatio >= 1 ? `${formatNumber(measuredRatio, 2)}:1` : `1:${formatNumber(1 / measuredRatio, 2)}`
  const deviation = Math.abs(measuredRatio - scale.ratio) / scale.ratio
  const scaleTolerance = p.tolerancePct ?? thresholds.scaleTolerancePct
  if (deviation * 100 <= scaleTolerance) return
  const detailSamples = samples
    .slice(0, 4)
    .map(item => `${item.text}：标注 ${formatNumber(item.value)} mm，实测 ${formatNumber(item.measured)} mm，R=${formatNumber(item.ratio, 3)}`)
    .join('；')
  context.findings.push(
    makeFinding(context, rule, checkpointId(rule, 0, 'D07'), {
      title: `比例标注 ${scale.numerator}:${scale.denominator}，图面实测约 ${actualScale}`,
      detail: `标题栏比例与图元实测不一致（偏差 ${formatNumber(deviation * 100, 1)}%，阈值 ${scaleTolerance}%）。依据样本：${detailSamples}`,
      location: { x: scale.x, y: scale.y, label: '标题栏比例栏' },
      measured: `${actualScale}（${ratios.length} 处尺寸中位值）`,
      expected: `${scale.numerator}:${scale.denominator}`,
      basis: rule.standard,
      clause: '比例系列与标注',
      suggestion: `按实际绘图比例修改标题栏为 ${actualScale}，或按标注比例重新缩放图形。`,
      confidence: 0.95,
      evidence: samples.slice(0, 6),
    })
  )
}

// ── R04 明细栏与件号 ──
function ruleR04(context, rule) {
  const p = rule?.params || {}
  const { model } = context
  const rows = model.bom?.rows || []
  if (!rows.length) return
  const bomNumbers = [...new Set(rows.map(row => row.index))].sort((a, b) => a - b)
  const balloonNumbers = model.balloons.map(item => item.number)
  const balloonSet = new Set(balloonNumbers)
  const bomSet = new Set(bomNumbers)

  const extra = [...balloonSet].filter(number => !bomSet.has(number))
  if (extra.length) {
    const positions = model.balloons.filter(item => extra.includes(item.number)).map(item => item.ref)
    context.findings.push(
      makeFinding(context, rule, null, {
        title: `图面存在无来源件号：${extra.join('、')}`,
        detail: '图面件号在明细栏中找不到对应序号（B－A 非空）。',
        location: positions[0] ? { x: positions[0].x, y: positions[0].y, label: '图面件号' } : { x: 0, y: 0, label: '图面' },
        measured: extra.join('、'),
        expected: `明细栏序号 ${bomNumbers.join('、')} 对应的件号`,
        basis: rule.standard,
        clause: '明细栏与件号一致性',
        suggestion: '删除多余件号，或在明细栏中补充对应零件。',
        confidence: 0.85,
        severity: '关键',
      })
    )
  }

  const missing = bomNumbers.filter(number => !balloonSet.has(number))
  if (missing.length) {
    const rowRefs = rows.filter(row => missing.includes(row.index)).map(row => row.cellRefs?.['序号'] || null)
    context.findings.push(
      makeFinding(context, rule, checkpointId(rule, 0, 'D09'), {
        title: `明细栏中件 ${missing.join('、')} 在图面无件号`,
        detail: `明细栏序号集 A 与图面件号集 B 不一致，A－B 非空，共漏标 ${missing.length} 项。`,
        location: rowRefs[0]
          ? { x: rowRefs[0].x, y: rowRefs[0].y, label: '明细栏序号列' }
          : { x: model.bom.box.x0, y: model.bom.box.y1, label: '明细栏' },
        measured: `已标 ${balloonNumbers.length ? [...new Set(balloonNumbers)].sort((a, b) => a - b).join('、') : '无'}`,
        expected: `件号应覆盖 ${bomNumbers.join('、')}`,
        basis: rule.standard,
        clause: '明细栏序号与图面件号双向一致',
        suggestion: `在对应零件轮廓处补画件号 ${missing.join('、')} 及指引线。`,
        confidence: 0.95,
        severity: severityOf(rule, checkpointId(rule, 0, 'D09')),
      })
    )
  }

  const counts = new Map()
  for (const balloon of model.balloons) {
    if (!counts.has(balloon.number)) counts.set(balloon.number, [])
    counts.get(balloon.number).push(balloon)
  }
  for (const [number, items] of counts) {
    if (items.length < 2) continue
    context.findings.push(
      makeFinding(context, rule, checkpointId(rule, 1, 'D10'), {
        title: `件号 ${number} 重复标注 ${items.length} 次`,
        detail: `同一件号在图面出现多次：${items.map(item => `(${formatNumber(item.ref.x, 1)}, ${formatNumber(item.ref.y, 1)})`).join('、')}。`,
        location: { x: items[1].ref.x, y: items[1].ref.y, label: `件号 ${number}` },
        measured: `${items.length} 处`,
        expected: '同一件号只标注 1 次',
        basis: rule.standard,
        clause: '件号标注唯一性',
        suggestion: `保留最清晰视图中的 1 处件号 ${number}，删除其余重复标注。`,
        confidence: 0.95,
        severity: severityOf(rule, checkpointId(rule, 1, 'D10')),
      })
    )
  }

  for (const balloon of model.balloons) {
    if (balloon.hasDot) continue
    context.findings.push(
      makeFinding(context, rule, checkpointId(rule, 2, 'D11'), {
        title: `件号 ${balloon.number} 指引线空端（未画圆点）`,
        detail: `指引线终点 (${formatNumber(balloon.endpoint.x, 1)}, ${formatNumber(balloon.endpoint.y, 1)}) 没有圆点或箭头，且未落在零件轮廓上。`,
        location: { x: balloon.ref.x, y: balloon.ref.y, label: `件号 ${balloon.number}` },
        measured: '空端',
        expected: '指引线终止于轮廓内并画圆点',
        basis: rule.standard,
        clause: '指引线画法',
        suggestion: `将件号 ${balloon.number} 的指引线端点移到零件轮廓上，并补画直径约 1 mm 的圆点。`,
        confidence: 0.9,
        severity: severityOf(rule, checkpointId(rule, 2, 'D11')),
      })
    )
  }
}

// ── R05 线型与线宽 ──
function ruleR05(context, rule) {
  const p = rule?.params || {}
  const { model, thresholds } = context
  const visible = model.lines?.visible || []
  const lineLike = visible.filter(item => ['LINE', 'LWPOLYLINE', 'POLYLINE'].includes(item.entity.type))
  if (lineLike.length >= 3) {
    const widths = lineLike.map(item => item.lineweight)
    const expected = mode(widths)
    const widthTolerance = p.widthToleranceMm ?? thresholds.lineWidthToleranceMm
    const offenders = lineLike.filter(item => Math.abs(item.lineweight - expected) > widthTolerance)
    if (offenders.length) {
      const worst = offenders.sort((a, b) => Math.abs(b.lineweight - expected) - Math.abs(a.lineweight - expected))[0]
      const center = worst.bbox ? rectCenter(worst.bbox) : { x: 0, y: 0 }
      context.findings.push(
        makeFinding(context, rule, checkpointId(rule, 0, 'D12'), {
          title: `可见轮廓线宽 ${formatNumber(worst.lineweight, 2)} mm，偏离同组众数 ${formatNumber(expected, 2)} mm`,
          detail: `同一可见轮廓组内线宽应一致；共 ${offenders.length} 处偏离，最大偏差 ${formatNumber(Math.abs(worst.lineweight - expected), 2)} mm（阈值 ${widthTolerance} mm）。图层：${worst.layer}。`,
          location: { x: center.x, y: center.y, label: `图层 ${worst.layer}` },
          measured: `${formatNumber(worst.lineweight, 2)} mm`,
          expected: `${formatNumber(expected, 2)} mm（组内众数）`,
          basis: rule.standard,
          clause: '图线线宽系列与同组一致性',
          suggestion: `将该轮廓改到粗实线图层（0.50 mm），或把图层 ${worst.layer} 的线宽改为 ${formatNumber(expected, 2)} mm。`,
          confidence: 0.92,
          evidence: offenders.slice(0, 8).map(item => ({ layer: item.layer, lineweight: item.lineweight, bbox: item.bbox })),
        })
      )
    }
  }

  // 轴线必须为细点画线
  const centerItems = model.lines?.center || []
  const badCenter = centerItems.filter(item => !/CENTER|DASHDOT|DASH_DOT|点画/i.test(item.linetype))
  if (badCenter.length) {
    const item = badCenter[0]
    context.findings.push(
      makeFinding(context, rule, null, {
        title: `轴线/对称中心线使用了 ${item.linetype} 线型`,
        detail: '轴线与对称中心线必须使用细点画线，当前线型不符合要求。',
        location: item.bbox ? { ...rectCenter(item.bbox), label: `图层 ${item.layer}` } : { x: 0, y: 0, label: '—' },
        measured: item.linetype,
        expected: 'CENTER（细点画线）',
        basis: rule.standard,
        clause: '图线线型及应用',
        suggestion: '将轴线/中心线改为 CENTER 点画线线型，线宽保持 0.13~0.25 mm。',
        confidence: 0.9,
      })
    )
  }

  // 细实线层上的长直线，若正好位于零件对称中心，判为轴线误用细实线
  const symmetricRects = (model.rects || []).filter(item => {
    const w = rectWidth(item.box)
    const h = rectHeight(item.box)
    return w >= 15 && h >= 15 && w < model.sheet.width * 0.8 && h < model.sheet.height * 0.8
  })
  const thinLines = [...(model.lines?.thin || []), ...(model.lines?.visible || [])].filter(
    item => item.entity.type === 'LINE' && item.length >= 25 && !/DASH|CENTER/i.test(item.linetype)
  )
  for (const item of thinLines) {
    const entity = item.entity
    const vertical = Math.abs(entity.x0 - entity.x1) < 0.2
    const horizontal = Math.abs(entity.y0 - entity.y1) < 0.2
    if (!vertical && !horizontal) continue
    const mid = { x: (entity.x0 + entity.x1) / 2, y: (entity.y0 + entity.y1) / 2 }
    const match = symmetricRects.find(rectItem => {
      const center = rectCenter(rectItem.box)
      if (vertical) {
        const withinY = mid.y >= rectItem.box.y0 - 1 && mid.y <= rectItem.box.y1 + 1
        const spanOverlap =
          Math.min(Math.max(entity.y0, entity.y1), rectItem.box.y1) - Math.max(Math.min(entity.y0, entity.y1), rectItem.box.y0)
        return withinY && Math.abs(center.x - entity.x0) <= 0.8 && spanOverlap > 20
      }
      const withinX = mid.x >= rectItem.box.x0 - 1 && mid.x <= rectItem.box.x1 + 1
      const spanOverlap =
        Math.min(Math.max(entity.x0, entity.x1), rectItem.box.x1) - Math.max(Math.min(entity.x0, entity.x1), rectItem.box.x0)
      return withinX && Math.abs(center.y - entity.y0) <= 0.8 && spanOverlap > 20
    })
    if (!match) continue
    context.findings.push(
      makeFinding(context, rule, checkpointId(rule, 1, 'D13'), {
        title: '轴线使用了细实线（非点画线）',
        detail: `该直线位于零件对称中心，应为细点画线，当前线型 ${item.linetype}，图层 ${item.layer}。`,
        location: { x: mid.x, y: mid.y, label: `图层 ${item.layer}` },
        measured: `${item.linetype} / ${formatNumber(item.lineweight, 2)} mm`,
        expected: 'CENTER 细点画线 / 0.13 mm',
        basis: rule.standard,
        clause: '图线线型及应用——轴线与对称中心线',
        suggestion: '将该线段移至 CENTER 图层或改用 CENTER 线型。',
        confidence: 0.9,
      })
    )
    break
  }
}

// ── R06 字高 ──
function ruleR06(context, rule) {
  const p = rule?.params || {}
  const { model, thresholds } = context
  const name = model.titleBlock?.fields?.name
  const titleMin = p.titleMinHeight ?? thresholds.titleNameMinHeight
  const techMin = p.techMinHeight ?? thresholds.techRequirementMinHeight
  if (name?.height && name.height < titleMin - 0.01) {
    context.findings.push(
      makeFinding(context, rule, checkpointId(rule, 0, 'D06'), {
        title: `图样名称字高 ${formatNumber(name.height, 2)}，低于最低 ${titleMin} 号`,
        detail: '图样名称为标题栏中最醒目的文字，字高应不小于 5 号。',
        location: { x: name.x, y: name.y, label: '标题栏图样名称' },
        measured: `${formatNumber(name.height, 2)} mm`,
        expected: `≥ ${titleMin} mm（5 号字）`,
        basis: rule.standard,
        clause: '字体高度系列与标题栏字高',
        suggestion: '将图样名称字高改为 5 号（5 mm）或 7 号。',
        confidence: 0.95,
      })
    )
  }

  if (model.tech?.body?.length) {
    const heights = model.tech.body.map(item => item.height)
    const min = Math.min(...heights)
    if (min < techMin - 0.01) {
      context.findings.push(
        makeFinding(context, rule, checkpointId(rule, 1, 'D14'), {
          title: `技术要求正文字高 ${formatNumber(min, 2)}，低于 ${techMin} 号`,
          detail: `技术要求正文共 ${heights.length} 条，字高不得小于 3.5 号。`,
          location: { x: model.tech.body[0].x, y: model.tech.body[0].y, label: '技术要求' },
          measured: `${formatNumber(min, 2)} mm`,
          expected: `≥ ${techMin} mm（3.5 号字）`,
          basis: rule.standard,
          clause: '技术要求正文字高',
          suggestion: '将技术要求正文统一改为 3.5 号（3.5 mm）。',
          confidence: 0.96,
          evidence: model.tech.body.slice(0, 6),
        })
      )
    }
    const distinct = [...new Set(heights.map(value => Math.round(value * 100) / 100))]
    if (distinct.length > 1 && Math.max(...distinct) - Math.min(...distinct) > 0.3 && min >= techMin) {
      context.findings.push(
        makeFinding(context, rule, null, {
          title: '技术要求正文字高不一致',
          detail: `同一层级技术要求正文出现 ${distinct.join('、')} 号字。`,
          location: { x: model.tech.body[0].x, y: model.tech.body[0].y, label: '技术要求' },
          measured: distinct.join('、'),
          expected: '同一层级字高一致',
          basis: rule.standard,
          clause: '同一层级字高一致性',
          suggestion: `统一为 ${formatNumber(min, 2)} mm。`,
          confidence: 0.85,
        })
      )
    }
  }

  const dimHeights = model.dimensions
    .filter(item => item.source === 'exploded' && Number.isFinite(item.height) && ['linear', 'tolerance', 'diameter', 'radius', 'fit'].includes(item.kind))
    .map(item => item.height)
  if (dimHeights.length >= 3) {
    const expected = mode(dimHeights)
    const offenders = model.dimensions.filter(
      item =>
        item.source === 'exploded' &&
        Number.isFinite(item.height) &&
        Math.abs(item.height - expected) > 0.3
    )
    if (offenders.length) {
      context.findings.push(
        makeFinding(context, rule, null, {
          title: '尺寸数字字高不一致',
          detail: `尺寸数字字高众数为 ${formatNumber(expected, 2)} mm，另有 ${offenders
            .map(item => `${item.text}（${formatNumber(item.height, 2)}）`)
            .slice(0, 5)
            .join('、')}。`,
          location: { x: offenders[0].position.x, y: offenders[0].position.y, label: `尺寸 ${offenders[0].text}` },
          measured: offenders.map(item => formatNumber(item.height, 2)).join('、'),
          expected: formatNumber(expected, 2),
          basis: rule.standard,
          clause: '同一层级字高一致性',
          suggestion: `将尺寸数字统一为 ${formatNumber(expected, 2)} mm。`,
          confidence: 0.8,
        })
      )
    }
  }
}

// ── R07 尺寸三要素与符号 ──
function ruleR07(context, rule) {
  const p = rule?.params || {}
  const { model } = context
  const circleDiameters = []
  const titleBox = model.titleBlock?.box
  const bomBox = model.bom?.box
  for (const entity of model.entitiesForRules || []) {
    if (entity.type !== 'CIRCLE' || entity.radius < 2) continue
    const center = { x: entity.cx, y: entity.cy }
    if (titleBox && rectContainsPoint(titleBox, center, 2)) continue
    if (bomBox && rectContainsPoint(bomBox, center, 2)) continue
    circleDiameters.push(entity.radius * 2)
  }
  const linearDims = model.dimensions.filter(item => ['linear', 'tolerance'].includes(item.kind) && !item.leader)
  for (const dim of linearDims) {
    if (!dim.hasDimLine) {
      context.findings.push(
        makeFinding(context, rule, null, {
          title: `尺寸「${dim.text}」缺少尺寸线`,
          detail: '该尺寸未检测到尺寸线，三要素不完整。',
          location: { x: dim.position.x, y: dim.position.y, label: `尺寸 ${dim.text}` },
          measured: '缺尺寸线',
          expected: '尺寸线',
          basis: rule.standard,
          clause: '尺寸标注三要素',
          suggestion: '补画尺寸线并保持与尺寸界线垂直。',
          confidence: 0.85,
        })
      )
      continue
    }
    const requiredExt = p.requireExtLines ?? 2
    if (dim.extLineCount < requiredExt) {
      context.findings.push(
        makeFinding(context, rule, checkpointId(rule, 0, 'D16'), {
          title: `尺寸「${dim.text}」缺尺寸界线（${dim.extLineCount} 条）`,
          detail: `线性尺寸应包含尺寸线、${requiredExt} 条尺寸界线和尺寸数字，当前未检测到两端尺寸界线。`,
          location: { x: dim.position.x, y: dim.position.y, label: `尺寸 ${dim.text}` },
          measured: `${dim.extLineCount} 条尺寸界线`,
          expected: '2 条尺寸界线',
          basis: rule.standard,
          clause: '尺寸标注三要素',
          suggestion: `在尺寸「${dim.text}」两端补画尺寸界线，并与尺寸线垂直。`,
          confidence: 0.93,
          severity: severityOf(rule, checkpointId(rule, 0, 'D16')),
        })
      )
    }
  }

  // 直径符号：无 φ 的数值尺寸，若与图中圆直径一致，判为漏 φ
  const missingPhi = model.dimensions.filter(dim => {
    if (dim.kind !== 'linear' && dim.kind !== 'tolerance') return false
    if (!Number.isFinite(dim.value) || dim.value < 3) return false
    if (/[φΦ]/.test(dim.text)) return false
    return circleDiameters.some(diameter => Math.abs(diameter - dim.value) <= 0.25)
  })
  for (const dim of missingPhi) {
    context.findings.push(
      makeFinding(context, rule, checkpointId(rule, 1, 'D17'), {
        title: `尺寸「${dim.text}」是圆的直径，漏注 φ`,
        detail: `图面存在直径 ${formatNumber(dim.value, 2)} mm 的圆，该尺寸未加 φ 符号，无法区分直径与线性尺寸。`,
        location: { x: dim.position.x, y: dim.position.y, label: `尺寸 ${dim.text}` },
        measured: dim.text,
        expected: `φ${formatNumber(dim.value, 2)}`,
        basis: rule.standard,
        clause: '直径与半径的标注',
        suggestion: `将尺寸文字改为「φ${formatNumber(dim.value, 2)}」，球面则用「Sφ」。`,
        confidence: 0.9,
        severity: severityOf(rule, checkpointId(rule, 1, 'D17')),
      })
    )
  }

  // 半径符号
  const arcs = (model.entitiesForRules || []).filter(entity => entity.type === 'ARC' && entity.radius >= 2)
  const missingR = model.dimensions.filter(dim => {
    if (dim.kind !== 'linear') return false
    if (/^\s*R/i.test(dim.text)) return false
    if (!Number.isFinite(dim.value)) return false
    return arcs.some(arc => Math.abs(arc.radius - dim.value) <= 0.25)
  })
  for (const dim of missingR) {
    context.findings.push(
      makeFinding(context, rule, null, {
        title: `尺寸「${dim.text}」是圆弧半径，漏注 R`,
        detail: '图面存在同半径圆弧，该尺寸未加 R 符号。',
        location: { x: dim.position.x, y: dim.position.y, label: `尺寸 ${dim.text}` },
        measured: dim.text,
        expected: `R${formatNumber(dim.value, 2)}`,
        basis: rule.standard,
        clause: '直径与半径的标注',
        suggestion: `将尺寸文字改为「R${formatNumber(dim.value, 2)}」。`,
        confidence: 0.8,
      })
    )
  }
}

// ── R08 尺寸数字方向 ──
function ruleR08(context, rule) {
  const p = rule?.params || {}
  const { model } = context
  for (const dim of model.dimensions) {
    if (dim.kind !== 'linear') continue
    if (!dim.hasDimLine || dim.leader) continue
    const line = dim.dimLine
    if (!line) continue
    const angle = Math.abs(
      (Math.atan2(line.b.y - line.a.y, line.b.x - line.a.x) * 180) / Math.PI
    )
    const verticalTolerance = p.verticalToleranceDeg ?? 4
    const vertical = Math.abs(normalizeAngleAngle(angle) - 90) <= verticalTolerance
    if (!vertical) continue
    if (Math.abs(dim.rotation) > 5) continue
    const noteText = String(dim.text || '').replace(/[φΦRS]/gi, '').trim()
    if (!/^\d/.test(noteText)) continue
    context.findings.push(
      makeFinding(context, rule, checkpointId(rule, 0, 'D15'), {
        title: `竖直尺寸「${dim.text}」数字水平书写`,
        detail: '尺寸线竖直时，尺寸数字应旋转 90° 书写（字头朝左）；当前数字旋转角约 0°。',
        location: { x: dim.position.x, y: dim.position.y, label: `尺寸 ${dim.text}` },
        measured: '数字旋转 0°',
        expected: '数字旋转 90°（字头朝左）',
        basis: rule.standard,
        clause: '尺寸数字的方向',
        suggestion: `将尺寸「${dim.text}」的数字旋转 90°，或改为水平引出标注。`,
        confidence: 0.93,
        severity: severityOf(rule, checkpointId(rule, 0, 'D15')),
      })
    )
  }
}

function normalizeAngleAngle(angle) {
  let value = angle % 180
  if (value < 0) value += 180
  return value
}

// ── R09 配合代号 ──
function ruleR09(context, rule) {
  const p = rule?.params || {}
  const { model } = context
  const tolerance = context.toleranceIndex
  const library = tolerance.library
  const seen = new Set()
  for (const item of model.texts) {
    const text = item.text.trim()
    const match = text.match(/[φΦ]?\s*(\d+(?:\.\d+)?)\s*([A-Za-z]{1,2})\s*(\d{1,2})\s*\/\s*([A-Za-z]{1,2})\s*(\d{1,2})/)
    if (!match) continue
    const key = `${item.x}-${item.y}`
    if (seen.has(key)) continue
    seen.add(key)
    const holeLetter = match[2]
    const shaftLetter = match[4]
    const problems = []
    if (/^[a-z]/.test(holeLetter)) problems.push(`斜杠前为孔，应用大写字母，当前为「${holeLetter}」`)
    if (/^[A-Z]/.test(shaftLetter)) problems.push(`斜杠后为轴，应用小写字母，当前为「${shaftLetter}」`)

    const designation = `${holeLetter}${match[3]}/${shaftLetter}${match[5]}`
    let libraryProblem = null
    if (!library) {
      libraryProblem = '未加载公差与配合库，无法校验该配合/公差带是否在库中'
    } else if (tolerance.fits.size > 0 && !tolerance.fits.has(designation)) {
      libraryProblem = `配合「${designation}」不在当前公差库「${library.name}」（${library.version}）中`
    } else {
      if (tolerance.letters.size > 0 && (!tolerance.letters.has(holeLetter) || !tolerance.letters.has(shaftLetter))) {
        libraryProblem = `公差带字母不在当前公差库「${library.name}」（${library.version}）中`
      } else if (
        tolerance.grades.size > 0 &&
        (!tolerance.grades.has(Number(match[3])) || !tolerance.grades.has(Number(match[5])))
      ) {
        libraryProblem = `公差等级 IT${match[3]}/IT${match[5]} 不在当前公差库「${library.name}」（${library.version}）中`
      }
    }
    if (!problems.length && !libraryProblem) continue
    const title = problems.length
      ? `配合代号「${text}」大小写不合规`
      : library ? `配合代号「${text}」不在当前公差库` : `配合代号「${text}」待核验`
    const detail = [
      problems.length ? `配合代号斜杠前为孔（大写）、后为轴（小写）。${problems.join('；')}。` : '',
      libraryProblem ? `外部库校验：${libraryProblem}。` : '',
      library ? `当前公差库：${library.name}，版本 ${library.version}。` : '',
    ]
      .filter(Boolean)
      .join('')
    context.findings.push(
      makeFinding(context, rule, checkpointId(rule, 0, 'D18'), {
        title,
        detail,
        location: { x: item.x, y: item.y, label: `配合尺寸 ${text}` },
        measured: text,
        expected: `φ${match[1]} ${holeLetter.toUpperCase()}${match[3]}/${shaftLetter.toLowerCase()}${match[5]}（示例）`,
        basis: rule.standard,
        clause: '公差带代号与配合制',
        suggestion: problems.length
          ? '核对孔、轴公差带代号的大小写，并参照适用标准核验配合。'
          : '当前库未能确认该配合，请参照适用标准或完整的公差库核验。',
        confidence: problems.length ? 0.95 : 0.6,
        libraryVersion: library?.version || p.toleranceLibraryVersion || null,
        libraryName: library?.name || null,
        conclusion: problems.length ? undefined : '待确认',
        severity: problems.length ? severityOf(rule, checkpointId(rule, 0, 'D18')) : '一般',
      })
    )
  }
}

function isToleranceLetter(letter) {
  return /^[A-Za-z]{1,2}$/.test(letter) && !/[IiLlOoQqWw]/.test(letter)
}

// ── R10 几何公差框格 ──
function ruleR10(context, rule) {
  const p = rule?.params || {}
  const { model } = context
  const frames = model.fcf || []
  if (!frames.length) return
  const heights = frames.map(item => item.height)
  const minHeight = Math.min(...heights)
  const maxHeight = Math.max(...heights)
  if (frames.length > 1 && maxHeight - minHeight > 0.5) {
    context.findings.push(
      makeFinding(context, rule, checkpointId(rule, 1, 'D20'), {
        title: `同图几何公差框格高度不一致（${formatNumber(minHeight, 2)} / ${formatNumber(maxHeight, 2)}）`,
        detail: `框格高度应等于 2 倍字高，且同图一致；当前框格高度分别为 ${heights.map(value => formatNumber(value, 2)).join('、')} mm。`,
        location: { x: frames[heights.indexOf(maxHeight)].box.x0, y: frames[heights.indexOf(maxHeight)].box.y0, label: '几何公差框格' },
        measured: heights.map(value => formatNumber(value, 2)).join('、'),
        expected: `统一为 ${formatNumber(maxHeight, 2)} mm（2×字高）`,
        basis: rule.standard,
        clause: '公差框格高度与比例',
        suggestion: '按同一字高（如 3.5 号）重绘全部公差框格，框格高统一为 7 mm。',
        confidence: 0.93,
        severity: severityOf(rule, checkpointId(rule, 1, 'D20')),
      })
    )
  } else {
    for (const frame of frames) {
      const textHeight = Math.max(...frame.texts.map(item => item.height), 0)
      if (textHeight > 0 && Math.abs(frame.height - textHeight * 2) > 1) {
        context.findings.push(
          makeFinding(context, rule, null, {
            title: `几何公差框格高 ${formatNumber(frame.height, 2)}，与 2×字高不符`,
            detail: `框格内文字字高 ${formatNumber(textHeight, 2)} mm，框格高度应为 ${formatNumber(textHeight * 2, 2)} mm。`,
            location: { x: frame.box.x0, y: frame.box.y0, label: '几何公差框格' },
            measured: formatNumber(frame.height, 2),
            expected: formatNumber(textHeight * 2, 2),
            basis: rule.standard,
            clause: '公差框格高度',
            suggestion: '按 2 倍字高调整框格高度。',
            confidence: 0.85,
          })
        )
      }
    }
  }

  const datumTexts = model.texts.filter(item => /^[A-Z]$/.test(item.text.trim()))
  for (const frame of frames) {
    const needsDatum = frame.symbol === 'coaxiality' || frame.symbol === 'perpendicularity' || frame.symbol === 'position'
    const minCells = needsDatum ? (p.minCellsLocation ?? 3) : (p.minCellsShape ?? 2)
    if (frame.cells < minCells) {
      context.findings.push(
        makeFinding(context, rule, checkpointId(rule, 0, 'D19'), {
          title: `几何公差框格只有 ${frame.cells} 格，缺少基准格`,
          detail: `该框格（${frame.symbol === 'coaxiality' ? '同轴度' : frame.symbol === 'perpendicularity' ? '垂直度' : '方向/位置公差'}）为关联要素公差，至少需要 3 格：公差项目、公差值、基准。`,
          location: { x: frame.box.x0, y: frame.box.y0, label: '几何公差框格' },
          measured: `${frame.cells} 格`,
          expected: `≥ ${minCells} 格（含基准格）`,
          basis: rule.standard,
          clause: '公差框格格数与基准',
          suggestion: '在框格末尾补画基准格并填写基准字母（如 A）。',
          confidence: 0.9,
          severity: severityOf(rule, checkpointId(rule, 0, 'D19')),
        })
      )
    }
    for (const letter of frame.datumLetters) {
      const exists = datumTexts.some(
        item =>
          item.text.trim() === letter &&
          !rectContainsPoint(frame.box, item.box.center, 1) &&
          findDatumSymbolNear(model, item)
      )
      if (!exists) {
        context.findings.push(
          makeFinding(context, rule, null, {
            title: `基准字母 ${letter} 在图面找不到对应基准符号`,
            detail: '框格中引用的基准字母必须对应图面上的基准符号（基准三角形 + 字母）。',
            location: { x: frame.box.x0, y: frame.box.y0, label: '几何公差框格' },
            measured: `基准 ${letter} 无对应符号`,
            expected: `图面存在基准符号 ${letter}`,
            basis: rule.standard,
            clause: '基准的标注',
            suggestion: `在基准要素轮廓处补画基准符号 ${letter}。`,
            confidence: 0.8,
          })
        )
      }
    }
  }
}

function findDatumSymbolNear(model, textItem) {
  const entities = model.entitiesForRules || []
  const near = entities.some(entity => {
    if (entity.type !== 'LINE' && entity.type !== 'SOLID') return false
    const box = entity.bbox
    if (!box) return false
    const cx = (box.x0 + box.x1) / 2
    const cy = (box.y0 + box.y1) / 2
    const distance = Math.hypot(cx - textItem.x, cy - textItem.y)
    return distance <= 8 && rectWidth(box) <= 6 && rectHeight(box) <= 6
  })
  return near
}

// ── R11 表面结构 ──
function ruleR11(context, rule) {
  const p = rule?.params || {}
  const { model } = context
  const missingRa = (model.roughness || []).filter(item => !item.hasRa && !item.uniform && !item.topRight)
  if (missingRa.length) {
    const first = missingRa[0]
    context.findings.push(
      makeFinding(context, rule, checkpointId(rule, 0, 'D21'), {
        title: `粗糙度标注只有数值，缺 Ra 代号（${missingRa.map(item => item.text).join('、')}）`,
        detail: `共 ${missingRa.length} 处粗糙度仅写数值，未注 Ra（或 Rz）代号，无法判定评定参数。`,
        location: { x: first.ref.x, y: first.ref.y, label: `粗糙度 ${first.text}` },
        measured: missingRa.map(item => item.text).join('、'),
        expected: `Ra ${missingRa[0].text}（代号＋数值＋完整符号）`,
        basis: rule.standard,
        clause: '表面结构代号标注',
        suggestion: '在数值前补写 Ra（或 Rz），如「Ra 6.3」「Ra 3.2」。',
        confidence: 0.93,
        severity: severityOf(rule, checkpointId(rule, 0, 'D21')),
        evidence: missingRa.map(item => item.ref),
      })
    )
  }
  const uniform = (model.roughness || []).filter(item => (item.topRight || item.uniform) && !item.hasRa)
  if (uniform.length) {
    const first = uniform[0]
    context.findings.push(
      makeFinding(context, rule, checkpointId(rule, 1, 'D22'), {
        title: '统一注法缺「其余」与 Ra 代号',
        detail: '图面右上角的统一注法只写了数值，未按「其余＋符号＋Ra 值」书写。',
        location: { x: first.ref.x, y: first.ref.y, label: '右上角统一注法' },
        measured: first.text,
        expected: `其余  Ra ${first.text}`,
        basis: rule.standard,
        clause: '统一注法',
        suggestion: `改为「其余  Ra ${first.text}」，并置于图面右上角。`,
        confidence: 0.92,
        severity: severityOf(rule, checkpointId(rule, 1, 'D22')),
      })
    )
  }
}

// ── R12 材料牌号 ──
function ruleR12(context, rule) {
  const p = rule?.params || {}
  const { model } = context
  const library = context.libraries.material
  const index = context.materialIndex
  const materials = []
  for (const row of model.bom?.rows || []) {
    if (row.material) materials.push({ text: row.material, ref: row.cellRefs?.['材料'], where: `明细栏第 ${row.index} 项` })
  }
  const titleMaterial = model.titleBlock?.fields?.material
  if (titleMaterial?.text) materials.push({ text: titleMaterial.text, ref: titleMaterial, where: '标题栏材料栏' })

  if (!library || index.size === 0) {
    context.findings.push(
      makeFinding(context, rule, checkpointId(rule, 0, 'D08'), {
        title: '未加载材料牌号库，无法核验材料目录',
        detail: '材料牌号判定依赖外部牌号库。请到「标准库」上传材料库并启用后重新审查。',
        location: titleMaterial ? { x: titleMaterial.x, y: titleMaterial.y, label: '标题栏材料栏' } : { x: 0, y: 0, label: '图面' },
        measured: titleMaterial?.text || '—',
        expected: '已启用的材料牌号库',
        basis: rule.standard,
        clause: '材料牌号库版本',
        suggestion: '上传材料牌号库（JSON/CSV），启用后重新审查；结论会附带库版本。',
        confidence: 0.4,
        conclusion: '待确认',
        severity: '严重',
      })
    )
    return
  }

  const reported = new Set()
  for (const item of materials) {
    const raw = item.text.trim()
    if (!raw) continue
    if (reported.has(raw)) continue
    const normalized = raw.replace(/\s+/g, '')
    const withoutStandard = normalized.split(/[（(]/)[0].replace(/GB\/T.*$/i, '').trim()
    const oldSuffix = normalized.match(/^([A-Z]\d{3})-([A-Z])$/i)
    const hashBase = /#$/.test(normalized) ? normalized.replace(/#$/u, '') : ''
    const candidates = [...new Set([normalized, withoutStandard, hashBase, oldSuffix?.[1] || ''].filter(Boolean))]
    let entry = null
    for (const candidate of candidates) {
      const found = index.get(normalizeMaterialCode(candidate))
      if (found) {
        entry = found
        break
      }
    }

    if (!entry) {
      reported.add(raw)
      context.findings.push(
        makeFinding(context, rule, null, {
          title: `材料牌号「${raw}」未收录于当前材料库`,
          detail: `${item.where}：当前材料库「${library.name}」版本 ${library.version} 未收录该牌号；如属企业标准或引进牌号，请上传对应的企业材料库。`,
          location: item.ref ? { x: item.ref.x, y: item.ref.y, label: item.where } : { x: 0, y: 0, label: item.where },
          measured: raw,
          expected: `材料库「${library.name}」中的牌号`,
          basis: rule.standard,
          clause: '材料牌号标注与牌号库版本',
          suggestion: '核对牌号写法；确属企业标准牌号时，上传企业材料库并启用后重新审查。',
          confidence: 0.65,
          libraryVersion: library.version,
          libraryName: library.name,
          severity: '严重',
        })
      )
      continue
    }

    const legacy = Boolean(entry.matchedLegacy) || /#$/.test(normalized) || Boolean(oldSuffix)
    const stale = entry.status === 'old' || entry.status === 'obsolete'
    if (!legacy && !stale) continue
    reported.add(raw)
    const expected = entry.replacement || entry.code
    context.findings.push(
      makeFinding(context, rule, checkpointId(rule, 0, 'D08'), {
        title: stale
          ? `材料牌号「${raw}」已${entry.status === 'obsolete' ? '废止' : '淘汰'}`
          : `材料牌号「${raw}」为旧习惯写法`,
        detail: `${item.where}：当前材料库「${library.name}」版本 ${library.version} 标记为${stale ? '非现行牌号' : '旧写法'}，建议改为「${expected}」。`,
        location: item.ref ? { x: item.ref.x, y: item.ref.y, label: item.where } : { x: 0, y: 0, label: item.where },
        measured: raw,
        expected,
        basis: rule.standard,
        clause: '材料牌号表示方法与牌号库版本',
        suggestion: `按当前材料库改为「${expected}」，并在技术要求中注明材料标准号。`,
        confidence: 0.95,
        libraryVersion: library.version,
        libraryName: library.name,
        severity: severityOf(rule, checkpointId(rule, 0, 'D08')),
      })
    )
  }
  void p
}

function dedupeFindings(findings) {
  const seen = new Set()
  const out = []
  for (const item of findings) {
    const key = `${item.ruleId}|${item.checkpoint || ''}|${item.title}|${Math.round(item.location.x / 3)}|${Math.round(item.location.y / 3)}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  return out
}

function summarizeFindings(findings, model, ruleSet = RULE_SET) {
  const bySeverity = { 关键: 0, 严重: 0, 一般: 0, 提示: 0 }
  const byRule = {}
  const byConclusion = { 不符合: 0, 疑似不符合: 0, 待确认: 0 }
  for (const item of findings) {
    bySeverity[item.severity] = (bySeverity[item.severity] || 0) + 1
    byRule[item.ruleId] = (byRule[item.ruleId] || 0) + 1
    byConclusion[item.conclusion] = (byConclusion[item.conclusion] || 0) + 1
  }
  const totalCheckpoints = (ruleSet.checkpoints || []).length
  const hitCheckpoints = new Set(findings.map(item => item.checkpoint).filter(Boolean))
  return {
    total: findings.length,
    bySeverity,
    byRule,
    byConclusion,
    checkpoints: { total: totalCheckpoints, hit: hitCheckpoints.size },
    drawing: {
      sheet: model.sheet.format,
      width: Math.round(model.sheet.width),
      height: Math.round(model.sheet.height),
      entities: model.entityCount || null,
    },
  }
}

function decideVerdict(findings, stats) {
  if (!findings.length) return { level: 'pass', label: '符合', detail: '未检出规则集内的问题。' }
  const hard = findings.filter(item => item.conclusion === '不符合')
  if (hard.length) {
    const suspected = findings.length - hard.length
    return {
      level: 'fail',
      label: '不符合',
      detail: `检出 ${hard.length} 项不符合${suspected ? `、${suspected} 项疑似不符合` : ''}（关键 ${stats.bySeverity['关键'] || 0}、严重 ${stats.bySeverity['严重'] || 0}、一般 ${stats.bySeverity['一般'] || 0}）。`,
    }
  }
  return {
    level: 'review',
    label: '待确认',
    detail: `检出 ${findings.length} 项疑似不符合，需标准化员签认。`,
  }
}

function formatMm(value) {
  return `${Math.round(value * 100) / 100} mm`
}

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) return '—'
  const factor = 10 ** digits
  return String(Math.round(value * factor) / factor)
}

export { MATERIAL_LIBRARY, MATERIAL_LIBRARY as materialLibrary }
