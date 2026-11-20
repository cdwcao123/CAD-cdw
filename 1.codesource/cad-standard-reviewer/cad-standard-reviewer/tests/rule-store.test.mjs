import test from 'node:test'
import assert from 'node:assert/strict'
import { promises as fs } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRuleStore } from '../server/rule-store.js'

async function withStore(fn) {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cad-rules-'))
  try {
    await fn(createRuleStore({ dataDir }), dataDir)
  } finally {
    await fs.rm(dataDir, { recursive: true, force: true })
  }
}

const builtinId = 'cn-mech-2d-v1'

async function installLegacy(store) {
  await store.ensureSeeded()
  const file = path.join(store.dir, `${builtinId}.json`)
  const ruleSet = JSON.parse(await fs.readFile(file, 'utf8'))
  for (const rule of ruleSet.rules) if (['R04', 'R09'].includes(rule.id)) rule.ruleClass = 'A'
  await fs.writeFile(file, JSON.stringify(ruleSet))
  return { file, ruleSet }
}

test('升级未修改的旧内置种子并保留文件启停状态', async () => withStore(async store => {
  const { file } = await installLegacy(store)
  await store.setActive(builtinId, false)
  await store.ensureSeeded()
  const migrated = JSON.parse(await fs.readFile(file, 'utf8'))
  assert.equal(migrated.rules.find(rule => rule.id === 'R04').ruleClass, 'B')
  assert.equal(migrated.rules.find(rule => rule.id === 'R09').ruleClass, 'C')
  assert.equal((await store.listFiles())[0].active, false)
  const before = await fs.readFile(file, 'utf8')
  await store.ensureSeeded()
  assert.equal(await fs.readFile(file, 'utf8'), before)
}))

test('不覆盖修改过的内置规则及上传规则', async () => withStore(async store => {
  const { file, ruleSet } = await installLegacy(store)
  ruleSet.rules[0].name = 'custom'
  await fs.writeFile(file, JSON.stringify(ruleSet))
  const custom = { id: 'user-rules', name: 'custom', version: '1', rules: [{ id: 'R04', ruleClass: 'A', name: 'custom' }] }
  const { entry } = await store.importFile(Buffer.from(JSON.stringify(custom)), 'custom.json')
  const before = await fs.readFile(file, 'utf8')
  const userFile = path.join(store.dir, `${entry.id}.json`)
  const userBefore = await fs.readFile(userFile, 'utf8')
  await store.ensureSeeded()
  assert.equal(await fs.readFile(file, 'utf8'), before)
  assert.equal(await fs.readFile(userFile, 'utf8'), userBefore)
}))

test('全部规则文件停用或索引为空时不隐式启用', async () => withStore(async store => {
  await store.ensureSeeded()
  await store.setActive(builtinId, false)
  const active = await store.getActiveRuleSet()
  assert.deepEqual(active.rules, [])
  assert.deepEqual(active.sources, [])
  await fs.writeFile(store.indexFile, '[]')
  const reopened = createRuleStore({ dataDir: path.dirname(store.dir) })
  assert.deepEqual(await reopened.listFiles(), [])
  assert.deepEqual((await reopened.getActiveRuleSet()).rules, [])
}))

test('索引丢失时不覆盖已有内置文件或猜测启用状态', async () => withStore(async store => {
  const { file, ruleSet } = await installLegacy(store)
  ruleSet.rules[0].name = 'custom'
  await fs.writeFile(file, JSON.stringify(ruleSet))
  const before = await fs.readFile(file, 'utf8')
  await fs.rm(store.indexFile)
  assert.deepEqual(await store.listFiles(), [])
  assert.deepEqual((await store.getActiveRuleSet()).rules, [])
  assert.equal(await fs.readFile(file, 'utf8'), before)
}))

test('同目录多个实例并发初始化和更新不丢失数据', async () => withStore(async (store, dataDir) => {
  const other = createRuleStore({ dataDir })
  await Promise.all([store.ensureSeeded(), other.ensureSeeded(), store.listFiles()])
  const payload = Buffer.from(JSON.stringify({ id: 'parallel-rule', name: '并发规则', rules: [{ id: 'R13', name: '测试' }] }))
  await Promise.all([store.importFile(payload, 'parallel.json'), other.setActive(builtinId, false)])
  const entries = await other.listFiles()
  assert.equal(entries.find(item => item.id === builtinId).active, false)
  assert.ok(entries.some(item => item.id === 'parallel-rule'))
}))

test('启用文件缺失时不回退到内置种子', async () => withStore(async store => {
  await store.ensureSeeded()
  await fs.rm(path.join(store.dir, `${builtinId}.json`))
  assert.deepEqual((await store.getActiveRuleSet()).rules, [])
}))
