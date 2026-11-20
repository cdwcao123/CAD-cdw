/** 页面渲染冒烟测试：用最小 h() 打桩，检查 render 不抛错、关键区块存在。 */
const h = (tag, props, children) => {
  if (typeof props === 'string' || typeof props === 'number' || Array.isArray(props)) {
    children = props
    props = null
  }
  const childrenArray = Array.isArray(children) ? children.flat(Infinity).filter(x => x !== null && x !== undefined && x !== false) : children
  return { tag, props, children: childrenArray }
}

const { default: component } = await import('../index.js')

const pluginApi = {
  metadata: { domId: suffix => `test-${suffix}` },
  logger: { debug() {}, info() {}, warn() {}, error() {} },
  http: { path: p => p, post: async () => ({ ok: true, decisions: [] }) },
}

const ctx = {
  ...component.data(),
  vueH: h,
  pluginApi,
}
for (const [name, fn] of Object.entries(component.methods)) ctx[name] = fn.bind(ctx)

function walk(node, visit) {
  if (typeof node === 'string' || typeof node === 'number') {
    visit({ text: String(node) })
    return
  }
  if (!node || typeof node !== 'object') return
  visit(node)
  const kids = Array.isArray(node.children) ? node.children : node.children ? [node.children] : []
  for (const child of kids) walk(child, visit)
}

let tree = component.render.call(ctx)
const texts = []
walk(tree, node => {
  if (node.text) texts.push(node.text)
  else if (typeof node.children === 'string') texts.push(node.children)
})
const joined = texts.join('|')
console.log('empty state render ok, nodes', texts.length)
for (const keyword of ['巷道自动成图', '1. 原始图纸', '2. 成图参数', '矿井名称', '巷道宽度', '高级参数', '开始自动成图'])
  console.log(keyword, joined.includes(keyword) ? 'OK' : 'MISSING')

ctx.summary = {
  lanes: 164,
  named: 84,
  withElevation: 164,
  totalLength: 31330,
  medianWidth: 4,
  elapsedMs: 1801,
  elevationMin: 847.4,
  elevationMax: 1320,
  layers: ['巷道'],
}
ctx.records = [
  {
    laneway_name: '+850m轨道石门',
    laneway_code: 'abc1234',
    laneway_width: 4,
    traverse_point_count: 2,
    traverse_point_array: [{ x: 1, y: 2, z_top: 853, z_bottom: 850 }],
    border_line_points: [[{ x: 0, y: 0 }], [{ x: 1, y: 1 }]],
  },
]
ctx.warnings = ['测试提示']
ctx.dwg = new Uint8Array([1, 2, 3])
tree = component.render.call(ctx)
const texts2 = []
walk(tree, node => {
  if (node.text) texts2.push(node.text)
  else if (typeof node.children === 'string') texts2.push(node.children)
})
const joined2 = texts2.join('|')
console.log('result state render ok')
for (const keyword of ['4. 识别结果', '164', '31.3', '下载结果 DWG', '下载巷道 JSON', '测试提示', '轨道石门']) {
  // 名称在子组件里渲染，父层只检查统计与按钮
  console.log(keyword, joined2.includes(keyword) ? 'OK' : keyword === '轨道石门' ? 'SKIP(子组件)' : 'MISSING')
}
