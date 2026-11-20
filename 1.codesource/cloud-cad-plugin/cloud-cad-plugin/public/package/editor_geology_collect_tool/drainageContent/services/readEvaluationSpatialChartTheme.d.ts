import type { EvaluationSpatialChartTheme } from '../types/interface';
/**
 * 读取预览容器继承的应用主题颜色，供 Canvas/WebGL 使用已解析的色值。
 * @param container 已挂载的三维预览容器，其 CSS 变量由 Editor 主题提供。
 * @returns 当前主题下的背景、坐标轴、网格及提示框颜色快照。
 */
export declare function readEvaluationSpatialChartTheme(container: HTMLElement): EvaluationSpatialChartTheme;
