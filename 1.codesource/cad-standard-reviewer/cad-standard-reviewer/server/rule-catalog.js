// 运行时规则完全来自规则库；该空集合仅作为未提供规则时的安全默认值。
export const RULE_SET = { id: '', name: '', version: '', thresholds: {}, rules: [], checkpoints: [], sources: [], warnings: [] }
export const SEVERITY_ORDER = { 关键: 0, 严重: 1, 一般: 2, 提示: 3 }
export const SEVERITY_LABEL = { 关键: '关键', 严重: '严重', 一般: '一般', 提示: '提示' }

export function getRule(ruleSet, ruleId) {
  return (ruleSet?.rules || []).find(rule => rule.id === ruleId)
}

export function publicCatalog(ruleSet = RULE_SET) {
  return {
    id: ruleSet.id,
    version: ruleSet.version,
    name: ruleSet.name,
    scope: ruleSet.scope || '',
    boundary: ruleSet.boundary || '',
    thresholds: ruleSet.thresholds,
    rules: (ruleSet.rules || []).map(rule => ({ ...rule })),
    checkpoints: (ruleSet.checkpoints || []).map(item => ({ ...item })),
    sourceType: ruleSet.sourceType || 'builtin',
    sources: ruleSet.sources || [],
    warnings: ruleSet.warnings || [],
  }
}
