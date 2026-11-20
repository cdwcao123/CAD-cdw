import type { DirectionalDesignResultSheet, DirectionalProfileChartImage } from '../types/interface';
/**
 * 使用与网页相同的 ECharts 配置渲染可嵌入 Excel 的二维剖面矢量图。
 * @param sheet 需要导出的单孔轨迹数据。
 * @returns 固定导出尺寸的 SVG 字节及其展示尺寸。
 */
export declare function createDirectionalProfileChartImage(sheet: DirectionalDesignResultSheet): DirectionalProfileChartImage;
