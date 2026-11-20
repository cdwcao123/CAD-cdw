/** 字典下拉选项。 */
export interface DictItem {
    /** 选项显示文本 */
    label: string;
    /** 选项值 */
    value: string;
}
/** 带类型编码的命名数据项。 */
export interface NamedItem {
    /** 唯一标识 */
    id: string;
    /** 显示名称 */
    name: string;
    /** 类型编码 */
    typeCode: string;
}
/** 数据模型中只包含 id 和 name 的基础项。 */
export interface IdNameItem {
    /** 唯一标识 */
    id: string;
    /** 显示名称 */
    name: string;
}
/** 下拉框使用的 label/value 选项。 */
export interface LabelValueItem {
    /** 选项显示文本 */
    label: string;
    /** 选项值 */
    value: string;
}
