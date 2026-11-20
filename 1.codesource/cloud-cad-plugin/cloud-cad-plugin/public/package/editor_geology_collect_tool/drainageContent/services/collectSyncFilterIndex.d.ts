import type { DrainageSyncFilterIndex } from '../types/interface';
import type { McCore } from 'McCore';
/**
 * 从当前图纸建立本地同步筛选索引，钻场和钻孔的工作面沿正式巷道关联解析。
 * 评价单元的工作面直接读取自身 workFaceCode，钻孔成员只用于建立钻孔与评价单元的关联。
 * @param core 已就绪的当前图纸内核。
 * @returns 独立的实体归属和显示字典；不修改正式实体，也不写入同步数据快照。
 */
export declare function collectSyncFilterIndex(core: McCore): DrainageSyncFilterIndex;
