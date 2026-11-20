const CUSTOM_SCHEMA = 'mine-laneway-rules-v1'
const CALIBRATION_SCHEMA = 'laneway-calibration-v1'
const ACTIONS = new Set(['accept', 'reject', 'review_required'])
const SCOPES = new Set(['single_case', 'current_drawing', 'project'])

const finiteNumber = value => typeof value === 'number' && Number.isFinite(value)

function validateRegion(region, errors, prefix) {
  if (region == null) return
  if (typeof region !== 'object' || Array.isArray(region)) {
    errors.push(`${prefix} must be an object`)
    return
  }
  if (region.x_min != null || region.y_min != null || region.x_max != null || region.y_max != null) {
    for (const key of ['x_min', 'y_min', 'x_max', 'y_max']) {
      if (!finiteNumber(region[key])) errors.push(`${prefix}.${key} must be a number`)
    }
    if (finiteNumber(region.x_min) && finiteNumber(region.x_max) && region.x_min >= region.x_max) {
      errors.push(`${prefix}.x_min must be less than x_max`)
    }
    if (finiteNumber(region.y_min) && finiteNumber(region.y_max) && region.y_min >= region.y_max) {
      errors.push(`${prefix}.y_min must be less than y_max`)
    }
    return
  }
  for (const key of ['x', 'y', 'width', 'height']) {
    if (!finiteNumber(region[key]) || region[key] < 0) errors.push(`${prefix}.${key} must be a non-negative number`)
  }
  if (finiteNumber(region.width) && region.width <= 0) errors.push(`${prefix}.width must be positive`)
  if (finiteNumber(region.height) && region.height <= 0) errors.push(`${prefix}.height must be positive`)
}

export function validateRuleFile(rules) {
  const errors = [], warnings = []
  if (!rules || typeof rules !== 'object' || Array.isArray(rules)) {
    return { valid: false, errors: ['rule file must be a JSON object'], warnings, complexCases: 0 }
  }
  if (rules.schema_version === CALIBRATION_SCHEMA) {
    return { valid: true, errors, warnings, complexCases: 0, kind: 'calibration' }
  }
  if (rules.schema_version !== CUSTOM_SCHEMA) {
    errors.push(`schema_version must be ${CUSTOM_SCHEMA} or ${CALIBRATION_SCHEMA}`)
  }
  const collection = rules.collection_rules
  if (collection != null && (typeof collection !== 'object' || Array.isArray(collection))) {
    errors.push('collection_rules must be an object')
  } else if (collection) {
    const forbidden = {
      require_same_color_boundaries: false,
      allow_single_line_lanes: true,
      preserve_elevation_suffix: false,
      require_complete_lane_points: false,
    }
    for (const [key, value] of Object.entries(forbidden)) {
      if (collection[key] === value) errors.push(`collection_rules.${key}=${value} relaxes a required rule`)
    }
    for (const [minKey, maxKey, label] of [
      ['boundary_gap_min', 'boundary_gap_max', 'boundary gap'],
      ['point_boundary_distance_drawing_units', 'point_boundary_distance_max_drawing_units', 'point boundary distance'],
    ]) {
      if (collection[minKey] != null && (!finiteNumber(collection[minKey]) || collection[minKey] < 0)) errors.push(`collection_rules.${minKey} must be a non-negative number`)
      if (collection[maxKey] != null && (!finiteNumber(collection[maxKey]) || collection[maxKey] < 0)) errors.push(`collection_rules.${maxKey} must be a non-negative number`)
      if (finiteNumber(collection[minKey]) && finiteNumber(collection[maxKey]) && collection[minKey] > collection[maxKey]) {
        errors.push(`collection_rules.${minKey} cannot exceed ${maxKey} (${label})`)
      }
    }
    for (const key of [
      'label_association_radius_drawing_units',
      'minimum_boundary_length_drawing_units',
      'minimum_lane_length_drawing_units',
      'minimum_point_count',
      'boundary_chain_tolerance_drawing_units',
      'point_boundary_text_height_multiplier',
    ]) {
      if (collection[key] != null && (!finiteNumber(collection[key]) || collection[key] <= 0)) errors.push(`collection_rules.${key} must be positive`)
    }
    if (collection.allow_boundary_reuse != null && typeof collection.allow_boundary_reuse !== 'boolean') {
      errors.push('collection_rules.allow_boundary_reuse must be a boolean')
    }
    if (collection.analysis_region != null) validateRegion(collection.analysis_region, errors, 'collection_rules.analysis_region')
  }
  const cases = rules.complex_case_rules == null ? [] : rules.complex_case_rules
  if (!Array.isArray(cases)) {
    errors.push('complex_case_rules must be an array')
    return { valid: false, errors, warnings, complexCases: 0, kind: 'custom' }
  }
  const seen = new Set()
  cases.forEach((item, index) => {
    const prefix = `complex_case_rules[${index}]`
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      errors.push(`${prefix} must be an object`)
      return
    }
    if (!String(item.rule_id || '').trim()) errors.push(`${prefix}.rule_id is required`)
    else if (seen.has(item.rule_id)) errors.push(`${prefix}.rule_id is duplicated`)
    else seen.add(item.rule_id)
    const sourceKind = item.source_kind || 'image'
    if (!['image', 'dxf_region'].includes(sourceKind)) errors.push(`${prefix}.source_kind must be image or dxf_region`)
    if (sourceKind === 'image') {
      if (!String(item.source_image || '').trim()) errors.push(`${prefix}.source_image is required`)
      if (!/^[0-9a-f]{64}$/i.test(String(item.source_image_sha256 || ''))) errors.push(`${prefix}.source_image_sha256 must be 64 hexadecimal characters`)
    } else {
      if (!String(item.source_file || '').trim()) errors.push(`${prefix}.source_file is required for dxf_region evidence`)
      if (!/^[0-9a-f]{64}$/i.test(String(item.source_sha256 || item.source_image_sha256 || ''))) {
        errors.push(`${prefix}.source_sha256 must be 64 hexadecimal characters for dxf_region evidence`)
      }
    }
    if (!String(item.user_instruction || '').trim()) errors.push(`${prefix}.user_instruction is required`)
    if (!String(item.observed_pattern || '').trim()) errors.push(`${prefix}.observed_pattern is required`)
    if (!ACTIONS.has(item.action)) errors.push(`${prefix}.action must be accept, reject or review_required`)
    if (!SCOPES.has(item.applies_to?.scope)) errors.push(`${prefix}.applies_to.scope must be single_case, current_drawing or project`)
    if (!finiteNumber(item.confidence) || item.confidence < 0 || item.confidence > 1) errors.push(`${prefix}.confidence must be between 0 and 1`)
    if (!item.derived_rules || typeof item.derived_rules !== 'object' || Array.isArray(item.derived_rules)) errors.push(`${prefix}.derived_rules must be an object`)
    validateRegion(item.source_region, errors, `${prefix}.source_region`)
    if (item.applies_to?.scope !== 'single_case' && finiteNumber(item.confidence) && item.confidence < 0.8) {
      warnings.push(`${prefix} generalizes a low-confidence image observation; keep it review_required`)
      if (item.action !== 'review_required') errors.push(`${prefix} must use action=review_required when scope is broader than single_case and confidence < 0.8`)
    }
    if (!item.source_region) warnings.push(`${prefix} has no source_region; the image-to-DXF location must be reviewed manually`)
  })
  return { valid: errors.length === 0, errors, warnings, complexCases: cases.length, kind: 'custom' }
}
