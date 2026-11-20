import type { DrainageSyncRow } from '../types/interface';
import type { DrainageSyncType } from '../types/type';
import type { McCore } from 'McCore';
/**
 * 按同步菜单类型读取本地实体及详情快照，不推断服务器同步状态。
 * @param core 已就绪的图纸内核。
 * @param type 同步菜单类型；评价单元采集名称、类型和边界坐标快照。
 * @returns 以实体 objectId 为稳定标识的只读列表，不改变实体和选择集。
 */
export declare function collectLocalSyncRows(core: McCore, type: DrainageSyncType): DrainageSyncRow[];
