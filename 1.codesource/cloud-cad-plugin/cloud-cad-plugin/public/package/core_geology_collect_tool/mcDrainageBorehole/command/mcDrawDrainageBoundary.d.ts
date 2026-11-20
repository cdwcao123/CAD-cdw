import { McCore, McDbPolyLine } from 'McCore';
/**
 * 绘制抽采范围边界
 * @param core McCore
 * @returns 抽采范围边界以及抽采范围面积，要求多边形闭合
 */
export declare function drawDrainageBoundary(core: McCore): Promise<McDbPolyLine | null>;
