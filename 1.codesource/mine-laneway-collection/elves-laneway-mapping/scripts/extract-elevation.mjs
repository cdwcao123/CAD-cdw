import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { decodeDxf, parseDxf } from '../core/parse.js'
import { parseElev, parsePointName } from '../core/nodes.js'

const hash = value => createHash('sha256').update(value).digest('hex')

function validateDxf(bytes) {
  const lines = decodeDxf(bytes).split(/\r\n|\n|\r/)
  if (lines.at(-1) === '') lines.pop()
  if (lines.length % 2) throw new Error('DXF 截断：组码未配对')
  let section = false, entities = false, eof = false
  for (let i = 0; i < lines.length; i += 2) {
    const code = lines[i].trim(), value = lines[i + 1].trim()
    if (!/^\d+$/.test(code)) throw new Error(`DXF 组码无效，行 ${i + 1}`)
    if (Number(code) !== 0) continue
    if (value === 'SECTION') {
      if (section || eof || lines[i + 2]?.trim() !== '2' || !lines[i + 3]?.trim()) throw new Error('DXF SECTION 结构无效')
      section = true
      if (lines[i + 3].trim() === 'ENTITIES') entities = true
    } else if (value === 'ENDSEC') {
      if (!section || eof) throw new Error('DXF ENDSEC 结构无效')
      section = false
    } else if (value === 'EOF') {
      if (section || eof || i !== lines.length - 2) throw new Error('DXF EOF 结构无效')
      eof = true
    }
  }
  if (section || !entities || !eof) throw new Error('DXF 不完整：缺少 ENTITIES、ENDSEC 或 EOF')
}

function lowerBound(items, x) {
  let lo = 0, hi = items.length
  while (lo < hi) {
    const mid = (lo + hi) >>> 1
    if (items[mid].x < x) lo = mid + 1
    else hi = mid
  }
  return lo
}

