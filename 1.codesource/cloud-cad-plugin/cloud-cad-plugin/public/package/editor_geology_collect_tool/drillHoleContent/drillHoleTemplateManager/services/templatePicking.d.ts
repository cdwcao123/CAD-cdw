import { type McCore } from 'McCore';
import type { DrillHoleTemplateEntitySelection, DrillHoleTemplatePoint } from '../types';
/**
 * 暂时隐藏模板相关弹框，在活动绘图区拾取，结束后恢复原来的可见弹框。
 * @param dialogId 当前模板配置弹框标识
 * @param pick 使用活动 Core 执行的拾取操作，取消时返回 undefined
 * @returns 拾取结果；无绘图区、取消或异常时返回 undefined，交互异常会提示用户
 */
export declare function runTemplatePick<T>(dialogId: string, pick: (core: McCore) => Promise<T | undefined>): Promise<T | undefined>;
/**
 * 多选组成模板的图面实体，不修改或删除实体。
 * @param dialogId 发起拾取的弹框标识
 * @returns 所属 Core 和实体标识；取消或失败时返回 undefined
 */
export declare function pickDrillHoleTemplateEntities(dialogId: string): Promise<DrillHoleTemplateEntitySelection | undefined>;
/**
 * 在所选实体所属的图纸中拾取模板中心点，保留原始坐标精度。
 * @param dialogId 发起拾取的弹框标识
 * @param sourceCore 已选实体所属的 Core
 * @param message 拾取提示，默认提示模板中心点
 * @returns 中心点世界坐标副本；图纸已切换、取消或失败时返回 undefined
 */
export declare function pickDrillHoleTemplateCenter(dialogId: string, sourceCore: McCore, message?: string): Promise<DrillHoleTemplatePoint | undefined>;
