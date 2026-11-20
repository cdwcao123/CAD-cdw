import { FieldSourceType } from './mcDbPlaneTemplateStyle';
/** 字段选项: field 为实体属性路径, label 为中文名 */
export interface IFieldOption {
    /** 实体属性字段路径(支持嵌套如 baseInfo.name) */
    field: string;
    /** 中文名称 */
    label: string;
}
/**
 * 各数据来源类型的可选字段映射表
 * 用于 UI 下拉选择: 用户选中文名 -> 对应实体属性字段路径
 */
export declare const FieldDefinitions: Record<Exclude<FieldSourceType, FieldSourceType.Predefine | FieldSourceType.Custom>, IFieldOption[]>;
/**
 * 根据来源类型获取可选字段列表(用于 UI 下拉选择中文名)
 * @param sourceType 字段来源类型
 * @returns 字段选项数组
 */
export declare function getAvailableFields(sourceType: FieldSourceType): IFieldOption[];
