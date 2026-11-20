import type { DirectionalDesignResultSheet, DirectionalProfileChartConfig } from '../types/interface';
/**
 * 根据当前 Sheet 创建定向钻二维剖面的共享显示参数。
 * @param sheet 设计结果或既有钻孔详情中已联动计算的单孔轨迹数据。
 * @returns 网页图表与 Excel 内嵌剖面图共同使用的坐标轴和线段颜色。
 * @throws 孔深或相对 Z 坐标为空、非有限数字时抛错，不替用户填零。
 */
export declare function createDirectionalProfileChartConfig(sheet: DirectionalDesignResultSheet): DirectionalProfileChartConfig;
