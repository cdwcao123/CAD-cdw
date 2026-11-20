/**
 * 结果图纸写出：把巷道记录写成 DWG（默认 R2018）。
 * 输出图层：巷道中线、巷道边界、巷道名称。
 */
import {
  CadDocument,
  LwPolyline,
  LwPolylineVertex,
  XY,
  XYZ,
  TextEntity,
  Layer,
  Color,
  ACadVersion,
  DwgWriter,
  TextStyle,
  BlockRecord,
  Insert,
  Circle,
} from '../vendor/acad-bundle.js'
const LAYERS = {
  center: { name: '巷道中线', color: 3 },
  border: { name: '巷道边界', color: 4 },
  label: { name: '巷道名称', color: 7 },
  frame: { name: '成图信息', color: 8 },
  point: { name: '巷道点', color: 2 },
}

/** 中文标注必须用带中文字形的字体，否则 CAD 里显示成“??”。 */
function ensureTextStyle(doc) {
  let style = null
  try {
    style = doc.textStyles.get('巷道标注')
  } catch {
    style = null
  }
  if (!style) {
    style = new TextStyle('巷道标注')
    style.filename = 'txt.shx'
    style.bigFontFilename = 'gbcbig.shx'
    style.height = 0
    style.width = 1
    doc.textStyles.add(style)
  }
  return style
}

function ensureLayers(doc) {
  const map = {}
  for (const [key, def] of Object.entries(LAYERS)) {
    let layer = null
    try {
      layer = doc.layers.get(def.name)
    } catch {
      layer = null
    }
    if (!layer) {
      layer = new Layer()
      layer.name = def.name
      layer.color = new Color(def.color)
      doc.layers.add(layer)
    }
    map[key] = layer
  }
  return map
}

function addPolyline(ms, layer, points) {
  if (!points || points.length < 2) return
  const pl = new LwPolyline()
  for (const p of points) pl.vertices.push(new LwPolylineVertex(new XY(p[0], p[1])))
  pl.layer = layer
  ms.entities.add(pl)
}

function addPointMark(ms, circleLayer, textLayer, x, y, z, style) {
  const c = new Circle()
  c.center = new XYZ(x, y, 0)
  c.radius = 0.5
  c.layer = circleLayer
  ms.entities.add(c)
  if (Number.isFinite(z)) addText(ms, textLayer, `${Math.round(z * 10) / 10}`, x + 1.0, y - 0.8, 2.0, 0, style)
}

function addText(ms, layer, value, x, y, height = 2.5, rotation = 0, style = null) {
  const text = new TextEntity()
  text.value = value
  if (style) text.style = style
  // 注意：acad-ts 的 TextEntity 用 insertPoint（不是 insertionPoint），写错会全部落在原点。
  text.insertPoint = new XYZ(x, y, 0)
  text.alignmentPoint = new XYZ(x, y, 0)
  text.height = height
  text.rotation = rotation
  text.layer = layer
  ms.entities.add(text)
}

function midpoint(points) {
  let total = 0
  for (let i = 1; i < points.length; i++) total += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1])
  let acc = 0
  for (let i = 1; i < points.length; i++) {
    const d = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1])
    if (acc + d >= total / 2) {
      const t = d < 1e-9 ? 0 : (total / 2 - acc) / d
      return [points[i - 1][0] + (points[i][0] - points[i - 1][0]) * t, points[i - 1][1] + (points[i][1] - points[i - 1][1]) * t]
    }
    acc += d
  }
  return points[0]
}

