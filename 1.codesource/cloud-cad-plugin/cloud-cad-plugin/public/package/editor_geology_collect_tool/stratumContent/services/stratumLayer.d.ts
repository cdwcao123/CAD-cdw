import type { StratumLayerRow } from '../../types';
/**
 * 获取当前活动图纸的全部图层，并映射为地层采集弹框使用的表格行。
 * resolveActiveCoreReady 会等待活动图纸内核就绪；无活动图纸或图层表时返回空列表。
 *
 * @returns 按当前图层表顺序排列的图层行，空名称图层会被忽略。
 */
export declare const loadCurrentDrawingLayerRows: () => Promise<StratumLayerRow[]>;
