// CAD 图样标准化审查 — 全页面插件前端
// 通过 pluginApi.http 访问插件命名空间后端；样式使用宿主设计变量，自动适配浅色/深色主题。

const CSS = `
.cad-root {
  --cad-critical: var(--sys-color-error, #dc2626);
  --cad-critical-bg: var(--sys-color-error-light, #fee2e2);
  --cad-major: var(--sys-color-warning, #d97706);
  --cad-major-bg: var(--sys-color-warning-light, #fef3c7);
  --cad-minor: var(--sys-color-info, #0284c7);
  --cad-minor-bg: var(--sys-color-info-light, #f0f9ff);
  --cad-pass: var(--sys-color-success, #059669);
  --cad-pass-bg: var(--sys-color-success-light, #ecfdf5);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg, 16px);
  padding: var(--spacing-md, 12px) var(--spacing-lg, 16px) var(--spacing-xl, 28px);
  color: var(--sys-color-text-primary, #0f172a);
  height: 100vh;
  min-height: 0;
  overflow: hidden;
  box-sizing: border-box;
}
.cad-root * { box-sizing: border-box; }
.cad-content { flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
.cad-header { display: flex; flex-direction: column; gap: 6px; }
.cad-title-row { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.cad-title { margin: 0; font-size: var(--fs-h1, 24px); line-height: var(--lh-h1, 32px); font-weight: var(--fw-h1, 600); letter-spacing: var(--ls-h1, 0); }
.cad-version { color: var(--sys-color-text-muted, #64748b); font-size: 12px; }
.cad-subtitle { margin: 0; color: var(--sys-color-text-muted, #64748b); font-size: var(--fs-body, 14px); line-height: 1.6; max-width: 900px; }
.cad-tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--sys-color-border-subtle, #e2e8f0); flex-wrap: wrap; }
.cad-tab { appearance: none; border: none; background: transparent; color: var(--sys-color-text-muted, #64748b); padding: 8px 14px; border-radius: 8px 8px 0 0; cursor: pointer; font-size: 14px; font-weight: 500; border-bottom: 2px solid transparent; margin-bottom: -1px; }
.cad-tab:hover { background: var(--sys-color-bg-hover, rgba(15,23,42,.05)); color: var(--sys-color-text-primary, #0f172a); }
.cad-tab.is-active { color: var(--sys-color-primary, #2563eb); border-bottom-color: var(--sys-color-primary, #2563eb); background: var(--sys-color-primary-light, #eff6ff); }
.cad-tab:focus-visible { outline: 2px solid var(--sys-color-focus-border, #2563eb); outline-offset: 2px; }
.cad-panel { display: flex; flex-direction: column; gap: var(--spacing-md, 12px); }
.cad-card { background: var(--sys-color-bg-surface, #fff); border: 1px solid var(--sys-color-border-subtle, #e2e8f0); border-radius: 12px; padding: 16px; overflow-x: auto; }
.cad-card-tight { padding: 12px 14px; }
.cad-card-title { margin: 0 0 10px; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
.cad-muted { color: var(--sys-color-text-muted, #64748b); font-size: 12px; line-height: 1.6; }
.cad-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.cad-row-between { display: flex; gap: 12px; align-items: center; justify-content: space-between; flex-wrap: wrap; }
.cad-grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.cad-grid-log { display: grid; gap: 12px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
@media (max-width: 860px) { .cad-grid-log { grid-template-columns: 1fr; } }
.cad-btn { appearance: none; border: 1px solid var(--sys-color-border-main, #cbd5e1); background: var(--sys-color-bg-surface, #fff); color: var(--sys-color-text-primary, #0f172a); padding: 7px 14px; border-radius: 8px; font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; line-height: 1.2; }
.cad-btn:hover { background: var(--sys-color-bg-hover, rgba(15,23,42,.05)); }
.cad-btn:disabled { opacity: .5; cursor: not-allowed; }
.cad-btn-primary { background: var(--sys-color-primary, #2563eb); border-color: var(--sys-color-primary, #2563eb); color: var(--sys-color-text-on-primary, #fff); }
.cad-btn-primary:hover { background: var(--sys-color-primary-hover, #1d4ed8); }
.cad-btn-danger { color: var(--cad-critical); border-color: var(--sys-color-error-border, #fca5a5); background: var(--cad-critical-bg); }
.cad-btn-sm { padding: 4px 9px; font-size: 12px; border-radius: 6px; }
.cad-btn-ghost { border-color: transparent; background: transparent; color: var(--sys-color-text-muted, #64748b); }
.cad-btn-ghost:hover { color: var(--sys-color-text-primary, #0f172a); background: var(--sys-color-bg-hover, rgba(15,23,42,.05)); }
.cad-drop { border: 1.5px dashed var(--sys-color-border-main, #cbd5e1); border-radius: 12px; padding: 28px 18px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px; background: var(--sys-color-bg-subtle, #f1f5f9); transition: border-color .15s, background .15s; }
.cad-drop.is-over { border-color: var(--sys-color-primary, #2563eb); background: var(--sys-color-primary-light, #eff6ff); }
.cad-drop-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: var(--sys-color-primary-light, #eff6ff); color: var(--sys-color-primary, #2563eb); }
.cad-file { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border: 1px solid var(--sys-color-border-subtle, #e2e8f0); border-radius: 10px; background: var(--sys-color-bg-surface, #fff); }
.cad-file-name { font-size: 13px; font-weight: 500; word-break: break-all; }
.cad-switch { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; font-size: 13px; border: 0; background: transparent; padding: 0; color: inherit; font: inherit; }
.cad-switch-track { width: 36px; height: 20px; border-radius: 999px; background: var(--sys-switch-off, rgba(15,23,42,.12)); position: relative; transition: background .15s; flex: none; }
.cad-switch-track::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform .15s; box-shadow: 0 1px 2px rgba(0,0,0,.2); }
.cad-switch.is-on .cad-switch-track { background: var(--sys-color-primary, #2563eb); }
.cad-switch.is-on .cad-switch-track::after { transform: translateX(16px); }
.cad-switch.is-disabled { opacity: .55; cursor: not-allowed; }
.cad-progress { height: 6px; border-radius: 999px; background: var(--sys-color-bg-subtle, #f1f5f9); overflow: hidden; }
.cad-progress-bar { height: 100%; border-radius: 999px; background: var(--sys-color-primary, #2563eb); transition: width .2s ease; }
.cad-alert { border-radius: 10px; padding: 10px 12px; font-size: 13px; line-height: 1.6; border: 1px solid var(--sys-color-border-subtle, #e2e8f0); background: var(--sys-color-bg-subtle, #f1f5f9); }
.cad-alert-error { border-color: var(--sys-color-error-border, #fca5a5); background: var(--cad-critical-bg); color: var(--sys-color-error-strong, #b91c1c); }
.cad-alert-warn { border-color: var(--sys-color-warning-border, #fcd34d); background: var(--cad-major-bg); color: var(--sys-color-warning-strong, #b45309); }
.cad-alert-ok { border-color: var(--sys-color-success-border, #a7f3d0); background: var(--cad-pass-bg); color: var(--sys-color-success-strong, #047857); }
.cad-verdict { display: flex; gap: 16px; align-items: flex-start; padding: 18px; border-radius: 12px; border: 1px solid var(--sys-color-border-subtle, #e2e8f0); background: var(--sys-color-bg-surface, #fff); }
.cad-verdict.is-fail { border-color: var(--sys-color-error-border, #fca5a5); background: linear-gradient(180deg, var(--cad-critical-bg), var(--sys-color-bg-surface, #fff)); }
.cad-verdict.is-review { border-color: var(--sys-color-warning-border, #fcd34d); background: linear-gradient(180deg, var(--cad-major-bg), var(--sys-color-bg-surface, #fff)); }
.cad-verdict.is-pass { border-color: var(--sys-color-success-border, #a7f3d0); background: linear-gradient(180deg, var(--cad-pass-bg), var(--sys-color-bg-surface, #fff)); }
.cad-verdict-mark { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; flex: none; }
.cad-verdict.is-fail .cad-verdict-mark { background: var(--cad-critical-bg); color: var(--cad-critical); }
.cad-verdict.is-review .cad-verdict-mark { background: var(--cad-major-bg); color: var(--cad-major); }
.cad-verdict.is-pass .cad-verdict-mark { background: var(--cad-pass-bg); color: var(--cad-pass); }
.cad-verdict-title { font-size: 18px; font-weight: 650; margin: 0 0 4px; }
.cad-metrics { display: grid; gap: 10px; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); }
.cad-metric { border: 1px solid var(--sys-color-border-subtle, #e2e8f0); border-radius: 10px; padding: 10px 12px; background: var(--sys-color-bg-surface, #fff); }
.cad-metric-value { font-size: 22px; font-weight: 650; line-height: 1.2; }
.cad-metric-label { font-size: 12px; color: var(--sys-color-text-muted, #64748b); margin-top: 2px; }
.cad-chip { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; line-height: 18px; border: 1px solid transparent; white-space: nowrap; }
.cad-chip-关键 { color: var(--cad-critical); background: var(--cad-critical-bg); border-color: var(--sys-color-error-border, #fca5a5); }
.cad-chip-严重 { color: var(--cad-major); background: var(--cad-major-bg); border-color: var(--sys-color-warning-border, #fcd34d); }
.cad-chip-一般 { color: var(--cad-minor); background: var(--cad-minor-bg); border-color: var(--sys-color-info-border, #7dd3fc); }
.cad-chip-提示 { color: var(--sys-color-text-muted, #64748b); background: var(--sys-color-bg-subtle, #f1f5f9); border-color: var(--sys-color-border-subtle, #e2e8f0); }
.cad-chip-pass { color: var(--cad-pass); background: var(--cad-pass-bg); border-color: var(--sys-color-success-border, #a7f3d0); }
.cad-chip-plain { color: var(--sys-color-text-secondary, #334155); background: var(--sys-color-bg-subtle, #f1f5f9); border-color: var(--sys-color-border-subtle, #e2e8f0); }
.cad-filters { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.cad-input, .cad-select { font-family: inherit; height: 32px; border: 1px solid var(--sys-color-border-main, #cbd5e1); border-radius: 7px; background: var(--sys-color-bg-surface, #fff); color: var(--sys-color-text-primary, #0f172a); padding: 0 9px; font-size: 13px; }
.cad-input:focus, .cad-select:focus { outline: 2px solid var(--sys-color-focus-ring, rgba(37,99,235,.2)); border-color: var(--sys-color-primary, #2563eb); }
.cad-input-search { min-width: 200px; flex: 1; max-width: 320px; }
.cad-finding { border: 1px solid var(--sys-color-border-subtle, #e2e8f0); border-radius: 10px; background: var(--sys-color-bg-surface, #fff); overflow: hidden; }
.cad-finding + .cad-finding { margin-top: 10px; }
.cad-finding-head { display: flex; gap: 10px; align-items: flex-start; padding: 12px 14px; cursor: pointer; }
.cad-finding-head:hover { background: var(--sys-color-bg-hover, rgba(15,23,42,.045)); }
.cad-finding-main { flex: 1; min-width: 0; }
.cad-finding-title { font-size: 14px; font-weight: 600; line-height: 1.45; margin: 4px 0 0; word-break: break-word; }
.cad-finding-meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 8px 14px; padding: 0 14px 12px; }
.cad-field-label { font-size: 11px; color: var(--sys-color-text-muted, #64748b); margin-bottom: 2px; }
.cad-field-value { font-size: 12.5px; line-height: 1.55; word-break: break-word; }
.cad-finding-body { border-top: 1px dashed var(--sys-color-border-subtle, #e2e8f0); padding: 12px 14px; display: flex; flex-direction: column; gap: 10px; background: var(--sys-color-bg-subtle, #f1f5f9); }
.cad-kv { display: grid; grid-template-columns: 96px 1fr; gap: 6px 10px; font-size: 12.5px; line-height: 1.6; }
.cad-kv dt { color: var(--sys-color-text-muted, #64748b); }
.cad-kv dd { margin: 0; word-break: break-word; }
.cad-code { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 11.5px; background: var(--sys-color-bg-surface, #fff); border: 1px solid var(--sys-color-border-subtle, #e2e8f0); border-radius: 6px; padding: 1px 5px; }
.cad-pre { margin: 0; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 11.5px; line-height: 1.55; background: var(--sys-color-bg-surface, #fff); border: 1px solid var(--sys-color-border-subtle, #e2e8f0); border-radius: 8px; padding: 10px; overflow: auto; max-height: 260px; white-space: pre-wrap; word-break: break-word; }
.cad-rule { border: 1px solid var(--sys-color-border-subtle, #e2e8f0); border-radius: 10px; background: var(--sys-color-bg-surface, #fff); padding: 14px; display: flex; flex-direction: column; gap: 8px; }
.cad-rule.is-off { opacity: .62; }
.cad-rule-head { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.cad-rule-id { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-weight: 700; color: var(--sys-color-primary, #2563eb); }
.cad-rule-name { font-weight: 600; font-size: 14px; }
.cad-rule-logic { font-size: 12.5px; line-height: 1.65; color: var(--sys-color-text-secondary, #334155); }
.cad-list { margin: 0; padding-left: 18px; font-size: 12px; line-height: 1.7; color: var(--sys-color-text-muted, #64748b); }
.cad-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
.cad-table th { text-align: left; font-weight: 600; color: var(--sys-color-text-muted, #64748b); padding: 8px 10px; border-bottom: 1px solid var(--sys-color-border-subtle, #e2e8f0); white-space: nowrap; }
.cad-table td { padding: 8px 10px; border-bottom: 1px solid var(--sys-color-border-soft, #f1f5f9); vertical-align: top; }
.cad-table tr:last-child td { border-bottom: none; }
.cad-table tbody tr:hover { background: var(--sys-color-bg-hover, rgba(15,23,42,.045)); }
.cad-link { color: var(--sys-color-primary, #2563eb); cursor: pointer; text-decoration: none; }
.cad-link:hover { text-decoration: underline; }
.cad-toast { position: fixed; right: 20px; bottom: 20px; z-index: 9999; background: var(--sys-color-bg-surface, #fff); border: 1px solid var(--sys-color-border-main, #cbd5e1); border-left: 4px solid var(--sys-color-primary, #2563eb); border-radius: 10px; padding: 10px 14px; font-size: 13px; box-shadow: 0 10px 30px rgba(15, 23, 42, .18); max-width: 360px; }
.cad-toast.is-error { border-left-color: var(--cad-critical); }
.cad-toast.is-success { border-left-color: var(--cad-pass); }
.cad-empty { padding: 24px; text-align: center; color: var(--sys-color-text-muted, #64748b); font-size: 13px; border: 1px dashed var(--sys-color-border-main, #cbd5e1); border-radius: 10px; }
.cad-split { display: grid; gap: 12px; grid-template-columns: minmax(0, 1.15fr) minmax(280px, .85fr); }
@media (max-width: 900px) { .cad-split { grid-template-columns: 1fr; } }
.cad-llm { border: 1px solid var(--sys-color-border-subtle, #e2e8f0); border-radius: 10px; padding: 12px 14px; background: var(--sys-color-bg-subtle, #f1f5f9); font-size: 12.5px; line-height: 1.65; }
.cad-callout { border-left: 3px solid var(--sys-color-primary, #2563eb); padding: 6px 10px; background: var(--sys-color-primary-light, #eff6ff); border-radius: 0 6px 6px 0; font-size: 12.5px; line-height: 1.6; }
.cad-sep { height: 1px; background: var(--sys-color-border-subtle, #e2e8f0); margin: 2px 0; }
.cad-num { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
.cad-source-layout { display: grid; grid-template-columns: minmax(180px, 260px) minmax(0, 1fr); gap: 12px; align-items: start; }
.cad-source-list { display: flex; flex-direction: column; gap: 6px; }
.cad-source-item { width: 100%; text-align: left; justify-content: flex-start; overflow-wrap: anywhere; }
.cad-source-item.is-active { border-color: var(--sys-color-primary, #2563eb); background: var(--sys-color-primary-light, #eff6ff); }
.cad-source-editor { width: 100%; min-height: 240px; resize: vertical; height: auto; padding: 10px; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; line-height: 1.5; }
@media (max-width: 700px) { .cad-source-layout { grid-template-columns: 1fr; } }
`