export function buildDwg(records, { version = 'R2018', title = '', mode = 'double', showPoints = false, pointSpacing = 40, showNames = false, greenLane = true } = {}) {
  // 全局点位去重：多条巷道在岔口共用点位，逐条画会叠成一团圆圈
  const drawnPoints = new Set()
  const drawnZ = new Set()
  const pointKey = (x, y) => `${Math.round(x / 6)}:${Math.round(y / 6)}`
  const drawPointIfNew = (ms, layers, p, style, ox = 0, oy = 0) => {
    const key = pointKey(p.x, p.y)
    if (drawnPoints.has(key)) return
    drawnPoints.add(key)
    const z = p.z_bottom == null ? NaN : Number(p.z_bottom)
    const zKey = Number.isFinite(z) ? `${Math.round(z * 10)}@${Math.round(p.x / 200)}:${Math.round(p.y / 200)}` : ''
    const showZ = !!zKey && !drawnZ.has(zKey)
    if (showZ) drawnZ.add(zKey)
    addPointMark(ms, layers.point, layers.label, p.x - ox, p.y - oy, showZ ? z : null, style)
  }
  const doc = new CadDocument()
  doc.header.version = version === 'R2000' ? ACadVersion.AC1015 : version === 'R2004' ? ACadVersion.AC1018 : version === 'R2007' ? ACadVersion.AC1021 : ACadVersion.AC1032
  doc.header.codePage = 'ANSI_936'
  const textStyle = ensureTextStyle(doc)
  const layers = ensureLayers(doc)
  if (mode === 'manual' || mode === 'points') {
    // 与人工采集图一致：巷道为绿色（ACI 3）
    layers.center.color = new Color(greenLane ? 4 : 5)
    layers.border.color = new Color(greenLane ? 4 : 5)
    layers.label.color = new Color(7)
  }
  const ms = doc.blockRecords.get('*Model_Space')

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  let laneIndex = 0
  for (const record of records) {
    laneIndex++
    const center = record.traverse_point_array.map(p => [p.x, p.y])
    for (const p of center) {
      if (p[0] < minX) minX = p[0]
      if (p[1] < minY) minY = p[1]
      if (p[0] > maxX) maxX = p[0]
      if (p[1] > maxY) maxY = p[1]
    }
    const [mx, my] = midpoint(center)

    if (mode === 'points') {
      // 采集数据形态：中心线 + 抽稀点位 + 标高（双帮线交给 MAS 系统按宽度生成）
      addPolyline(ms, layers.center, center)
      let lastX = null
      let lastY = null
      const pts = record.traverse_point_array
      pts.forEach((p, idx) => {
        const far = lastX === null || Math.hypot(p.x - lastX, p.y - lastY) >= pointSpacing
        if (!far && idx !== pts.length - 1) return
        lastX = p.x
        lastY = p.y
        drawPointIfNew(ms, layers, p, textStyle)
      })
    } else if (mode === 'manual') {
      // 人工采集图样式：一条巷道 = 一个块（单线 + 每个点圆圈 + 标高数字）
      const ox = Math.round(center[0][0] * 1000) / 1000
      const oy = Math.round(center[0][1] * 1000) / 1000
      const name = `巷道_${laneIndex}_${String(record.laneway_code || laneIndex).replace(/[<>/\\":;?*|=,]/g, '_').slice(0, 36)}`
      let blockRecord = null
      try {
        blockRecord = doc.blockRecords.get(name)
      } catch {
        blockRecord = null
      }
      if (!blockRecord) {
        blockRecord = new BlockRecord(name)
        doc.blockRecords.add(blockRecord)
        addPolyline(blockRecord, layers.center, center.map(p => [Math.round((p[0] - ox) * 1000) / 1000, Math.round((p[1] - oy) * 1000) / 1000]))
        let lx = null
        let ly = null
        const rp = record.traverse_point_array
        rp.forEach((p, idx) => {
          const far = lx === null || Math.hypot(p.x - lx, p.y - ly) >= pointSpacing
          if (!far && idx !== rp.length - 1) return
          lx = p.x
          ly = p.y
          drawPointIfNew(blockRecord, layers, p, textStyle, ox, oy)
        })
        const insert = new Insert()
        insert.block = blockRecord
        insert.insertPoint = new XYZ(ox, oy, 0)
        insert.layer = layers.center
        ms.entities.add(insert)
      }
    } else if (mode === 'block') {
      // 一条巷道 = 一个块参照：查看器里鼠标移上去整条（中线+两帮+名称）一起高亮
      const ox = Math.round(center[0][0] * 1000) / 1000
      const oy = Math.round(center[0][1] * 1000) / 1000
      const name = `巷道_${laneIndex}_${String(record.laneway_code || record.laneway_name).replace(/[<>/\\":;?*|=,]/g, '_').slice(0, 36)}`
      let blockRecord = null
      try {
        blockRecord = doc.blockRecords.get(name)
      } catch {
        blockRecord = null
      }
      if (!blockRecord) {
        blockRecord = new BlockRecord(name)
        doc.blockRecords.add(blockRecord)
        const rel = pts => pts.map(p => [Math.round((p[0] - ox) * 1000) / 1000, Math.round((p[1] - oy) * 1000) / 1000])
        addPolyline(blockRecord, layers.center, rel(center))
        if (showPoints)
          for (const p of record.traverse_point_array)
            addPointMark(blockRecord, layers.point, layers.label, p.x - ox, p.y - oy, p.z_bottom, textStyle)
        for (const border of record.border_line_points) addPolyline(blockRecord, layers.border, rel(border.map(p => [p.x, p.y])))
        addText(blockRecord, layers.label, record.laneway_name, mx - ox, my - oy + record.laneway_width / 2 + 1.2, 2.2, 0, textStyle)
        const insert = new Insert()
        insert.block = blockRecord
        insert.insertPoint = new XYZ(ox, oy, 0)
        insert.layer = layers.center
        ms.entities.add(insert)
      }
    } else {
      addPolyline(ms, layers.center, center)
      if (mode !== 'center')
        for (const border of record.border_line_points) addPolyline(ms, layers.border, border.map(p => [p.x, p.y]))
      if (showNames) addText(ms, layers.label, record.laneway_name, mx, my + record.laneway_width / 2 + 1.2, 2.2, 0, textStyle)
      if (showPoints)
        for (const p of record.traverse_point_array)
          addPointMark(ms, layers.point, layers.label, p.x, p.y, p.z_bottom, textStyle)
    }
  }

  if (records.length && Number.isFinite(minX)) {
    const info = `巷道自动成图：${records.length} 条${title ? `　工程：${title}` : ''}`
    addText(ms, layers.frame, info, minX, maxY + 12, 4, 0, textStyle)
    addText(ms, layers.frame, `生成时间：${new Date().toISOString().slice(0, 19).replace('T', ' ')}　坐标系统：图纸坐标系`, minX, maxY + 6, 3, 0, textStyle)
  }

  // 打开即定位到图面：模型空间激活 + 图形范围 + 视口中心/高度。
  // 不设置时 AutoCAD 会停在 0,0 的默认视图，看起来是"空白图纸"。
  if (records.length && Number.isFinite(minX)) {
    const pad = Math.max(20, (maxX - minX) * 0.05, (maxY - minY) * 0.05)
    const header = doc.header
    header.showModelSpace = true
    header.modelSpaceExtMin = new XYZ(minX - pad, minY - pad, 0)
    header.modelSpaceExtMax = new XYZ(maxX + pad, maxY + pad, 0)
    header.modelSpaceLimitsMin = new XY(minX - pad, minY - pad)
    header.modelSpaceLimitsMax = new XY(maxX + pad, maxY + pad)
    header.modelSpaceInsertionBase = new XYZ(minX, minY, 0)
    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2
    const spanX = Math.max(1, maxX - minX)
    const spanY = Math.max(1, maxY - minY)
    try {
      const vp = doc.vPorts?.get('*Active')
      if (vp) {
        // 注意：acad-ts 写出的 VPORT 会被 AutoCAD 解释为“视图中心 = center + target”，
        // 若把 target 也设成图面中心，打开后镜头会跑到 2 倍坐标处（看起来就是空白）。
        vp.center = new XY(centerX, centerY)
        vp.target = new XYZ(0, 0, 0)
        vp.viewHeight = spanY * 1.8
        vp.aspectRatio = 1.6
      }
    } catch {
      /* 视口缺失不影响图元 */
    }
  }

  const buffer = DwgWriter.writeToBuffer(doc)
  return new Uint8Array(buffer)
}

