import { loadResult, saveResult, deleteResult, listResults } from './core/result-store.js'

const CSS = `
.lw-page{display:flex;flex-direction:column;gap:var(--spacing-lg);padding:var(--spacing-lg);color:var(--sys-color-text-primary);max-width:900px}
.lw-page h2,.lw-page h3,.lw-page p{margin:0}
.lw-panel{display:flex;flex-direction:column;gap:var(--spacing-sm);padding:var(--spacing-md);border:1px solid var(--sys-color-border-main);border-radius:var(--radius-md);background:var(--sys-color-bg-surface)}
.lw-sub{color:var(--sys-color-text-muted);font-size:var(--fs-body-sm);line-height:1.6}
.lw-warning{border-left:3px solid #b35900;padding-left:12px;line-height:1.6}
.lw-actions{display:flex;align-items:center;gap:var(--spacing-sm);flex-wrap:wrap}
.lw-actions button{padding:var(--spacing-xs) var(--spacing-md);border-radius:var(--radius-sm);border:1px solid var(--sys-color-border-main);background:var(--sys-color-bg-surface);color:var(--sys-color-text-primary);cursor:pointer}
.lw-actions button.primary{background:var(--sys-color-primary,#1f6feb);border-color:transparent;color:#fff}
.lw-actions button:disabled{opacity:.55;cursor:not-allowed}
.lw-error{color:var(--sys-color-error)}
.lw-json{max-height:400px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px}
@media(max-width:760px){.lw-page{padding:var(--spacing-md)}}
`

export const KERNEL_VERSION = '5.9.1'

// Memory only: page navigation may preserve this module, but a host reload will not.
let checkpoint = null

function logFailure(api, event, kind) {
  try {
    const result = api?.logger?.error(event, { operation: 'collect', kind })
    if (result && typeof result.catch === 'function') result.catch(() => {})
  } catch {}
}

function logProgress(api, event, fields) {
  try {
    const result = api?.logger?.info(event, fields)
    if (result && typeof result.catch === 'function') result.catch(() => {})
  } catch {}
}

