const COLOR_NAMES = new Map([
  ['red', 1],
  ['红', 1],
  ['红色', 1],
  ['yellow', 2],
  ['黄', 2],
  ['黄色', 2],
  ['green', 3],
  ['绿', 3],
  ['绿色', 3],
  ['cyan', 4],
  ['青', 4],
  ['青色', 4],
  ['blue', 5],
  ['蓝', 5],
  ['蓝色', 5],
  ['magenta', 6],
  ['洋红', 6],
  ['洋红色', 6],
  ['white', 7],
  ['black', 7],
  ['白', 7],
  ['白色', 7],
  ['黑', 7],
  ['黑色', 7],
  ['gray', 8],
  ['grey', 8],
  ['灰', 8],
  ['灰色', 8],
])

export const UNKNOWN_COLOR = 'unknown'

export function layerColorKey(fields = {}) {
  const rgb = Number(fields['420'])
  if (Number.isFinite(rgb) && rgb >= 0) return `rgb:${Math.trunc(rgb)}`
  const aci = Number(fields['62'])
  if (Number.isFinite(aci) && aci !== 0 && aci !== 256) return `aci:${Math.abs(Math.trunc(aci))}`
  return 'aci:7'
}

export function entityColorDescriptor(fields = {}) {
  const rgb = Number(fields['420'])
  if (Number.isFinite(rgb) && rgb >= 0) return { kind: 'rgb', value: Math.trunc(rgb) }
  if (fields['62'] == null || fields['62'] === '') return { kind: 'bylayer' }
  const aci = Number(fields['62'])
  if (!Number.isFinite(aci)) return { kind: 'bylayer' }
  if (aci === 0) return { kind: 'byblock' }
  if (aci === 256) return { kind: 'bylayer' }
  return { kind: 'aci', value: Math.abs(Math.trunc(aci)) }
}

export function resolveColorKey(layerColors, layer, descriptor, inheritedColor = null) {
  if (descriptor?.kind === 'rgb') return `rgb:${descriptor.value}`
  if (descriptor?.kind === 'aci') return `aci:${descriptor.value}`
  if (descriptor?.kind === 'byblock' && inheritedColor) return inheritedColor
  return layerColors.get(layer || '0') || 'aci:7'
}

export function normalizeRuleColor(value) {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0 && value < 256) return `aci:${value}`
  const text = String(value ?? '').trim().toLowerCase()
  if (!text) return null
  if (/^#?[0-9a-f]{6}$/i.test(text)) return `rgb:${parseInt(text.replace(/^#/, ''), 16)}`
  if (/^\d+$/.test(text)) {
    const aci = Number(text)
    return aci > 0 && aci < 256 ? `aci:${aci}` : null
  }
  const named = COLOR_NAMES.get(text)
  return named ? `aci:${named}` : text
}

export function dxfColorValue(colorKey) {
  const text = String(colorKey || '')
  if (/^rgb:\d+$/.test(text)) return { true_color: Number(text.slice(4)) }
  if (/^aci:\d+$/.test(text)) {
    const aci = Number(text.slice(4))
    return aci > 0 && aci < 256 ? { color: aci } : {}
  }
  return {}
}

export function sameKnownColor(a, b) {
  return Boolean(a) && Boolean(b) && a !== UNKNOWN_COLOR && b !== UNKNOWN_COLOR && a === b
}

export function colorPriorityMap(values = []) {
  return new Map(
    values
      .map(normalizeRuleColor)
      .filter(Boolean)
      .map((color, index) => [color, index])
  )
}

export function colorLayerOrder(color, priority = new Map()) {
  return priority.has(color) ? priority.get(color) : priority.size + 1000
}