export async function extract(input, radius = 12, batchSize = 10, maxPairs = 10000) {
  if (!Number.isSafeInteger(maxPairs) || maxPairs < 1 || maxPairs > 1000000) throw new Error('单圆圈组合检查上限无效')
  let bytes = fs.readFileSync(input)
  const sourceHash = hash(bytes)
  let conversion = null
  if (/\.dwg$/i.test(input)) {
    const { default: createModule } = await import('../runtime/libredwg-web.mjs')
    const messages = []
    const mod = await createModule({ locateFile: () => fileURLToPath(new URL('../runtime/libredwg-web.wasm', import.meta.url)), print: s => messages.push(String(s)), printErr: s => messages.push(String(s)) })
    mod.FS.writeFile('/input.dwg', bytes)
    const decoded = mod.dwg_read_file('/input.dwg')
    if (!decoded.data || (decoded.error & 0x3f80)) {
      if (decoded.data) mod.dwg_free(decoded.data)
      throw new Error(`DWG 读取失败，代码 ${decoded.error}`)
    }
    const entityCount = mod.dwg_get_num_entities(decoded.data)
    mod.dwg_free(decoded.data)
    const status = mod.dwg_write_dxf('/input.dwg', '/output.dxf')
    if (status !== 0 || !mod.FS.analyzePath('/output.dxf').exists) throw new Error(`DWG 转 DXF 失败，代码 ${status}`)
    bytes = mod.FS.readFile('/output.dxf')
    conversion = { backend: 'libredwg-web', read_warning_code: decoded.error, source_entity_count: entityCount, write_status: status, messages }
  }
  const dxfHash = hash(bytes)
  validateDxf(bytes)
  const parsed = parseDxf(bytes)
  const texts = parsed.texts.map((t, index) => ({
    id: `text-${hash(`${sourceHash}:text:${index}`)}`,
    raw_text: t.rawText ?? t.text, text: t.text, x: t.x, y: t.y,
    height: t.h, rotation: t.rot, layer: t.layer,
    parsed_elevation: parseElev(t.text), parsed_name: parsePointName(t.text),
  })).filter(t => Number.isFinite(t.x) && Number.isFinite(t.y))
  const sortedTexts = texts.slice().sort((a, b) => a.x - b.x || a.y - b.y || a.id.localeCompare(b.id))
  const candidates = []
  let approximateCircles = 0, circleCount = 0
  for (let index = 0; index < parsed.paths.length; index++) {
    const p = parsed.paths[index]
    if (!/^CIRCLE(?:@|$)/.test(p.kind || '')) continue
    circleCount++
    let c = p.circle
    let approximate = false
    if (!c) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
      for (const [x, y] of p.pts) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y) }
      c = { x: (minX + maxX) / 2, y: (minY + maxY) / 2, r: (maxX - minX + maxY - minY) / 4 }
      approximate = true
      approximateCircles++
    }
    const nearby = []
    for (let i = lowerBound(sortedTexts, c.x - radius); i < sortedTexts.length && sortedTexts[i].x <= c.x + radius; i++) {
      const t = sortedTexts[i]
      if (Math.abs(t.y - c.y) > radius) continue
      const distance = Math.hypot(t.x - c.x, t.y - c.y)
      if (distance <= radius) nearby.push({ ...t, distance })
    }
    nearby.sort((a, b) => a.distance - b.distance || a.id.localeCompare(b.id))
    const names = nearby.filter(t => t.parsed_name !== null || /^(?:[A-Za-z]{1,4}\d{1,5}['′]?|\d+)$/.test(t.text.trim()))
    const elevations = nearby.filter(t => t.parsed_elevation !== null)
    const combinations = []
    const pairCount = names.length * elevations.length
    const incomplete = pairCount > maxPairs
    if (incomplete) {
      candidates.push({ id: `circle-${hash(`${sourceHash}:circle:${index}`)}`, circle: { x: c.x, y: c.y, r: c.r, layer: p.layer, kind: p.kind, approximate }, nearby_texts: nearby, combinations, combination_check: { complete: false, possible_pair_count: pairCount, max_pairs: maxPairs, reason: '组合检查超限，存在候选的可能性，必须人工核验' } })
      continue
    }
    for (const name of names) for (const elevation of elevations) {
      if (name.id === elevation.id && name.parsed_name === null) continue
      if (Math.hypot(name.x - elevation.x, name.y - elevation.y) > radius) continue
      combinations.push({ name_text_id: name.id, elevation_text_id: elevation.id, name: name.parsed_name ?? name.text.trim(), elevation: elevation.parsed_elevation })
    }
    if (!combinations.length) continue
    candidates.push({ id: `circle-${hash(`${sourceHash}:circle:${index}`)}`, circle: { x: c.x, y: c.y, r: c.r, layer: p.layer, kind: p.kind, approximate }, nearby_texts: nearby, combinations, combination_check: { complete: true, possible_pair_count: pairCount, max_pairs: maxPairs } })
  }
  const batches = []
  for (let offset = 0; offset < candidates.length; offset += batchSize) {
    const items = candidates.slice(offset, offset + batchSize)
    const batchHash = hash(JSON.stringify(items))
    batches.push({ batch_id: `batch-${batchHash}`, batch_sha256: batchHash, index: batches.length, candidates: items })
  }
  const warnings = [
    '候选包含已找到完整组合的圆圈及组合检查超限、尚未确认是否存在完整组合的圆圈；排除圆圈可能存在遗漏。',
    '超限圆圈未枚举任何组合，完整保留邻近文字并须人工核验；组合数量为已枚举数量，不代表全图总数。',
    '编号与高程各自距圆心及彼此的插入点距离均不超过半径；纯数字可竞争编号和高程角色，组合不代表真实标注。',
    '邻近范围仅按文字插入或对齐点计算；超出半径的相关文字不会关联。原文保留 DXF 格式控制码，显示文本已清理。',
    '完整性检查仅验证基本段和 EOF，不保证单个实体完整；不支持的图元、外部参照、代理实体、字体及转换均可能造成遗漏。',
    '解析器最多展开三层嵌套块，缺失块及更深层参照可能遗漏；非均匀缩放圆圈按包围盒近似，嵌套变换和文字坐标可能存在误差。',
    '解析器对文字坐标及部分块变换坐标四舍五入至 0.001；坐标系和单位未经确认。',
  ]
  if (conversion) warnings.push('DWG 转 DXF 成功不代表转换完整；请核查转换消息、源实体数和底图。')
  if (approximateCircles) warnings.push(`${approximateCircles} 个圆圈为非均匀变换后的近似形状，半径仅为包围盒估计。`)
  const report = {
    schema_version: 'elevation-evidence-v1', source_sha256: sourceHash, dxf_sha256: dxfHash,
    parameters: { radius, batch_size: batchSize, max_pairs_per_circle: maxPairs }, conversion,
    coordinates: { reference: 'parsed_dxf', units: 'unknown', crs: 'unknown', note: '解析器输出的原图坐标，块参照已展开，未配准或缩放。' },
    warnings: [...warnings, ...parsed.warnings],
    summary: { circle_count: candidates.length, incomplete_circle_count: candidates.filter(c => !c.combination_check.complete).length, combination_count: candidates.reduce((sum, c) => sum + c.combinations.length, 0), combination_count_complete: candidates.every(c => c.combination_check.complete), total_circle_count: circleCount, prescreen_excluded_count: circleCount - candidates.length, text_count: texts.length, circles_without_nearby_text: candidates.filter(c => !c.nearby_texts.length).length, approximate_circle_count: approximateCircles, batch_count: batches.length, dxf_type_count: parsed.typeCount, blocks: parsed.blocks, inserts: parsed.inserts },
    batches,
  }
  return report
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2)
    if (args.includes('--help')) { console.log('用法: node scripts/extract-elevation.mjs 输入.dxf|输入.dwg [--radius 12] [--batch-size 10] [--page 0] [--max-pairs 10000]'); process.exit(0) }
    const input = args.shift()
    if (!input || !/\.(dxf|dwg)$/i.test(input)) throw new Error('请指定 DXF 或 DWG 输入')
    let radius = 12, batchSize = 10, page = 0, maxPairs = 10000
    const seen = new Set()
    while (args.length) {
      const key = args.shift()
      const value = args.shift(), n = Number(value)
      if (!['--radius', '--batch-size', '--page', '--max-pairs'].includes(key) || seen.has(key) || value === undefined || !value.trim() || !Number.isFinite(n)) throw new Error('参数无效')
      seen.add(key)
      if (key === '--radius' && n > 0) radius = n
      else if (key === '--batch-size' && Number.isSafeInteger(n) && n > 0 && n <= 100) batchSize = n
      else if (key === '--page' && Number.isSafeInteger(n) && n >= 0) page = n
      else if (key === '--max-pairs' && Number.isSafeInteger(n) && n > 0 && n <= 1000000) maxPairs = n
      else throw new Error('参数无效')
    }
    const report = await extract(input, radius, batchSize, maxPairs)
    if (page >= report.batches.length && !(page === 0 && report.batches.length === 0)) throw new Error('页码超出范围')
    const { batches, ...metadata } = report
    console.log(JSON.stringify({ ...metadata, evidence_sha256: hash(JSON.stringify(report)), page, batch: batches[page] ?? null }))
  } catch (error) { console.error(`失败: ${error.message}`); process.exitCode = 1 }
}
