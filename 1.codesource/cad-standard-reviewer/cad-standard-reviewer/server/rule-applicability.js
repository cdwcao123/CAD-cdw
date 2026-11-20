const CAD_SIGNALS = [
  ['图样/图纸', /图样|图纸|工程图|制图|CAD|DXF|DWG/i],
  ['图框/标题栏', /图框|图幅|标题栏|明细栏|装订边/],
  ['尺寸/标注', /尺寸|标注|尺寸线|尺寸界线|基准|比例/],
  ['公差/表面结构', /公差|配合|粗糙度|表面结构|几何公差|形状公差|位置公差/],
  ['CAD 图元', /图层|线型|线宽|块|几何|实体|视图|剖面/],
  ['机械图样', /零件图|装配图|机械|材料牌号|焊接|螺纹/],
]

const NON_CAD_SIGNALS = [
  ['工艺文件', /工艺文件|工艺规程|工艺编号|操作说明/],
  ['工艺参数', /工艺参数|关键工艺参数/],
  ['生产参数', /干燥温度|混合温度|搅拌时间|取样体积|过滤压力|搅拌转速/],
  ['生产设备', /设备编号|生产过程中的设备|设备参数/],
]

function signals(text, definitions) {
  return definitions.filter(([, pattern]) => pattern.test(text)).map(([label]) => label)
}

function sourceText(source) {
  return [
    source?.fileName,
    source?.originalText,
    source?.reason,
    ...(source?.fragments || []).map(fragment => fragment?.text),
  ].filter(Boolean).join('\n').slice(0, 500000)
}

function ruleText(rules) {
  return rules.flatMap(rule => [rule.name, rule.logic, rule.standard, ...(rule.exceptions || [])]).filter(Boolean).join('\n')
}

export function assessRuleApplicability({ ruleSet, rawSources = [], drawing = {} }) {
  const ruleSources = rawSources.filter(source => source.kind === 'rule')
  const failures = []
  for (const source of ruleSources) {
    const rules = (ruleSet.rules || []).filter(rule => rule.sourceFileId === source.entryId || rule.sourceFileId === source.fileId)
    const text = `${ruleText(rules)}\n${sourceText(source)}`.slice(0, 500000)
    const cadSignals = signals(text, CAD_SIGNALS)
    const nonCadSignals = signals(text, NON_CAD_SIGNALS)
    const genericOnly = rules.length > 0 && rules.every(rule => !rule.checkType || rule.checkType === 'llmOnly')
    const machineRuleCount = rules.filter(rule => rule.checkType && rule.checkType !== 'llmOnly').length
    if (genericOnly && cadSignals.length === 0 && nonCadSignals.length >= 2) {
      failures.push({ fileName: source.fileName || source.entryId, cadSignals, nonCadSignals, genericOnly, machineRuleCount })
    }
  }
  if (!failures.length) {
    const text = `${ruleText(ruleSet.rules || [])}\n${ruleSources.map(sourceText).join('\n')}`.slice(0, 500000)
    return { applicable: true, cadSignals: signals(text, CAD_SIGNALS), nonCadSignals: signals(text, NON_CAD_SIGNALS), drawing: { entityCount: drawing.entityCount || 0, textCount: drawing.textCount || 0 } }
  }
  const names = [...new Set(failures.map(item => item.fileName))]
  const nonCadSignals = [...new Set(failures.flatMap(item => item.nonCadSignals))]
  return {
    applicable: false,
    code: 'RULE_FILE_NOT_APPLICABLE',
    message: `规则文件“${names.join('、')}”与待审查图纸不匹配：检测到“${nonCadSignals.join('、')}”等非 CAD 内容，但未检测到图样、图框、尺寸、标注等图样审查要求。请选择与图纸配套的规则文件后重新审查。`,
    ruleFiles: names,
    nonCadSignals,
    failures,
  }
}
