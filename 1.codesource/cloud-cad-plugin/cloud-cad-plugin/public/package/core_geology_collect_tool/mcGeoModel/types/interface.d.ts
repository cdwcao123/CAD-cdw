import { McGeVector4 } from 'McCore';
import { McGeoStyle } from '../style/mcGeoStyle';
import { FeatureType, McGeoGeometryType, McGeoViewType } from './enum';
import { McGeoFieldMap, McGeoGeometryDataType, McGeoSchema } from './type';
/**
 * 元数据属性或要素类非几何属性的的脚本解释
 * @description 是一个JSON格式的字符串类型，内部包含全部属性解释，
 * 一个metaDataSchema必须包含 id和name属性
 * @see https://www.yuque.com/wangzhengang-yhyyr/iwlfzx/drmghgv3v95zksaf/edit#Dsw5M
 */
interface McGeoSchemaInfo {
    /** 属性标识 */
    name: string;
    /**
     * 属性显示名称
     * @description 属性显示的中文名称
     */
    label: string;
    /**
     * 控件类型
     * @description 属性在前端或其他展示采集平台的控件类型，支持的类型参见
     * 附录->属性配置->控件
     */
    controlType: string;
    /**
     * 控件参数
     * @description 控件参数，参见附录->属性配置->控件参数
     */
    controlOption: string;
    /**
     * 控件值类型
     * @description 控件值类型，包括 String、 Number 、Array、 Object
     */
    valueType: string;
    /** 描述 */
    desc: string;
    /**
     * 是否显示在列表页
     * @description 当前模型的包含的地质体对象的集合。1-显示，0-隐藏
     */
    isShowInList: number;
    /**
     * 是否作为查询条件
     * @description 是否作为查询条件，1-是  0-否
     */
    isQueryParam: number;
    /**
     * 数据列表来源类型
     * @description 非必需，仅限于下拉框或级联选择器等需要数据源的控件类型，
     * 包含 数据字典(dictionary)、内置数据源(xaylDataSource)、
     * 地质模型(xaylGeoModel)、自定义(custom)
     */
    listSource?: string;
    /**
     * 数据源解析规则
     * @description 非必需，JSON格式的字符串，此处指定value（选项值）、
     * label（选项显示名）、children（子选项）的数据映射字段
     */
    listOption?: string;
    /**
     * 数据列表类型
     * @description 非必需，指定数据列表来源下的具体哪个作为列表，
     * 例如数据源类型是数据字典时，此处指定是哪个字典分类，分类往往带有层级关系，
     * 因此此处使用数组代表分类的层级结构
     */
    listType?: [];
}
/**
 * 地质模型几何信息
 * @description 地质模型几何信息的类型定义，包含几何类型和坐标信息
 * @property {McGeoGeometryType} type - 几何类型，参考 McGeoGeometryType 枚举
 * @property {any} coord - 坐标信息，具体类型根据几何类型而定
 */
interface McGeoGeometryData {
    type: McGeoGeometryType;
    coord: McGeoGeometryDataType;
}
/**
 * 地质模型点几何信息
 * @description 地质模型点几何信息的类型定义，包含几何类型和坐标信息
 * @property {McGeoGeometryType} type - 几何类型，参考 McGeoGeometryType 枚举
 * @property {McGeVector4} coord - 坐标信息，点几何的坐标为一个 McGeVector4 对象
 */
interface McGeoPointGeometryData extends McGeoGeometryData {
    coord: McGeVector4;
}
/**
 * 地质模型多点几何信息
 * @description 地质模型多点几何信息的类型定义，包含几何类型和坐标信息
 * @property {McGeoGeometryType} type - 几何类型，参考 McGeoGeometryType 枚举
 * @property {McGeVector4[]} coord - 坐标信息，多点几何的坐标为一个 McGeVector4 对象数组，即多个点坐标
 */
