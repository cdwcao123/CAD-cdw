import type { DirectionalDesignResultSheet, DirectionalReverseSession } from '../types/interface';
/**
 * 在当前活动图纸高亮指定定向钻，参数页签和反演页签共用此入口。
 * @param entityId 对应图纸实体的 objectId；未生成实体时省略。
 * @returns 无返回值，未就绪或已删除时不改变选择，不修改正式实体。
 */
export declare function highlightDirectionalSheet(entityId?: string): void;
/**
 * 按工作表类别导入定向钻，设计孔仅补建，成孔创建或更新实际孔，整批支持保存和取消。
 * @param session 当前弹框持有的会话及此前已导入的工作表。
 * @param sheets 已校验重算的设计、成孔工作表，孔号读取 E1，旧模板按实际孔处理。
 * @param drawingKey 用户开始读取文件时的图纸 key。
 * @returns 成功写入的轨迹工作表数；全部为已有设计孔时返回 0，原会话不变。
 * @throws 图纸切换或重载、重复钻孔、命令占用、实体写入失败时抛错，原会话保持可恢复。
 */
export declare function importDirectionalReverseSheets(session: DirectionalReverseSession, sheets: DirectionalDesignResultSheet[], drawingKey: string): Promise<number>;
/**
 * 撤销选中的轨迹 Sheet：删除新建实体，并恢复本会话首次修改前的已有钻孔。
 * @param session 当前弹框的反演会话。
 * @param keys 待撤销的 Sheet key；单孔删除传当前高亮页签，取消整个会话时传全部 key。
 * @returns 图纸撤销完成后移除对应页签；失败时保留页签供重试。
 * @throws 共用反演事务检测到图纸失效、实体锁定或撤销失败时继续抛错。
 */
export declare function deleteDirectionalReverseSheets(session: DirectionalReverseSession, keys: ReadonlySet<string>): Promise<void>;
