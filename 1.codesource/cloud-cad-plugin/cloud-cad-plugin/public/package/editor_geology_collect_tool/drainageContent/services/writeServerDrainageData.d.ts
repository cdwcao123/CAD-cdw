import type { DrainageCloudCadSaveRequest, DrainageServerContext, DrainageSyncRow, EvaluationUnitSaveItem } from '../types/interface';
import type { DrainageSyncType } from '../types/type';
/**
 * 构建 SaveListForm 表单参数；所有选中行验证完成后才允许发出写请求。
 * @param type 当前同步类型。
 * @param context 已查询的矿井抽采记录及钻场关联数据。
 * @param rows 本地新增或已确定关联的冲突行。
 * @param overwrite true 表示必须覆盖既有服务端 ID，false 表示只能创建新增记录。
 * @returns 已序列化的两个列表及 isSite；覆盖时以服务端对象为底稿，不修改输入记录。
 * @throws 选中行重复、关联不唯一或实体参数不满足服务端写入要求时抛出错误。
 */
export declare function createDrainageSaveRequest(type: DrainageSyncType, context: DrainageServerContext, rows: DrainageSyncRow[], overwrite: boolean): DrainageCloudCadSaveRequest | EvaluationUnitSaveItem[];
/**
 * 发出保存请求；业务失败保持原列表，成功由调用方重新 GET 核实结果。
 * @param type 当前同步类型。
 * @param context 当前矿井的服务端关联表。
 * @param rows 待提交的本地实体行。
 * @param overwrite 是否覆写已有服务器记录。
 * @returns 保存成功后完成，不在此处修改本地行。
 * @throws 预检失败或服务器返回非 200 业务码时抛出错误。
 */
export declare function saveServerDrainageData(type: DrainageSyncType, context: DrainageServerContext, rows: DrainageSyncRow[], overwrite: boolean): Promise<void>;
/**
 * 按真实服务端 ID 删除已核实属于本矿井的记录，业务失败不移除前端行。
 * @param type 待删除的钻场、钻孔或评价单元类型。
 * @param context 当前矿井的服务端上下文。
 * @param rows 已确认矿井归属的服务端行。
 * @returns 删除成功后完成，由调用方重新读取服务端列表。
 * @throws 行缺少 ID、重复或服务器返回非 200 业务码时抛出错误。
 */
export declare function deleteServerDrainageData(type: DrainageSyncType, context: DrainageServerContext, rows: DrainageSyncRow[]): Promise<void>;
