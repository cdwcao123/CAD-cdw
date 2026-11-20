/** 后端分片落盘冒烟测试：模拟 router，上传 200KB 随机数据并校验文件一致。 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'
import { register } from '../server.js'

const handlers = new Map()
const router = {
  get: (p, fn) => handlers.set(`GET ${p}`, fn),
  post: (p, fn) => handlers.set(`POST ${p}`, fn),
  log: { info() {}, warn() {}, error() {} },
}
const ctx = { id: 'cad-inspector', dataDir: path.join(os.tmpdir(), 'lw-export-test') }
await register(router, ctx)

const init = handlers.get('POST /export/init')
const chunk = handlers.get('POST /export/chunk')
const finish = handlers.get('POST /export/finish')
if (!init || !chunk || !finish) throw new Error('导出路由未注册')

const payload = crypto.randomBytes(200 * 1024)
const { id } = await init({ body: { name: 'test.dwg', size: payload.length } })
const SIZE = 36000
let seq = 0
for (let i = 0; i < payload.length; i += SIZE, seq++) {
  const slice = payload.subarray(i, Math.min(i + SIZE, payload.length))
  const res = await chunk({ body: { id, seq, data: slice.toString('base64') } })
  if (res.ok === false) throw new Error('chunk failed')
}
const fin = await finish({ body: { id } })
if (!fin.ok) throw new Error('finish failed: ' + fin.error)
const written = fs.readFileSync(fin.path)
console.log('written', fin.path, written.length, 'bytes')
if (!written.equals(payload)) throw new Error('文件内容与上传不一致')
console.log('EXPORT OK')
