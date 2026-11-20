import type { McDbEntity } from 'McCore';
/**
 * 解析关联巷道的显示名称。
 * @param source 保存关联字段的当前图纸实体。
 * @param tunnelID 巷道实体 ID；兼容旧数据保存的巷道编码。
 * @returns 关联巷道名称；未关联或目标实体已不存在时返回空字符串。
 */
export declare function resolveTunnelDisplayName(source: McDbEntity, tunnelID: string): string;
/**
 * 解析关联钻场的显示名称。
 * @param source 保存关联字段的当前图纸实体。
 * @param siteID 钻场实体 ID；兼容旧数据直接保存的钻场号。
 * @returns 钻场号作为业务显示名称；未关联或目标实体已不存在时返回空字符串。
 */
export declare function resolveDrillSiteDisplayName(source: McDbEntity, siteID: string): string;