export default {
  inject: ['vueH', 'pluginApi'],
  data() {
    return {
      filename: '',
      fileSize: 0,
      bytes: null,
      busy: false,
      error: '',
      status: '',
      points: null,
      lanes: null,
      laneReview: null,
      worker: null,
      styleNode: null,
      fileSelection: 0,
      sessionId: '',
      history: [],
      cloudConfigured: false,
      cloudOrigin: '',
      cloudBusy: false,
      cloudStatus: '',
      cloudRecords: null,
      cloudFilename: '',
    }
  },
  mounted() {
    const style = document.createElement('style')
    try {
      style.id = this.pluginApi.metadata.domId('styles')
    } catch {
      style.id = 'cad-inspector-point-styles'
    }
    style.textContent = CSS
    document.head.appendChild(style)
    this.styleNode = style
    this.pluginApi.http.get(this.pluginApi.http.path('/cloud-status')).then(result => {
      this.cloudConfigured = result?.configured === true
      this.cloudOrigin = result?.origin || ''
    }).catch(() => { this.cloudStatus = '云接口状态不可用。' })
    if (checkpoint) {
      Object.assign(this, { filename: checkpoint.filename, fileSize: checkpoint.fileSize, bytes: checkpoint.bytes,
        points: checkpoint.points || null, lanes: checkpoint.lanes || null, laneReview: checkpoint.laneReview || null })
      this.status = checkpoint.points ? '已恢复本次会话中的采集结果。' : `采集已暂停；已保存 ${checkpoint.offset || 0} 个候选的进度，点击继续采集。`
    }
    const selection = this.fileSelection
    listResults().then(items => { this.history = items }).catch(() => {})
    loadResult().then(result => {
      if (!result || checkpoint || this.fileSelection !== selection || this.busy) return
      Object.assign(this, { filename: result.filename, points: result.points, lanes: result.lanes, laneReview: null })
      this.status = '已恢复本机保存的上次采集结果。'
    }).catch(() => {})
  },
  beforeUnmount() {
    this.fileSelection++
    if (this.busy) logProgress(this.pluginApi, 'collect.page_unmount', { operation: 'collect', sessionId: this.sessionId, offset: checkpoint?.offset || 0 })
    if (this.worker && checkpoint) this.status = '采集已暂停。'
    this.worker?.terminate()
    this.worker = null
    this.styleNode?.remove()
  },
  methods: {
    async pickCloudJson(event) {
      const file = event.target.files?.[0]
      event.target.value = ''
      if (!file) return
      this.cloudRecords = null
      this.cloudFilename = ''
      if (file.size > 3 * 1024 * 1024) { this.cloudStatus = 'JSON 文件不能超过 3 MB。'; return }
      try {
        const value = JSON.parse(await file.text())
        if (!Array.isArray(value)) throw new Error('not array')
        this.cloudRecords = value
        this.cloudFilename = file.name
        this.cloudStatus = `已选择 ${value.length} 条记录，推送前将检查字段。`
      } catch { this.cloudStatus = 'JSON 必须是 UTF-8 编码的巷道数组。' }
    },
    async pushCloud() {
      if (this.cloudBusy || this.busy || !this.cloudConfigured) return
      const records = this.cloudRecords ?? this.lanes
      if (!Array.isArray(records) || !records.length) { this.cloudStatus = '没有可推送的巷道。'; return }
      this.cloudBusy = true
      this.cloudStatus = '正在检查巷道数据…'
      let sending = false
      try {
        const check = await this.pluginApi.http.post(this.pluginApi.http.path('/cloud-validate'), { records })
        if (!check?.ok) {
          this.cloudStatus = `未推送：${(check?.issues || ['数据校验失败']).join('；')}${check?.issueCount > 20 ? `；共 ${check.issueCount} 项` : ''}`
          return
        }
        this.cloudStatus = '正在向巷道台账提交数据…'
        sending = true
        const result = await this.pluginApi.http.egress.call('cloud.laneway.create', check.data)
        if (!result?.ok || result.status < 200 || result.status >= 300) this.cloudStatus = `云接口请求失败（HTTP ${Number.isInteger(result?.status) ? result.status : '未知'}），请核查后再操作。`
        else if (result.body && Number(result.body.code) === 200) this.cloudStatus = `云接口返回成功，已提交 ${records.length} 条；请在云端核对。`
        else this.cloudStatus = '请求已返回，但未能确认业务成功，请先在云端核对，勿重复推送。'
      } catch {
        this.cloudStatus = sending ? '请求结果未知，请先在云端核对是否写入，勿重复推送。' : '数据检查失败，未发送到云系统。'
      } finally { this.cloudBusy = false }
    },
    async pickFile(event) {
      const file = event.target.files?.[0]
      event.target.value = ''
      if (!file) return
      const selection = ++this.fileSelection
      checkpoint = null
      this.bytes = null
      this.filename = ''
      this.fileSize = 0
      this.points = null
      this.lanes = null
      this.laneReview = null
      this.status = ''
      this.error = ''
      if (!/\.(dwg|dxf)$/i.test(file.name)) {
        this.error = '请选择 DWG 或 DXF 文件。'
        return
      }
      if (file.size > 80 * 1024 * 1024) {
        this.error = '图纸文件不能超过 80 MB。'
        return
      }
      try {
        const bytes = await file.arrayBuffer()
        if (selection !== this.fileSelection) return
        this.filename = file.name
        this.fileSize = file.size
        this.bytes = bytes
      } catch {
        if (selection === this.fileSelection) this.error = '读取文件失败，请重试。'
      }
    },
    async start() {
      if (!this.bytes || this.busy) return
      this.busy = true
      this.points = null
      this.lanes = null
      this.laneReview = null
      this.error = ''
      this.status = '正在解析图纸…'
      if (!checkpoint || checkpoint.bytes !== this.bytes || checkpoint.points) {
        checkpoint = { filename: this.filename, fileSize: this.fileSize, bytes: this.bytes, offset: 0, decisions: [], used: [], reviewed: 0 }
      }
      const current = checkpoint
      const sessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
      this.sessionId = sessionId
      const startedAt = Date.now()
      logProgress(this.pluginApi, 'collect.start', { operation: 'collect', sessionId, resumedOffset: current.offset })
      const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' })
      this.worker = worker
      worker.onerror = () => { if (this.worker === worker) { logFailure(this.pluginApi, 'collect.worker_error', 'worker'); this.error = '解析进程异常。'; this.busy = false; worker.terminate(); this.worker = null } }
      worker.onmessage = async event => {
        const data = event.data || {}
        if (this.worker !== worker || data.sessionId !== sessionId) return
        if (data.type === 'error') { logFailure(this.pluginApi, 'collect.business_error', 'worker'); this.error = data.error; this.busy = false; worker.terminate(); this.worker = null; return }
        if (data.type === 'lane-candidates') {
          try {
            const approvals = []
            for (const lane of data.lanes) {
              if (this.worker !== worker) return
              if (lane.points.length > 100 || lane.sides.some(side => side.length > 500)) continue
              this.status = `模型正在审查巷道连接：${lane.index + 1}/${data.lanes.length}。`
              const response = await this.pluginApi.http.post(this.pluginApi.http.path('/connect'), { points: lane.points, sides: lane.sides })
              if (this.worker !== worker) return
              if (!response?.ok || !Array.isArray(response.order)) throw new Error('模型连接审查失败。')
              if (response.order.length) approvals.push({ index: lane.index, order: response.order })
            }
            worker.postMessage({ cmd: 'approve-lanes', sessionId, approvals })
          } catch {
            if (this.worker !== worker) return
            logFailure(this.pluginApi, 'collect.connect_error', 'model')
            this.error = '巷道模型审查失败，未生成 JSON；可继续采集重试。'
            this.busy = false; worker.terminate(); this.worker = null
          }
          return
        }
        if (data.type === 'result') { this.points = data.points; this.lanes = data.lanes; this.laneReview = data.laneReview; Object.assign(current, { points: data.points, lanes: data.lanes, laneReview: data.laneReview }); this.status = `采集结束：${data.points.length} 个测点候选，${data.lanes.length} 条双边线巷道候选；复杂区域可能跳过，必须人工核验。`; this.busy = false; worker.terminate(); this.worker = null; logProgress(this.pluginApi, 'collect.complete', { operation: 'collect', sessionId, durationMs: Date.now() - startedAt, pointCount: data.points.length, laneCount: data.lanes.length, skipped: data.summary?.skipped }); saveResult({ filename: this.filename, points: data.points, lanes: data.lanes }).then(() => listResults()).then(items => { this.history = items }).catch(() => { this.error = '结果未能保存到本机，请立即下载 JSON。'; logFailure(this.pluginApi, 'collect.save_error', 'storage') }); return }
        if (data.type !== 'candidates') return
        logProgress(this.pluginApi, 'collect.candidates', { operation: 'collect', sessionId, durationMs: Date.now() - startedAt, candidateCount: data.candidates.length, duplicateCount: data.summary?.duplicates || 0, ambiguousCircleCount: data.summary?.ambiguousCircles || 0, excludedCount: data.summary?.excluded || 0, shaftHintCount: data.summary?.shaftHints || 0, priorityGroupCount: data.summary?.priorityGroups || 0 })
        let httpFailed = false
        try {
          const decisions = current.decisions.slice(), used = new Set(current.used)
          let reviewed = current.reviewed
          for (let offset = current.offset; offset < data.candidates.length; offset += 5) {
            if (this.worker !== worker) return
            const batch = data.candidates.slice(offset, offset + 5)
            const circles = batch.map(c => data.entities[c.circle_id]).map(c => ({ id: c.id, x: c.x, y: c.y, r: c.radius }))
            const ids = new Set(batch.flatMap(c => c.nearby_texts.map(t => t.id)).filter(id => !used.has(id)))
            const texts = [...ids].map(id => data.entities[id]).filter(Boolean).map(t => ({ id: t.id, x: t.x, y: t.y, text: t.text, rotation: t.rotation }))
            const corridors = batch.filter(c => c.corridor).map(c => ({ circleId: c.circle_id, ...c.corridor }))
            if (!texts.length) { current.offset = offset + batch.length; continue }
            this.status = `默认模型采集中：已完成 ${offset}/${data.candidates.length} 个双边线内候选；重复 ${data.summary?.duplicates || 0} 个，未通过边线筛选 ${data.summary?.excluded || 0} 个。`
            let response
            try {
              response = await this.pluginApi.http.post(this.pluginApi.http.path('/collect'), { circles, texts, corridors, sessionId, batchIndex: offset })
            } catch (error) {
              httpFailed = true
              if (this.worker === worker) logFailure(this.pluginApi, 'collect.http_error', 'http')
              throw error
            }
            if (this.worker !== worker) return
            if (!response?.ok) throw new Error(`${response?.code || 'MODEL_FAILED'}：${response?.error || '模型采集失败'}`)
            const nextUsed = new Set(used), nextDecisions = []
            for (const selection of response.selections || []) {
              const candidate = batch.find(c => c.circle_id === selection.circleId)
              const nearby = new Set(candidate?.nearby_texts.map(t => t.id) || [])
              if (!candidate || !nearby.has(selection.nameId) || (selection.elevationId !== null && !nearby.has(selection.elevationId))) continue
              if (nextUsed.has(selection.nameId) || (selection.elevationId !== null && nextUsed.has(selection.elevationId))) throw new Error('模型重复使用文字证据。')
              nextUsed.add(selection.nameId)
              if (selection.elevationId !== null) nextUsed.add(selection.elevationId)
              nextDecisions.push({ candidate_id: selection.circleId, accept: true, name_text_id: selection.nameId, elevation_text_id: selection.elevationId })
            }
            decisions.push(...nextDecisions)
            for (const id of nextUsed) used.add(id)
            reviewed += batch.length
            Object.assign(current, { offset: offset + batch.length, decisions: decisions.slice(), used: [...used], reviewed })
          }
          if (!reviewed) throw new Error('没有找到具有可用文字且通过双边线筛选的候选；复杂或碎片区域可能被跳过。')
          worker.postMessage({ cmd: 'finalize', sessionId, decisions })
        } catch (error) {
          if (this.worker !== worker) return
          if (!httpFailed) logFailure(this.pluginApi, 'collect.business_error', 'collection')
          this.error = `模型采集已暂停：${httpFailed ? '网络请求失败，请重试。' : error?.message || error}；可点击继续采集，未生成 JSON。`
          this.busy = false; worker.terminate(); this.worker = null
        }
      }
      const bytes = this.bytes.slice(0)
      worker.postMessage({ cmd: 'open', sessionId, name: this.filename, bytes }, [bytes])
    },
    exportJson() {
      const output = this.lanes
      if (this.busy || !Array.isArray(output)) return
      const text = JSON.stringify(output, null, 2)
      const url = URL.createObjectURL(new Blob([text], { type: 'application/json;charset=utf-8' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `${this.filename.replace(/\.(dwg|dxf)$/i, '')}-巷道候选.json`
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 2000)
    },
    async clearSavedResult() {
      try { await deleteResult(); this.status = '已删除最新结果的自动恢复记录；历史记录仍保留。' }
      catch { this.error = '删除本机结果失败。' }
    },
    showHistory(item) {
      if (this.busy) return
      this.filename = item.filename; this.points = item.points; this.lanes = item.lanes
      this.status = '已打开本机历史结果。'
    },
  },
  render() {
    const h = this.vueH
    return h('main', { class: 'lw-page' }, [
      h('header', { class: 'lw-panel' }, [
        h('h2', `图纸测点采集 v${KERNEL_VERSION}`),
        h('p', { class: 'lw-sub' }, '上传 DWG 或 DXF 图纸，通过默认模型识别测点，仅输出双边线之间的巷道候选 JSON。复杂或不确定区域可能跳过。'),
        h('p', { class: 'lw-sub' }, '井口文字仅作待核实的优先提示，优先处理可识别的双边线候选；采集结果须人工核验。'),
        h('p', { class: 'lw-warning' }, '图纸中的候选信息可能包含敏感数据，处理时将发送至默认模型；请确认拥有相应权限后再使用。'),
      ]),
      h('section', { class: 'lw-panel' }, [
        h('h3', '推送巷道台账'),
        h('p', { class: 'lw-sub' }, this.cloudConfigured ? `目标：${this.cloudOrigin}，批量新增巷道。重复提交可能产生重复数据。` : '未配置云端地址或令牌；请先配置并重启插件。'),
        h('p', { class: 'lw-sub' }, '默认推送当前采集结果；也可选择已人工核验并补齐字段的 UTF-8 JSON。缺失字段不会自动填值。'),
        h('div', { class: 'lw-actions' }, [
          h('input', { type: 'file', accept: '.json,application/json', disabled: this.cloudBusy, onChange: this.pickCloudJson }),
          this.cloudFilename ? h('span', `已选：${this.cloudFilename}`) : null,
          this.cloudFilename ? h('button', { disabled: this.cloudBusy, onClick: () => { this.cloudRecords = null; this.cloudFilename = ''; this.cloudStatus = '已切换为当前采集结果。' } }, '使用当前结果') : null,
          h('button', { disabled: this.cloudBusy || this.busy || !this.cloudConfigured || !(this.cloudRecords?.length || this.lanes?.length), onClick: this.pushCloud }, this.cloudBusy ? '处理中…' : '推送至巷道台账'),
        ]),
        this.cloudStatus ? h('p', { role: 'status', class: 'lw-sub' }, this.cloudStatus) : null,
      ]),
      h('section', { class: 'lw-panel' }, [
        h('h3', `本机输出历史（${this.history.length}）`),
        ...this.history.map(item => h('div', { class: 'lw-actions' }, [
          h('span', `${new Date(item.savedAt).toLocaleString()} · ${item.filename} · ${item.lanes?.length || 0} 条巷道`),
          h('button', { disabled: this.busy, onClick: () => this.showHistory(item) }, '查看及下载'),
        ])),
      ]),
      h('section', { class: 'lw-panel' }, [
        h('h3', '原始图纸'),
        h('div', { class: 'lw-actions' }, [
          h('input', { type: 'file', accept: '.dwg,.dxf', disabled: this.busy, onChange: this.pickFile }),
          h('span', { class: 'lw-sub' }, this.filename ? `${this.filename}（${(this.fileSize / 1024 / 1024).toFixed(1)} MB）` : '支持 DWG、DXF，单文件不超过 80 MB'),
        ]),
        h('div', { class: 'lw-actions' }, [
          h('button', { class: 'primary', disabled: this.busy || !this.bytes, onClick: this.start }, this.busy ? '采集中…' : checkpoint && !checkpoint.points && checkpoint.bytes === this.bytes ? '继续采集' : '开始采集'),
        ]),
        h('p', { class: 'lw-sub' }, '切换页面会暂停采集；返回后可在模块仍驻留时继续。完成的结果和历史保存在本机浏览器存储中，包含坐标及采集数据；图纸和采集中进度不持久保存。'),
        h('div', { class: 'lw-actions' }, [h('button', { onClick: this.clearSavedResult }, '删除最新结果自动恢复记录')]),
        this.status ? h('p', { class: 'lw-sub', role: 'status' }, this.status) : null,
        this.error ? h('p', { class: 'lw-error', role: 'alert' }, this.error) : null,
      ]),
      Array.isArray(this.points) ? h('section', { class: 'lw-panel' }, [
        h('h3', `采集结果（${this.points.length} 个测点）`),
        h('p', { class: 'lw-sub' }, `双边线巷道候选 ${this.lanes?.length || 0} 条；无明确顶底板标注的标高按底板推定，巷高未能从图纸确认时默认 3。估算及默认值均标记来源，点归属、边线和标高须人工核验。`),
        h('div', { class: 'lw-actions' }, [
          h('button', { class: 'primary', disabled: this.busy || !this.lanes?.length, onClick: () => this.exportJson() }, '下载巷道 JSON'),
        ]),
        h('pre', { class: 'lw-json' }, JSON.stringify(this.lanes, null, 2)),
      ]) : null,
    ])
  },
}
