import type { DirectionalDesignResultSheet } from '../types/interface';
/**
 * 按当前 Sheet 快照创建 ECharts GL 三维轨迹配置。
 * @param sheet 当前钻孔的完整结果快照；三个方向采用相同的每米显示比例。
 * @returns 可交给 ECharts 的三维坐标系、交互视角和轨迹系列配置。
 * @throws 相对坐标为空或非有限数字时抛错，不覆盖表格中的输入或公式结果。
 */
export declare function createDirectionalSpatialChartOption(sheet: DirectionalDesignResultSheet): Record<string, unknown>;
