import type { DrainageSyncLocalOperation } from '../types/interface';
/**
 * 在一条可撤销命令中获取、覆盖或删除本地抽采实体，先预检全部选中行。
 * @param operation 当前图纸、操作类型及选中行快照。
 * @returns 命令成功后完成；没有选中行时直接返回。
 * @throws 图纸切换、关联不明、锁定图层或 Core 写入失败时抛出错误。
 */
export declare function runDrainageSyncLocalOperation(operation: DrainageSyncLocalOperation): Promise<void>;
