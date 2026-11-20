import type { DrillHoleListColumn } from '../types';
/**
 * 在 Core 插件就绪后获取管理列表与 Excel 共用的全部基础信息列。
 * @returns 钻孔代码列及按 Core BaseInfo 定义顺序排列的所有列。
 * @throws Core 字段没有对应的 Editor 数据映射时抛出错误，避免静默漏列。
 */
export declare function getDrillHoleListColumns(): DrillHoleListColumn[];