interface McGeoMultiPointGeometryData extends McGeoGeometryData {
    coord: McGeVector4[];
}
/**
 * 地质模型线几何信息
 * @description 地质模型线几何信息的类型定义，包含几何类型和坐标信息
 * @property {McGeoGeometryType} type - 几何类型，参考 McGeoGeometryType 枚举
 * @property {McGeVector4[]} coord - 坐标信息，线几何的坐标为一个 McGeVector4 对象数组，即多个点坐标
 */
interface McGeoLineGeometryData extends McGeoGeometryData {
    coord: McGeVector4[];
}
/**
 * 地质模型多线几何信息
 * @description 地质模型多线几何信息的类型定义，包含几何类型和坐标信息
 * @property {McGeoGeometryType} type - 几何类型，参考 McGeoGeometryType 枚举
 * @property {McGeVector4[][]} coord - 坐标信息，多线几何的坐标为一个 McGeVector4 对象数组的数组，即多个线坐标
 */
interface McGeoMultiLineGeometryData extends McGeoGeometryData {
    coord: McGeVector4[][];
}
/**
 * 地质模型面几何信息
 * @description 地质模型面几何信息的类型定义，包含几何类型和坐标信息
 * @property {McGeoGeometryType} type - 几何类型，参考 McGeoGeometryType 枚举
 * @property {McGeVector4[][]} coord - 坐标信息，面几何的坐标为一个 McGeVector4 对象数组的数组，第一个数组为边界
 */
interface McGeoPolygonGeometryData extends McGeoGeometryData {
    coord: McGeVector4[][];
}
/**
 * 地质模型多面几何信息
 * @description 地质模型多面几何信息的类型定义，包含几何类型和坐标信息
 * @property {McGeoGeometryType} type - 几何类型，参考 McGeoGeometryType 枚举
 * @property {McGeVector4[][][]} coord - 坐标信息，多面几何的坐标为一个 McGeVector4 对象数组的数组的数组，即多个面坐标
 */
interface McGeoMultiPolygonGeometryData extends McGeoGeometryData {
    coord: McGeVector4[][][];
}
/**
 * 地质模型三角面几何信息
 * @description 地质模型多面几何信息的类型定义，包含几何类型和坐标信息
 * @property {McGeoGeometryType} type - 几何类型，参考 McGeoGeometryType 枚举
 * @property {McGeVector4[][]} coord - 坐标信息，三角面几何的坐标为一个 McGeVector4 对象数组的数组的数组，第一个数组为边界，第二个数组为内部顶点
 */
interface McGeoTinGeometryData extends McGeoGeometryData {
    coord: McGeVector4[][];
}
/**
 * 地质模型要素
 */
interface McGeoFeature {
    /** 要素字段 */
    fields: McGeoFieldMap;
    /** 几何信息 */
    geometry: McGeoGeometryData;
    /** 样式信息 */
    styles: McGeoStyle[];
}
/**
 * 地质模型要素类
 * @description 通用类，使用
 */
interface McGeoFeatureClass {
    /** 要素类ID */
    id: string;
    /** 要素类名称 */
    className: string;
    /** 要素类标签 */
    classLabel: string;
    /**
     * 要素类类型
     * @description 参考 FeatureType 枚举
     * @see FeatureType
     */
    featureType: FeatureType;
    /**
     * 要素列表
     * @description 要素列表
     * @see McGeoFeature
     */
    features: McGeoFeature[];
}
/**
 * 地质模型字段
 */
interface McGeoModelField {
    /** 字段名 非显示label名 */
    name: string;
    /** 字段值 */
    value: string;
}
interface McGeoData {
    /** 数据模型ID */
    modelId: string;
    /** 数据模型名字 */
    modelName: string;
    /** 数据模型类型 */
    dataSourceId: string;
    /** 元属性脚本 */
    metaDataSchema: McGeoSchema;
    /** 要素类属性脚本 */
    featureClassSchema: McGeoSchema;
    /** 坐标系参数 */
    coordOption: {
        EPSG: string;
        coordParams: string;
    };
}
interface McGeoModelData {
    /** 数据模型ID */
    modelId: string;
    /** 数据模型名字 */
    modelName: string;
    /** 数据模型类型 */
    modelType: string;
    /** 字段说明 */
    schema?: McGeoSchema;
    /** 属性字段 */
    fields: McGeoFieldMap;
    /** 要素列表 */
    featureClasses: McGeoFeatureClass[];
}
/**
 * 地质模型定义信息
 */
