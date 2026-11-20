// 审查编排：DXF 字节 → 解析 → 语义提取 → 规则判定。
import { decodeDxfBuffer, DxfParseError, parseDxf } from './dxf.js'
import { extractDrawing } from './extract.js'
import { analyzeDrawing } from './rules.js'
import { RULE_SET } from './rule-catalog.js'

export const MAX_DRAWING_BYTES = 64 * 1024 * 1024

export class AnalysisError extends Error {
  constructor(message, code = 'ANALYSIS_FAILED', status = 400) {
    super(message)
    this.name = 'AnalysisError'
    this.code = code
    this.status = status
  }
}

export function analyzeDxfBuffer(buffer, options = {}) {
  const started = Date.now()
  if (!buffer || buffer.length === 0) throw new AnalysisError('图纸内容为空', 'DXF_EMPTY')
  if (buffer.length > MAX_DRAWING_BYTES) {
    throw new AnalysisError(`图纸超过 ${Math.round(MAX_DRAWING_BYTES / 1024 / 1024)} MB 上限`, 'DXF_TOO_LARGE', 413)
  }
  let decoded
  try {
    decoded = decodeDxfBuffer(buffer)
  } catch (error) {
    if (error instanceof DxfParseError) throw new AnalysisError(error.message, error.code)
    throw error
  }
  let doc
  try {
    doc = parseDxf(decoded.text)
  } catch (error) {
    if (error instanceof DxfParseError) throw new AnalysisError(error.message, error.code)
    throw new AnalysisError('DXF 解析失败：' + (error instanceof Error ? error.message : String(error)), 'DXF_PARSE_FAILED')
  }
  const ruleSet = options.ruleSet || RULE_SET
  const libraries = options.libraries === undefined ? { material: null, tolerance: null } : options.libraries
  const model = extractDrawing(doc, options)
  const result = analyzeDrawing(model, { ...options, ruleSet, libraries })
  return {
    ...result,
    libraries: summarizeLibraries(libraries),
    drawing: {
      fileName: options.fileName || '',
      encoding: decoded.encoding,
      sourceFormat: /\.dwg$/i.test(options.fileName || '') ? 'dwg' : 'dxf',
      dxfVersion: doc.version || '未知',
      sheet: model.sheet.format,
      width: Math.round(model.sheet.width),
      height: Math.round(model.sheet.height),
      orientation: model.sheet.orientation,
      entityCount: model.entityCount,
      layerCount: model.layers?.length || 0,
      textCount: model.texts.length,
      dimensionCount: model.dimensions.length,
      balloonCount: model.balloons.length,
      bomCount: model.bom?.rows?.length || 0,
      fcfCount: model.fcf.length,
      roughnessCount: model.roughness.length,
    },
    summary: buildHumanSummary(model, result),
    model,
    warnings: model.warnings,
    parseMs: Date.now() - started,
    ruleSet: { ...result.ruleSet, thresholds: result.thresholds },
  }
}

function summarizeLibraries(libraries = {}) {
  const pick = library =>
    library
      ? {
          id: library.id,
          name: library.name,
          version: library.version,
          standard: library.standard,
          sourceType: library.sourceType,
          itemCount: library.itemCount,
        }
      : null
  return {
    material: pick(libraries.material),
    tolerance: pick(libraries.tolerance),
  }
}

function buildHumanSummary(model, result) {
  const fields = model.titleBlock?.fields
  const parts = []
  parts.push(
    `${model.sheet.format} ${Math.round(model.sheet.width)}×${Math.round(model.sheet.height)} mm，图元 ${model.entityCount} 个，文字 ${model.texts.length} 条`
  )
  if (fields?.name?.text) parts.push(`图样名称「${fields.name.text}」`)
  if (fields?.code?.text) parts.push(`代号 ${fields.code.text}`)
  if (fields?.scale?.label) parts.push(fields.scale.label)
  if (model.bom?.rows?.length) parts.push(`明细栏 ${model.bom.rows.length} 项`)
  parts.push(`件号 ${[...new Set(model.balloons.map(item => item.number))].sort((a, b) => a - b).join('、') || '无'}`)
  parts.push(`规则结论：${result.verdict.label}（${result.findings.length} 项）`)
  return parts.join('；')
}
