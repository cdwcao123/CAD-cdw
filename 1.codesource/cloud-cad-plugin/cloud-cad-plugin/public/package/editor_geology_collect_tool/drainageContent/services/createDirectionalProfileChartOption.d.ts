import type { DirectionalDesignResultSheet, DirectionalProfileBranchSeries } from '../types/interface';
/**
 * 将当前 Sheet 的轨迹点按分支归组为孔深和上下偏移二维剖面坐标。
 * @param sheet 设计结果或既有钻孔详情中已联动计算的单孔轨迹数据。
 * @returns 分支名称及其对应的孔深、相对 Z 坐标。
 * @throws 孔深或相对 Z 未补全时抛出错误，不将空值当作零点。
 */
export declare function createDirectionalProfileBranchSeries(sheet: DirectionalDesignResultSheet): DirectionalProfileBranchSeries[];
/**
 * 创建网页显示和 Excel 导出共同使用的定向钻二维剖面 ECharts 配置。
 * @param sheet 设计结果或既有钻孔详情中已联动计算的单孔轨迹数据。
 * @returns 包含坐标范围、网格、标题、颜色和分支曲线的完整图表配置。
 * @throws 孔深或相对 Z 未补全时抛出错误，避免使用空值绘制轨迹。
 */
export declare function createDirectionalProfileChartOption(sheet: DirectionalDesignResultSheet): Record<string, unknown>;