interface GeoModelDefInfo {
    /** 数据模型 ID */
    modelId: string;
    /** 数据模型名称 */
    modelName: string;
    /** 数据模型类型 */
    modelType: string;
}
/**
 * 地质模型要素类定义信息
 */
interface McGeoFeatureClassDefInfo {
    /** 要素类 ID */
    id: string;
    /** 要素类名称 */
    className: string;
    /** 要素类标签 */
    classLabel: string;
    /** 要素类类型（几何/非几何），参考 FeatureType 枚举 */
    featureType: FeatureType;
    /** 要素数目 */
    featureCount: string;
    /** 几何类型，参考 McGeoGeometryType 枚举 */
    geometryType: McGeoGeometryType;
}
/**
 * 地质模型 UI 交互信息
 * @description 由内核组装层产出，供绘制面板 / 特性面板等消费
 */
interface McGeoModelUIExchangeInfo {
    /** 地质模型定义信息 */
    modelDefInfo: GeoModelDefInfo;
    /** 模型基础属性字段 */
    metaDataFields: McGeoFieldMap;
    /** 要素类定义信息 */
    featureClassDefInfos: McGeoFeatureClassDefInfo[];
    /** 要素类样式（classID -> McGeoStyle[]） */
    featureClassStyles: Map<string, McGeoStyle[]>;
    /** 要素类字段（classID -> McGeoFieldMap） */
    featureClassFields: Map<string, McGeoFieldMap>;
}
/**
 * 模型基础字段描述
 */
interface McGeoMetaField {
    /** 字段名称 */
    name?: string;
    /** 字段显示名称 */
    label?: string;
    /** 控件类型（Select / Input_String / Input_Number / TextArea 等） */
    controlType?: string;
    /** 控件参数（JSON 字符串，如 Switch 的 active-value / inactive-value） */
    controlOption?: string | null;
    /** 控件值类型 */
    valueType?: string;
    /** 默认值 */
    default?: unknown;
    /** 列表数据源分类编码 */
    listType?: string[];
    /** 列表数据源类型（dictionary / xaylDataSource / xaylGeoModel / custom） */
    listSource?: string;
    /** 列表数据源映射配置（JSON 字符串） */
    listOption?: string | null;
    /** 静态列表数据 */
    listData?: unknown[] | null;
}
/**
 * 模型表单字段（FormSchema 元素）
 */
interface McGeoFormField {
    /** 表单字段绑定的模型字段名 */
    __vModel__?: string;
    /** 是否禁用 */
    disabled?: boolean;
    /** 字段配置 */
    __config__?: {
        label?: string;
        required?: boolean;
        disabled?: boolean;
        labelWidth?: number | string | null;
        tag?: string;
    };
}
/**
 * 模型表单结构
 */
interface McGeoFormSchema {
    /** 表单字段列表 */
    fields?: McGeoFormField[];
    /** 默认标签宽度 */
    labelWidth?: number | string | null;
}
/**
 * 模型基础 Schema
 * @description 由 DataModel/DataModelBase/GetEntity 响应解析得到
 */
interface McGeoModelSchema {
    /** 数据模型 ID */
    modelId: string;
    /** 数据模型名称 */
    modelName: string;
    /** 元数据字段映射（字段名 -> 字段描述） */
    meta: Record<string, McGeoMetaField>;
    /** 表单结构 */
    form: McGeoFormSchema | null;
    /** 字段展示顺序 */
    fieldOrder: string[];
    /** 字段禁用映射 */
    fieldDisabledMap: Record<string, boolean>;
    /** 字段标签宽度映射 */
    fieldLabelWidthMap: Record<string, number | string | null | undefined>;
}
/**
 * 要素类 Schema 原始项
 * @description DataModelFeatureClassSchema/GetList 返回列表中的单个元素
 */
