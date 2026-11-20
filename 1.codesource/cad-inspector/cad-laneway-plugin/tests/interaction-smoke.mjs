/** 交互冒烟测试：模拟“选文件 → 开始自动成图 → 大模型复核 → 生成结果”的完整点击链路。 */
const h = (tag, props, children) => {
  if (typeof props === 'string' || typeof props === 'number' || Array.isArray(props)) {
    children = props
    props = null
  }
  return { tag, props, children }
}

const { default: component } = await import('../index.js')

class FakeWorker {
  constructor() {
    FakeWorker.last = this
  }
  postMessage(message) {
    if (message.cmd === 'open') {
      setTimeout(() => {
        this.onmessage?.({
          data: {
            type: 'candidates',
            sessionId: message.sessionId,
            candidates: [{ i: 0, name: '轨道石门', elev: 850, layer: '巷道', len: 120, width: 4, x: 1, y: 2 }],
            summary: { lanes: 1, named: 1, withElevation: 1, totalLength: 120, medianWidth: 4, elapsedMs: 10, elevationMin: 850, elevationMax: 850, layers: ['巷道'] },
            warnings: [],
          },
        })
      }, 0)
    }
    if (message.cmd === 'finalize') {
      setTimeout(() => {
        this.onmessage?.({
          data: {
            type: 'result',
            sessionId: message.sessionId,
            records: [
              {
                laneway_name: '+850m轨道石门',
                laneway_code: 'abc1234',
                laneway_width: 4,
                traverse_point_count: 2,
                traverse_point_array: [{ x: 1, y: 2, z_top: 853, z_bottom: 850 }],
                border_line_points: [[{ x: 0, y: 0 }], [{ x: 1, y: 1 }]],
              },
            ],
            dwg: new Uint8Array([1, 2, 3]),
            summary: { lanes: 1, named: 1, withElevation: 1, totalLength: 120, medianWidth: 4, elapsedMs: 12, elevationMin: 850, elevationMax: 850, layers: ['巷道'], reviewed: 1 },
          },
        })
      }, 0)
    }
  }
  terminate() {}
}
globalThis.Worker = FakeWorker
globalThis.Blob = class { constructor(parts, opts) { this.parts = parts; this.type = opts?.type } }
globalThis.URL.createObjectURL = () => 'blob:test'
globalThis.URL.revokeObjectURL = () => {}
const downloads = []
globalThis.document = {
  createElement: () => ({ set href(v) {}, set download(v) { downloads.push(v) }, click() {} }),
}

const logged = []
const pluginApi = {
  metadata: { domId: s => s },
  logger: {
    debug: (e, f) => logged.push(['debug', e, f]),
    info: (e, f) => logged.push(['info', e, f]),
    warn: (e, f) => logged.push(['warn', e, f]),
    error: (e, f) => logged.push(['error', e, f]),
  },
  http: { path: p => p, post: async () => ({ ok: true, decisions: [{ i: 0, name: '1131006轨道石门' }] }) },
}

const ctx = { ...component.data(), vueH: h, pluginApi }
for (const [name, fn] of Object.entries(component.methods)) ctx[name] = fn.bind(ctx)

// 1. 选文件
const buffer = new ArrayBuffer(16)
ctx.bytes = buffer
ctx.filename = '银二井上下对照图.dwg'
ctx.fileSize = 5.7 * 1024 * 1024

// 2. 点击开始
await ctx.start()
console.log('after start: busy', ctx.busy, 'step', ctx.step, 'error', JSON.stringify(ctx.error))

// 3. 等待 worker 异步回调
await new Promise(r => setTimeout(r, 60))
console.log('after flow: busy', ctx.busy, 'step', ctx.step, 'records', ctx.records.length, 'dwg bytes', ctx.dwg?.byteLength)
console.log('summary lanes', ctx.summary?.lanes, 'layers filled', ctx.options.layers)
console.log('errors in state:', ctx.error || '(none)')
console.log('log events:', logged.map(l => l[1]).join(' | '))
if (ctx.error || ctx.records.length !== 1 || !ctx.dwg) {
  console.log('INTERACTION FAILED')
  process.exit(1)
}

// 4. 再次点击开始（验证 bytes 未被清空）
await ctx.start()
await new Promise(r => setTimeout(r, 60))
console.log('second run ok, records', ctx.records.length, 'error', ctx.error || '(none)')
if (ctx.error || ctx.records.length !== 1) process.exit(1)
console.log('downloads:', downloads.join(' | '))
console.log('INTERACTION OK')
