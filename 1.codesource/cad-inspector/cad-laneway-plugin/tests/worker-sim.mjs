/** 在 Node 中模拟 Worker 消息协议，验证插件 worker 的完整链路。 */
import fs from 'node:fs'
import path from 'node:path'

const input = process.argv[2]
const outDir = 'E:/kuangshan/cad-laneway-test-out'
fs.mkdirSync(outDir, { recursive: true })

const messages = []
let resolveDone
const done = new Promise(resolve => (resolveDone = resolve))

globalThis.self = {
  postMessage(message) {
    messages.push(message)
    if (message.type === 'candidates') {
      const bytes = new Uint8Array(fs.readFileSync(input))
      self.onmessage({
        data: { cmd: 'finalize', sessionId: message.sessionId, decisions: [] },
      })
    }
    if (message.type === 'result' || message.type === 'error') resolveDone(message)
  },
  onmessage: null,
}

await import('../worker.js')

const bytes = new Uint8Array(fs.readFileSync(input))
const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
self.onmessage({
  data: {
    cmd: 'open',
    sessionId: 'sim-1',
    name: path.basename(input),
    bytes: buffer,
    options: { width: 4, height: 3, minLength: 20, mineName: '银星二号煤矿', mineCode: 'hrmyxyk' },
  },
})

const result = await done
if (result.type === 'error') {
  console.log('WORKER ERROR', result.error)
  process.exit(1)
}
console.log('records', result.records.length, 'dwg bytes', result.dwg.byteLength)
const base = path.basename(input).replace(/\.(dwg|dxf)$/i, '')
fs.writeFileSync(path.join(outDir, `${base}-worker.json`), JSON.stringify(result.records, null, 2))
fs.writeFileSync(path.join(outDir, `${base}-worker.dwg`), Buffer.from(result.dwg))
console.log('steps', messages.filter(m => m.type === 'progress').map(m => m.step).join('>'))
console.log('summary', JSON.stringify(result.summary))