interface McGeoFeatureClassSchemaItem {
    [key: string]: unknown;
    /** 要素类 ID */
    ID?: string;
    /** 模型 ID */
    ModelId?: string;
    /** 要素类名称 */
    ClassName?: string;
    /** 要素类标签 */
    ClassLabel?: string;
    /** 几何类型 */
    GeoType?: string;
    /** 要素类型 */
    FeatureType?: string;
    /** 要素数量关系（1:1 / 1:N 等） */
    FeatureCount?: string;
    /** 属性 Schema */
    AttrSchema?: unknown;
    /** 几何 Schema */
    GeoSchema?: unknown;
    /** 形状属性 Schema */
    ShapePropertySchema?: unknown;
    /** 扩展字段 1 */
    Field1?: unknown;
    /** 扩展字段 2（只读等配置） */
    Field2?: unknown;
}
/**
 * 要素类字段描述（AttrSchema / GeoSchema 字段规范化后）
 */
interface McGeoFeatureField {
    /** 字段名 */
    key: string;
    /** 字段显示名称 */
    label: string;
    /** 控件类型 */
    controlType?: string;
    /** 控件参数（由 AttrSchema.controlOption 解析） */
    controlOption?: Record<string, unknown> | null;
    /** 运行时控件配置（合并 controlOption 与 Field2.FormSchema 同名字段） */
    controlConfig?: Record<string, unknown>;
    /** 值类型 */
    valueType?: string;
    /** 默认值 */
    default?: unknown;
    /** 是否只读 */
    readOnly: boolean;
    /** 是否必填 */
    required: boolean;
    /** 标签宽度 */
    labelWidth?: number | string | null;
    /** 列表数据源分类编码 */
    listType?: string[];
    /** 列表数据源类型（dictionary / xaylDataSource / xaylGeoModel / custom） */
    listSource?: string;
    /** 列表数据源映射配置 */
    listOption?: string | null;
    /** 静态列表数据 */
    listData?: unknown[] | null;
    /** 原始字段对象 */
    raw: Record<string, unknown>;
}
/**
 * 要素类 Schema（规范化后）
 * @description 由 DataModelFeatureClassSchema/GetList 原始项解析得到
 */
interface McGeoFeatureClassSchema {
    /** 要素类 ID */
    id: string;
    /** 模型 ID */
    modelId: string;
    /** 要素类名称 */
    className: string;
    /** 要素类标签 */
    classLabel: string;
    /** 要素类型 */
    featureType: string;
    /** 几何类型 */
    geoType: string;
    /** 要素数量关系（1:1 / 1:N） */
    featureCount: string;
    /** 是否为单要素（1:1） */
    isSingleFeature: boolean;
    /** 是否只读 */
    isReadOnly: boolean;
    /** 要素数据在实体 xData 中的存储键 */
    valueKey: string;
    /** 几何数据在要素记录中的键 */
    geometryValueKey: string;
    /** 几何字段显示名 */
    geometryLabel: string;
    /** 属性字段列表 */
    attrFields: McGeoFeatureField[];
    /** 几何字段列表 */
    geometryFields: McGeoFeatureField[];
    /** 原始项 */
    raw: McGeoFeatureClassSchemaItem;
}
/**
 * 样式选项树节点
 * @description 由 DataModelStyleFeatureClass.StyleOptions（JSON 数组字符串）解析得到
 */
interface McGeoStyleOptionNode {
    /** 节点 ID */
    id: string | number;
    /** 节点名称 */
    name: string;
    /** 节点标签 */
    label: string;
    /** 节点类型 */
    type: string;
    /** 控件类型 */
    controlType: string;
    /** 默认值 */
    value: unknown;
    /** 是否禁用 */
    disabled?: boolean;
    /** 是否必选 */
    isMust?: boolean;
    /** 子节点 */
    children?: McGeoStyleOptionNode[];
    /** 依赖属性（控制显隐） */
    dependencyProperty?: unknown;
    /** 控件属性名 */
    controlProperty?: string;
    /** 父节点 */
    parent?: string;
}
/**
 * 样式明细
 * @description DataModelStyleFeatureClass/GetList 返回列表中的单个元素
 */
