import type { DrainageSyncLocalOperation, DrainageSyncLocalTarget, DrainageSyncRow } from '../types/interface';
import type { McCore } from 'McCore';
/**
 * 将一条服务器钻孔记录展开为设计、实际两个落图目标，同步时保持两套主孔和分支独立。
 * @param core 当前图纸内核，用于确认已有实体及设计、实际身份。
 * @param row 已转换服务器详情的钻孔同步行。
 * @param action 获取、采用服务器或删除；删除同时处理聚合行内的全部本地钻孔。
 * @returns 单个或两个目标；新建实际孔的 objectId 及本地编号使用 _fy，覆盖已有孔保留实体 ID。
 * @throws 服务器详情缺失、没有可渲染的设计或实际数据，或本地关联不唯一时抛出错误。
 */
export declare function resolveBoreholeSyncLocalTargets(core: McCore, row: DrainageSyncRow, action: DrainageSyncLocalOperation['action']): DrainageSyncLocalTarget[];
