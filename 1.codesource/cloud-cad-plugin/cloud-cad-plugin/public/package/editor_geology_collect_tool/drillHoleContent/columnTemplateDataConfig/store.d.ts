import { type McCore } from 'McCore';
import type { HistogramTemplateColumn, HistogramTemplateListItem, HistogramTemplateType, HistogramTemplateTypeOption } from './types';
import type { McDbHistogramCollectTemplate, McDbHistogramCollectTemplateTable } from '@/core_geology_collect_tool/mcGeoDrill/template';
export declare const histogramTemplateList: import("vue").Ref<{
    name: string;
    templateType: HistogramTemplateType;
    columns: {
        name: string;
        isValid: boolean;
        label: string;
        type: "Number" | "String";
        value: number | string;
    }[];
}[], HistogramTemplateListItem[] | {
    name: string;
    templateType: HistogramTemplateType;
    columns: {
        name: string;
        isValid: boolean;
        label: string;
        type: "Number" | "String";
        value: number | string;
    }[];
}[]>;
/** 返回固定的三种地层类型，值与 Core 枚举保持一致。 */
export declare function getHistogramTemplateTypeOptions(): HistogramTemplateTypeOption[];
/** 获取当前图纸的柱状图采集模板表。 */
export declare function getHistogramTemplateTable(core?: McCore | null): McDbHistogramCollectTemplateTable | undefined;
/** 从 Core 表重建列表投影。 */
export declare function refreshHistogramTemplates(): void;
/** 图纸切换和文件读取后重新绑定真实模板表事件。 */
export declare function bindHistogramTemplateTable(core: McCore | null): void;
/** 获取一种地层在 Core 中定义的全部可用属性。 */
export declare function getHistogramPropertyDefinitions(type: HistogramTemplateType): HistogramTemplateColumn[];
/** 使用 Core 模板自身的约定创建无效占位列。 */
export declare function createHistogramPlaceholderColumn(type: HistogramTemplateType): HistogramTemplateColumn;
/** 获取名称对应的真实 Core 模板。 */
export declare function getHistogramTemplate(name: string): McDbHistogramCollectTemplate | undefined;
/** 校验全表唯一的模板名称。 */
export declare function validateHistogramTemplateName(name: string): void;
/** 新建柱状图采集模板并保存到当前图纸。 */
export declare function createHistogramTemplate(name: string, type: HistogramTemplateType, columns: HistogramTemplateColumn[]): void;
/** 覆盖已有模板的有序列配置。 */
export declare function updateHistogramTemplate(name: string, columns: HistogramTemplateColumn[]): Promise<void>;
/** 从当前图纸删除模板。 */
export declare function removeHistogramTemplate(name: string): void;