interface McGeoStyleFeatureClassModel {
    /** 样式明细 ID */
    ID: string;
    /** 样式名称 */
    StyleName: string;
    /** 要素类 ID */
    FeatureClassId: string;
    /** 样式选项树 JSON 字符串 */
    StyleOptions: string;
}
/**
 * 要素类样式 ID 关联
 * @description 位于 DataModelStyleModel/GetList 的 FeatureClassStyleIds 数组中
 */
interface McGeoFeatureClassStyleId {
    /** 样式明细 ID（对应 DataModelStyleFeatureClass.ID） */
    ID?: string;
    /** 要素类 ID */
    classID?: string;
}
/**
 * 样式分类记录
 * @description DataModelStyleModel/GetList 返回数组中的单个元素，仅用于二维/三维分类
 */
interface McGeoStyleModelRecord {
    /** 分类记录 ID */
    ID?: string;
    /** 视图类型（CAD / 2D / 3D，仅 CAD 与 3D 生效） */
    ViewType?: string;
    /** 是否默认（1 为默认） */
    IsDefault?: number | string;
    /** 要素类样式 ID 关联列表 */
    FeatureClassStyleIds?: McGeoFeatureClassStyleId[];
}
/**
 * 分类后的样式项（绑定元数据 + 样式明细）
 */
interface McGeoFeatureClassStyle {
    /** 样式明细 ID */
    styleId: string;
    /** 样式名称 */
    styleName: string;
    /** 视图类型（CAD=二维 / 3D=三维） */
    viewType: McGeoViewType;
    /** 样式选项树 */
    options: McGeoStyleOptionNode[];
}
/**
 * 要素类样式分组结果
 * @description 按二维/三维分桶后的样式集合
 */
interface McGeoFeatureClassStyleMap {
    /** 二维样式（ViewType=CAD） */
    cad: McGeoFeatureClassStyle[];
    /** 三维样式（ViewType=3D） */
    view3d: McGeoFeatureClassStyle[];
}
/**
 * 下拉选项（静态可序列化）
 */
interface McGeoOptionItem {
    /** 选项显示名 */
    label?: unknown;
    /** 选项值 */
    value?: unknown;
    [key: string]: unknown;
}
/**
 * 属性绑定元数据
 * @description 供 editor 侧据此重建 getVal/setVal/options/isShow 等运行时闭包
 */
interface McGeoPropertyBinding {
    /** 字段种类：基础字段/要素属性/几何/样式/摘要/索引/坐标 */
    kind: 'baseInfo' | 'attr' | 'geometry' | 'style' | 'summary' | 'count' | 'coordinate';
    /** 所属要素类 ID */
    featureClassId?: string;
    /** 要素类名称 */
    className?: string;
    /** 要素类标签 */
    classLabel?: string;
    /** 字段名 */
    fieldKey?: string;
    /** 要素数据在实体 xData 中的存储键 */
    valueKey?: string;
    /** 几何数据键 */
    geometryValueKey?: string;
    /** 是否按索引取值（1:N 场景） */
    indexed?: boolean;
    /** 是否单要素（1:1） */
    singleFeature?: boolean;
    /** 是否只读 */
    isReadOnly?: boolean;
    /** 样式明细 ID */
    styleId?: string;
    /** 视图类型（CAD / 3D） */
    viewType?: string;
    /** 样式类型（Point / Line / Polygon / Raster / Text），用于区分同 viewType 下不同样式对象的同名属性 */
    styleType?: string;
    /** 样式选项节点原始名称（如 StrokeColor），用于映射到 McGeoStyle 内部属性名 */
    nodeName?: string;
    /** 已解析的样式内部属性名（如 lineColor / textureHeight），优先级高于 nodeName 的二次推断 */
    stylePropertyName?: string;
    /** 显隐依赖属性列表 */
    dependencyProperty?: string[];
    /** 显隐依赖属性默认值映射（供 isShow 闭包回退使用） */
    dependencyDefault?: Record<string, unknown>;
    /** 操作按钮种类：边界坐标面板 / 要素几何面板 */
    actionKind?: 'boundary' | 'featureGeometry' | 'none';
    /** 列表数据源配置 */
    listSource?: {
        sourceType: string;
        sourceCode: string;
        sourceCodes?: string[];
        labelKey: string;
        valueKey: string;
        fieldKey?: string;
    } | null;
    /** 坐标控件字段列表 */
    geometryFields?: {
        key: string;
        label: string;
    }[];
}
/**
 * 属性描述（中性、可序列化）
 * @description 特性面板脚本的最小组成单元，editor 侧据此生成运行时属性
 */