/** 自检图：三条线 + 一段文字 + 一个闭合框，用于快速确认本机能否正常打开插件写出的 DWG。 */
export function buildDemoDwg() {
  const doc = new CadDocument()
  doc.header.version = ACadVersion.AC1032
  doc.header.codePage = 'ANSI_936'
  const textStyle = ensureTextStyle(doc)
  const layers = ensureLayers(doc)
  if (mode === 'manual' || mode === 'points') {
    // 与人工采集图一致：巷道为绿色（ACI 3）
    layers.center.color = new Color(greenLane ? 4 : 5)
    layers.border.color = new Color(greenLane ? 4 : 5)
    layers.label.color = new Color(7)
  }
  const ms = doc.blockRecords.get('*Model_Space')
  addPolyline(ms, layers.center, [[0, 0], [60, 0], [60, 40]])
  addPolyline(ms, layers.border, [[0, -2], [60, -2], [60, 38]])
  addPolyline(ms, layers.border, [[0, 2], [60, 2], [60, 42]])
  addPolyline(ms, layers.frame, [[-20, -15], [90, -15], [90, 60], [-20, 60], [-20, -15]])
  addText(ms, layers.label, `巷道自动成图 自检图 ${new Date().toISOString().slice(0, 10)}`, 0, 48, 4, 0, textStyle)
  addText(ms, layers.label, '若能看到这些线与文字，说明插件写出的 DWG 正常', 0, 52, 3, 0, textStyle)
  const header = doc.header
  header.showModelSpace = true
  header.modelSpaceExtMin = new XYZ(-25, -20, 0)
  header.modelSpaceExtMax = new XYZ(95, 65, 0)
  header.modelSpaceLimitsMin = new XY(-25, -20)
  header.modelSpaceLimitsMax = new XY(95, 65)
  header.modelSpaceInsertionBase = new XYZ(-25, -20, 0)
  try {
    const vp = doc.vPorts?.get('*Active')
    if (vp) {
      vp.center = new XY(35, 22)
      vp.target = new XYZ(0, 0, 0)
      vp.viewHeight = 100
      vp.aspectRatio = 1.6
    }
  } catch {
    /* 忽略 */
  }
  return new Uint8Array(DwgWriter.writeToBuffer(doc))
}
