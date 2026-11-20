import type { GasAreaReverseRow, GasAreaReverseSession } from '../types/interface';
/**
 * 创建独立评价单元反演会话。
 * @returns 未绑定图纸、未修改实体的响应式会话。
 */
export declare function createGasAreaReverseSession(): GasAreaReverseSession;
/**
 * 导入后立即渲染并追加独立结果行；同名和重复导入均新建，不覆盖已有单元。
 * @param session 当前反演面板会话。
 * @param rows Excel 解析结果，包含错误行。
 * @param drawingKey 文件选择时固定的图纸 key。
 * @returns 本批成功新建的评价单元数量。
 * @throws 图纸变化、插件未就绪或整批写入失败时抛错，不登记失败批次。
 */
export declare function importGasAreaRows(session: GasAreaReverseSession, rows: GasAreaReverseRow[], drawingKey: string): Promise<number>;
/**
 * 删除结果行时只删除对应的本次新建单元，整批失败保持原会话。
 * @param session 当前反演会话。
 * @param rowIds 待删除行 ID；取消时传全部行。
 * @returns 成功删除图形并移除对应结果行后结束。
 * @throws 图纸切换、目标锁定或事务失败时抛错。
 */
export declare function deleteGasAreaRows(session: GasAreaReverseSession, rowIds: ReadonlySet<string>): Promise<void>;
/**
 * 保存前检查所有结果均已生成且仍属于当前活动图纸，不重复写入实体。
 * @param session 待确认的会话。
 * @returns 全部图形有效时结束。
 * @throws 无数据、存在错误行、图纸失效或图形已被删除时抛错。
 */
export declare function assertGasAreaCanSave(session: GasAreaReverseSession): void;
