import { normalizeRuleSet, RuleImportError } from './rule-import.js'

export function rulesFromDocumentPreview(fileName, preview, sha256) {
  const sourceType = String(fileName || '').split('.').pop()?.toLowerCase() || 'document'
  const fragments = Array.isArray(preview?.fragments) ? preview.fragments.filter(item =>
    item && typeof item.text === 'string' && item.text.trim()
  ) : []
  if (!fragments.length) throw new RuleImportError('未提取到可用文字，请检查文件、OCR 语言及解析工具', 'RULE_DOCUMENT_NO_TEXT')
  const groupSize = Math.max(1, Math.ceil(fragments.length / 300))
  const groups = []
  for (let index = 0; index < fragments.length; index += groupSize) groups.push(fragments.slice(index, index + groupSize))
  const rules = groups.map((group, index) => {
    const label = group.length === 1
      ? (() => {
          const location = group[0].location || {}
          return location.type === 'pdf-page' || location.type === 'pdf-ocr'
            ? `PDF 第 ${location.page} 页`
            : location.type === 'docx-table'
              ? `表格 ${location.table} 行 ${location.row} 单元格 ${location.cell}`
              : location.type === 'docx-paragraph'
                ? `段落 ${location.paragraph}`
                : `片段 ${index + 1}`
        })()
      : `片段 ${index + 1}`
    return {
      id: `R${index + 1}`,
      name: label,
      logic: group.map(item => item.text).join('\n'),
      checkType: 'llmOnly',
      checkpoints: [],
      sourceLocations: group.map(item => item.location || {}),
    }
  })
  const ruleSet = normalizeRuleSet({ name: fileName, rules }, { sourceType, fileName })
  ruleSet.thresholds = {}
  ruleSet.sourceType = sourceType
  ruleSet.documentPreview = { sha256, fragments, reason: preview.reason || '文档提取可能不完整，须核对原件。' }
  ruleSet.warnings.push('按解析器识别到的片段创建模型审查单元，不代表已逐条提取规则；未识别内容须人工核对。')
  return { ruleSet, sourceType, warnings: ruleSet.warnings }
}

export function rulesFromPdfPreview(fileName, preview, sha256) {
  return rulesFromDocumentPreview(fileName, preview, sha256)
}
