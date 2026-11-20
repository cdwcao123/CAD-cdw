import type { DrainageDesignResultRow, DrainageDesignResultTunnelOption } from '../types/interface';
/**
 * 递归收集设计结果中的巷道筛选项，显示名称但仍按编码区分巷道。
 * @param rows 完整设计结果树。
 * @returns 按编码去重的名称选项；未关联或未取得名称的记录不生成选项。
 */
export declare function getDesignResultTunnelOptions(rows: DrainageDesignResultRow[]): DrainageDesignResultTunnelOption[];
/**
 * 筛选设计结果；父行未命中但子行命中时保留父级路径。
 * @param rows 当前层级的设计结果树。
 * @param boreholeCode 孔号包含匹配文本，空字符串表示不过滤。
 * @param tunnelID 所属巷道编码，空字符串表示不过滤。
 * @returns 保留父子结构的新结果树，不修改原行。
 */
export declare function filterDesignResultRows(rows: DrainageDesignResultRow[], boreholeCode: string, tunnelID: string): DrainageDesignResultRow[];
