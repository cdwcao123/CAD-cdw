import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const script = path.join(root, 'scripts/extract-elevation.mjs')
const dxf = '0\nSECTION\n2\nENTITIES\n0\nCIRCLE\n10\n0\n20\n0\n40\n1\n0\nTEXT\n10\n1\n20\n0\n1\nA1\n0\nTEXT\n10\n0\n20\n1\n1\n120.5\n0\nCIRCLE\n10\n100\n20\n100\n40\n1\n0\nENDSEC\n0\nEOF\n'

test('分页仅输出宽松筛选候选，不写证据文件', t => {
  const dir = fs.mkdtempSync(path.join(root, 'test-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  const file = path.join(dir, 'drawing.dxf')
  fs.writeFileSync(file, dxf)
  const run = (...args) => spawnSync(process.execPath, [script, file, ...args], { encoding: 'utf8' })
  const a = run('--batch-size', '1', '--page', '0')
  assert.equal(a.status, 0, a.stderr)
  const report = JSON.parse(a.stdout)
  assert.equal(report.summary.total_circle_count, 2)
  assert.equal(report.summary.prescreen_excluded_count, 1)
  assert.equal(report.batch.candidates.length, 1)
  assert.equal(report.batch.candidates[0].nearby_texts.length, 2)
  assert.equal(run('--batch-size', '1', '--page', '0').stdout, a.stdout)
  assert.notEqual(run('--page', '1').status, 0)
  assert.equal(report.summary.combination_count, 1)
  assert.equal(report.batch.candidates[0].combinations.length, 1)
  assert.notEqual(run('--all-circles').status, 0)
  assert.deepEqual(fs.readdirSync(dir), ['drawing.dxf'])
})

test('全方向、纯数字、后缀和共享文字保留全部组合且跨页稳定', async t => {
  const dir = fs.mkdtempSync(path.join(root, 'test-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  const file = path.join(dir, 'drawing.dxf')
  const entity = (kind, x, y, value) => `0\n${kind}\n10\n${x}\n20\n${y}\n${kind === 'CIRCLE' ? `40\n1` : `1\n${value}`}\n`
  fs.writeFileSync(file, '0\nSECTION\n2\nENTITIES\n' +
    entity('CIRCLE', 0, 0) + entity('CIRCLE', 2, 0) + entity('CIRCLE', 100, 0) +
    entity('TEXT', -1, 0, '001') + entity('TEXT', 0, 1, '123.45底板') +
    entity('TEXT', 1, 0, 'B2 125.5（底）') + entity('TEXT', 100, 0, 'A7') + '0\nENDSEC\n0\nEOF\n')
  const { extract } = await import('../scripts/extract-elevation.mjs')
  const report = await extract(file, 12, 1)
  assert.equal(report.summary.circle_count, 2)
  assert.equal(report.summary.combination_count, 8)
  assert.equal(report.summary.batch_count, 2)
  const [a, b] = report.batches.map(batch => batch.candidates[0])
  assert.notEqual(a.id, b.id)
  assert.deepEqual(new Set(a.combinations.map(JSON.stringify)), new Set(b.combinations.map(JSON.stringify)))
  assert.ok(a.combinations.some(c => c.name === '001' && c.elevation === 123.45))
  assert.ok(a.combinations.some(c => c.name === 'B2' && c.elevation === 125.5 && c.name_text_id === c.elevation_text_id))
  assert.equal(new Set(a.nearby_texts.map(v => v.id)).size, 3)
  assert.equal(new Set(b.nearby_texts.map(v => v.id)).size, 3)
  const run = page => JSON.parse(spawnSync(process.execPath, [script, file, '--batch-size', '1', '--page', String(page)], { encoding: 'utf8' }).stdout)
  const page0 = run(0), page1 = run(1)
  assert.equal(page0.evidence_sha256, page1.evidence_sha256)
  assert.equal(page0.batch.batch_sha256, report.batches[0].batch_sha256)
  assert.equal(page1.batch.batch_sha256, report.batches[1].batch_sha256)
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('123.45底板', '123.46底板'))
  const changed = run(0)
  assert.notEqual(changed.evidence_sha256, page0.evidence_sha256)
  assert.notEqual(changed.batch.batch_sha256, page0.batch.batch_sha256)
})

test('单圆圈上限不会限制全图候选且超限哈希绑定', async t => {
  const dir = fs.mkdtempSync(path.join(root, 'test-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  const file = path.join(dir, 'drawing.dxf')
  fs.writeFileSync(file, dxf.replace('0\nENDSEC', '0\nTEXT\n10\n2\n20\n0\n1\nB2\n0\nTEXT\n10\n101\n20\n100\n1\nC3 130.5\n0\nENDSEC'))
  const { extract } = await import('../scripts/extract-elevation.mjs')
  const limited = await extract(file, 12, 1, 1), full = await extract(file, 12, 1, 2)
  assert.equal(limited.summary.circle_count, 2)
  assert.equal(limited.summary.incomplete_circle_count, 1)
  assert.equal(limited.batches[0].candidates[0].combination_check.complete, false)
  assert.equal(limited.batches[1].candidates[0].combination_check.complete, true)
  assert.equal(full.summary.incomplete_circle_count, 0)
  assert.equal(full.summary.combination_count, 3)
  assert.notEqual(limited.batches[0].batch_sha256, full.batches[0].batch_sha256)
  const page = spawnSync(process.execPath, [script, file, '--batch-size', '1', '--max-pairs', '1'], { encoding: 'utf8' })
  assert.equal(page.status, 0, page.stderr)
  assert.equal(JSON.parse(page.stdout).parameters.max_pairs_per_circle, 1)
})

test('两文字彼此超半径或仅有数字不能成为候选', async t => {
  const dir = fs.mkdtempSync(path.join(root, 'test-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  const file = path.join(dir, 'drawing.dxf')
  fs.writeFileSync(file, dxf.replace('10\n1\n20\n0\n1\nA1', '10\n-10\n20\n0\n1\nA1').replace('10\n0\n20\n1\n1\n120.5', '10\n10\n20\n0\n1\n120.5'))
  const { extract } = await import('../scripts/extract-elevation.mjs')
  assert.equal((await extract(file)).summary.circle_count, 0)
  fs.writeFileSync(file, dxf.replace('\nA1\n', '\nfoo\n'))
  assert.equal((await extract(file)).summary.circle_count, 0)
})

test('损坏 DXF 被拒绝', t => {
  const dir = fs.mkdtempSync(path.join(root, 'test-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  const file = path.join(dir, 'broken.dxf')
  fs.writeFileSync(file, dxf.replace('0\nEOF\n', ''))
  assert.notEqual(spawnSync(process.execPath, [script, file]).status, 0)
})
