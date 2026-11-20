import type { DrainageCoalStratum, DrainageReverseRow, DrainageReverseSession } from '../types/interface';
import type { DrainageReverseMode, DrainageStraightBoreholeCategory } from '../types/type';
/**
 * 创建跨弹框挂载保留的反演会话。
 * @returns 尚未绑定图纸、未创建实体的响应式会话。
 */
export declare function createDrainageReverseSession(): DrainageReverseSession;
/**
 * 导入即新增或更新实体；异型数据直接跳过，同孔再次导入替换旧结果行，目标类型的失败行保留错误。
 * @param session 当前弹框持有的反演会话。
 * @param rows Excel 原始行，行 ID 将添加批次前缀。
 * @param mode 导入对象为钻孔或钻场。
 * @param drawingKey 导入操作所属的图纸 key。
 * @param loadedCoalStrata 本次操作已加载的煤层快照；界面覆盖旧结果前先加载，避免接口失败丢失旧结果，省略时由本函数加载。
 * @param category 钻孔菜单所属孔型；传入时仅匹配并创建该类型钻孔，省略时保留通用导入行为。
 * @returns 成功生成图形的行数；一行两个钻孔仍计为一行。
 * @throws 地层加载失败、图纸切换、重新加载或整批实体写入失败时抛出错误，不登记未完成批次。
 */
export declare function importDrainageReverseRows(session: DrainageReverseSession, rows: DrainageReverseRow[], mode: DrainageReverseMode, drawingKey: string, loadedCoalStrata?: DrainageCoalStratum[], category?: DrainageStraightBoreholeCategory): Promise<number>;
/**
 * 根据反演行映射定位反演孔或钻场；同一行附带设计孔时仍优先定位反演孔。
 * @param session 已生成反演实体的当前会话。
 * @param rowId 反演表格行 ID，通过 entityIds 获取真实 objectId，不按业务编号查找。
 * @returns 无返回值；仅调整视图和选择，不修改实体或保存状态。
 * @throws 图纸不匹配、行未生成实体或对应实体已失效时抛出错误。
 */
export declare function locateDrainageReverseRow(session: DrainageReverseSession, rowId: string): void;
/**
 * 撤销指定行：删除本会话新建的孔，并恢复原有反演孔首次导入前的数据。
 * @param session 持有实体 ID 及首次更新前快照的反演会话。
 * @param rowIds 要删除的表格行 ID；取消整个会话时传入全部行。
 * @returns 恢复或删除图形后清理对应行、映射及快照，原有设计孔保持不变。
 * @throws 图纸失效、命令未结束或实体删除失败时抛出错误，保留会话记录供重试。
 */
export declare function deleteDrainageReverseRows(session: DrainageReverseSession, rowIds: ReadonlySet<string>): Promise<void>;
/**
 * 保存前检查每一行新建或更新的全部实体仍存在，不重复写入图形。
 * @param session 待确认的反演会话。
 * @returns 全部行及其反演孔、配套设计孔有效时正常返回。
 * @throws 存在错误行、图纸失效或任一生成实体已删除/撤销时抛出错误。
 */
export declare function assertDrainageReverseCanSave(session: DrainageReverseSession): void;
/**
 * 释放已保存或已取消会话的数据引用，不执行图纸实体删除。
 * @param session 已完成保存或取消处理的会话。
 * @returns 清空行、实体映射及图纸绑定后结束。
 */
export declare function clearDrainageReverseSession(session: DrainageReverseSession): void;
