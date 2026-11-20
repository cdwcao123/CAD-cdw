import type { BoreholeCorrectionPlan } from '../types/interface';
import type { BoreholeCorrectionResult } from '../types/type';
import type { McCore } from 'McCore';
/**
 * 按修正孔 ID 创建应用计划，带 _clone 后缀的孔匹配原孔，其余孔保留完整实体等待入库。
 * @param result Core 返回的原设计孔、修正孔和临时图件，不修改其中的实体。
 * @returns 独立的原孔三字段快照及尚未入库的新孔实体。
 * @throws 修正结果存在重复 ID 或带后缀的孔无法匹配本次原设计孔时抛出错误。
 */
export declare function createBoreholeCorrectionPlan(result: BoreholeCorrectionResult): BoreholeCorrectionPlan;
/**
 * 在原图纸的同一命令中回写原孔三字段，并将修正后新增的完整钻孔加入数据库和图纸。
 * @param core 本次计算所属的 Core。
 * @param drawingKey 本次计算所属的图纸键，避免把旧会话应用到其他图纸。
 * @param plan 按 objectId 匹配的原孔更新及新孔入库计划，不受导出单选影响。
 * @returns Core 报告命令完成后通知 Editor 刷新钻孔业务数据。
 * @throws 图纸切换、命令占用、原孔已移除、新孔 ID 已存在、入库失败或 Core 命令未完成时抛出错误；写入和撤销行为由 Core 管理。
 */
export declare function applyBoreholeCorrection(core: McCore, drawingKey: string, plan: BoreholeCorrectionPlan): Promise<void>;
