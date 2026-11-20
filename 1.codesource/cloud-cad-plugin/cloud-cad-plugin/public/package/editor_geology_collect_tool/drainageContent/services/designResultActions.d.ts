import type { DrainageDesignResultRow } from '../types/interface';
/**
 * 按 UUID 定位并选中钻孔实体，清除旧选中后保留当前钻孔的持续高亮。
 * @param drawingKey 结果所属图纸 key。
 * @param id 结果行保存的实体 objectId，不能使用钻孔业务编号。
 * @returns 定位和高亮完成；实体不存在或图纸不匹配时抛错。
 */
export declare function locateDesignResult(drawingKey: string | undefined, id: string): Promise<void>;
/**
 * 按 UUID 选中并持续高亮钻孔实体，不改变当前图纸视口。
 * @param drawingKey 结果所属图纸 key。
 * @param id 结果行保存的实体 objectId，不能使用钻孔业务编号。
 * @returns 高亮完成；实体不存在或图纸不匹配时抛错。
 */
export declare function highlightDesignResult(drawingKey: string | undefined, id: string): Promise<void>;
/**
 * 仅移除本次成功删除的实体行，保留其余行及未删除的子实体。
 * @param rows 当前结果树。
 * @param id 已从 Core 场景删除的实体 UUID。
 * @returns 新结果树；删除带子行的实体时将未删除子行提升到原层级。
 */
export declare function removeDesignResultRow(rows: DrainageDesignResultRow[], id: string): DrainageDesignResultRow[];
/**
 * 从结果树移除指定钻孔行，保留未删除的子行及其他结果。
 * @param rows 当前结果树。
 * @param ids 已成功删除的钻孔实体 objectId 集合。
 * @returns 删除目标行后的新结果树。
 */
export declare function removeDesignResultRows(rows: DrainageDesignResultRow[], ids: ReadonlySet<string>): DrainageDesignResultRow[];
/**
 * 删除当前结果面板记录的全部设计钻孔，不扫描或影响图纸中的其他钻孔。
 * @param drawingKey 结果所属图纸 key。
 * @param rows 当前设计结果树，行 ID 必须是对应钻孔实体的 objectId。
 * @param siteEntityIds 钻场模式本次设计返回的全部钻场实体 objectId。
 * @returns 全部实体删除完成；图纸不匹配、命令占用或任一实体删除失败时抛错。
 */
export declare function deleteAllDesignResults(drawingKey: string | undefined, rows: DrainageDesignResultRow[], siteEntityIds?: readonly string[]): Promise<void>;
/**
 * 删除单条钻孔；关联钻场没有其他设计结果钻孔时一并删除，并在成功后同步弹框结果。
 * @param drawingKey 结果所属图纸 key。
 * @param rows 当前完整设计结果树，用于判断钻场是否仍有关联钻孔。
 * @param row 待删除钻孔结果；钻场模式通过 siteEntityId 同步删除钻场。
 * @returns 删除完成；Core 拒绝删除或图纸不匹配时抛错，本地数据保持原样。
 */
export declare function deleteDesignResult(drawingKey: string | undefined, rows: DrainageDesignResultRow[], row: DrainageDesignResultRow): Promise<void>;
/**
 * 批量删除勾选钻孔；关联钻场没有其他设计结果钻孔时一并删除，并在全部成功后同步弹框结果。
 * @param drawingKey 结果所属图纸 key。
 * @param rows 当前设计结果树。
 * @param ids 勾选的钻孔实体 objectId 集合。
 * @returns 删除完成；没有匹配行时直接返回。
 */
export declare function deleteDesignResults(drawingKey: string | undefined, rows: DrainageDesignResultRow[], ids: ReadonlySet<string>): Promise<void>;
