import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { extract } from '../scripts/extract-elevation.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const script = path.join(root, 'scripts/finalize-elevation.mjs')
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex')
const dxf = '0\nSECTION\n2\nENTITIES\n0\nCIRCLE\n10\n0\n20\n0\n40\n1\n0\nTEXT\n10\n1\n20\n0\n1\nA1\n0\nTEXT\n10\n0\n20\n1\n1\n123.45\n0\nENDSEC\n0\nEOF\n'

async function setup(t, drawing = dxf, options = []) {
  const dir = fs.mkdtempSync(path.join(root, 'test-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  const file = path.join(dir, 'drawing.dxf'), out = path.join(dir, 'final.json')
  fs.writeFileSync(file, drawing)
  const report = await extract(file, 12, 10), candidate = report.batches[0].candidates[0]
  const decision = { candidate_id: candidate.id, decision: 'accept', name: 'A1', elevation: 123.45, name_text_id: candidate.nearby_texts.find(t => t.text === 'A1')?.id, elevation_text_id: candidate.nearby_texts.find(t => t.text === '123.45')?.id }
  const round = stage => ({ schema_version: 'elevation-review-v1', stage, evidence_sha256: hash(report), batches: report.batches.map(b => ({ batch_id: b.batch_id, batch_sha256: b.batch_sha256, decisions: [{ ...decision }] })) })
  const first = round(1), second = round(2)
  second.first_round_sha256 = hash(first)
  const run = () => spawnSync(process.execPath, [script, file, '--out', out, ...options], { input: JSON.stringify({ first, second }), encoding: 'utf8' })
  return { dir, file, out, first, second, run, candidate, report }
}

test('重解析原图合并两轮且独占输出', async t => {
  const x = await setup(t), result = x.run()
  assert.equal(result.status, 0, result.stderr)
  assert.equal(JSON.parse(fs.readFileSync(x.out)).summary.confirmed_count, 1)
  assert.deepEqual(fs.readdirSync(x.dir).sort(), ['drawing.dxf', 'final.json'])
  const original = fs.readFileSync(x.out)
  assert.notEqual(x.run().status, 0)
  assert.deepEqual(fs.readFileSync(x.out), original)
})

test('漏决策、第一轮变化或原图变化均拒绝输出', async t => {
  for (const mutate of [x => x.second.batches[0].decisions.pop(), x => { x.first.batches[0].decisions[0].decision = 'reject' }, x => fs.appendFileSync(x.file, ' ')]) {
    const x = await setup(t); mutate(x)
    assert.notEqual(x.run().status, 0)
    assert.equal(fs.existsSync(x.out), false)
  }
})

test('重复候选和未知批次不得写出结果', async t => {
  for (const mutate of [x => x.first.batches[0].decisions.push(x.first.batches[0].decisions[0]), x => { x.second.batches[0].batch_id = 'unknown' }]) {
    const x = await setup(t)
    mutate(x)
    x.second.first_round_sha256 = hash(x.first)
    assert.notEqual(x.run().status, 0)
    assert.equal(fs.existsSync(x.out), false)
  }
})

test('本机 shell here-document 直接传递真实测试决定', async t => {
  const x = await setup(t)
  const shellScript = `"$1" "$2" "$3" --out "$4" <<'REVIEW'\n${JSON.stringify({ first: x.first, second: x.second })}\nREVIEW`
  const result = spawnSync('bash', ['-c', shellScript, 'review', process.execPath, script, x.file, x.out], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  assert.equal(JSON.parse(fs.readFileSync(x.out)).summary.confirmed_count, 1)
})

test('两轮拒绝仍需优先保留共享文字等冲突', async t => {
  const drawing = dxf.replace('0\nENDSEC', '0\nCIRCLE\n10\n2\n20\n0\n40\n1\n0\nENDSEC')
  const x = await setup(t, drawing)
  for (const round of [x.first, x.second]) round.batches[0].decisions = x.report.batches[0].candidates.map(c => ({ candidate_id: c.id, decision: 'reject' }))
  x.second.first_round_sha256 = hash(x.first)
  const result = x.run(); assert.equal(result.status, 0, result.stderr)
  const resultData = JSON.parse(fs.readFileSync(x.out))
  assert.equal(resultData.summary.pending_count, 2)
  assert.equal(resultData.summary.rejected_count, 0)
  assert.ok(resultData.points.every(p => p.conflicts.shared_texts.length))
})

test('组合过密时即使双拒绝也必须保留证据待核', async t => {
  const x = await setup(t, dxf.replace('0\nENDSEC', '0\nTEXT\n10\n2\n20\n0\n1\nB2\n0\nENDSEC'))
  const report = await extract(x.file, 12, 10, 1)
  const c = report.batches[0].candidates[0]
  assert.equal(c.combination_check.complete, false)
  assert.equal(c.combination_check.possible_pair_count, 2)
  assert.equal(c.nearby_texts.length, 3)
  assert.deepEqual(c.combinations, [])
  assert.equal(report.summary.incomplete_circle_count, 1)
  assert.equal(report.summary.combination_count_complete, false)
  const round = stage => ({ schema_version: 'elevation-review-v1', stage, evidence_sha256: hash(report), batches: report.batches.map(b => ({ batch_id: b.batch_id, batch_sha256: b.batch_sha256, decisions: [{ candidate_id: c.id, decision: 'reject' }] })) })
  const first = round(1), second = round(2); second.first_round_sha256 = hash(first)
  const r = spawnSync(process.execPath, [script, x.file, '--out', x.out, '--max-pairs', '1'], { input: JSON.stringify({ first, second }), encoding: 'utf8' })
  assert.equal(r.status, 0, r.stderr)
  const result = JSON.parse(fs.readFileSync(x.out))
  assert.equal(result.summary.incomplete_circle_count, 1)
  assert.equal(result.points[0].status, 'pending')
  assert.deepEqual(result.points[0].nearby_texts, c.nearby_texts)
  assert.deepEqual(result.points[0].combination_check, c.combination_check)
})

test('跨页共享文字在双拒绝时保留双方证据', async t => {
  const x = await setup(t, dxf.replace('0\nENDSEC', '0\nCIRCLE\n10\n2\n20\n0\n40\n1\n0\nENDSEC'))
  const report = await extract(x.file, 12, 1)
  const round = stage => ({ schema_version: 'elevation-review-v1', stage, evidence_sha256: hash(report), batches: report.batches.map(b => ({ batch_id: b.batch_id, batch_sha256: b.batch_sha256, decisions: b.candidates.map(c => ({ candidate_id: c.id, decision: 'reject' })) })) })
  const first = round(1), second = round(2); second.first_round_sha256 = hash(first)
  const r = spawnSync(process.execPath, [script, x.file, '--out', x.out, '--batch-size', '1'], { input: JSON.stringify({ first, second }), encoding: 'utf8' })
  assert.equal(r.status, 0, r.stderr)
  const result = JSON.parse(fs.readFileSync(x.out))
  assert.equal(result.coverage.length, 2)
  assert.equal(result.summary.pending_count, 2)
  for (const p of result.points) {
    const other = result.points.find(v => v.candidate_id !== p.candidate_id)
    assert.equal(p.conflicts.shared_texts.length, 2)
    assert.ok(p.conflicts.shared_texts.every(s => s.candidate_ids.includes(other.candidate_id) && other.nearby_texts.some(t => t.id === s.text_id)))
  }
})

test('跨页纯数字同名在双拒绝时仍待核', async t => {
  const drawing = dxf.replace('\nA1\n', '\n001\n').replace('0\nENDSEC', '0\nCIRCLE\n10\n100\n20\n0\n40\n1\n0\nTEXT\n10\n101\n20\n0\n1\n001\n0\nTEXT\n10\n100\n20\n1\n1\n125.5\n0\nENDSEC')
  const x = await setup(t, drawing)
  const report = await extract(x.file, 12, 1)
  const round = stage => ({ schema_version: 'elevation-review-v1', stage, evidence_sha256: hash(report), batches: report.batches.map(b => ({ batch_id: b.batch_id, batch_sha256: b.batch_sha256, decisions: b.candidates.map(c => ({ candidate_id: c.id, decision: 'reject' })) })) })
  const first = round(1), second = round(2); second.first_round_sha256 = hash(first)
  const r = spawnSync(process.execPath, [script, x.file, '--out', x.out, '--batch-size', '1'], { input: JSON.stringify({ first, second }), encoding: 'utf8' })
  assert.equal(r.status, 0, r.stderr)
  const result = JSON.parse(fs.readFileSync(x.out))
  assert.equal(result.summary.pending_count, 2)
  assert.ok(result.points.every(p => p.conflicts.duplicate_names.some(n => n.name === '001')))
})

test('纯数字编号须独立于高程文字，保留前导零', async t => {
  const x = await setup(t, dxf.replace('\nA1\n', '\n00123\n'))
  const numberId = x.candidate.nearby_texts.find(v => v.text === '00123').id
  for (const round of [x.first, x.second]) Object.assign(round.batches[0].decisions[0], { name: '00123', name_text_id: numberId })
  x.second.first_round_sha256 = hash(x.first)
  const result = x.run(); assert.equal(result.status, 0, result.stderr)
  assert.equal(JSON.parse(fs.readFileSync(x.out)).points[0].name, '00123')
})

test('明确可解析的组合文字允许共用文字 ID', async t => {
  const x = await setup(t, dxf.replace('\nA1\n', '\nA1 123.45\n').replace('\n123.45\n', '\nfoo\n'))
  const id = x.candidate.nearby_texts.find(v => v.text === 'A1 123.45').id
  for (const round of [x.first, x.second]) Object.assign(round.batches[0].decisions[0], { name_text_id: id, elevation_text_id: id })
  x.second.first_round_sha256 = hash(x.first)
  const result = x.run(); assert.equal(result.status, 0, result.stderr)
  assert.equal(JSON.parse(fs.readFileSync(x.out)).summary.confirmed_count, 1)
})

test('不能把同一个数字文字当编号和高程', async t => {
  const x = await setup(t, dxf.replace('\nA1\n', '\n123\n').replace('\n123.45\n', '\n124\n'))
  const id = x.candidate.nearby_texts.find(v => v.text === '123').id
  for (const round of [x.first, x.second]) Object.assign(round.batches[0].decisions[0], { name: '123', elevation: 123, name_text_id: id, elevation_text_id: id })
  x.second.first_round_sha256 = hash(x.first)
  const result = x.run(); assert.equal(result.status, 0, result.stderr)
  assert.equal(JSON.parse(fs.readFileSync(x.out)).summary.pending_count, 1)
})

test('无冲突的双轮拒绝才是 rejected', async t => {
  const x = await setup(t)
  for (const round of [x.first, x.second]) round.batches[0].decisions[0] = { candidate_id: x.candidate.id, decision: 'reject' }
  x.second.first_round_sha256 = hash(x.first)
  const result = x.run(); assert.equal(result.status, 0, result.stderr)
  assert.equal(JSON.parse(fs.readFileSync(x.out)).summary.rejected_count, 1)
})

test('不允许切换到非三主体候选模式', async t => {
  const x = await setup(t)
  const result = spawnSync(process.execPath, [script, x.file, '--out', x.out, '--all-circles'], { input: JSON.stringify({ first: x.first, second: x.second }), encoding: 'utf8' })
  assert.notEqual(result.status, 0)
  assert.equal(fs.existsSync(x.out), false)
})

test('空候选不写出误导性结果', async t => {
  const dir = fs.mkdtempSync(path.join(root, 'test-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  const file = path.join(dir, 'empty.dxf'), out = path.join(dir, 'final.json')
  fs.writeFileSync(file, '0\nSECTION\n2\nENTITIES\n0\nENDSEC\n0\nEOF\n')
  const result = spawnSync(process.execPath, [script, file, '--out', out], { input: '{}', encoding: 'utf8' })
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /没有候选/)
  assert.equal(fs.existsSync(out), false)
})

test('两轮冲突保留待核', async t => {
  const x = await setup(t)
  x.second.batches[0].decisions[0].elevation = 124
  const result = x.run()
  assert.equal(result.status, 0, result.stderr)
  assert.equal(JSON.parse(fs.readFileSync(x.out)).summary.pending_count, 1)
})
