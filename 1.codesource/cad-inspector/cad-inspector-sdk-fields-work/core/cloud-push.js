const LANE_FIELDS = ['id','laneway_code','laneway_name','laneway_type','mineCode','mining_name','horizontal_name','mining_area_name','work_face_name','material','color','laneway_sec_style','traverse_point_count','laneway_use','laneway_height','laneway_width','support_pattern','into_or_out_wind','series_ventilation','return_air_type','excavation_status','excavation_type','current_footage','border_line_points','translate_border_line_points','traverse_point_array']
const POINT_FIELDS = ['laneway_code','point_name','point_order','radius','left_side','right_side','top_coal_thick','use_second_side','coal_seam_struct','second_left_side','bottom_coal_thick','second_right_side','x','y','z_top','z_bottom','traverse_point_type']
const value = v => v === undefined || v === null || v === '' || (typeof v === 'number' && !Number.isFinite(v)) ? null : v
const fields = (obj, names) => Object.fromEntries(names.map(key => [key, value(obj?.[key])]))
const code = v => typeof v === 'string' && /^(?:fragment-)?candidate-/i.test(v) ? null : value(v)

export function toSdkRecords(records) {
  if (!Array.isArray(records)) throw new TypeError('Expected an array of lanes')
  return records.map(lane => {
    const result = fields(lane, LANE_FIELDS)
    result.laneway_code = code(lane?.laneway_code)
    result.mineCode = value(lane?.mineCode ?? lane?.MineCode)
    result.traverse_point_array = Array.isArray(lane?.traverse_point_array) ? lane.traverse_point_array.map(point => ({ ...fields(point, POINT_FIELDS), laneway_code: code(point?.laneway_code) })) : null
    return result
  })
}

export function prepareCloudPayload(records) {
  return { ok: true, data: { data: toSdkRecords(records) } }
}
