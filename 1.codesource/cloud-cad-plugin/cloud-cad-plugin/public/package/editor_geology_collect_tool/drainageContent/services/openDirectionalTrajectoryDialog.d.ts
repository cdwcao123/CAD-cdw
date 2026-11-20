import type { DirectionalDesignResultSheet } from '../types/interface';
/**
 * 使用结果或既有钻孔详情面板当前选中的 Sheet 打开二维剖面和三维轨迹；重复打开时刷新数据并恢复居中显示。
 * @param sheet 当前选中的单个定向钻设计结果 Sheet。
 * @returns 无返回值，图表仅消费数据快照，不修改设计结果。
 */
export declare function openDirectionalTrajectoryDialog(sheet: DirectionalDesignResultSheet): void;
