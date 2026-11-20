import type { DirectionalDesignResultSheet } from '../types/interface';
/**
 * 使用参考工作簿原公式重算 D～J；第一条轨迹为主支，分支从主支参考测点接续。
 * @param sheet 当前结果会话的独立快照；主孔首行绝对坐标保留孔口初值。
 * @returns 无返回值；保留输入、分支名称和元数据，仅更新派生列。
 */
export declare function recalculateDirectionalDesignResult(sheet: DirectionalDesignResultSheet): void;
