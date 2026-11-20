/** 识别结果明细表（纯文本表格，不含任何 CAD 图形预览）。 */
export default {
  inject: ['vueH'],
  props: {
    records: { type: Array, default: () => [] },
  },
  data() {
    return { limit: 50 }
  },
  render() {
    const h = this.vueH
    const rows = this.records.slice(0, this.limit)
    return h('div', { style: 'overflow:auto;max-height:360px;border:1px solid var(--sys-color-border-main);border-radius:var(--radius-sm)' }, [
      h('table', { class: 'lw-table' }, [
        h('thead', [
          h('tr', [
            h('th', '#'),
            h('th', '巷道名称'),
            h('th', '巷道编码'),
            h('th', '底板标高'),
            h('th', '顶板标高'),
            h('th', '宽度'),
            h('th', '节点数'),
          ]),
        ]),
        h(
          'tbody',
          rows.map((r, i) => {
            const first = r.traverse_point_array[0] || {}
            return h('tr', [
              h('td', String(i + 1)),
              h('td', r.laneway_name),
              h('td', r.laneway_code),
              h('td', String(first.z_bottom ?? '')),
              h('td', String(first.z_top ?? '')),
              h('td', String(r.laneway_width)),
              h('td', String(r.traverse_point_count)),
            ])
          })
        ),
      ]),
      this.records.length > this.limit
        ? h(
            'p',
            { style: 'margin:8px;color:var(--sys-color-text-muted);font-size:var(--fs-body-sm)' },
            `仅显示前 ${this.limit} 条，完整数据请下载 JSON。`
          )
        : null,
    ])
  },
}
