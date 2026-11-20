import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { parseElev, parsePointName } from '../core/nodes.js'
import { extract } from './extract-elevation.mjs'

const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const digest = value => typeof value === 'string' && /^[0-9a-f]{64}$/.test(value)
const fail = message => { throw new Error(message) }
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value)
function evidenceIndex(report) {
  if (!object(report) || report.schema_version !== 'elevation-evidence-v1' || !Array.isArray(report.batches) || !object(report.summary)) fail('证据格式无效')
  if (!digest(report.source_sha256) || !digest(report.dxf_sha256)) fail('证据来源哈希无效')
  if (report.summary.batch_count !== report.batches.length || !Number.isSafeInteger(report.summary.circle_count) || report.summary.circle_count < 0) fail('证据汇总数量无效')
  const batches = new Map(), candidates = new Map(), texts = new Map()
  for (const [index, batch] of report.batches.entries()) {
    if (!object(batch) || !Array.isArray(batch.candidates) || batch.candidates.length === 0 || batch.index !== index) fail('证据批次格式或索引无效')
    const expected = hash(JSON.stringify(batch.candidates))
    if (batch.batch_sha256 !== expected || batch.batch_id !== `batch-${expected}` || batches.has(batch.batch_id)) fail('证据批次哈希或 ID 无效')
    const ids = new Set()
    for (const candidate of batch.candidates) {
      if (!object(candidate) || typeof candidate.id !== 'string' || !candidate.id || candidates.has(candidate.id) || !object(candidate.circle) || !Array.isArray(candidate.nearby_texts)) fail('圆圈候选无效或重复')
      const local = new Set()
      for (const text of candidate.nearby_texts) {
        if (!object(text) || typeof text.id !== 'string' || !text.id || typeof text.text !== 'string' || local.has(text.id)) fail('附近文字无效或重复')
        local.add(text.id)
        const { distance, ...identity } = text
        const serialized = JSON.stringify(identity)
        if (texts.has(text.id) && texts.get(text.id) !== serialized) fail('同一文字 ID 的内容不一致')
        texts.set(text.id, serialized)
      }
      ids.add(candidate.id)
      candidates.set(candidate.id, candidate)
    }
    batches.set(batch.batch_id, { batch, ids })
  }
  if (candidates.size !== report.summary.circle_count) fail('证据圆圈数量不匹配')
  return { batches, candidates }
}

function validateRound(round, stage, evidenceHash, firstHash, index) {
  if (!object(round) || round.schema_version !== 'elevation-review-v1' || round.stage !== stage || round.evidence_sha256 !== evidenceHash || (stage === 2 && round.first_round_sha256 !== firstHash) || !Array.isArray(round.batches)) fail(`第 ${stage} 轮格式或文件哈希无效`)
  if (round.batches.length !== index.batches.size) fail(`第 ${stage} 轮批次数量不匹配`)
  const decisions = new Map(), seen = new Set()
  for (const batch of round.batches) {
    if (!object(batch) || seen.has(batch.batch_id) || !index.batches.has(batch.batch_id)) fail(`第 ${stage} 轮批次缺失、重复或未知`)
    seen.add(batch.batch_id)
    const expected = index.batches.get(batch.batch_id)
    if (batch.batch_sha256 !== expected.batch.batch_sha256 || !Array.isArray(batch.decisions) || batch.decisions.length !== expected.ids.size) fail(`第 ${stage} 轮批次哈希或覆盖无效`)
    for (const d of batch.decisions) {
      if (!object(d) || !expected.ids.has(d.candidate_id) || decisions.has(d.candidate_id) || !['accept', 'reject', 'uncertain'].includes(d.decision)) fail(`第 ${stage} 轮决策缺失、重复或无效`)
      if (d.decision === 'accept' && (typeof d.name !== 'string' || !d.name.trim() || d.name !== d.name.trim() || !Number.isFinite(d.elevation) || typeof d.name_text_id !== 'string' || !d.name_text_id || typeof d.elevation_text_id !== 'string' || !d.elevation_text_id)) fail(`第 ${stage} 轮 accept 字段无效`)
      decisions.set(d.candidate_id, d)
    }
  }
  return decisions
}