const TABS = [
  { id: 'review', label: '图纸审查' },
  { id: 'rules', label: '规则库' },
  { id: 'libraries', label: '标准库' },
  { id: 'collections', label: '标准集合' },
  { id: 'history', label: '审查记录' },
  { id: 'logs', label: '本机日志' },
  { id: 'settings', label: '设置' },
]

const SEVERITIES = ['全部', '关键', '严重', '一般', '提示']
const CHUNK_BYTES = 40 * 1024
const SESSION_KEY = 'cad-reviewer-session-v1'
const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000

export default {
  name: 'CadStandardReviewer',
  inject: ['pluginApi', 'vueH'],

  data() {
    return {
      tab: 'review',
      booting: true,
      bootError: '',
      health: null,
      catalog: null,
      settings: null,
      draft: null,
      file: null,
      fileBytes: null,
      batchFiles: [],
      batchResults: [],
      batchRunning: false,
      dragOver: false,
      running: false,
      progress: { percent: 0, phase: '' },
      error: '',
      result: null,
      historyDetail: null,
      filterSeverity: '全部',
      filterRule: '全部',
      keyword: '',
      expanded: {},
      showEvidence: {},
      history: [],
      logs: [],
      logsLoading: false,
      logLocations: null,
      logPaths: null,
      ruleFiles: [],
      ruleSummary: null,
      ruleUploading: false,
      ruleWarnings: [],
      libraries: [],
      librarySummary: null,
      libraryUploading: false,
      libraryWarnings: [],
      sources: [],
      collections: [],
      collectionName: '',
      collectionRuleFiles: [],
      collectionSourceIds: [],
      selectedCollectionId: '',
      selectedCollectionVersion: null,
      collectionLoading: false,
      collectionSaving: false,
      collectionEditingId: '',
      collectionEditingBase: null,
      collectionLoadError: '',
      collectionFormError: '',
      expandedCollectionIds: {},
      source: null,
      sourceLoading: false,
      sourceBusy: false,
      sourceError: '',
      sourceDraft: '',
      sourceSavedDraft: '',
      sourceStatusError: '',
      sourcePreviewUnderstanding: null,
      restored: false,
      restoredAt: null,
      historyLoading: false,
      saving: false,
      toast: null,
      toastTimer: null,
    }
  },

  computed: {
    version() {
      return this.pluginApi?.metadata?.version || '1.0.0'
    },
    llmAvailable() {
      return Boolean(this.health?.capabilities?.llm)
    },
    dwgAvailable() {
      return Boolean(this.health?.capabilities?.dwg)
    },
    activeRuleFileCount() {
      return (this.ruleFiles || []).filter(item => item.active).length
    },
    enabledRules() {
      return new Set(this.draft?.enabledRules || [])
    },
    filteredFindings() {
      const source = this.currentReview?.findings || []
      const keyword = this.keyword.trim()
      return source.filter(item => {
        if (this.filterSeverity !== '全部' && item.severity !== this.filterSeverity) return false
        if (this.filterRule !== '全部' && item.ruleId !== this.filterRule) return false
        if (!keyword) return true
        return `${item.title} ${item.detail} ${item.suggestion} ${item.ruleId}`.includes(keyword)
      })
    },
    ruleOptions() {
      return this.catalog?.rules?.map(rule => ({ value: rule.id, label: `${rule.id} ${rule.name}` })) || []
    },
    currentReview() {
      return this.historyDetail?.result || this.result
    },
  },

  mounted() {
    const style = document.createElement('style')
    style.id = 'cad-standard-reviewer-css'
    style.textContent = CSS
    document.head.appendChild(style)
    this.bootstrap()
  },

  beforeUnmount() {
    document.getElementById('cad-standard-reviewer-css')?.remove()
    if (this.toastTimer) clearTimeout(this.toastTimer)
    this.saveSession()
  },

  errorCaptured(error, _instance, info) {
    this.logVueError(error, info)
  },

  methods: {
    logVueError(error, info) {
    const name = typeof error?.name === 'string' && /^[A-Za-z]+Error$/.test(error.name) ? error.name : 'Error'
    const frame = typeof error?.stack === 'string' ? error.stack.match(/index\.js:(\d+):(\d+)/) : null
    const phase = String(info || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'unknown'
    this.logEvent('error', 'plugin.vue.error', { operation: 'ui.error', errorCode: 'PLUGIN_UI_ERROR', reason: name, kind: phase, ...(frame ? { state: `index.${frame[1]}.${frame[2]}` } : {}) })
    },
    url(suffix) {
      return this.pluginApi.http.path(suffix)
    },

    newOperationId(prefix) {
      try {
        return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
      } catch {
        return `${prefix}-${Date.now().toString(36)}`
      }
    },

    logEvent(level, event, fields) {
      try {
        const logger = this.pluginApi?.logger
        if (logger && typeof logger[level] === 'function') logger[level](event, fields || {})
      } catch {
        // 诊断日志失败不得影响业务
      }
    },

    async saveSession() {
      try {
        if (!this.pluginApi?.storage?.set) return
        if (!this.result && !this.file) {
          await this.clearSession()
          return
        }
        const payload = {
          version: 1,
          savedAt: new Date().toISOString(),
          tab: this.tab,
          result: this.result || null,
          historyDetail: this.historyDetail || null,
          file: this.file
            ? { name: this.file.name, size: this.file.size, lastModified: this.file.lastModified }
            : null,
          filters: {
            filterSeverity: this.filterSeverity,
            filterRule: this.filterRule,
            keyword: this.keyword,
          },
        }
        const saved = await this.pluginApi.storage.set(SESSION_KEY, payload)
        if (saved === false) {
          this.logEvent('warn', 'plugin.session.save_rejected', { operation: 'session.save', errorCode: 'STORAGE_REJECTED' })
        }
      } catch {
        this.logEvent('warn', 'plugin.session.save_failed', { operation: 'session.save', errorCode: 'STORAGE_FAILED' })
      }
    },

    async restoreSession() {
      try {
        if (!this.pluginApi?.storage?.get) return false
        const stored = await this.pluginApi.storage.get(SESSION_KEY)
        if (!stored || stored.version !== 1) return false
        const savedAt = Date.parse(stored.savedAt || '')
        if (Number.isFinite(savedAt) && Date.now() - savedAt > SESSION_MAX_AGE_MS) {
          await this.clearSession()
          return false
        }
        if (stored.tab && TABS.some(item => item.id === stored.tab)) this.tab = stored.tab
        if (stored.historyDetail) {
          this.historyDetail = stored.historyDetail
          if (!this.result && stored.historyDetail.result) this.result = stored.historyDetail.result
        }
        if (stored.result) {
          this.result = stored.result
          this.file = stored.file
            ? { name: stored.file.name, size: stored.file.size, lastModified: stored.file.lastModified }
            : null
          this.fileBytes = null
          this.restored = true
          this.restoredAt = stored.savedAt || null
        } else if (stored.file) {
          this.file = { ...stored.file }
          this.fileBytes = null
        }
        if (stored.filters) {
          this.filterSeverity = stored.filters.filterSeverity || '全部'
          this.filterRule = stored.filters.filterRule || '全部'
          this.keyword = stored.filters.keyword || ''
        }
        return Boolean(stored.result)
      } catch {
        return false
      }
    },

    async clearSession() {
      try {
        if (this.pluginApi?.storage?.remove) await this.pluginApi.storage.remove(SESSION_KEY)
      } catch {
        // 清理失败不影响业务
      }
    },

    async tryRestoreLatestReview() {
      if (this.result || this.historyDetail || !this.file || !this.history?.length) return
      const latest = this.history.find(item => item.fileName === this.file.name)
      if (!latest) return
      const createdAt = Date.parse(latest.createdAt || '')
      if (!Number.isFinite(createdAt) || Date.now() - createdAt > 30 * 60 * 1000) return
      try {
        const response = await this.pluginApi.http.get(this.url(`/reviews/${latest.id}`))
        if (!response?.ok || !response.review?.result) return
        this.result = response.review.result
        this.restored = true
        this.restoredAt = latest.createdAt
        this.historyDetail = null
        await this.saveSession()
      } catch {
        // 读取失败时保留历史列表入口
      }
    },

    async bootstrap() {
      this.booting = true
      this.bootError = ''
      const operationId = this.newOperationId('boot')
      const started = performance.now()
      this.logEvent('info', 'plugin.boot.started', { operation: 'boot', operationId })
      try {
        await this.restoreSession()
        const [health, rules, settingsResponse, librariesResponse] = await Promise.all([
          this.pluginApi.http.get(this.url('/health')),
          this.pluginApi.http.get(this.url('/rules')),
          this.pluginApi.http.get(this.url('/settings')),
          this.pluginApi.http.get(this.url('/libraries')),
        ])
        if (!health?.ok) throw new Error(health?.error?.message || '无法读取插件状态')
        this.health = health
        this.catalog = rules?.catalog || health.catalog
        this.ruleFiles = rules?.files || health.ruleFiles?.files || []
        this.ruleSummary = rules?.summary || health.ruleFiles || null
        this.libraries = librariesResponse?.files || rules?.libraries || []
        this.librarySummary = librariesResponse?.summary || rules?.librarySummary || health.libraries || null
        this.settings = settingsResponse?.settings || rules || null
        this.draft = this.cloneSettings(this.settings)
        await Promise.all([this.refreshHistory(), this.refreshLogs(), this.refreshCollections()])
        await this.tryRestoreLatestReview()
        if (this.tab === 'collections') await this.loadCollectionInputs()
        this.logEvent('info', 'plugin.boot.completed', {
          operation: 'boot',
          operationId,
          elapsedMs: Math.round(performance.now() - started),
        })
      } catch (error) {
        this.bootError = this.errorMessage(error)
        this.logEvent('error', 'plugin.boot.failed', { operation: 'boot', operationId, errorCode: 'BOOT_FAILED' })
      } finally {
        this.booting = false
      }
    },

    cloneSettings(settings) {
      const source = settings || {}
      return {
        enabledRules: Array.isArray(source.enabledRules) ? [...source.enabledRules] : this.catalog?.rules?.map(r => r.id) || [],
        thresholds: {
          frameToleranceMm: source.thresholds?.frameToleranceMm ?? 1,
          scaleTolerancePct: source.thresholds?.scaleTolerancePct ?? 1,
          lineWidthToleranceMm: source.thresholds?.lineWidthToleranceMm ?? 0.1,
          titleNameMinHeight: source.thresholds?.titleNameMinHeight ?? 5,
          techRequirementMinHeight: source.thresholds?.techRequirementMinHeight ?? 3.5,
        },
        retentionDays: source.retentionDays ?? 90,
        maxReviews: source.maxReviews ?? 200,
      }
    },

    errorMessage(error) {
      if (!error) return '未知错误'
      if (typeof error === 'string') return error
      if (error.error?.message) return error.error.message
      if (error.message) return error.message
      return String(error)
    },

    notify(message, type = 'success') {
      const text = String(message || '')
      if (this.pluginApi?.showToast) {
        try {
          this.pluginApi.showToast(text, type)
          return
        } catch {
          // 使用内部提示
        }
      }
      this.toast = { message: text, type }
      if (this.toastTimer) clearTimeout(this.toastTimer)
      this.toastTimer = setTimeout(() => {
        this.toast = null
      }, 4200)
    },

    switchTab(tab) {
      this.tab = tab
      this.historyDetail = null
      if (tab === 'logs') this.refreshLogs()
      if (tab === 'history') this.refreshHistory()
      if (tab === 'libraries') this.refreshLibraries()
      if (tab === 'collections') this.loadCollectionInputs()
      if (tab === 'rules' || tab === 'settings') this.draft = this.cloneSettings(this.settings)
      this.saveSession()
    },

    // ── 文件 ──
    pickFile() {
      this.$refs.fileInput?.click()
    },

    async onFileChange(event) {
      const files = Array.from(event?.target?.files || [])
      event.target.value = ''
      if (files.length) await this.acceptFiles(files)
    },

    async onDrop(event) {
      this.dragOver = false
      const files = Array.from(event?.dataTransfer?.files || [])
      if (files.length) await this.acceptFiles(files)
    },

    async acceptFiles(files) {
      if (this.running || this.batchRunning) return
      this.batchFiles = files.slice()
      this.batchResults = []
      await this.acceptFile(files[0])
    },

    async acceptFile(file) {
      this.error = ''
      this.result = null
      this.historyDetail = null
      this.file = null
      this.fileBytes = null
      const name = String(file.name || '')
      if (!/\.(dxf|dwg)$/i.test(name)) {
        this.error = '仅支持 DXF / DWG 图纸。PDF 需先转换为 DXF；其他格式请先导出为 DXF 或 DWG。'
        return
      }
      if (/\.dwg$/i.test(name) && !this.dwgAvailable) {
        this.error = '当前插件包未包含 DWG 转换器，请改用 DXF，或安装带 DWG 转换资产的插件版本。'
        return
      }
      if (file.size > 64 * 1024 * 1024) {
        this.error = `图纸大小 ${this.formatBytes(file.size)}，超过 64 MB 上限。`
        return
      }
      try {
        const buffer = await file.arrayBuffer()
        this.fileBytes = new Uint8Array(buffer)
        this.file = { name, size: file.size, lastModified: file.lastModified }
        this.restored = false
        this.logEvent('info', 'plugin.file.selected', { operation: 'select', bytes: file.size, count: 1 })
        await this.saveSession()
      } catch (error) {
        this.error = '读取文件失败：' + this.errorMessage(error)
      }
    },

    async clearFile() {
      this.batchFiles = []
      this.batchResults = []
      this.file = null
      this.fileBytes = null
      this.result = null
      this.error = ''
      this.restored = false
      await this.clearSession()
    },

    // ── 审查 ──
    async runBatchReview() {
      if (this.running || this.batchRunning) return
      if (this.selectedCollectionId && this.selectedCollectionVersion == null) {
        this.error = '所选标准集合的版本不可用，请重新选择。'
        return
      }
      const files = this.batchFiles.slice()
      const selection = { id: this.selectedCollectionId, version: this.selectedCollectionVersion }
      this.batchRunning = true
      this.batchResults = []
      try {
        for (const file of files) {
          await this.acceptFile(file)
          if (!this.fileBytes) {
            this.batchResults.push({ name: file.name, error: this.error || '读取文件失败' })
            continue
          }
          await this.runReview(selection)
          this.batchResults.push({ name: file.name, result: this.error ? null : this.result, error: this.error })
        }
      } finally {
        this.batchRunning = false
      }
    },

    async runReview(selection) {
      if (!this.file || !this.fileBytes) {
        this.error = this.file
          ? '已恢复上次审查结果，但原始文件内容未保留。请点击「更换」重新选择图纸后再审查。'
          : '请先选择 DXF / DWG 图纸。'
        return
      }
      if (this.running) return
      if (this.selectedCollectionId && this.selectedCollectionVersion == null) {
        this.error = '所选标准集合的版本不可用，请重新选择。'
        return
      }
      const collectionId = selection?.id ?? this.selectedCollectionId
      const collectionVersion = selection ? selection.version : this.selectedCollectionVersion
      this.running = true
      this.error = ''
      this.result = null
      this.historyDetail = null
      this.progress = { percent: 2, phase: '准备上传' }
      const operationId = this.newOperationId('review')
      const started = performance.now()
      this.logEvent('info', 'plugin.review.started', { operation: 'review', operationId, bytes: this.file.size })
      try {
        let original = this.fileBytes
        if (/\.dwg$/i.test(this.file.name)) {
          this.progress = { percent: 8, phase: '加载 DWG 转换器（LibreDWG WASM）' }
          original = await this.convertDwgToDxf(this.fileBytes)
          this.logEvent('info', 'plugin.dwg.converted', { operation: 'convert', bytes: original.length })
          this.progress = { percent: 24, phase: 'DWG 已转为 DXF，准备上传' }
        }
        const compressed = await this.gzip(original)
        const payload = compressed.bytes
        const totalChunks = Math.max(1, Math.ceil(payload.length / CHUNK_BYTES))
        this.progress = { percent: 5, phase: '创建上传会话' }
        const created = await this.pluginApi.http.post(this.url('/uploads'), {
          fileName: this.file.name,
          kind: 'drawing',
          totalChunks,
          compressed: compressed.compressed ? 'gzip' : 'none',
          fileSize: original.length,
        })
        if (!created?.ok) throw new Error(created?.error?.message || '创建上传会话失败')
        for (let index = 0; index < totalChunks; index += 1) {
          const slice = payload.subarray(index * CHUNK_BYTES, Math.min(payload.length, (index + 1) * CHUNK_BYTES))
          const response = await this.pluginApi.http.post(this.url(`/uploads/${created.uploadId}/chunks`), {
            index,
            data: this.toBase64(slice),
          })
          if (!response?.ok) throw new Error(response?.error?.message || '上传分片失败')
          this.progress = {
            percent: 5 + Math.round(((index + 1) / totalChunks) * 55),
            phase: `上传图纸 ${index + 1}/${totalChunks}`,
          }
        }
        this.progress = { percent: 65, phase: this.llmAvailable ? '规则审查 + 大模型复查' : '规则审查（宿主模型不可用）' }
        const response = await this.pluginApi.http.post(this.url('/review'), {
          uploadId: created.uploadId,
          fileName: this.file.name,
          ...(collectionId ? { collectionId, collectionVersion } : {}),
          options: {
            enabledRules: this.draft.enabledRules,
            thresholds: this.draft.thresholds,
          },
        })
        if (!response?.ok) throw new Error(response?.error?.message || '审查失败')
        this.progress = { percent: 100, phase: '完成' }
        this.result = response.result
        this.historyDetail = null
        this.filterSeverity = '全部'
        this.filterRule = '全部'
        this.keyword = ''
        this.expanded = {}
        this.notify(`审查完成：${response.result.verdict?.label || '—'}，${response.result.findings?.length || 0} 项`, 'success')
        this.logEvent('info', 'plugin.review.completed', {
          operation: 'review',
          operationId,
          elapsedMs: Math.round(performance.now() - started),
          count: response.result.findings?.length || 0,
        })
        await this.saveSession()
        await Promise.allSettled([this.refreshHistory(), this.refreshLogs()])
      } catch (error) {
        this.error = this.errorMessage(error)
        this.notify(this.error, 'error')
        this.logEvent('error', 'plugin.review.failed', { operation: 'review', operationId, errorCode: 'REVIEW_FAILED' })
      } finally {
        this.running = false
        setTimeout(() => {
          if (!this.running) this.progress = { percent: 0, phase: '' }
        }, 1200)
      }
    },

    async gzip(bytes) {
      if (typeof CompressionStream === 'undefined' || bytes.length < 24 * 1024) return { bytes, compressed: false }
      try {
        const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'))
        const buffer = await new Response(stream).arrayBuffer()
        const result = new Uint8Array(buffer)
        if (result.length < bytes.length * 0.92) return { bytes: result, compressed: true }
        return { bytes, compressed: false }
      } catch {
        return { bytes, compressed: false }
      }
    },

    toBase64(bytes) {
      let binary = ''
      const step = 0x8000
      for (let i = 0; i < bytes.length; i += step) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + step))
      }
      return btoa(binary)
    },

    convertDwgToDxf(bytes) {
      return new Promise((resolve, reject) => {
        let worker = null
        let timer = null
        const finish = (callback, value) => {
          if (timer) clearTimeout(timer)
          timer = null
          try {
            worker?.terminate()
          } catch {
            // 已释放
          }
          worker = null
          callback(value)
        }
        try {
          const workerUrl = new URL('./assets/dwg/dwg-worker.js', import.meta.url).href
          const wasmPath = new URL('./assets/dwg/', import.meta.url).href
          worker = new Worker(workerUrl)
          timer = setTimeout(() => {
            finish(reject, new Error('DWG 转换超时（超过 240 秒）。请尝试简化图纸或先另存为 DXF。'))
          }, 240000)
          worker.onmessage = event => {
            const data = event?.data || {}
            if (data.type === 'ready') {
              try {
                worker.postMessage({
                  type: 'cad-to-dxf',
                  requestId: `dwg-${Date.now().toString(36)}`,
                  bytes: bytes.slice(),
                  wasmPath,
                })
              } catch (error) {
                finish(reject, new Error('DWG 转换器通信失败：' + this.errorMessage(error)))
              }
              return
            }
            if (data.type === 'progress') {
              const percent = Number(data.progress?.percent)
              this.progress = {
                percent: Number.isFinite(percent) ? Math.min(80, 10 + Math.round(percent * 0.6)) : 30,
                phase: data.progress?.message || 'DWG 转换中',
              }
              return
            }
            if (data.type === 'cad-to-dxf-result') {
              const dxf = data.dxf instanceof Uint8Array ? data.dxf : new Uint8Array(data.dxf || [])
              if (!dxf.length) {
                finish(reject, new Error('DWG 转换结果为空，可能图纸版本或内容不受支持。'))
                return
              }
              finish(resolve, dxf)
              return
            }
            if (data.type === 'cad-to-dxf-error') {
              finish(reject, new Error(data.message || 'DWG 转换失败'))
            }
          }
          worker.onerror = event => {
            finish(reject, new Error('DWG 转换器加载失败：' + (event?.message || 'Worker 初始化错误')))
          }
        } catch (error) {
          finish(reject, new Error('无法启动 DWG 转换器：' + this.errorMessage(error)))
        }
      })
    },

    // ── 历史 / 日志 ──
    async refreshHistory() {
      this.historyLoading = true
      try {
        const response = await this.pluginApi.http.get(this.url('/reviews'), { limit: 40 })
        if (response?.ok) this.history = response.reviews || []
      } catch {
        // 历史读取失败不阻塞主流程
      } finally {
        this.historyLoading = false
      }
    },

    async openReview(id) {
      try {
        const response = await this.pluginApi.http.get(this.url(`/reviews/${id}`))
        if (!response?.ok) throw new Error(response?.error?.message || '读取记录失败')
        this.historyDetail = response.review
        this.tab = 'history'
        await this.saveSession()
        this.filterSeverity = '全部'
        this.filterRule = '全部'
        this.keyword = ''
        this.expanded = {}
      } catch (error) {
        this.notify(this.errorMessage(error), 'error')
      }
    },

    async deleteReview(id, event) {
      event?.stopPropagation?.()
      if (!window.confirm('删除这条本机审查记录？该操作不可恢复。')) return
      try {
        const response = await this.pluginApi.http.delete(this.url(`/reviews/${id}`))
        if (!response?.ok) throw new Error(response?.error?.message || '删除失败')
        if (this.historyDetail?.id === id) this.historyDetail = null
        await this.refreshHistory()
        this.logEvent('info', 'plugin.review.deleted', { operation: 'review.delete' })
        this.notify('已删除审查记录')
      } catch (error) {
        this.notify(this.errorMessage(error), 'error')
      }
    },

    async refreshLogs() {
      this.logsLoading = true
      try {
        const response = await this.pluginApi.http.get(this.url('/logs'), { limit: 120 })
        if (response?.ok) {
          this.logs = response.entries || []
          this.logLocations = response.locations || null
          this.logPaths = response.paths || null
        }
      } catch {
        // 忽略
      } finally {
        this.logsLoading = false
      }
    },

    // ── 规则文件 ──
    async refreshRules() {
      const response = await this.pluginApi.http.get(this.url('/rules'))
      if (!response?.ok) throw new Error(response?.error?.message || '读取规则失败')
      this.catalog = response.catalog
      this.ruleFiles = response.files || []
      this.ruleSummary = response.summary || null
      try {
        const settingsResponse = await this.pluginApi.http.get(this.url('/settings'))
        if (settingsResponse?.ok) {
          this.settings = settingsResponse.settings
          this.draft = this.cloneSettings(settingsResponse.settings)
        }
      } catch {
        // 设置读取失败不阻塞规则刷新
      }
      return response
    },

    pickRuleFile() {
      this.$refs.ruleFileInput?.click()
    },

    async onRuleFileChange(event) {
      const file = event?.target?.files?.[0]
      event.target.value = ''
      if (!file) return
      await this.uploadRuleFile(file)
    },

    async uploadRuleFile(file) {
      if (this.ruleUploading) return
      const name = String(file.name || '')
      if (!/\.(json|yaml|yml|docx|pdf|md|markdown|txt|xml|html|htm|rtf|xlsx)$/i.test(name)) {
        this.notify('该规则文件类型暂不支持', 'error')
        return
      }
      if (file.size > 20 * 1024 * 1024) {
        this.notify(`规则文件 ${this.formatBytes(file.size)}，超过 20 MB 上限`, 'error')
        return
      }
      this.ruleUploading = true
      this.ruleWarnings = []
      const operationId = this.newOperationId('rules')
      try {
        const bytes = new Uint8Array(await file.arrayBuffer())
        const compressed = await this.gzip(bytes)
        const payload = compressed.bytes
        const totalChunks = Math.max(1, Math.ceil(payload.length / CHUNK_BYTES))
        const created = await this.pluginApi.http.post(this.url('/uploads'), {
          fileName: file.name,
          kind: 'rule',
          totalChunks,
          compressed: compressed.compressed ? 'gzip' : 'none',
          fileSize: bytes.length,
        })
        if (!created?.ok) throw new Error(created?.error?.message || '创建规则上传会话失败')
        for (let index = 0; index < totalChunks; index += 1) {
          const slice = payload.subarray(index * CHUNK_BYTES, Math.min(payload.length, (index + 1) * CHUNK_BYTES))
          const response = await this.pluginApi.http.post(this.url(`/uploads/${created.uploadId}/chunks`), {
            index,
            data: this.toBase64(slice),
          })
          if (!response?.ok) throw new Error(response?.error?.message || '规则分片上传失败')
        }
        const imported = await this.pluginApi.http.post(this.url('/rule-files'), { uploadId: created.uploadId })
        if (!imported?.ok) throw new Error(imported?.error?.message || '规则文件导入失败')
        this.ruleWarnings = [...(imported.warnings || imported.entry?.warnings || [])]
        if (imported.calibration?.ok === false) this.ruleWarnings.push(`自动校准未完成：${imported.calibration.error?.message || '请检查文件或模型后重试'}`)
        this.ruleFiles = imported.files || this.ruleFiles
        this.catalog = imported.catalog || this.catalog
        this.logEvent('info', 'plugin.rules.imported', {
          operation: 'rules.import',
          operationId,
          count: imported.entry?.ruleCount || 0,
        })
        await this.refreshRules()
        if (imported.entry?.sourceId) await this.openSource(imported.entry.sourceId)
        this.notify(`规则文件已导入：${imported.entry?.ruleCount || 0} 条规则`, 'success')
      } catch (error) {
        this.notify(this.errorMessage(error), 'error')
        this.logEvent('error', 'plugin.rules.import_failed', {
          operation: 'rules.import',
          operationId,
          errorCode: 'RULE_IMPORT_FAILED',
        })
      } finally {
        this.ruleUploading = false
      }
    },

    async toggleRuleFile(id, active) {
      try {
        const response = await this.pluginApi.http.put(this.url(`/rule-files/${id}`), { active })
        if (!response?.ok) throw new Error(response?.error?.message || '规则文件状态更新失败')
        this.ruleFiles = response.files || this.ruleFiles
        this.catalog = response.catalog || this.catalog
        this.notify(active ? '规则文件已启用' : '规则文件已停用')
        await this.refreshRules()
      } catch (error) {
        this.notify(this.errorMessage(error), 'error')
      }
    },

    async deleteRuleFile(id) {
      if (!window.confirm('删除这个规则文件？')) return
      try {
        const response = await this.pluginApi.http.delete(this.url(`/rule-files/${id}`))
        if (!response?.ok) throw new Error(response?.error?.message || '删除规则文件失败')
        this.ruleFiles = response.files || []
        this.catalog = response.catalog || this.catalog
        this.notify('规则文件已删除')
        await this.refreshRules()
      } catch (error) {
        this.notify(this.errorMessage(error), 'error')
      }
    },

    async refreshCollections() {
      try {
        const response = await this.pluginApi.http.get(this.url('/standard-collections'))
        if (!response?.ok || !Array.isArray(response.collections)) throw new Error(response?.error?.message || '读取标准集合失败')
        this.collections = response.collections
        this.collectionLoadError = ''
      } catch (error) {
        this.collectionLoadError = this.errorMessage(error)
      }
    },

    async selectReviewCollection(id) {
      this.selectedCollectionId = id
      this.selectedCollectionVersion = this.collections.find(item => item.id === id)?.latest?.version ?? null

    },

    async loadCollectionInputs() {
      this.collectionLoading = true
      try {
        const [rules, libraries] = await Promise.all([
          this.pluginApi.http.get(this.url('/rule-files')),
          this.pluginApi.http.get(this.url('/libraries')),
          this.refreshCollections(),
        ])
        if (!rules?.ok || !Array.isArray(rules.files)) throw new Error(rules?.error?.message || '读取规则文件失败')
        if (!libraries?.ok || !Array.isArray(libraries.files)) throw new Error(libraries?.error?.message || '读取标准库失败')
        this.ruleFiles = rules.files
        this.sources = libraries.files.filter(item => item.sourceId).map(item => ({ id: item.sourceId, fileName: item.sourceFile || item.name }))
      } catch (error) {
        this.collectionFormError = this.errorMessage(error)
      } finally {
        this.collectionLoading = false
      }
    },

    async createCollection() {
      if (this.collectionSaving) return
      const name = this.collectionName.trim()
      if (!name || name.length > 200) {
        this.collectionFormError = '请输入不超过 200 字的集合名称'
        return
      }
      if (!this.collectionRuleFiles.length) {
        this.collectionFormError = '请至少选择一个规则文件'
        return
      }
      if (this.collectionRuleFiles.some(id => !this.ruleFiles.some(item => item.id === id)) || this.collectionSourceIds.some(id => !this.sources.some(item => item.id === id))) {
        this.collectionFormError = '所选文件已不存在，请重新选择'
        return
      }
      this.collectionSaving = true
      this.collectionFormError = ''
      try {
        const details = await Promise.all(this.collectionRuleFiles.map(async id => {
          const response = await this.pluginApi.http.get(this.url(`/rule-files/${encodeURIComponent(id)}`))
          if (!response?.ok || !Array.isArray(response.ruleSet?.rules)) throw new Error(response?.error?.message || '读取规则文件详情失败')
          return response.ruleSet.rules.map(rule => ({ fileId: id, ruleId: rule.id }))
        }))
        const response = await this.pluginApi.http.post(this.url(this.collectionEditingId ? `/standard-collections/${encodeURIComponent(this.collectionEditingId)}/versions` : '/standard-collections'), {
          name, rules: details.flat(), sourceIds: [...new Set(this.collectionSourceIds)], ...(this.collectionEditingId ? { baseVersion: this.collectionEditingBase } : {}),
        })
        if (!response?.ok) throw new Error(response?.error?.message || '创建标准集合失败')
        const editing = Boolean(this.collectionEditingId)
        this.collectionEditingId = ''
        this.collectionEditingBase = null
        this.collectionName = ''
        this.collectionRuleFiles = []
        this.collectionSourceIds = []
        await this.refreshCollections()
        this.notify(editing ? '标准集合新版本已创建' : '标准集合已创建')
      } catch (error) {
        this.collectionFormError = this.errorMessage(error)
      } finally {
        this.collectionSaving = false
      }
    },

    editCollection(item) {
      this.collectionEditingId = item.id
      this.collectionEditingBase = item.latest.version
      this.collectionName = item.latest.name
      this.collectionRuleFiles = [...new Set((item.latest.rules || []).map(rule => rule.fileId))]
      this.collectionSourceIds = (item.latest.standardSourceIds || []).filter(id => this.sources.some(source => source.id === id))
      this.collectionFormError = ''
    },

    toggleCollectionFiles(id) {
      this.expandedCollectionIds = { ...this.expandedCollectionIds, [id]: !this.expandedCollectionIds[id] }
    },

    collectionVersionFiles(item) {
      const latest = item.latest || {}
      const snapshots = new Map((latest.sourceSnapshots || []).map(source => [source.id, source.fileName]))
      const ruleFiles = [...new Set((latest.rules || []).map(ref => ref.fileSnapshot?.sourceFile || ref.fileSnapshot?.name).filter(Boolean))]
      const ruleSourceIds = new Set((latest.rules || []).map(ref => ref.sourceId).filter(Boolean))
      const standardIds = Array.isArray(latest.standardSourceIds)
        ? latest.standardSourceIds
        : (latest.sourceIds || []).filter(id => !ruleSourceIds.has(id))
      return { ruleFiles, standardFiles: standardIds.map(id => snapshots.get(id)).filter(Boolean) }
    },

    async deleteCollection(item) {
      if (this.collectionSaving || this.batchRunning || this.running) return
      if (!globalThis.confirm(`删除标准集合“${item.latest?.name || item.id}”？历史审查记录保留，删除后不能再选择该集合审查。`)) return
      this.collectionSaving = true
      try {
        const response = await this.pluginApi.http.delete(this.url(`/standard-collections/${encodeURIComponent(item.id)}`))
        if (!response?.ok) throw new Error(response?.error?.message || '删除集合失败')
        if (this.selectedCollectionId === item.id) await this.selectReviewCollection('')
        if (this.collectionEditingId === item.id) { this.collectionEditingId = ''; this.collectionEditingBase = null }
        await this.refreshCollections()
        this.notify('集合已删除，历史审查记录保留')
      } catch (error) { this.collectionFormError = this.errorMessage(error) }
      finally { this.collectionSaving = false }
    },

    renderCollectionsTab() {
      const h = this.vueH
      const checkbox = (item, selected, label) => h('label', { class: 'cad-row', style: 'margin:8px 0' }, [
        h('input', { type: 'checkbox', checked: selected.includes(item.id), disabled: this.collectionSaving || this.collectionLoading, onChange: event => {
          const next = event.target.checked ? [...selected, item.id] : selected.filter(id => id !== item.id)
          if (selected === this.collectionRuleFiles) this.collectionRuleFiles = next
          else this.collectionSourceIds = next
        } }), label,
      ])
      return h('div', { class: 'cad-panel' }, [
        h('div', { class: 'cad-row-between' }, [h('h2', { class: 'cad-card-title' }, '标准集合'), h('button', { type: 'button', class: 'cad-btn', disabled: this.collectionLoading || this.collectionSaving, onClick: () => this.loadCollectionInputs() }, '刷新')]),
        h('div', { class: 'cad-alert cad-alert-warn' }, '审查使用所选集合版本的快照；集合需包含可校验的规则原文和对应资料，不满足条件时将拒绝审查。'),
        this.collectionFormError ? h('div', { class: 'cad-alert cad-alert-error', role: 'alert' }, this.collectionFormError) : null,
        h('section', { class: 'cad-card' }, [
          h('h2', { class: 'cad-card-title' }, this.collectionEditingId ? `更新集合（基于版本 ${this.collectionEditingBase}）` : '创建集合'),
          h('label', { for: 'cad-collection-name' }, '集合名称'),
          h('input', { id: 'cad-collection-name', class: 'cad-input', maxlength: 200, value: this.collectionName, disabled: this.collectionSaving, onInput: event => { this.collectionName = event.target.value } }),
          h('h3', {}, '规则文件（包含所选文件的全部规则）'),
          ...this.ruleFiles.map(item => checkbox(item, this.collectionRuleFiles, `${item.name || item.id} · ${item.version || '版本未知'}`)),
          !this.ruleFiles.length ? h('div', { class: 'cad-muted' }, '暂无规则文件') : null,
          h('h3', {}, '标准库文件（可选）'),
          ...this.sources.map(item => checkbox(item, this.collectionSourceIds, item.fileName || item.id)),
          !this.sources.length ? h('div', { class: 'cad-muted' }, '未上传标准库；仍可创建仅使用规则文件的集合。') : null,
          h('button', { type: 'button', class: 'cad-btn cad-btn-primary', disabled: this.collectionSaving || this.collectionLoading, onClick: () => this.createCollection() }, this.collectionSaving ? '保存中…' : this.collectionEditingId ? '保存为新版本' : '创建集合'),
          this.collectionEditingId ? h('button', { type: 'button', class: 'cad-btn', onClick: () => { this.collectionEditingId = ''; this.collectionEditingBase = null; this.collectionName = ''; this.collectionRuleFiles = []; this.collectionSourceIds = [] } }, '取消更新') : null,
        ]),
        h('section', { class: 'cad-card' }, [
          h('h2', { class: 'cad-card-title' }, '已有集合'),
          ...this.collections.map(item => {
            const files = this.collectionVersionFiles(item)
            return h('div', { style: 'margin:10px 0;padding:10px;border:1px solid var(--sys-color-border-subtle)', borderRadius: '8px' }, [
              h('div', { class: 'cad-row-between' }, [
                h('span', {}, `${item.latest?.name || item.id} · 版本 ${item.latest?.version ?? '—'} · ${files.ruleFiles.length} 个规则文件 · ${files.standardFiles.length} 个标准库文件`),
                h('div', { class: 'cad-row' }, [
                  h('button', { type: 'button', class: 'cad-btn cad-btn-sm', onClick: () => this.toggleCollectionFiles(item.id) }, this.expandedCollectionIds[item.id] ? '收起文件' : '查看文件'),
                  h('button', { type: 'button', class: 'cad-btn', disabled: this.collectionSaving || this.collectionLoading, onClick: () => this.editCollection(item) }, '更新版本'),
                  h('button', { type: 'button', class: 'cad-btn cad-btn-danger', disabled: this.collectionSaving || this.running || this.batchRunning, onClick: () => this.deleteCollection(item) }, '删除'),
                ]),
              ]),
              this.expandedCollectionIds[item.id] ? h('div', { class: 'cad-grid', style: 'margin-top:10px' }, [
                h('div', {}, [h('div', { class: 'cad-field-label' }, '规则文件'), h('ul', { class: 'cad-list' }, files.ruleFiles.map(name => h('li', {}, name)))]),
                h('div', {}, [h('div', { class: 'cad-field-label' }, '标准库文件'), h('ul', { class: 'cad-list' }, files.standardFiles.length ? files.standardFiles.map(name => h('li', {}, name)) : [h('li', {}, '无')])]),
              ]) : null,
            ])
          }),
          !this.collections.length ? h('div', { class: 'cad-muted' }, '暂无集合') : null,
        ]),
      ])
    },

    // ── 规则正文版本 ──
    async openSource(id) {
      if (this.sourceBusy) return
      if (this.source && this.source.id !== id && this.sourceDraft !== this.sourceSavedDraft && !globalThis.confirm('当前正文有未保存修改，是否继续？')) return
      this.sourceBusy = true
      this.sourceError = ''
      try {
        const response = await this.pluginApi.http.get(this.url(`/sources/${encodeURIComponent(id)}`))
        if (response?.ok === false || response?.error) throw response
        const source = response?.source || response
        if (!source || source.id == null) throw new Error('资料详情格式无效')
        this.source = source
        this.sourcePreviewUnderstanding = null
        this.sourceDraft = source.history?.filter(item => typeof item.data?.text === 'string').at(-1)?.data.text ?? source.originalExtraction?.text ?? source.preview?.fragments?.map(item => item.text).join('\n\n') ?? ''
        this.sourceSavedDraft = this.sourceDraft
      } catch (error) {
        this.sourceError = this.errorMessage(error)
      } finally {
        this.sourceBusy = false
      }
    },

    async updateSource(action) {
      if (!this.source || this.sourceBusy) return
      let extraction
      if (action === 'recalibrate' && this.sourceDraft !== this.sourceSavedDraft && !globalThis.confirm('重新校准成功后将替换未保存的编辑。是否继续？')) return
      if (action === 'edit') extraction = { text: this.sourceDraft }
      const id = this.source.id
      this.sourceBusy = true
      this.sourceError = ''
      try {
        const path = this.url(`/sources/${encodeURIComponent(id)}/${action}`)
        const kind = this.ruleFiles.some(item => item.sourceId === id) ? 'rule' : this.libraries.some(item => item.sourceId === id) ? 'library' : 'document'
        const response = action === 'edit'
          ? await this.pluginApi.http.put(path, { extraction })
          : await this.pluginApi.http.post(path, { kind })
        if (response?.ok === false || response?.error) throw response
        const source = response?.source
        if (!source || source.id == null) throw new Error('资料详情格式无效')
        this.source = source
        this.sourceDraft = source.history?.filter(item => typeof item.data?.text === 'string').at(-1)?.data.text ?? source.originalExtraction?.text ?? source.preview?.fragments?.map(item => item.text).join('\n\n') ?? ''
        this.sourceSavedDraft = this.sourceDraft
        this.notify(action === 'edit' ? '资料编辑已保存' : '资料已重新校准')
      } catch (error) {
        this.sourceError = this.errorMessage(error)
      } finally {
        this.sourceBusy = false
      }
    },

    // ── 外部标准库 ──
    async refreshLibraries() {
      try {
        const response = await this.pluginApi.http.get(this.url('/libraries'))
        if (!response?.ok) throw new Error(response?.error?.message || '读取标准库失败')
        this.libraries = response.files || []
        this.librarySummary = response.summary || null
      } catch (error) {
        this.notify(this.errorMessage(error), 'error')
      }
    },

    activeLibrary(type) {
      return (this.libraries || []).find(item => item.type === type && item.active) || null
    },

    pickLibraryFile() {
      this.$refs.libraryFileInput?.click()
    },

    async onLibraryFileChange(event) {
      const file = event?.target?.files?.[0]
      event.target.value = ''
      if (!file) return
      await this.uploadLibraryFile(file)
    },

    async uploadLibraryFile(file) {
      if (this.libraryUploading) return
      const name = String(file.name || '')
      if (!/\.(json|yaml|yml|csv|txt|md|markdown|xml|html|htm|rtf|pdf|docx|xlsx)$/i.test(name)) {
        this.notify('该文件类型暂不支持', 'error')
        return
      }
      if (file.size > 20 * 1024 * 1024) {
        this.notify(`标准库文件 ${this.formatBytes(file.size)}，超过 20 MB 上限`, 'error')
        return
      }
      this.libraryUploading = true
      this.libraryWarnings = []
      const operationId = this.newOperationId('libraries')
      try {
        const bytes = new Uint8Array(await file.arrayBuffer())
        const compressed = await this.gzip(bytes)
        const payload = compressed.bytes
        const totalChunks = Math.max(1, Math.ceil(payload.length / CHUNK_BYTES))
        const created = await this.pluginApi.http.post(this.url('/uploads'), {
          fileName: file.name,
          kind: 'library',
          totalChunks,
          compressed: compressed.compressed ? 'gzip' : 'none',
          fileSize: bytes.length,
        })
        if (!created?.ok) throw new Error(created?.error?.message || '创建标准库上传会话失败')
        for (let index = 0; index < totalChunks; index += 1) {
          const slice = payload.subarray(index * CHUNK_BYTES, Math.min(payload.length, (index + 1) * CHUNK_BYTES))
          const response = await this.pluginApi.http.post(this.url(`/uploads/${created.uploadId}/chunks`), {
            index,
            data: this.toBase64(slice),
          })
          if (!response?.ok) throw new Error(response?.error?.message || '标准库分片上传失败')
        }
        const imported = await this.pluginApi.http.post(this.url('/libraries'), {
          uploadId: created.uploadId,
        })
        if (!imported?.ok) throw new Error(imported?.error?.message || '标准库导入失败')
        this.libraryWarnings = [...(imported.warnings || [])]
        if (imported.calibration?.ok === false) this.libraryWarnings.push(`自动校准未完成：${imported.calibration.error?.message || '请检查文件或模型后重试'}`)
        this.libraries = imported.files || this.libraries
        this.librarySummary = imported.summary || this.librarySummary
        this.logEvent('info', 'plugin.libraries.imported', {
          operation: 'libraries.import',
          operationId,
          count: imported.entry?.itemCount || 0,
        })
        await this.refreshLibraries()
        if (imported.entry?.sourceId) await this.openSource(imported.entry.sourceId)
        this.notify(`标准库已导入：${imported.entry?.name || name}（${imported.entry?.version || '—'}）`, 'success')
      } catch (error) {
        this.notify(this.errorMessage(error), 'error')
        this.logEvent('error', 'plugin.libraries.import_failed', {
          operation: 'libraries.import',
          operationId,
          errorCode: 'LIBRARY_IMPORT_FAILED',
        })
      } finally {
        this.libraryUploading = false
      }
    },

    async toggleLibrary(id, active) {
      try {
        const response = await this.pluginApi.http.put(this.url(`/libraries/${id}`), { active })
        if (!response?.ok) throw new Error(response?.error?.message || '标准库状态更新失败')
        this.libraries = response.files || this.libraries
        this.librarySummary = response.summary || this.librarySummary
        this.notify(active ? '标准库已启用' : '标准库已停用')
        await this.refreshLibraries()
      } catch (error) {
        this.notify(this.errorMessage(error), 'error')
      }
    },

    async deleteLibrary(id) {
      if (!window.confirm('删除这个标准库？')) return
      try {
        const response = await this.pluginApi.http.delete(this.url(`/libraries/${id}`))
        if (!response?.ok) throw new Error(response?.error?.message || '删除标准库失败')
        this.libraries = response.files || []
        this.librarySummary = response.summary || this.librarySummary
        this.notify('标准库已删除')
        await this.refreshLibraries()
      } catch (error) {
        this.notify(this.errorMessage(error), 'error')
      }
    },

    async openLogPath(target) {
      try {
        const response = await this.pluginApi.http.post(this.url('/logs/open'), { target })
        if (!response?.ok) throw new Error(response?.error?.message || '无法打开路径')
        this.notify('已在文件管理器中打开')
      } catch (error) {
        this.notify(this.errorMessage(error), 'error')
      }
    },

    async copyText(text) {
      try {
        await navigator.clipboard.writeText(text)
        this.notify('已复制到剪贴板')
      } catch {
        this.notify('复制失败，请手动选择文本', 'error')
      }
    },

    // ── 设置 ──
    async saveSettings(silent = false) {
      if (this.saving) return
      this.saving = true
      try {
        const response = await this.pluginApi.http.put(this.url('/settings'), this.draft)
        if (!response?.ok) throw new Error(response?.error?.message || '保存失败')
        this.settings = response.settings
        this.draft = this.cloneSettings(response.settings)
        this.logEvent('info', 'plugin.settings.saved', { operation: 'settings.save' })
        if (!silent) this.notify('设置已保存')
      } catch (error) {
        this.notify(this.errorMessage(error), 'error')
      } finally {
        this.saving = false
      }
    },

    toggleRule(ruleId) {
      if (!this.draft) return
      const set = new Set(this.draft.enabledRules)
      if (set.has(ruleId)) set.delete(ruleId)
      else set.add(ruleId)
      this.draft.enabledRules = this.catalog.rules.map(rule => rule.id).filter(id => set.has(id))
    },

    setThreshold(key, value) {
      if (!this.draft) return
      this.draft.thresholds = { ...this.draft.thresholds, [key]: Number(value) }
    },

    resetThresholds() {
      this.draft.thresholds = {
        frameToleranceMm: 1,
        scaleTolerancePct: 1,
        lineWidthToleranceMm: 0.1,
        titleNameMinHeight: 5,
        techRequirementMinHeight: 3.5,
      }
      this.notify('已恢复首版阈值，点击保存后生效')
    },

    toggleExpanded(id) {
      this.expanded = { ...this.expanded, [id]: !this.expanded[id] }
    },

    toggleEvidence(id) {
      this.showEvidence = { ...this.showEvidence, [id]: !this.showEvidence[id] }
    },

    // ── 导出 ──
    download(name, content, type) {
      const blob = new Blob([content], { type })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = name
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 2000)
    },

    exportJson() {
      const review = this.currentReview
      if (!review) return
      const payload = {
        tool: 'elvespuck-cad-standard-reviewer',
        version: this.version,
        generatedAt: new Date().toISOString(),
        fileName: this.historyDetail?.fileName || review.fileName,
        ruleSet: review.ruleSet,
        verdict: review.verdict,
        stats: review.stats,
        drawing: review.drawing,
        llm: review.llm,
        findings: review.findings,
        localAnalysis: review.localAnalysis || null,
        collection: review.collection || null,
        ...(Array.isArray(this.historyDetail?.modelSources) ? { modelSources: this.historyDetail.modelSources } : {}),
      }
      const base = String(payload.fileName || 'drawing').replace(/\.dxf$/i, '')
      this.download(`${base}-审查报告.json`, JSON.stringify(payload, null, 2), 'application/json;charset=utf-8')
      this.logEvent('info', 'plugin.report.exported', { operation: 'export', kind: 'json' })
    },

    exportHtml() {
      const review = this.currentReview
      if (!review) return
      const fileName = this.historyDetail?.fileName || review.fileName || 'drawing.dxf'
      const rows = (review.findings || [])
        .map(
          (item, index) => `<tr>
  <td>${index + 1}</td>
  <td><b>${escapeHtml(item.ruleId)}</b>${item.checkpoint ? `<br><span class="muted">${escapeHtml(item.checkpoint)}</span>` : ''}</td>
  <td><span class="sev sev-${escapeHtml(item.severity)}">${escapeHtml(item.severity)}</span><br>${escapeHtml(item.conclusion || '')}</td>
  <td><b>${escapeHtml(item.title)}</b><div class="muted">${escapeHtml(item.detail || '')}</div></td>
  <td>${escapeHtml(item.location?.label || '—')}<br><span class="muted">(${round(item.location?.x)}, ${round(item.location?.y)})</span></td>
  <td>${escapeHtml(item.measured || '—')}</td>
  <td>${escapeHtml(item.expected || '—')}</td>
  <td>${escapeHtml(item.basis || '—')}</td>
  <td>${escapeHtml(item.suggestion || '—')}</td>
</tr>`
        )
        .join('\n')
      const html = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><title>${escapeHtml(fileName)} 标准化审查报告</title>
<style>
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;margin:32px;color:#0f172a;line-height:1.6}
h1{font-size:22px;margin:0 0 6px}h2{font-size:16px;margin:26px 0 10px}
.muted{color:#64748b;font-size:12px}
.summary{display:flex;gap:18px;flex-wrap:wrap;margin:14px 0;padding:14px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc}
.summary div{min-width:120px}.summary b{display:block;font-size:20px}
table{width:100%;border-collapse:collapse;font-size:12px}th,td{border:1px solid #e2e8f0;padding:7px 8px;vertical-align:top;text-align:left}
th{background:#f1f5f9;font-weight:600}
.sev{display:inline-block;padding:1px 7px;border-radius:999px;font-size:11px;font-weight:600}
.sev-关键{background:#fee2e2;color:#b91c1c}.sev-严重{background:#fef3c7;color:#b45309}.sev-一般{background:#f0f9ff;color:#0369a1}.sev-提示{background:#f1f5f9;color:#475569}
.verdict{font-size:18px;font-weight:700}.fail{color:#b91c1c}.review{color:#b45309}.pass{color:#047857}
</style></head><body>
<h1>二维图样标准化审查报告</h1>
<div class="muted">文件：${escapeHtml(fileName)}　规则集：${escapeHtml(review.ruleSet?.name || '')} ${escapeHtml(review.ruleSet?.version || '')}　生成时间：${escapeHtml(new Date().toLocaleString('zh-CN'))}</div>
<div class="summary">
  <div>审查结论<b class="verdict ${review.verdict?.level || ''}">${escapeHtml(review.verdict?.label || '—')}</b></div>
  <div>问题总数<b>${review.findings?.length || 0}</b></div>
  <div>关键<b>${review.stats?.bySeverity?.['关键'] || 0}</b></div>
  <div>严重<b>${review.stats?.bySeverity?.['严重'] || 0}</b></div>
  <div>一般<b>${review.stats?.bySeverity?.['一般'] || 0}</b></div>
  <div>图纸<b>${escapeHtml(review.drawing?.sheet || '')} ${review.drawing?.width || ''}×${review.drawing?.height || ''}</b></div>
</div>
<h2>问题清单</h2>
<table><thead><tr><th>#</th><th>规则</th><th>级别</th><th>问题</th><th>位置</th><th>实测值</th><th>标准值</th><th>依据</th><th>修改建议</th></tr></thead>
<tbody>${rows || '<tr><td colspan="9">没有可展示的问题项；不能据此认定图纸符合。</td></tr>'}</tbody></table>
${review.localAnalysis?.findings?.length ? `<h2>本地初查候选（待核对）</h2><p>${escapeHtml(review.localAnalysis.notice || '')}</p>${review.localAnalysis.findings.map(item => `<p>${escapeHtml(item.ruleId)} ${escapeHtml(item.title)}；实测：${escapeHtml(item.measured || '未取得')}；${escapeHtml(item.detail || '')}</p>`).join('')}` : ''}
${review.llm?.summary ? `<h2>大模型复查意见</h2><p>${escapeHtml(review.llm.summary)}</p>` : ''}
<h2>实际记录的模型资料</h2>${Array.isArray(this.historyDetail?.modelSources) ? this.historyDetail.modelSources.map(source => `<pre style="white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(JSON.stringify(source, null, 2))}</pre>`).join('') || '<p>记录为空</p>' : '<p>当前报告未提供实际记录的模型资料；请打开审查记录详情查看。</p>'}
<p class="muted">本报告由 ElvesPuck「CAD图样标准化审查」插件生成。规则集只判图样规范性，不判技术方案正确性。</p>
</body></html>`
      const base = String(fileName).replace(/\.dxf$/i, '')
      this.download(`${base}-审查报告.html`, html, 'text/html;charset=utf-8')
      this.logEvent('info', 'plugin.report.exported', { operation: 'export', kind: 'html' })
    },

    // ── 格式化 ──
    formatBytes(value) {
      if (!Number.isFinite(value)) return '—'
      if (value < 1024) return `${value} B`
      if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`
      return `${(value / 1024 / 1024).toFixed(2)} MB`
    },

    formatTime(value) {
      if (!value) return '—'
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return String(value)
      return date.toLocaleString('zh-CN', { hour12: false })
    },

    formatMs(value) {
      if (!Number.isFinite(value)) return '—'
      return value < 1000 ? `${value} ms` : `${(value / 1000).toFixed(2)} s`
    },

    verdictIcon(level) {
      if (level === 'fail') return '!'
      if (level === 'review') return '?'
      return '✓'
    },

    severityClass(severity) {
      return ['关键', '严重', '一般', '提示'].includes(severity) ? severity : '提示'
    },

    // ── 渲染：通用 ──
    renderBadge(text, className) {
      return this.vueH('span', { class: `cad-chip ${className}` }, text)
    },

    renderSwitch(label, checked, onChange, disabled = false) {
      const h = this.vueH
      return h(
        'button',
        {
          type: 'button',
          class: `cad-switch ${checked ? 'is-on' : ''} ${disabled ? 'is-disabled' : ''}`,
          role: 'switch',
          'aria-checked': String(Boolean(checked)),
          disabled,
          onClick: () => {
            if (!disabled) onChange(!checked)
          },
        },
        [h('span', { class: 'cad-switch-track' }), h('span', {}, label)]
      )
    },

    renderEmpty(text) {
      return this.vueH('div', { class: 'cad-empty' }, text)
    },

    // ── 渲染：头部 ──
    renderHeader() {
      const h = this.vueH
      return h('header', { class: 'cad-header' }, [
        h('div', { class: 'cad-title-row' }, [
          h('h1', { class: 'cad-title' }, 'CAD 图样标准化审查'),
          h('span', { class: 'cad-version' }, `插件 v${this.version} · 规则集 ${this.catalog?.version || '—'}`),
          this.health?.capabilities?.llm
            ? this.renderBadge('大模型可用', 'cad-chip-pass')
            : this.renderBadge('模型不可用，解析器可用', 'cad-chip-plain'),
          this.dwgAvailable ? this.renderBadge('DWG 本机转换', 'cad-chip-pass') : null,
          this.renderBadge(`规则文件 ${this.activeRuleFileCount}`, 'cad-chip-plain'),
        ]),
        h(
          'p',
          { class: 'cad-subtitle' },
          '上传规则和标准库，建立版本集合并结合图纸证据审查。'
        ),
      ])
    },

    renderTabs() {
      const h = this.vueH
      return h(
        'nav',
        { class: 'cad-tabs', role: 'tablist' },
        TABS.map(tab =>
          h(
            'button',
            {
              type: 'button',
              class: `cad-tab ${this.tab === tab.id ? 'is-active' : ''}`,
              role: 'tab',
              'aria-selected': String(this.tab === tab.id),
              onClick: () => this.switchTab(tab.id),
            },
            tab.label
          )
        )
      )
    },

    // ── 渲染：审查 ──
    renderReviewTab() {
      const h = this.vueH
      if (this.historyDetail) {
        return h('div', { class: 'cad-panel' }, [
          h('div', { class: 'cad-row-between' }, [
            h('div', {}, [
              h('div', { style: 'font-weight:600' }, `历史记录：${this.historyDetail.fileName}`),
              h('div', { class: 'cad-muted' }, this.formatTime(this.historyDetail.createdAt)),
            ]),
            h('button', { type: 'button', class: 'cad-btn', onClick: () => (this.historyDetail = null) }, '返回'),
          ]),
          this.renderResult(this.historyDetail.result, true),
        ])
      }
      return h('div', { class: 'cad-panel' }, [
        this.restored && this.result
          ? h('div', { class: 'cad-alert cad-alert-ok' }, [
              h('b', {}, '已恢复上次审查结果'),
              `（${this.formatTime(this.restoredAt)}）。`,
              this.fileBytes ? '' : ' 原始文件内容未保留；如需重新审查，请点击「更换」重新选择图纸。',
              h(
                'button',
                { type: 'button', class: 'cad-btn cad-btn-sm', style: 'margin-left:10px', onClick: () => (this.restored = false) },
                '知道了'
              ),
            ])
          : null,
        h('section', { class: 'cad-card' }, [
          h('label', { for: 'cad-review-collection' }, '标准集合'),
          h('select', { id: 'cad-review-collection', class: 'cad-input', value: this.selectedCollectionId, disabled: this.running || this.batchRunning, onChange: event => this.selectReviewCollection(event.target.value) }, [
            h('option', { value: '' }, '不选择集合'),
            ...this.collections.map(item => h('option', { value: item.id }, `${item.latest?.name || item.id} · 版本 ${item.latest?.version ?? '—'}`)),
          ]),
          h('div', { class: 'cad-muted' }, this.selectedCollectionId ? `已选定版本 ${this.selectedCollectionVersion ?? '不可用'}。` : '未选择集合时使用当前启用的规则；标准库不是必需项。'),
          this.collectionLoadError ? h('div', { class: 'cad-alert cad-alert-error', role: 'alert' }, `集合加载失败：${this.collectionLoadError}`) : null,
        ]),
        this.renderUploadCard(),
        this.running ? this.renderProgress() : null,
        this.error ? h('div', { class: 'cad-alert cad-alert-error' }, this.error) : null,
        this.batchResults.length ? h('section', { class: 'cad-card' }, [
          h('h2', { class: 'cad-card-title' }, '逐张审查结果'),
          ...this.batchResults.map(item => h('div', { class: 'cad-row' }, [
            h('span', {}, `${item.name}：${item.error ? `失败：${item.error}` : item.result?.verdict?.label || '结果不可用'}`),
            item.result ? h('button', { type: 'button', class: 'cad-btn cad-btn-sm', onClick: () => { this.result = item.result; this.historyDetail = null } }, '查看报告') : null,
          ])),
        ]) : null,
        this.result ? this.renderResult(this.result, false) : null,
        !this.result && !this.running
          ? h('div', { class: 'cad-card' }, [
              h('h2', { class: 'cad-card-title' }, '审查范围与口径'),
              h('div', { class: 'cad-grid' }, [
                this.renderScope('审查依据', '使用所选规则和标准库；规则必选，标准库按需使用。'),
                this.renderScope('图纸证据', '提取文字、尺寸和可用几何数据；缺失证据会标记待确认。'),
                this.renderScope('模型识别', '模型协助理解文档，解析器在模型不可用时提供兜底。'),
              ]),
            ])
          : null,
      ])
    },

    renderScope(title, text) {
      const h = this.vueH
      return h('div', { class: 'cad-metric', style: 'background:var(--sys-color-bg-subtle)' }, [
        h('div', { style: 'font-size:13px;font-weight:600;margin-bottom:4px' }, title),
        h('div', { class: 'cad-muted', style: 'font-size:12px;line-height:1.65' }, text),
      ])
    },

    renderUploadCard() {
      const h = this.vueH
      return h('section', { class: 'cad-card' }, [
        h('div', { class: 'cad-row-between' }, [
          h('h2', { class: 'cad-card-title', style: 'margin:0' }, '选择图纸'),
          h('span', { class: 'cad-muted' }, 'DXF / DWG（本机转 DXF）· 单文件最大 64 MB · 本机解析，不上传云端'),
        ]),
        h('input', {
          ref: 'fileInput',
          type: 'file',
          multiple: true,
          accept: '.dxf,.dwg,application/dxf,application/acad',
          style: 'display:none',
          onChange: this.onFileChange,
        }),
        this.file
          ? h('div', { class: 'cad-file', style: 'margin-top:12px' }, [
              h('div', { class: 'cad-drop-icon' }, /\.dwg$/i.test(this.file.name) ? 'DWG' : 'DXF'),
              h('div', { style: 'flex:1;min-width:0' }, [
                h('div', { class: 'cad-file-name' }, this.batchFiles.length > 1 ? `已选择 ${this.batchFiles.length} 张图纸：${this.batchFiles.map(file => file.name).join('、')}` : this.file.name),
                h('div', { class: 'cad-muted' }, `${this.formatBytes(this.file.size)} · ${this.formatTime(this.file.lastModified)}`),
                this.fileBytes
                  ? null
                  : h('div', { class: 'cad-muted', style: 'color:var(--sys-color-warning)' }, '已恢复文件信息，原始内容未保留；点击「更换」重新选择后可再次审查'),
              ]),
              h('button', { type: 'button', class: 'cad-btn cad-btn-sm', onClick: this.pickFile, disabled: this.running || this.batchRunning }, '更换'),
              h('button', { type: 'button', class: 'cad-btn cad-btn-sm cad-btn-danger', onClick: this.clearFile, disabled: this.running || this.batchRunning }, '移除'),
            ])
          : h(
              'div',
              {
                class: `cad-drop ${this.dragOver ? 'is-over' : ''}`,
                style: 'margin-top:12px',
                onDragover: event => {
                  event.preventDefault()
                  this.dragOver = true
                },
                onDragleave: () => {
                  this.dragOver = false
                },
                onDrop: event => {
                  event.preventDefault()
                  this.onDrop(event)
                },
              },
              [
                h('div', { class: 'cad-drop-icon' }, h('span', { style: 'font-size:20px;font-weight:700' }, '＋')),
                h('div', { style: 'font-size:14px;font-weight:600' }, '拖拽 DXF / DWG 文件到这里'),
                h('div', { class: 'cad-muted' }, this.dwgAvailable ? 'DWG 将在本机通过 LibreDWG WASM 转为 DXF 后审查' : '当前仅支持 ASCII DXF'),
                h('button', { type: 'button', class: 'cad-btn cad-btn-primary', onClick: this.pickFile, style: 'margin-top:4px' }, '选择 DXF / DWG 图纸'),
              ]
            ),
        h('div', { class: 'cad-row', style: 'margin-top:14px' }, [
          h(
            'span',
            { class: 'cad-muted' },
            this.llmAvailable
              ? '每次审查自动执行：规则库判定 → 大模型按规则复查 → 合并结论'
              : '当前仅运行本地规则；宿主未提供模型能力或插件未获批 engine.generate 权限'
          ),
          h('span', { style: 'flex:1' }),
          h(
            'button',
            {
              type: 'button',
              class: 'cad-btn cad-btn-primary',
              disabled: (!this.file && !this.batchFiles.length) || this.running || this.batchRunning,
              onClick: () => this.batchFiles.length > 1 ? this.runBatchReview() : this.runReview(),
            },
            this.running ? '审查中…' : '开始审查'
          ),
        ]),
      ])
    },

    renderProgress() {
      const h = this.vueH
      return h('div', { class: 'cad-card cad-card-tight' }, [
        h('div', { class: 'cad-row-between', style: 'margin-bottom:8px' }, [
          h('span', { style: 'font-size:13px;font-weight:500' }, this.progress.phase || '处理中…'),
          h('span', { class: 'cad-muted' }, `${this.progress.percent}%`),
        ]),
        h('div', { class: 'cad-progress' }, [
          h('div', { class: 'cad-progress-bar', style: `width:${Math.max(2, this.progress.percent)}%` }),
        ]),
      ])
    },

    renderResult(review, isHistory) {
      const h = this.vueH
      if (!review) return null
      const verdict = review.verdict || {}
      return h('div', { class: 'cad-panel' }, [
        !isHistory && this.restored ? h('div', { class: 'cad-alert cad-alert-warn' }, `当前展示的是恢复的旧报告（${this.formatTime(this.restoredAt)}），不是新版本重新审查的结果；请重新选择图纸后开始审查。`) : null,
        h('section', { class: `cad-verdict is-${verdict.level || 'review'}` }, [
          h('div', { class: 'cad-verdict-mark' }, this.verdictIcon(verdict.level)),
          h('div', { style: 'flex:1;min-width:0' }, [
            h('div', { class: 'cad-verdict-title' }, verdict.label || '—'),
            h('div', { class: 'cad-muted', style: 'font-size:13px' }, verdict.detail || ''),
            h('div', { class: 'cad-row', style: 'margin-top:8px;gap:6px' }, [
              this.renderBadge(`关键 ${review.stats?.bySeverity?.['关键'] || 0}`, 'cad-chip-关键'),
              this.renderBadge(`严重 ${review.stats?.bySeverity?.['严重'] || 0}`, 'cad-chip-严重'),
              this.renderBadge(`一般 ${review.stats?.bySeverity?.['一般'] || 0}`, 'cad-chip-一般'),
              this.renderBadge(`检查点 ${review.stats?.checkpoints?.hit || 0}/${review.stats?.checkpoints?.total || 22}`, 'cad-chip-plain'),
              this.renderBadge(`耗时 ${this.formatMs(review.elapsedMs)}`, 'cad-chip-plain'),
            ]),
          ]),
          h('div', { class: 'cad-row', style: 'gap:6px' }, [
            h('button', { type: 'button', class: 'cad-btn cad-btn-sm', onClick: this.exportJson }, '导出 JSON'),
            h('button', { type: 'button', class: 'cad-btn cad-btn-sm', onClick: this.exportHtml }, '导出 HTML'),
            isHistory ? null : h('button', { type: 'button', class: 'cad-btn cad-btn-sm', onClick: this.clearFile }, '新审查'),
          ]),
        ]),
        this.renderMetrics(review),
        this.renderDrawingInfo(review),
        review.llm ? this.renderLlm(review.llm) : null,
        review.localAnalysis?.findings?.length ? h('section', { class: 'cad-card' }, [
          h('h2', { class: 'cad-card-title' }, `本地初查候选（${review.localAnalysis.findings.length} 项，待核对）`),
          h('div', { class: 'cad-muted' }, review.localAnalysis.notice || '候选仅供人工核对，不代表最终结论。'),
          ...review.localAnalysis.findings.map(item => h('div', { class: 'cad-card' }, [h('strong', {}, `${item.ruleId || ''} ${item.title || ''}`), h('div', {}, `实测：${item.measured || '未取得'}；${item.detail || ''}`)])),
        ]) : null,
        h('section', { class: 'cad-card' }, [
          h('div', { class: 'cad-row-between', style: 'margin-bottom:10px' }, [
            h('h2', { class: 'cad-card-title', style: 'margin:0' }, `问题清单（${this.filteredFindings.length}/${review.findings?.length || 0}）`),
            h('div', { class: 'cad-filters' }, [
              h(
                'select',
                {
                  class: 'cad-select',
                  value: this.filterSeverity,
                  onChange: event => (this.filterSeverity = event.target.value),
                },
                SEVERITIES.map(item => h('option', { value: item }, item === '全部' ? '全部级别' : item))
              ),
              h(
                'select',
                {
                  class: 'cad-select',
                  value: this.filterRule,
                  onChange: event => (this.filterRule = event.target.value),
                },
                [h('option', { value: '全部' }, '全部规则')].concat(
                  this.ruleOptions.map(item => h('option', { value: item.value }, item.label))
                )
              ),
              h('input', {
                class: 'cad-input cad-input-search',
                type: 'search',
                placeholder: '搜索问题、规则或建议',
                value: this.keyword,
                onInput: event => (this.keyword = event.target.value),
              }),
            ]),
          ]),
          this.filteredFindings.length
            ? this.filteredFindings.map(item => this.renderFinding(item))
            : this.renderEmpty('当前没有可展示的问题项；不能据此认定图纸符合。'),
        ]),
        review.warnings?.length
          ? h('div', { class: 'cad-alert cad-alert-warn' }, [`解析提示：${review.warnings.join('；')}`])
          : null,
      ])
    },

    renderMetrics(review) {
      const h = this.vueH
      const stats = review.stats || {}
      const items = [
        { value: stats.total ?? review.findings?.length ?? 0, label: '问题总数' },
        { value: stats.bySeverity?.['关键'] || 0, label: '关键（必须整改）' },
        { value: stats.bySeverity?.['严重'] || 0, label: '严重' },
        { value: stats.bySeverity?.['一般'] || 0, label: '一般' },
        {
          value: `${stats.checkpoints?.hit || 0}/${stats.checkpoints?.total || 22}`,
          label: '检查点命中',
        },
        { value: this.formatMs(review.elapsedMs), label: '总耗时' },
      ]
      return h(
        'section',
        { class: 'cad-metrics' },
        items.map(item =>
          h('div', { class: 'cad-metric' }, [
            h('div', { class: 'cad-metric-value' }, String(item.value)),
            h('div', { class: 'cad-metric-label' }, item.label),
          ])
        )
      )
    },

    renderDrawingInfo(review) {
      const h = this.vueH
      const drawing = review.drawing || {}
      const chips = [
        ['图幅', `${drawing.sheet || '—'} ${drawing.width || ''}×${drawing.height || ''}`],
        ['图元', drawing.entityCount || 0],
        ['文字', drawing.textCount || 0],
        ['尺寸', drawing.dimensionCount || 0],
        ['明细栏', drawing.bomCount || 0],
        ['件号', drawing.balloonCount || 0],
        ['框格', drawing.fcfCount || 0],
        ['粗糙度', drawing.roughnessCount || 0],
        ['编码', drawing.encoding || '—'],
        ['DXF', drawing.dxfVersion || '—'],
      ]
      if (review.libraries?.material) chips.push(['材料库', `${review.libraries.material.name || ''} ${review.libraries.material.version || ''}`])
      if (review.libraries?.tolerance) chips.push(['公差库', `${review.libraries.tolerance.name || ''} ${review.libraries.tolerance.version || ''}`])
      return h('section', { class: 'cad-card cad-card-tight' }, [
        h('div', { class: 'cad-row', style: 'gap:6px' }, [
          h('span', { class: 'cad-muted', style: 'margin-right:4px' }, '图纸概况'),
          ...chips.map(([label, value]) => this.renderBadge(`${label} ${value}`, 'cad-chip-plain')),
        ]),
        review.summary ? h('div', { class: 'cad-muted', style: 'margin-top:8px' }, review.summary) : null,
      ])
    },

    renderLlm(llm) {
      const h = this.vueH
      if (!llm.enabled) {
        return h('section', { class: 'cad-llm' }, [h('b', {}, '本次未进行大模型复查'), ' 仅运行本地规则引擎。'])
      }
      if (!llm.ok) {
        return h('section', { class: 'cad-alert cad-alert-warn' }, [
          h('b', {}, '大模型复查未完成'),
          `：${llm.message || llm.errorCode || '模型不可用'} 当前结果不代表完整审查。`,
          llm.coverage ? h('div', { class: 'cad-muted' }, `模型批次：初审 ${llm.coverage.initialCompleted ?? 0}/${llm.coverage.total ?? 0}，复查 ${llm.coverage.completed ?? 0}/${llm.coverage.total ?? 0}。`) : null,
          llm.errorDetail ? h('div', { class: 'cad-muted', style: 'margin-top:4px' }, `诊断：${llm.errorDetail}`) : null,
          h('div', { class: 'cad-row', style: 'margin-top:8px' }, [
            h('button', { type: 'button', class: 'cad-btn cad-btn-sm', onClick: () => this.switchTab('logs') }, '查看本机日志'),
          ]),
        ])
      }
      return h('section', { class: 'cad-llm' }, [
        h('div', { class: 'cad-row-between' }, [
          h('b', {}, '大模型复查意见'),
          h('span', { class: 'cad-muted' }, `${llm.model?.providerId || ''}/${llm.model?.modelId || ''} · ${llm.formatMode === 'text' ? '纯文本 JSON' : '结构化输出'} · 复核 ${llm.reviewedTotal ?? llm.reviewed} 条 · 存疑 ${llm.flagged ?? llm.reviewed} 条 · 补充 ${llm.added} 条 · ${this.formatMs(llm.elapsedMs)}`),
        ]),
        h('div', { class: 'cad-row', style: 'margin-top:6px;gap:6px' }, [
          this.renderBadge(`模型意见 ${llm.verdict || '—'}`, 'cad-chip-严重'),
          h('span', { class: 'cad-muted' }, '模型意见需要核对原文与图纸证据。'),
        ]),
        llm.coverage ? h('div', { class: 'cad-muted', style: 'margin-top:6px' }, `模型批次：初审 ${llm.coverage.initialCompleted ?? 0}/${llm.coverage.total ?? 0}，复查 ${llm.coverage.completed ?? 0}/${llm.coverage.total ?? 0}。${llm.coverage.drawingEvidence ? `图纸文字 ${llm.coverage.drawingEvidence.includedTexts}/${llm.coverage.drawingEvidence.totalTexts}，尺寸 ${llm.coverage.drawingEvidence.includedDimensions}/${llm.coverage.drawingEvidence.totalDimensions}；${llm.coverage.drawingEvidence.note}` : ''}`) : null,
        llm.verdict === '不符合' && !llm.added && !llm.reviewed ? h('div', { class: 'cad-alert cad-alert-warn' }, '模型提出不符合意见，但没有可展示的具体问题；请核对模型摘要和本地初查候选。') : null,
        llm.summary ? h('div', { style: 'margin-top:6px' }, llm.summary) : null,
        llm.notes?.length
          ? h(
              'ul',
              { class: 'cad-list', style: 'margin-top:6px' },
              llm.notes.map(note => h('li', {}, note))
            )
          : null,
        h('div', { class: 'cad-muted', style: 'margin-top:6px' }, '模型补充项标记为「疑似不符合」，本地初查候选和模型意见均需人工核对。'),
      ])
    },

    renderFinding(item) {
      const h = this.vueH
      const open = Boolean(this.expanded[item.id])
      const showEvidence = Boolean(this.showEvidence[item.id])
      const severity = this.severityClass(item.severity)
      return h('article', { class: 'cad-finding', key: item.id }, [
        h(
          'div',
          {
            class: 'cad-finding-head',
            role: 'button',
            tabindex: '0',
            'aria-expanded': String(open),
            onClick: () => this.toggleExpanded(item.id),
            onKeydown: event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                this.toggleExpanded(item.id)
              }
            },
          },
          [
            h('div', { class: 'cad-finding-main' }, [
              h('div', { class: 'cad-row', style: 'gap:6px' }, [
                this.renderBadge(item.ruleId, 'cad-chip-plain'),
                item.checkpoint ? this.renderBadge(item.checkpoint, 'cad-chip-plain') : null,
                this.renderBadge(item.severity, `cad-chip-${severity}`),
                this.renderBadge(item.conclusion || '不符合', item.conclusion === '不符合' ? 'cad-chip-关键' : 'cad-chip-严重'),
                item.source === 'llm' ? this.renderBadge('模型补充', 'cad-chip-plain') : null,
                item.llmOpinion === 'refute' ? this.renderBadge('模型存疑', 'cad-chip-严重') : null,
                item.llmOpinion === 'confirm' ? this.renderBadge('模型确认', 'cad-chip-pass') : null,
              ]),
              h('div', { class: 'cad-finding-title' }, item.title),
            ]),
            h('span', { class: 'cad-muted', style: 'font-size:18px;line-height:1' }, open ? '−' : '+'),
          ]
        ),
        h('div', { class: 'cad-finding-meta' }, [
          this.renderField('命中位置', `${item.location?.label || '—'}（${round(item.location?.x)}, ${round(item.location?.y)}）`),
          this.renderField('实测值', item.measured || '—'),
          this.renderField('标准值', item.expected || '—'),
        ]),
        open
          ? h('div', { class: 'cad-finding-body' }, [
              h('div', {}, [
                h('div', { class: 'cad-field-label' }, '依据标准/条款'),
                h('div', { class: 'cad-field-value' }, [item.basis, item.clause].filter(Boolean).join(' · ') || '—'),
              ]),
              item.detail ? h('div', {}, [h('div', { class: 'cad-field-label' }, '判定说明'), h('div', { class: 'cad-field-value' }, item.detail)]) : null,
              h('div', {}, [h('div', { class: 'cad-field-label' }, '修改建议'), h('div', { class: 'cad-field-value' }, item.suggestion || '—')]),
              item.llmReason || item.llmOpinion
                ? h('div', {}, [
                    h('div', { class: 'cad-field-label' }, '大模型复查'),
                    h('div', { class: 'cad-field-value' }, `${item.llmOpinion || '—'}${item.llmReason ? `：${item.llmReason}` : ''}`),
                  ])
                : null,
              h('div', { class: 'cad-row', style: 'gap:8px' }, [
                h('span', { class: 'cad-muted' }, `置信度 ${Math.round((item.confidence || 0) * 100)}%`),
                item.libraryVersion ? h('span', { class: 'cad-code' }, `库 ${item.libraryName || ''} ${item.libraryVersion}`) : null,
                h('span', { style: 'flex:1' }),
                item.evidence
                  ? h('button', { type: 'button', class: 'cad-btn cad-btn-sm cad-btn-ghost', onClick: event => { event.stopPropagation(); this.toggleEvidence(item.id) } }, showEvidence ? '收起证据' : '查看证据')
                  : null,
              ]),
              showEvidence && item.evidence
                ? h('pre', { class: 'cad-pre' }, JSON.stringify(item.evidence, null, 2))
                : null,
            ])
          : null,
      ])
    },

    renderField(label, value) {
      const h = this.vueH
      return h('div', {}, [
        h('div', { class: 'cad-field-label' }, label),
        h('div', { class: 'cad-field-value' }, String(value)),
      ])
    },

    // ── 渲染：规则库 ──
    renderRuleFilesCard() {
      const h = this.vueH
      const files = this.ruleFiles || []
      const warnings = [...(this.ruleWarnings || []), ...(this.catalog?.warnings || [])]
      return h('section', { class: 'cad-card' }, [
        h('div', { class: 'cad-row-between' }, [
          h('div', {}, [
            h('h2', { class: 'cad-card-title', style: 'margin:0' }, '规则文件'),
            h(
              'div',
              { class: 'cad-muted' },
              '这里显示上传文件的提取正文；可编辑并保存新版本，上传原件保持不变。'
            ),
          ]),
          h('div', { class: 'cad-row', style: 'gap:6px' }, [
            h('input', {
              ref: 'ruleFileInput',
              type: 'file',
              accept: '.json,.yaml,.yml,.docx,.pdf,.md,.markdown,.txt,.xml,.html,.htm,.rtf,.xlsx',
              style: 'display:none',
              onChange: this.onRuleFileChange,
            }),
            h(
              'button',
              { type: 'button', class: 'cad-btn cad-btn-sm cad-btn-primary', onClick: this.pickRuleFile, disabled: this.ruleUploading },
              this.ruleUploading ? '导入中…' : '上传规则文件'
            ),
          ]),
        ]),
        warnings.length
          ? h(
              'div',
              { class: 'cad-alert cad-alert-warn', style: 'margin-top:10px' },
              warnings.map((warning, index) => h('div', { key: `w-${index}` }, `· ${warning}`))
            )
          : null,
        files.length
          ? h('table', { class: 'cad-table', style: 'margin-top:10px' }, [
              h('thead', {}, [
                h('tr', {}, [
                  h('th', {}, '规则文件'),
                  h('th', {}, '版本'),
                  h('th', {}, '来源'),
                  h('th', {}, '规则/检查点'),
                  h('th', {}, '状态'),
                  h('th', {}, ''),
                ]),
              ]),
              h(
                'tbody',
                {},
                files.map(item =>
                  h('tr', { key: item.id }, [
                    h('td', {}, [
                      h('div', { style: 'font-weight:600' }, item.name),
                      h('div', { class: 'cad-muted' }, item.sourceFile || item.id),
                    ]),
                    h('td', {}, item.version || '—'),
                    h('td', {}, this.renderBadge(sourceTypeLabel(item.sourceType), 'cad-chip-plain')),
                    h('td', { class: 'cad-muted' }, `${item.ruleCount || 0} / ${item.checkpointCount || 0}`),
                    h('td', {}, this.renderSwitch(item.active ? '启用' : '停用', Boolean(item.active), value => this.toggleRuleFile(item.id, value))),
                    h('td', {}, [
                      h('button', { type: 'button', class: 'cad-btn cad-btn-sm', disabled: !item.sourceId || this.sourceBusy, onClick: () => this.openSource(item.sourceId) }, '查看和编辑正文'),
                      h(
                        'button',
                        { type: 'button', class: 'cad-btn cad-btn-sm cad-btn-ghost', onClick: () => this.deleteRuleFile(item.id) },
                        '删除'
                      ),
                    ]),
                  ])
                )
              ),
            ])
          : this.renderEmpty('还没有规则文件'),
        h(
          'div',
          { class: 'cad-callout', style: 'margin-top:10px' },
          '结构化规则可执行本地检查；其他正文由模型结合图纸证据审查。'
        ),
      ])
    },

    renderRulesTab() {
      const h = this.vueH
      if (!this.catalog) return this.renderEmpty('规则集尚未加载')
      return h('div', { class: 'cad-panel' }, [
        this.renderRuleFilesCard(),
        this.source && this.ruleFiles.some(item => item.sourceId === this.source.id) ? h('section', { class: 'cad-card' }, [
          h('h2', { class: 'cad-card-title' }, `${this.source.fileName} · 提取正文`),
          h('div', { class: 'cad-muted' }, '编辑识别正文后保存为新版本；上传原件不变。更新标准集合版本后使用新内容，识别或人工编辑内容均需核对。'),
          this.sourceError ? h('div', { class: 'cad-alert cad-alert-error' }, this.sourceError) : null,
          this.source.originalExtraction?.complete === false ? h('div', { class: 'cad-alert cad-alert-warn' }, `提取可能不完整：${this.source.preview?.reason || this.source.originalExtraction.reason}`) : null,
          h('textarea', { class: 'cad-input cad-source-editor', value: this.sourceDraft, disabled: this.sourceBusy, onInput: event => { this.sourceDraft = event.target.value } }),
          h('div', { class: 'cad-row', style: 'margin-top:10px' }, [
            h('button', { type: 'button', class: 'cad-btn cad-btn-primary', disabled: this.sourceBusy, onClick: () => this.updateSource('edit') }, '保存正文新版本'),
            h('button', { type: 'button', class: 'cad-btn', disabled: this.sourceBusy || this.health?.capabilities?.llm !== true, onClick: () => this.updateSource('recalibrate') }, '由模型重新识别'),
          ]),
          h('div', { class: 'cad-muted' }, `历史版本：${this.source.history?.length || 0} 个`),
        ]) : this.renderEmpty('选择规则文件的“查看和编辑正文”以核对提取内容。'),
      ])
    },

    renderThresholdInput(label, key, unit) {
      const h = this.vueH
      return h('label', { class: 'cad-metric', style: 'display:flex;flex-direction:column;gap:6px' }, [
        h('span', { class: 'cad-metric-label', style: 'margin:0' }, label),
        h('div', { class: 'cad-row', style: 'gap:6px' }, [
          h('input', {
            class: 'cad-input',
            type: 'number',
            step: '0.01',
            value: this.draft?.thresholds?.[key] ?? '',
            onInput: event => this.setThreshold(key, event.target.value),
            style: 'width:110px',
          }),
          h('span', { class: 'cad-muted' }, unit),
        ]),
      ])
    },

    renderRuleCard(rule) {
      const h = this.vueH
      const enabled = this.enabledRules.has(rule.id)
      return h('article', { class: `cad-rule ${enabled ? '' : 'is-off'}`, key: rule.id }, [
        h('div', { class: 'cad-rule-head' }, [
          h('span', { class: 'cad-rule-id' }, rule.id),
          h('span', { class: 'cad-rule-name' }, rule.name),
          this.renderBadge(rule.severity, `cad-chip-${this.severityClass(rule.severity)}`),
          rule.ruleClass ? this.renderBadge(`${rule.ruleClass} 类`, 'cad-chip-plain') : null,
          this.renderBadge(rule.standard, 'cad-chip-plain'),
          this.renderBadge(rule.checkType || 'llmOnly', 'cad-chip-plain'),
          rule.sourceFileName ? this.renderBadge(`来源 ${rule.sourceFileName}`, 'cad-chip-plain') : null,
          h('span', { style: 'flex:1' }),
          this.renderSwitch(enabled ? '已启用' : '已停用', enabled, () => this.toggleRule(rule.id)),
        ]),
        h('div', { class: 'cad-rule-logic' }, rule.logic),
        h('div', { class: 'cad-grid' }, [
          h('div', {}, [
            h('div', { class: 'cad-field-label' }, '检查点'),
            h(
              'ul',
              { class: 'cad-list' },
              (rule.checkpoints || []).map(checkpointItem => {
                const id = typeof checkpointItem === 'string' ? checkpointItem : checkpointItem.id
                const known = typeof checkpointItem === 'object' ? checkpointItem : this.catalog.checkpoints.find(item => item.id === id)
                return h('li', {}, `${id}　${known?.defect || ''}`)
              })
            ),
          ]),
          h('div', {}, [
            h('div', { class: 'cad-field-label' }, '例外与豁免'),
            h('ul', { class: 'cad-list' }, (rule.exceptions || []).map(text => h('li', {}, text))),
          ]),
        ]),
      ])
    },

    // ── 渲染：标准库 ──
    renderLibrariesTab() {
      const h = this.vueH
      const files = this.libraries || []
      const selectedLibrary = this.source && files.some(item => item.sourceId === this.source.id)
      return h('div', { class: 'cad-panel' }, [
        h('section', { class: 'cad-card' }, [
          h('div', { class: 'cad-row-between' }, [
            h('div', {}, [
              h('h2', { class: 'cad-card-title', style: 'margin:0' }, '标准库文件'),
              h('div', { class: 'cad-muted' }, '上传审查所需的标准、材料目录、公差表或参考资料。标准库可以不启用，集合中按需选择。'),
            ]),
            h('div', { class: 'cad-row', style: 'gap:6px' }, [
              h('input', { ref: 'libraryFileInput', type: 'file', accept: '.json,.yaml,.yml,.csv,.txt,.md,.markdown,.xml,.html,.htm,.rtf,.pdf,.docx,.xlsx', style: 'display:none', onChange: this.onLibraryFileChange }),
              h('button', { type: 'button', class: 'cad-btn cad-btn-sm cad-btn-primary', onClick: this.pickLibraryFile, disabled: this.libraryUploading }, this.libraryUploading ? '导入中…' : '上传标准库'),
            ]),
          ]),
        ]),
        this.libraryWarnings.length ? h('div', { class: 'cad-alert cad-alert-warn' }, this.libraryWarnings.map((warning, index) => h('div', { key: `lib-w-${index}` }, warning))) : null,
        h('section', { class: 'cad-card' }, [
          files.length ? h('table', { class: 'cad-table' }, [
            h('thead', {}, h('tr', {}, ['文件', '版本', '类型', '状态', ''].map(label => h('th', {}, label)))),
            h('tbody', {}, files.map(item => h('tr', { key: item.id }, [
              h('td', {}, [h('div', { style: 'font-weight:600' }, item.sourceFile || item.name), h('div', { class: 'cad-muted' }, item.name)]),
              h('td', {}, item.version || '—'),
              h('td', {}, this.renderBadge(sourceTypeLabel(item.sourceType), 'cad-chip-plain')),
              h('td', {}, item.type === 'material' || item.type === 'tolerance'
                ? this.renderSwitch(item.active ? '启用' : '停用', Boolean(item.active), value => this.toggleLibrary(item.id, value))
                : this.renderBadge('可引用', 'cad-chip-pass')),
              h('td', {}, [
                h('button', { type: 'button', class: 'cad-btn cad-btn-sm', disabled: !item.sourceId || this.sourceBusy, onClick: () => this.openSource(item.sourceId) }, '查看和编辑正文'),
                h('button', { type: 'button', class: 'cad-btn cad-btn-sm cad-btn-ghost', onClick: () => this.deleteLibrary(item.id) }, '删除'),
              ]),
            ]))),
          ]) : this.renderEmpty('还没有上传标准库文件'),
          h('div', { class: 'cad-muted', style: 'margin-top:8px' }, '支持 JSON、YAML、CSV、TXT、Markdown、XML、HTML、RTF、PDF 和 DOCX。无法结构化解析的文件会作为模型参考资料。'),
        ]),
        selectedLibrary ? h('section', { class: 'cad-card' }, [
          h('h2', { class: 'cad-card-title' }, `${this.source.fileName} · 提取正文`),
          h('div', { class: 'cad-muted' }, '保存会新增正文版本，上传原件不变。后续集合版本固定使用保存时的正文。'),
          this.sourceError ? h('div', { class: 'cad-alert cad-alert-error' }, this.sourceError) : null,
          this.source.originalExtraction?.complete === false ? h('div', { class: 'cad-alert cad-alert-warn' }, `提取可能不完整：${this.source.preview?.reason || this.source.originalExtraction.reason}`) : null,
          h('textarea', { class: 'cad-input cad-source-editor', value: this.sourceDraft, disabled: this.sourceBusy, onInput: event => { this.sourceDraft = event.target.value } }),
          h('div', { class: 'cad-row', style: 'margin-top:10px' }, [
            h('button', { type: 'button', class: 'cad-btn cad-btn-primary', disabled: this.sourceBusy, onClick: () => this.updateSource('edit') }, '保存正文新版本'),
            h('button', { type: 'button', class: 'cad-btn', disabled: this.sourceBusy || this.health?.capabilities?.llm !== true, onClick: () => this.updateSource('recalibrate') }, '由模型重新识别'),
          ]),
          h('div', { class: 'cad-muted' }, `历史版本：${this.source.history?.length || 0} 个`),
        ]) : null,
      ])
    },

    // ── 渲染：历史 ──
    renderHistoryTab() {
      const h = this.vueH
      if (this.historyDetail) {
        return h('div', { class: 'cad-panel' }, [
          h('div', { class: 'cad-row-between' }, [
            h('div', {}, [
              h('div', { style: 'font-weight:600' }, this.historyDetail.fileName),
              h('div', { class: 'cad-muted' }, `${this.formatTime(this.historyDetail.createdAt)} · ${this.formatBytes(this.historyDetail.fileSize)} · ${this.historyDetail.sha256?.slice(0, 12) || ''}`),
            ]),
            h('button', { type: 'button', class: 'cad-btn', onClick: () => (this.historyDetail = null) }, '返回列表'),
          ]),
          this.renderResult(this.historyDetail.result, true),
        ])
      }
      return h('section', { class: 'cad-card' }, [
        h('div', { class: 'cad-row-between', style: 'margin-bottom:10px' }, [
          h('h2', { class: 'cad-card-title', style: 'margin:0' }, `审查记录（本机 ${this.history.length} 条）`),
          h('div', { class: 'cad-row', style: 'gap:6px' }, [
            h('button', { type: 'button', class: 'cad-btn cad-btn-sm', onClick: this.refreshHistory }, this.historyLoading ? '刷新中…' : '刷新'),
          ]),
        ]),
        this.history.length
          ? h('table', { class: 'cad-table' }, [
              h('thead', {}, [
                h('tr', {}, [
                  h('th', {}, '时间'),
                  h('th', {}, '图纸'),
                  h('th', {}, '图幅'),
                  h('th', {}, '结论'),
                  h('th', {}, '问题'),
                  h('th', {}, '模型'),
                  h('th', {}, '耗时'),
                  h('th', {}, ''),
                ]),
              ]),
              h(
                'tbody',
                {},
                this.history.map(item =>
                  h(
                    'tr',
                    {
                      key: item.id,
                      style: 'cursor:pointer',
                      title: '点击查看审查详情',
                      onClick: () => this.openReview(item.id),
                    },
                    [
                    h('td', { class: 'cad-muted' }, this.formatTime(item.createdAt)),
                    h('td', {}, [h('span', { class: 'cad-link' }, item.fileName)]),
                    h('td', {}, item.sheet || '—'),
                    h('td', {}, this.renderBadge(item.verdict, item.verdict === '符合' ? 'cad-chip-pass' : item.verdict === '待确认' ? 'cad-chip-严重' : 'cad-chip-关键')),
                    h('td', {}, `${item.findings || 0}`),
                    h('td', { class: 'cad-muted' }, item.llmOk ? `已复核 +${item.llmAdded || 0}` : '本地规则'),
                    h('td', { class: 'cad-muted' }, this.formatMs(item.elapsedMs)),
                    h('td', {}, [
                      h(
                        'button',
                        {
                          type: 'button',
                          class: 'cad-btn cad-btn-sm',
                          onClick: event => {
                            event.stopPropagation()
                            this.openReview(item.id)
                          },
                        },
                        '查看'
                      ),
                      h(
                        'button',
                        {
                          type: 'button',
                          class: 'cad-btn cad-btn-sm cad-btn-ghost',
                          onClick: event => this.deleteReview(item.id, event),
                        },
                        '删除'
                      ),
                    ]),
                    ])
                )
              ),
            ])
          : this.renderEmpty(this.historyLoading ? '读取中…' : '还没有审查记录'),
      ])
    },

    // ── 渲染：日志 ──
    renderPathCard(label, pathValue, target, meta) {
      const h = this.vueH
      return h('div', { class: 'cad-metric', style: 'min-width:0' }, [
        h('div', { class: 'cad-field-label' }, label),
        h(
          'div',
          { class: 'cad-code', style: 'display:block;margin-top:4px;word-break:break-all;white-space:pre-wrap;font-size:11px' },
          pathValue || '（尚未生成）'
        ),
        meta ? h('div', { class: 'cad-muted', style: 'margin-top:6px' }, meta) : null,
        h('div', { class: 'cad-row', style: 'gap:6px;margin-top:8px' }, [
          h('button', { type: 'button', class: 'cad-btn cad-btn-sm', onClick: () => this.copyText(pathValue || '') }, '复制路径'),
          h('button', { type: 'button', class: 'cad-btn cad-btn-sm', onClick: () => this.openLogPath(target) }, '打开位置'),
        ]),
      ])
    },

    renderLogsTab() {
      const h = this.vueH
      const paths = this.logPaths || {}
      const hostMeta = paths.hostLogExists
        ? `${this.formatBytes(paths.hostLogSize || 0)} · ${this.formatTime(paths.hostLogMtime)}`
        : '尚未写入（首次插件日志后生成）'
      return h('div', { class: 'cad-panel' }, [
        h('section', { class: 'cad-card' }, [
          h('div', { class: 'cad-row-between' }, [
            h('h2', { class: 'cad-card-title', style: 'margin:0' }, '本机日志与数据位置'),
            h('button', { type: 'button', class: 'cad-btn cad-btn-sm', onClick: this.refreshLogs }, this.logsLoading ? '刷新中…' : '刷新'),
          ]),
          h('div', { class: 'cad-grid-log', style: 'margin-top:12px' }, [
            this.renderPathCard('宿主插件日志（router.log · JSON Lines）', paths.hostLogFile, 'host', hostMeta),
            this.renderPathCard('今日审计日志（NDJSON）', paths.auditFile, 'auditFile', paths.auditStat?.exists ? this.formatBytes(paths.auditStat.size) : '尚未写入'),
            this.renderPathCard('审查记录目录（本机 JSON）', paths.reviewsDir, 'reviews', '每次审查的完整结果与索引'),
            this.renderPathCard('规则文件目录', paths.rulesDir, 'rules', '上传的 JSON/DOCX 规则与索引'),
          ]),
          h('div', { class: 'cad-muted', style: 'margin-top:10px;word-break:break-all' }, [
            h('div', {}, ['宿主插件日志目录：', h('span', { class: 'cad-code' }, paths.hostLogDir || '—')]),
            h('div', { style: 'margin-top:4px' }, ['插件数据目录：', h('span', { class: 'cad-code' }, paths.dataDir || '—')]),
          ]),
          h('div', { class: 'cad-callout', style: 'margin-top:8px' }, '复制的是真实绝对路径，可直接粘贴到资源管理器/终端；“打开位置”会调用本机文件管理器定位文件或目录。审计日志只记录元数据，不保存图纸正文。'),
        ]),
        h('section', { class: 'cad-card' }, [
          h('h2', { class: 'cad-card-title' }, `最近审计事件（${this.logs.length}）`),
          this.logs.length
            ? h('table', { class: 'cad-table' }, [
                h('thead', {}, [
                  h('tr', {}, [
                    h('th', {}, '时间'),
                    h('th', {}, '事件'),
                    h('th', {}, '图纸'),
                    h('th', {}, '结论'),
                    h('th', {}, '问题'),
                    h('th', {}, '模型'),
                    h('th', {}, '诊断'),
                    h('th', {}, '耗时'),
                  ]),
                ]),
                h(
                  'tbody',
                  {},
                  this.logs.map((item, index) =>
                    h('tr', { key: `${item.time}-${index}` }, [
                      h('td', { class: 'cad-muted' }, this.formatTime(item.time)),
                      h('td', {}, item.event || '—'),
                      h('td', {}, item.fileName || '—'),
                      h('td', {}, item.verdict || item.errorCode || '—'),
                      h('td', {}, item.findings === undefined ? '—' : String(item.findings)),
                      h('td', { class: 'cad-muted' }, item.llmOk === undefined ? '—' : item.llmOk ? `已复核 +${item.llmAdded || 0}` : '本地规则'),
                      h('td', { class: 'cad-muted', style: 'max-width:260px;word-break:break-word' }, item.errorDetail || item.parseReason || '—'),
                      h('td', { class: 'cad-muted' }, item.elapsedMs ? this.formatMs(item.elapsedMs) : '—'),
                    ])
                  )
                ),
              ])
            : this.renderEmpty(this.logsLoading ? '读取中…' : '暂无审计事件'),
        ]),
      ])
    },

    // ── 渲染：设置 ──
    renderSettingsTab() {
      const h = this.vueH
      if (!this.draft) return this.renderEmpty('设置尚未加载')
      return h('div', { class: 'cad-panel' }, [
        h('section', { class: 'cad-card' }, [
          h('h2', { class: 'cad-card-title' }, '审查与存储'),
          h('div', { class: 'cad-grid' }, [
            h('label', { style: 'display:flex;flex-direction:column;gap:6px' }, [
              h('span', { class: 'cad-field-label' }, '审查记录保留天数（0 = 不按时间清理）'),
              h('input', {
                class: 'cad-input',
                type: 'number',
                min: '0',
                max: '3650',
                value: this.draft.retentionDays,
                onInput: event => (this.draft.retentionDays = Number(event.target.value)),
              }),
            ]),
            h('label', { style: 'display:flex;flex-direction:column;gap:6px' }, [
              h('span', { class: 'cad-field-label' }, '最多保留记录条数（20~2000）'),
              h('input', {
                class: 'cad-input',
                type: 'number',
                min: '20',
                max: '2000',
                value: this.draft.maxReviews,
                onInput: event => (this.draft.maxReviews = Number(event.target.value)),
              }),
            ]),
          ]),
          h('div', { class: 'cad-muted', style: 'margin-top:8px' }, '审查记录与审计日志写入插件本机数据目录；原始图纸只在内存中解析，不落盘。'),
        ]),
        h('section', { class: 'cad-card' }, [
          h('h2', { class: 'cad-card-title' }, '诊断信息'),
          h('dl', { class: 'cad-kv' }, [
            h('dt', {}, '插件版本'),
            h('dd', {}, this.health?.pluginVersion || '—'),
            h('dt', {}, '规则集'),
            h('dd', {}, `${this.catalog?.name || '—'}（${this.catalog?.version || '—'}）`),
            h('dt', {}, '规则文件'),
            h('dd', {}, `${this.activeRuleFileCount} 个启用 / ${(this.ruleFiles || []).length} 个已导入`),
            h('dt', {}, '模型能力'),
            h('dd', {}, this.llmAvailable ? '可用' : '不可用'),
            h('dt', {}, 'DXF 解析'),
            h('dd', {}, '内置解析器（ASCII DXF R12~R2018）'),
            h('dt', {}, '材料库'),
            h('dd', {}, this.activeLibrary('material') ? `${this.activeLibrary('material').name}（${this.activeLibrary('material').version}）` : '未启用'),
            h('dt', {}, '公差库'),
            h('dd', {}, this.activeLibrary('tolerance') ? `${this.activeLibrary('tolerance').name}（${this.activeLibrary('tolerance').version}）` : '未启用'),
            h('dt', {}, 'DWG 转换'),
            h('dd', {}, this.dwgAvailable ? '内置 LibreDWG WASM（GPL-3.0/AGPL-3.0，本机转换）' : '不可用'),
            h('dt', {}, '日志'),
            h('dd', {}, this.logPaths?.hostLogFile || this.health?.logs?.pluginLog || '—'),
          ]),
        ]),
        h('div', { class: 'cad-row' }, [
          h('button', { type: 'button', class: 'cad-btn cad-btn-primary', onClick: () => this.saveSettings(), disabled: this.saving }, this.saving ? '保存中…' : '保存设置'),
          h('button', { type: 'button', class: 'cad-btn', onClick: () => (this.draft = this.cloneSettings(this.settings)) }, '放弃修改'),
        ]),
      ])
    },
  },

  // ── 根渲染 ──
  render() {
    try {
      const h = this.vueH
      if (this.booting) {
        return h('div', { class: 'cad-root' }, [h('div', { class: 'cad-empty' }, '正在加载 CAD 图样标准化审查插件…')])
      }
      if (this.bootError) {
        return h('div', { class: 'cad-root' }, [
          h('div', { class: 'cad-alert cad-alert-error' }, [
            h('div', { style: 'font-weight:600;margin-bottom:4px' }, '插件后端不可用'),
            h('div', {}, this.bootError),
            h('button', { type: 'button', class: 'cad-btn cad-btn-sm', style: 'margin-top:8px', onClick: this.bootstrap }, '重试'),
          ]),
        ])
      }
      return h('div', { class: 'cad-root' }, [
        this.renderHeader(),
        this.renderTabs(),
        h('main', { class: 'cad-content' }, [
        this.tab === 'review' ? this.renderReviewTab() : null,
        this.tab === 'rules' ? this.renderRulesTab() : null,
        this.tab === 'libraries' ? this.renderLibrariesTab() : null,
        this.tab === 'collections' ? this.renderCollectionsTab() : null,
        this.tab === 'history' ? this.renderHistoryTab() : null,
        this.tab === 'logs' ? this.renderLogsTab() : null,
        this.tab === 'settings' ? this.renderSettingsTab() : null,
        ]),
        this.toast
          ? h('div', { class: `cad-toast ${this.toast.type === 'error' ? 'is-error' : this.toast.type === 'success' ? 'is-success' : ''}` }, this.toast.message)
          : null,
      ])
    } catch (error) {
      this.logVueError(error, 'render')
      throw error
    }
  },
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function sourceTypeLabel(value) {
  return (
    {
      builtin: '内置',
      json: 'JSON',
      docx: 'DOCX',
      xlsx: 'XLSX',
      pdf: 'PDF',
      yaml: 'YAML',
      yml: 'YAML',
      xml: 'XML',
      html: 'HTML',
      htm: 'HTML',
      rtf: 'RTF',
      markdown: 'Markdown',
      md: 'Markdown',
      csv: 'CSV',
      txt: '文本',
      document: '文档',
    }[String(value || '').toLowerCase()] || String(value || '—')
  )
}

function round(value) {
  if (value === null || value === undefined || value === '') return '—'
  const number = Number(value)
  return Number.isFinite(number) ? Math.round(number * 10) / 10 : '—'
}
