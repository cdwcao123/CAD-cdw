import type { ColumnTemplateDraft, ColumnTemplateTypeOption } from '../types';
import type { HistogramCollectTemplateType, IColumnInfo, McDbHistogramCollectTemplateTable } from '@/core_geology_collect_tool/mcGeoDrill/template';
/**
 * 获取当前图纸的柱状采集模板表。
 * @returns 已由 Core 插件创建的表；无活动图纸或插件未初始化时返回 undefined。
 */
export declare function getColumnTemplateTable(): McDbHistogramCollectTemplateTable | undefined;
/**
 * 获取 Core 支持的三个模板类型。
 * @returns 按钻探、综合、测井顺序排列的下拉选项。
 */
export declare function getColumnTemplateTypes(): ColumnTemplateTypeOption[];
/**
 * 读取指定地层的可选属性，使用 Core 采集命令的字段契约。
 * @param type 当前地层模板类型。
 * @returns 独立的属性副本，编辑不会污染 Core 公共定义。
 */
export declare function getColumnTemplateFields(type: HistogramCollectTemplateType): IColumnInfo[];
/**
 * 校验当前弹框仍属于活动图纸，避免切图后写入旧表。
 * @param table 打开弹框时绑定的模板表。
 * @returns 无返回值。
 * @throws 活动图纸改变或模板表重新加载时抛出错误。
 */
export declare function assertColumnTemplateTable(table: McDbHistogramCollectTemplateTable): void;
/**
 * 保存新增或修改的柱状模板，列顺序及占位列由 Core 随图纸序列化。
 * @param table 打开弹框时绑定的模板表。
 * @param draft 通过文字格式弹框编辑的名称、类型和列配置。
 * @param originalName 修改前名称；不传表示新建。
 * @returns 保存后的模板名称。
 * @throws 名称为空、重名、无有效属性、类型不匹配或 Core 拒绝修改时抛出错误。
 */
export declare function saveColumnTemplate(table: McDbHistogramCollectTemplateTable, draft: ColumnTemplateDraft, originalName?: string): Promise<string>;
/**
 * 删除选中的模板，遵守 Core 对当前记录及引用关系的限制。
 * @param table 打开管理器时绑定的模板表。
 * @param name 选中的模板名称。
 * @returns 无返回值。
 * @throws 图纸改变、模板不存在、内置模板或 Core 拒绝删除时抛出错误。
 */
export declare function removeColumnTemplate(table: McDbHistogramCollectTemplateTable, name: string): void;
