import type { DirectionalDesignResultSheet, DrainageDrawingContext, DrainageReversePlan } from '../types/interface';
/**
 * 按工作表类别新建设计孔或创建、更新实际孔；已有设计孔由会话层预先跳过。
 * @param context 本次导入所属图纸及已加载的 Core 插件 API。
 * @param sheet 已校验的单孔轨迹及类别，首行 H～J 为孔口坐标，key 已添加导入批次前缀。
 * @param index 工作簿内的 Sheet 顺序，用于保存校验错误定位。
 * @returns 可由共用反演事务写入的目标实体及原实体；不修改正式图纸。
 * @throws 同孔号存在多个实际孔、生成 ID 时设计孔不唯一或目标 ID 被占用时抛错。
 */
export declare function createDirectionalReversePlan(context: DrainageDrawingContext, sheet: DirectionalDesignResultSheet, index: number): DrainageReversePlan;
