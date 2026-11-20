import { type McCore } from 'McCore';
import type { BatchDrawDrillHoleRow, BatchDrillHoleRenderOptions } from './types';
/** 复用钻孔自身的模板取值规则；仅生成显示属性，不把预览钻孔加入图纸。 */
export declare function getBatchTemplateAttributes(core: McCore, row: BatchDrawDrillHoleRow, templateName: string, options: BatchDrillHoleRenderOptions): Record<string, string>;
