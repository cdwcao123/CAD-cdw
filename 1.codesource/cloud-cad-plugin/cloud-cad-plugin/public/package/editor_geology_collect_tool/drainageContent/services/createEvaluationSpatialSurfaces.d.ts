import type { EvaluationSpatialData, EvaluationSpatialSurfaceResult } from '../types/interface';
/**
 * 根据核心见止煤坐标生成一层煤层顶底板，先扣除共同倾斜趋势，再插值残差并恢复标高。
 * @param data 当前评价单元及单一设计/实际模式的世界坐标快照。
 * @returns 边界内的顶底板曲面片、有效穿煤孔数量和无法成面的提示。
 * @throws Core 边界三角剖分失败时保留原异常供预览组件展示。
 */
export declare function createEvaluationSpatialSurfaces(data: EvaluationSpatialData): EvaluationSpatialSurfaceResult;
