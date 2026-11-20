const LANE_FIELDS = ['id','laneway_code','laneway_name','laneway_type','mineCode','mining_name','horizontal_name','mining_area_name','work_face_name','material','color','laneway_sec_style','traverse_point_count','laneway_use','laneway_height','laneway_width','support_pattern','into_or_out_wind','series_ventilation','return_air_type','excavation_status','excavation_type','current_footage','border_line_points','translate_border_line_points','traverse_point_array']
const POINT_FIELDS = ['laneway_code','point_name','point_order','radius','left_side','right_side','top_coal_thick','use_second_side','coal_seam_struct','second_left_side','bottom_coal_thick','second_right_side','x','y','z_top','z_bottom','traverse_point_type']
const POINT_NUMBERS = ['point_order','radius','left_side','right_side','top_coal_thick','second_left_side','bottom_coal_thick','second_right_side','x','y','z_top','z_bottom']
const copyFields = (object, fields) => Object.fromEntries(fields.filter(k => object[k] !== undefined).map(k => [k, object[k]]))

export function prepareCloudPayload(records) {
  if (!Array.isArray(records) || !records.length) throw new Error('请选择非空巷道数组。')
  if (records.length > 2000) throw new Error('单次最多推送 2000 条。')
  const issues = [], codes = new Set(), data = []
  for (const [index, lane] of records.entries()) {
    const label = `第 ${index + 1} 条`
    if (!lane || typeof lane !== 'object' || Array.isArray(lane)) { issues.push(`${label}不是巷道对象`); continue }
    const code = lane.laneway_code
    if (typeof code !== 'string' || !code.trim() || /^(?:fragment-)?candidate-/i.test(code) || codes.has(code)) issues.push(`${label}巷道编码缺失、重复或仍为候选编码`)
    else codes.add(code)
    const mineCode = lane.mineCode ?? lane.MineCode
    if (!(typeof mineCode === 'string' && mineCode.trim()) && !(typeof lane.mining_name === 'string' && lane.mining_name.trim())) issues.push(`${label}缺少矿井编码和矿井名称`)
    for (const key of ['laneway_height','laneway_width','current_footage']) if (!Number.isFinite(lane[key])) issues.push(`${label}缺少数值 ${key}`)
    const points = lane.traverse_point_array
    if (!Array.isArray(points) || points.length < 2) { issues.push(`${label}导线点不足`); continue }
    if (!Number.isInteger(lane.traverse_point_count) || lane.traverse_point_count !== points.length) issues.push(`${label}导线点数量不一致`)
    const pointData = []
    for (const [j, p] of points.entries()) {
      if (!p || typeof p !== 'object') { issues.push(`${label}第 ${j + 1} 点无效`); continue }
      for (const key of POINT_NUMBERS) if (!Number.isFinite(p[key])) issues.push(`${label}第 ${j + 1} 点缺少数值 ${key}`)
      if (Number.isFinite(p.point_order) && !Number.isInteger(p.point_order)) issues.push(`${label}第 ${j + 1} 点顺序必须为整数`)
      if (typeof p.use_second_side !== 'boolean') issues.push(`${label}第 ${j + 1} 点缺少 use_second_side`)
      if (p.laneway_code !== code) issues.push(`${label}第 ${j + 1} 点巷道编码不一致`)
      pointData.push(copyFields(p, POINT_FIELDS))
    }
    if (!Array.isArray(lane.border_line_points) || lane.border_line_points.some(line => !Array.isArray(line) || line.some(p => !p || !Number.isFinite(p.x) || !Number.isFinite(p.y)))) issues.push(`${label}帮线坐标无效`)
    const mapped = copyFields(lane, LANE_FIELDS)
    if (mineCode !== undefined) mapped.mineCode = mineCode
    mapped.traverse_point_array = pointData
    data.push(mapped)
  }
  if (issues.length) return { ok: false, issues, data: null }
  return { ok: true, issues: [], data: { data } }
}
