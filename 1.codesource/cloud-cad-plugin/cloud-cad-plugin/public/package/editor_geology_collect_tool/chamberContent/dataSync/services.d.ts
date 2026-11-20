import { type McCore } from 'McCore';
import type { ChamberSyncComparison, ChamberSyncLoadResult, ChamberSyncRow } from './types';
import type { McDbChamber } from '@/core_geology_collect_tool/mcDbChamber/entity/mcDbChamber';
/**
 * 加载服务器硐室数据
 * @returns 服务器硐室数据
 */
export declare const loadServerChambers: () => Promise<ChamberSyncLoadResult>;
/** 本地新增数据提交服务器（SourceAdd） */
export declare const submitChambersToServer: (rows: ChamberSyncRow[]) => Promise<void>;
/** 冲突数据覆盖服务器（SourceUpdate），沿用服务器原始记录 id 做原地更新 */
export declare const updateChambersToServer: (rows: ChamberSyncRow[], serverRows: ChamberSyncRow[]) => Promise<void>;
/** 删除服务器硐室数据（SourceDelete），keyValues 使用服务器记录 id */
export declare const deleteChambersFromServer: (rows: ChamberSyncRow[]) => Promise<void>;
/**
 * 获取图纸中所有的本地硐室数据
 * @returns 本地硐室同步行数组
 */
export declare const loadLocalChambers: () => ChamberSyncRow[];
/**
 * 依据服务器数据在当前图纸绘制硐室
 * @description 主键由 modelToChamber 从接口 chamber_code 带入，绘制后本地实体 objectId 与服务器记录一致
 */
export declare const drawServerChambersToLocal: (core: McCore, rows: ChamberSyncRow[]) => McDbChamber | null;
/** 删除本地硐室实体 */
export declare const eraseLocalChambers: (rows: ChamberSyncRow[]) => void;
export declare const compareChambers: (localRows: ChamberSyncRow[], serverRows: ChamberSyncRow[]) => ChamberSyncComparison;
