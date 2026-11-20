import { type ECharts } from 'echarts';
import type { DirectionalDesignResultSheet } from '../types/interface';
/**
 * 为无数据点标记的二维曲线绑定悬浮面板，与三维一样悬浮分支即可查看信息。
 * @param chart 已设置二维剖面配置的图表实例。
 * @param sheet 当前图表使用的完整结果快照，分支孔深已包含主孔起点偏移。
 * @returns 清理事件及提示框的函数；切换维度、更新数据和卸载前调用。
 */
export declare function bindDirectionalProfileTooltip(chart: ECharts, sheet: DirectionalDesignResultSheet): () => void;
