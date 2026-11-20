import type { DirectionalCadBranchOrigins, DirectionalDesignResultSheet, DrillSiteCoordRow } from '../types/interface';
/**
 * 在结果表重算前记录原实体分支起点，保证参数导出后可以还原实际 CAD 位置。
 * @param sheet 由实体轨迹生成的原始参数工作表。
 * @param positions 与工作表分支顺序一致的原实体起点，单位米。
 * @returns 独立的主孔输入与分支起点快照，不引用实体向量。
 */
export declare function createDirectionalCadOrigins(sheet: DirectionalDesignResultSheet, positions: DrillSiteCoordRow[]): DirectionalCadBranchOrigins;
/**
 * 判断主孔输入是否仍与分支起点来源相同；编辑主孔后不能继续使用旧的分支世界坐标。
 * @param sheet 当前结果表或导入工作表。
 * @returns 孔口和所有主孔测量输入均未变化时为 true，无来源快照时为 false。
 */
export declare function hasOriginalDirectionalMain(sheet: DirectionalDesignResultSheet): boolean;
/**
 * 获取仍有效的原始 CAD 分支起点，保留主孔分段孔深及终点测角绘图规则。
 * @param sheet 当前已校验的参数工作表。
 * @param branch 需要还原的分支名称。
 * @returns 独立起点数据的只读用途引用；主孔或分叉孔深已编辑、无来源数据时返回 undefined。
 */
export declare function getDirectionalCadBranchOrigin(sheet: DirectionalDesignResultSheet, branch: string): DrillSiteCoordRow | undefined;