const standaloneName = text => /^[A-Za-z]{1,4}\d{1,5}['′]?$/.test(text.trim()) ? text.trim() : null
const parsedName = text => parsePointName(text) ?? standaloneName(text)
const potentialName = text => parsedName(text) ?? (/^\d+$/.test(text.trim()) ? text.trim() : null)

function mixedText(text) {
  if (parseElev(text) !== null || standaloneName(text) !== null) return false
  return (text.match(/[A-Za-z]{1,4}\d{1,5}['′]?/g) || []).length +
    (text.match(/[+\-]?\d{2,4}\.\d{1,4}/g) || []).length >= 2 ||
    (text.match(/(?<![A-Za-z0-9_.])[+\-]?\d{2,4}(?:\.\d{1,4})?(?![A-Za-z0-9_.])/g) || []).length >= 2
}

function checkClaim(candidate, d) {
  if (!candidate.combinations.some(c => c.name_text_id === d.name_text_id && c.elevation_text_id === d.elevation_text_id && c.name === d.name && c.elevation === d.elevation)) return '声明不属于三主体候选组合'
  const texts = new Map(candidate.nearby_texts.map(t => [t.id, t]))
  const nameText = texts.get(d.name_text_id), elevationText = texts.get(d.elevation_text_id)
  if (!nameText || !elevationText) return '引用的文字不在该圆圈附近'
  const numericName = /^\d+$/.test(nameText.text.trim())
  const name = numericName ? nameText.text.trim() : parsedName(nameText.text)
  const z = parseElev(elevationText.text)
  const elevationName = parsePointName(elevationText.text)
  const nameElevation = numericName ? null : parseElev(nameText.text)
  if (d.name_text_id === d.elevation_text_id && parsePointName(nameText.text) === null) return '同一文字须包含明确可解析的编号与高程'
  if (name === null || z === null) return '编号或高程文字无法解析（parseElev 仅支持 100 至 2500 及规定格式，范围外不作识别）'
  if (name !== d.name || z !== d.elevation || (elevationName !== null && elevationName !== d.name) || (nameElevation !== null && nameElevation !== d.elevation)) return '声明与文字解析结果矛盾'
  return null
}

function finalize(report, first, second, index, hashes) {
  const textOwners = new Map(), nameOwners = new Map()
  const addOwner = (map, key, id) => {
    if (!map.has(key)) map.set(key, new Set())
    map.get(key).add(id)
  }
  for (const [id, candidate] of index.candidates) {
    for (const text of candidate.nearby_texts) {
      addOwner(textOwners, text.id, id)
      const name = potentialName(text.text)
      if (name !== null) addOwner(nameOwners, name.toUpperCase(), id)
    }
    for (const d of [first.get(id), second.get(id)]) {
      if (d.decision === 'accept') addOwner(nameOwners, d.name.toUpperCase(), id)
    }
  }
  const points = []
  for (const [id, candidate] of index.candidates) {
    const a = first.get(id), b = second.get(id), reasons = []
    const shared = candidate.nearby_texts.filter(t => textOwners.get(t.id).size > 1).map(t => ({ text_id: t.id, candidate_ids: [...textOwners.get(t.id)].filter(other => other !== id) }))
    const numericNameIds = new Set([a, b].filter(d => d.decision === 'accept' && /^\d+$/.test(d.name) && d.name_text_id !== d.elevation_text_id).map(d => d.name_text_id))
    const names = candidate.nearby_texts.filter(t => parsedName(t.text) !== null || numericNameIds.has(t.id)).map(t => t.id)
    const elevations = candidate.nearby_texts.filter(t => parseElev(t.text) !== null && !numericNameIds.has(t.id)).map(t => t.id)
    const mixed = candidate.nearby_texts.filter(t => mixedText(t.text)).map(t => t.id)
    const duplicateNames = [...new Set([...candidate.nearby_texts.map(t => potentialName(t.text)), ...[a, b].filter(d => d.decision === 'accept').map(d => d.name)].filter(name => name !== null).map(name => name.toUpperCase()))].filter(name => nameOwners.get(name).size > 1).map(name => ({ name, candidate_ids: [...nameOwners.get(name)].filter(other => other !== id) }))
    if (!candidate.combination_check.complete) reasons.push('组合检查超限，尚未完成，必须人工核验')
    if (candidate.combinations.length > 1) reasons.push('存在多个三主体竞争组合')
    if (shared.length) reasons.push('附近文字被其他圆圈共享')
    if (names.length > 1) reasons.push('存在多个可解析编号文字')
    if (elevations.length > 1) reasons.push('存在多个可解析高程文字')
    if (mixed.length) reasons.push('存在无法安全拆分的混合文字')
    if (duplicateNames.length) reasons.push('编号与其他圆圈重复')
    if ([a, b].some(d => d.decision === 'accept' && numericNameIds.has(d.elevation_text_id))) reasons.push('数字文字在两轮中被同时用作编号和高程')
    const hasConflict = reasons.length > 0
    for (const [label, d] of [['第一轮', a], ['第二轮', b]]) {
      if (d.decision !== 'accept') reasons.push(`${label}决策为 ${d.decision}`)
      else {
        const problem = checkClaim(candidate, d)
        if (problem) reasons.push(`${label}${problem}`)
      }
    }
    if (a.decision === 'accept' && b.decision === 'accept' && (a.name !== b.name || a.elevation !== b.elevation || a.name_text_id !== b.name_text_id || a.elevation_text_id !== b.elevation_text_id)) reasons.push('两轮编号、高程或证据文字不一致')
    const confirmed = reasons.length === 0
    const rejected = !hasConflict && a.decision === 'reject' && b.decision === 'reject'
    points.push({ candidate_id: id, circle: candidate.circle, nearby_texts: candidate.nearby_texts, combinations: candidate.combinations, combination_check: candidate.combination_check, status: confirmed ? 'confirmed' : rejected ? 'rejected' : 'pending', name: confirmed ? a.name : null, elevation: confirmed ? a.elevation : null, reasons, conflicts: { shared_texts: shared, name_text_ids: names.length > 1 ? names : [], elevation_text_ids: elevations.length > 1 ? elevations : [], mixed_text_ids: mixed, duplicate_names: duplicateNames }, first_round: a, second_round: b, human_verification_required: true })
  }
  const coverage = [...index.batches.values()].map(({ batch, ids }) => ({ batch_id: batch.batch_id, batch_sha256: batch.batch_sha256, index: batch.index, candidate_ids: [...ids], first_round_decision_count: ids.size, second_round_decision_count: ids.size }))
  return { schema_version: 'elevation-points-v1', ...hashes, source_sha256: report.source_sha256, dxf_sha256: report.dxf_sha256, parameters: report.parameters, coordinates: report.coordinates, warnings: [...(Array.isArray(report.warnings) ? report.warnings : []), 'confirmed 仅表示程序条件下两轮一致，不表示独立复核或事实正确；所有结果必须对照原图人工核验。', 'parseElev 仅支持 100 至 2500 及规定格式，范围外或格式不支持不作识别。', '覆盖仅针对本次解析和筛选的圆圈，不保证原图提取完整。'], coverage, summary: { batch_count: coverage.length, circle_count: points.length, incomplete_circle_count: report.summary.incomplete_circle_count, confirmed_count: points.filter(p => p.status === 'confirmed').length, pending_count: points.filter(p => p.status === 'pending').length, rejected_count: points.filter(p => p.status === 'rejected').length, total_circle_count: report.summary.total_circle_count, prescreen_excluded_count: report.summary.prescreen_excluded_count }, points }
}

try {
  const args = process.argv.slice(2)
  if (args.length === 1 && args[0] === '--help') { console.log('用法: node scripts/finalize-elevation.mjs 图纸.dxf|图纸.dwg --out 最终.json [--radius 12] [--batch-size 10] [--max-pairs 10000]；stdin 接收包含 first 和 second 的 JSON'); process.exit(0) }
  const input = args.shift()
  if (!input || !/\.(dxf|dwg)$/i.test(input)) fail('请指定原图')
  let out, radius = 12, batchSize = 10, maxPairs = 10000
  const seen = new Set()
  while (args.length) {
    const key = args.shift()
    const value = args.shift()
    if (!['--out', '--radius', '--batch-size', '--max-pairs'].includes(key) || seen.has(key) || !value || value.startsWith('--')) fail('参数无效')
    seen.add(key)
    if (key === '--out') out = value
    else if (key === '--radius' && Number.isFinite(Number(value)) && Number(value) > 0) radius = Number(value)
    else if (key === '--batch-size' && Number.isSafeInteger(Number(value)) && Number(value) > 0 && Number(value) <= 100) batchSize = Number(value)
    else if (key === '--max-pairs' && Number.isSafeInteger(Number(value)) && Number(value) > 0 && Number(value) <= 1000000) maxPairs = Number(value)
    else fail('参数无效')
  }
  if (!out || out === '-') fail('必须指定最终输出路径')
  const review = JSON.parse(fs.readFileSync(0, 'utf8'))
  const report = await extract(input, radius, batchSize, maxPairs)
  if (report.summary.circle_count === 0) fail('没有候选，无法完成审查或写出最终结果；请检查原图和遗漏风险')
  const evidenceHash = hash(JSON.stringify(report))
  const firstHash = hash(JSON.stringify(review.first))
  const secondHash = hash(JSON.stringify(review.second))
  const index = evidenceIndex(report)
  const first = validateRound(review.first, 1, evidenceHash, firstHash, index)
  const second = validateRound(review.second, 2, evidenceHash, firstHash, index)
  const result = finalize(report, first, second, index, { evidence_sha256: evidenceHash, first_round_sha256: firstHash, second_round_sha256: secondHash })
  try { fs.writeFileSync(out, JSON.stringify(result) + '\n', { flag: 'wx' }) }
  catch (error) { fail(`输出写入失败: ${error.message}；若有部分输出请人工检查 ${out}`) }
  console.log(JSON.stringify({ output: out, summary: result.summary }))
} catch (error) {
  console.error(`失败: ${error.message}`)
  process.exitCode = 1
}
