/**
 * 坐标配准：从图纸中的 "X=…/Y=…" 坐标注记反求相似变换，
 * 把图纸坐标统一到矿区测量坐标系（x=东坐标，y=北坐标）。
 */

const X_RE = /^[Xx]\s*[=＝]\s*(-?\d{3,12}(?:\.\d+)?)\s*(?:m|米)?$/
const Y_RE = /^[Yy]\s*[=＝]\s*(-?\d{3,12}(?:\.\d+)?)\s*(?:m|米)?$/

/** 收集成对的坐标注记控制点。 */
export function findControlPoints(texts) {
  const xs = []
  const ys = []
  for (const t of texts) {
    const text = String(t.text || '').trim()
    const mx = text.match(X_RE)
    if (mx) {
      xs.push({ x: t.x, y: t.y, value: Number(mx[1]) })
      continue
    }
    const my = text.match(Y_RE)
    if (my) ys.push({ x: t.x, y: t.y, value: Number(my[1]) })
  }
  const controls = []
  const usedY = new Set()
  for (const xItem of xs) {
    let best = -1
    let bestD = Infinity
    ys.forEach((yItem, i) => {
      if (usedY.has(i)) return
      const d = Math.hypot(xItem.x - yItem.x, xItem.y - yItem.y)
      if (d < bestD) {
        bestD = d
        best = i
      }
    })
    if (best >= 0 && bestD <= 60) {
      usedY.add(best)
      controls.push({ draw: [xItem.x, xItem.y], geo: [ys[best].value, xItem.value] })
    }
  }
  return controls
}

/** 最小二乘拟合相似变换：geo = R(θ)·s·draw + t。 */
export function fitSimilarity(controls) {
  if (!controls || controls.length < 2) return null
  const n = controls.length
  let sdx = 0
  let sdy = 0
  let sgx = 0
  let sgy = 0
  for (const c of controls) {
    sdx += c.draw[0]
    sdy += c.draw[1]
    sgx += c.geo[0]
    sgy += c.geo[1]
  }
  const cdx = sdx / n
  const cdy = sdy / n
  const cgx = sgx / n
  const cgy = sgy / n
  let num1 = 0
  let num2 = 0
  let den = 0
  for (const c of controls) {
    const px = c.draw[0] - cdx
    const py = c.draw[1] - cdy
    const qx = c.geo[0] - cgx
    const qy = c.geo[1] - cgy
    num1 += px * qx + py * qy
    num2 += px * qy - py * qx
    den += px * px + py * py
  }
  if (den < 1e-9) return null
  const a = num1 / den
  const b = num2 / den
  const scale = Math.hypot(a, b)
  if (!Number.isFinite(scale) || scale <= 0) return null
  const tx = cgx - (a * cdx - b * cdy)
  const ty = cgy - (b * cdx + a * cdy)
  let maxResidual = 0
  for (const c of controls) {
    const gx = a * c.draw[0] - b * c.draw[1] + tx
    const gy = b * c.draw[0] + a * c.draw[1] + ty
    maxResidual = Math.max(maxResidual, Math.hypot(gx - c.geo[0], gy - c.geo[1]))
  }
  return {
    a,
    b,
    tx,
    ty,
    scale: Math.round(scale * 1e4) / 1e4,
    rotation: Math.round((Math.atan2(b, a) * 180) / Math.PI * 1e3) / 1e3,
    points: n,
    maxResidual: Math.round(maxResidual * 100) / 100,
  }
}

export function applyTransform(pts, t) {
  if (!t) return pts
  const { a, b, tx, ty } = t
  return pts.map(([x, y]) => [a * x - b * y + tx, b * x + a * y + ty])
}

function plausibility(transform, bounds) {
  if (!transform) return true
  const corners = [
    [bounds.minX, bounds.minY],
    [bounds.maxX, bounds.maxY],
  ].map(([x, y]) => [transform.a * x - transform.b * y + transform.tx, transform.b * x + transform.a * y + transform.ty])
  const gx = corners.map(c => c[0])
  const gy = corners.map(c => c[1])
  const inRange = v => Math.abs(v) > 1e4 && Math.abs(v) < 1e8
  if (!gx.every(inRange) || !gy.every(inRange)) return false
  if (transform.maxResidual > 2.5) return false
  return true
}

function percentileBounds(paths) {
  const xs = []
  const ys = []
  for (const p of paths)
    for (const [x, y] of p.pts) {
      xs.push(x)
      ys.push(y)
    }
  if (!xs.length) return null
  xs.sort((a, b) => a - b)
  ys.sort((a, b) => a - b)
  const q = (arr, r) => arr[Math.min(arr.length - 1, Math.max(0, Math.floor(arr.length * r)))]
  return { minX: q(xs, 0.02), maxX: q(xs, 0.98), minY: q(ys, 0.02), maxY: q(ys, 0.98) }
}

/** 检测并应用配准；返回变换参数与提示。 */
export function georeference(paths, texts, warnings) {
  const controls = findControlPoints(texts)
  if (controls.length < 3) return { transform: null, controls: controls.length, applied: false }
  const transform = fitSimilarity(controls)
  if (!transform) return { transform: null, controls: controls.length, applied: false }
  const bounds = percentileBounds(paths)
  if (!bounds || !plausibility(transform, bounds)) return { transform: null, controls: controls.length, applied: false }
  if (Math.abs(transform.scale - 1) > 0.02 || Math.abs(transform.rotation) > 0.05)
    warnings.push(
      `已按 ${controls.length} 个 X/Y 坐标注记配准：缩放 ${transform.scale}，旋转 ${transform.rotation}°，最大残差 ${transform.maxResidual} 米。`
    )
  return { transform, controls: controls.length, applied: true }
}

/** 判断坐标是否已处于矿区测量坐标系（6～8 位、百万级）。 */
export function looksLikeSurvey(paths) {
  const bounds = percentileBounds(paths)
  if (!bounds) return false
  const ok = v => Math.abs(v) > 1e3 && Math.abs(v) < 5e7
  return ok(bounds.minX) && ok(bounds.maxX) && ok(bounds.minY) && ok(bounds.maxY)
}
