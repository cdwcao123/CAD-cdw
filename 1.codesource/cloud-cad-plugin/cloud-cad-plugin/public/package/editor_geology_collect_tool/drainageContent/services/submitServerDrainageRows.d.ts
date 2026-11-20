import type { DrainageServerContext, DrainageSyncRow } from '../types/interface';
import type { DrainageSyncType } from '../types/type';
/**
 * 统一预检新增和覆盖两批数据，再顺序提交，避免后一批参数错误造成部分写入。
 * @param type 当前同步类型。
 * @param context 当前矿井的服务器记录及关联表。
 * @param rows 待提交的本地新增或已采用本地的冲突行。
 * @param onBatchSaved 每批成功后通知调用方；后续批次失败时，调用方据此刷新已写入结果。
 * @returns 所有非空批次保存后，重新查询确认选中实体均已同步才结束。
 * @throws 参数预检、保存或回读核对失败时抛出错误，不回滚已保存的服务器批次。
 */
export declare function submitServerDrainageRows(type: DrainageSyncType, context: DrainageServerContext, rows: DrainageSyncRow[], onBatchSaved: () => void): Promise<void>;
