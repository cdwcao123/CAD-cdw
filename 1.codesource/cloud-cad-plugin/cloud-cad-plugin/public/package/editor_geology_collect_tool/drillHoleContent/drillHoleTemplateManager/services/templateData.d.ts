import type { DrillHoleTemplateFieldOption } from '../types';
import type { FieldSourceType, IMcDbPlaneTemplateStyleAttrBindMap, McDbPlaneTemplateStyle } from '@/core_geology_collect_tool/mcGeoDrill/template';
/**
 * 将 Core 字段定义适配为 Editor 下拉选项，预定义选项仅在 Editor 中补齐。
 * @param sourceType Core 已有的字段来源枚举值
 * @returns 字段选项；自定义来源没有预设字段，返回空数组，由 Editor 下拉允许用户输入内容
 */
export declare function getDrillHoleTemplateFields(sourceType: FieldSourceType): DrillHoleTemplateFieldOption[];
/**
 * 使用 Core 现有接口设置绑定，同时将 Editor 配置写入已有的扩展数据存储。
 * @param style 待保存模板
 * @param bindings 不含临时图面标识的业务绑定列表
 * @returns 无返回值
 */
export declare function setDrillHoleTemplateBindings(style: McDbPlaneTemplateStyle, bindings: IMcDbPlaneTemplateStyleAttrBindMap[]): void;
/**
 * 图纸重新读取后，将 Editor 保存的绑定恢复到 Core 已有的运行时接口。
 * @param style 样式表中的模板；没有 Editor 扩展数据时保留 Core 当前绑定
 * @returns 本次恢复了非空绑定时返回 true，否则返回 false
 */
export declare function restoreDrillHoleTemplateBindings(style: McDbPlaneTemplateStyle): boolean;
