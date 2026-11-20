/**
 * 创建新增钻场的服务端字段模板，业务值由本地实体映射后填写。
 * @returns 包含接口实测字段的独立对象；无本地来源的附加字段保留空值。
 */
export declare function createServerDrillSiteTemplate(): Record<string, unknown>;
/**
 * 创建四类钻孔共用的服务端字段模板。
 * @returns 独立的新增记录；施工、验收及展示字段无本地来源时为 null。
 */
export declare function createServerBoreholeTemplate(): Record<string, unknown>;
