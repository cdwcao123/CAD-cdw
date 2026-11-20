import { StyleOptionNode } from './interface';
/**
 * 模型元数据字段
 * @param name 字段名称
 * @param label 字段标签
 * @param controlType 控件类型
 * @param valueType 数据类型
 * @param default 默认值
 * @param listType 列表类型
 * @param listOption 列表选项
 */
export type MoreModelMetaField = {
    name?: string;
    label?: string;
    controlType?: string;
    valueType?: string;
    default?: unknown;
    listType?: string[];
    listOption?: string | null;
};
/**
 * 模型表单字段
 * @param __vModel__ 绑定的模型字段
 * @param disabled 是否禁用
 * @param __config__ 配置项
 */
export type MoreModelFormField = {
    __vModel__?: string;
    disabled?: boolean;
    __config__?: {
        label?: string;
        required?: boolean;
        disabled?: boolean;
        labelWidth?: number | string | null;
        tag?: string;
    };
};
/**
 * 模型表单方案
 * @param fields 字段数组
 * @param labelWidth 标签宽度
 */
export type MoreModelFormSchema = {
    fields?: MoreModelFormField[];
    labelWidth?: number | string | null;
};
/**
 * 模型元数据
 * @param modelId 模型ID
 * @param modelName 模型名称
 * @param meta 模型元数据字段
 * @param form 模型表单方案
 * @param fieldOrder 字段顺序
 * @param fieldDisabledMap 字段禁用映射
 * @param fieldLabelWidthMap 字段标签宽度映射
 */
export type MoreModelSchema = {
    modelId: string;
    modelName: string;
    meta: Record<string, MoreModelMetaField>;
    form: MoreModelFormSchema | null;
    fieldOrder: string[];
    fieldDisabledMap: Record<string, boolean>;
    fieldLabelWidthMap: Record<string, number | string | null | undefined>;
};
/**
 * 模型特征元数据字段
 * @param key 字段键
 * @param label 字段标签
 * @param controlType 控件类型
 * @param valueType 数据类型
 * @param default 默认值
 * @param readOnly 是否只读
 * @param required 是否必填
 * @param labelWidth 标签宽度
 * @param listType 列表类型
 * @param listOption 列表选项
 * @param raw 原始数据
 */
export type MoreModelFeatureSchemaField = {
    key: string;
    label: string;
    controlType?: string;
    valueType?: string;
    default?: unknown;
    readOnly: boolean;
    required: boolean;
    labelWidth?: number | string | null;
    listType?: string[];
    listOption?: string | null;
    raw: Record<string, unknown>;
};
/**
 * 模型特征记录
 * @param key 字段键
 * @param value 字段值
 */
export type MoreModelFeatureRecord = Record<string, unknown>;
/**
 * 模型特征值
 * @param value 模型特征记录
 * @param values 模型特征记录数组
 */
export type MoreModelFeatureValue = MoreModelFeatureRecord | MoreModelFeatureRecord[];
/**
 * 模型特征样式方案
 * @param id 样式ID
 * @param styleName 样式名称
 * @param options 选项数组
 */
export type MoreModelFeatureStyleSchema = {
    id: string;
    styleName: string;
    options: StyleOptionNode[];
};
/**
 * 模型特征类元数据项
 * @param ID 类ID
 * @param ModelId 模型ID
 * @param ClassName 类名
 * @param ClassLabel 类标签
 * @param GeoType 地理类型
 * @param FeatureType 特征类型
 * @param FeatureCount 特征数量
 * @param AttrSchema 属性方案
 * @param GeoSchema 地理方案
 * @param ShapePropertySchema 形状属性方案
 * @param Field1 字段1
 * @param Field2 字段2
 */
export type MoreModelFeatureClassSchemaItem = {
    [key: string]: unknown;
    ID?: string;
    ModelId?: string;
    ClassName?: string;
    ClassLabel?: string;
    GeoType?: string;
    FeatureType?: string;
    FeatureCount?: string;
    AttrSchema?: unknown;
    GeoSchema?: unknown;
    ShapePropertySchema?: unknown;
    Field1?: unknown;
    Field2?: unknown;
};
/***
 * 模型特征类元数据
 * @param id 类ID
 * @param modelId 模型ID
 * @param className 类名
 * @param classLabel 类标签
 * @param featureType 特征类型
 * @param geoType 地理类型
 * @param featureCount 特征数量
 * @param isSingleFeature 是否单特征
 * @param isReadOnly 是否只读
 * @param valueKey 值键
 * @param geometryValueKey 地理值键
 * @param geometryLabel 地理标签
 * @param attrFields 属性字段数组
 * @param geometryFields 地理字段数组
 * @param raw 原始数据
 */
export type MoreModelFeatureSchema = {
    id: string;
    modelId: string;
    className: string;
    classLabel: string;
    featureType: string;
    geoType: string;
    featureCount: string;
    isSingleFeature: boolean;
    isReadOnly: boolean;
    valueKey: string;
    geometryValueKey: string;
    geometryLabel: string;
    attrFields: MoreModelFeatureSchemaField[];
    geometryFields: MoreModelFeatureSchemaField[];
    raw: MoreModelFeatureClassSchemaItem;
};
