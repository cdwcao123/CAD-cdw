/** Core 柱状图模板支持的三种地层类型。 */
export type HistogramTemplateType = 'Drill' | 'Complex' | 'Logging';
/** 柱状图中一列的字段定义；无效列在拾取时作为占位列跳过。 */
export interface HistogramTemplateColumn {
    name: string;
    isValid: boolean;
    label: string;
    type: 'Number' | 'String';
    value: number | string;
}
/** 管理器中使用的 Core 模板列表投影。 */
export interface HistogramTemplateListItem {
    name: string;
    templateType: HistogramTemplateType;
    columns: HistogramTemplateColumn[];
}
/** 三种地层类型的下拉选项。 */
export interface HistogramTemplateTypeOption {
    value: HistogramTemplateType;
    label: string;
}
/** 模板管理公共弹框向宿主提供的操作。 */
export interface ColumnTemplateManagerDialogData {
    getSelectedTemplate: () => string;
    getSelectedType: () => HistogramTemplateType;
    removeSelectedTemplate: () => void | Promise<void>;
    confirm: () => boolean | Promise<boolean>;
    cancel: () => void;
}
/** 名称和模板内容弹框向宿主提供的操作。 */
export interface ColumnTemplateChildDialogData {
    confirm: () => boolean | Promise<boolean>;
    cancel: () => void;
}