interface McGeoPropertyDescriptor {
    /** 属性 key */
    key: string;
    /** 属性标签 */
    label: string;
    /** 展示标签（与 label 不同时可指定） */
    displayLabel?: string;
    /** 默认值 */
    value: unknown;
    /** 是否可编辑 */
    isEdit: boolean;
    /** 是否需要索引（1:N 场景） */
    isNeedIndex?: boolean;
    /** 是否为索引控件 */
    isIndex?: boolean;
    /** 是否跳过实体数据落库（仅更新元数据） */
    skipEntityFlush?: boolean;
    /** 控件类型（input/number/textarea/select/color/lineType/lineWeight/moreModelCoordinate） */
    controlType: string;
    /** 控件配置（可序列化） */
    controlConfig: Record<string, unknown>;
    /** 静态选项 */
    options?: McGeoOptionItem[];
    /** 绑定元数据 */
    binding: McGeoPropertyBinding;
}
/**
 * 属性分组描述（中性分组树）
 * @description 特性面板脚本的组织单元，对应 editor 侧 GroupPropertyType 的结构
 */
interface McGeoPropertyGroupDescriptor {
    /** 分组 key */
    key: string;
    /** 分组名称 */
    name: string;
    /** 分组头部操作按钮 */
    headerAction?: {
        isShow?: boolean;
        label?: string;
        actionKind?: string;
    } | null;
    /** 分组属性列表 */
    property: McGeoPropertyDescriptor[];
    /** 子分组 */
    children?: McGeoPropertyGroupDescriptor[];
}
/**
 * 绘制面板中性描述
 * @description 与特性面板同源，editor 据此生成 ribbon module JSON
 */
interface McGeoDrawPanelDescriptor {
    /** 模块 key */
    moduleKey: string;
    /** 模块名称 */
    moduleLabel: string;
    /** 模块图标 */
    moduleIcon: string;
    /** 面板分组树（与特性面板同源） */
    groups: McGeoPropertyGroupDescriptor[];
}
export { McGeoSchemaInfo, McGeoFeature, McGeoFeatureClass, McGeoGeometryData, McGeoModelData, McGeoPointGeometryData, McGeoMultiPointGeometryData, McGeoLineGeometryData, McGeoMultiLineGeometryData, McGeoPolygonGeometryData, McGeoMultiPolygonGeometryData, McGeoModelField, McGeoData, McGeoTinGeometryData, GeoModelDefInfo, McGeoFeatureClassDefInfo, McGeoModelUIExchangeInfo, McGeoMetaField, McGeoFormField, McGeoFormSchema, McGeoModelSchema, McGeoFeatureClassSchemaItem, McGeoFeatureField, McGeoFeatureClassSchema, McGeoStyleOptionNode, McGeoStyleFeatureClassModel, McGeoFeatureClassStyleId, McGeoStyleModelRecord, McGeoFeatureClassStyle, McGeoFeatureClassStyleMap, McGeoOptionItem, McGeoPropertyBinding, McGeoPropertyDescriptor, McGeoPropertyGroupDescriptor, McGeoDrawPanelDescriptor, };
