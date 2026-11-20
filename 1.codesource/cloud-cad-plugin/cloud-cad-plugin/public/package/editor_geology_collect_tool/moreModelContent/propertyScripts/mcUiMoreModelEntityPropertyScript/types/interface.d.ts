/**
 * 模型特征样式选项节点
 * @param id 选项ID
 * @param name 选项名称
 * @param label 选项标签
 * @param type 选项类型
 * @param controlType 控件类型
 * @param value 选项值
 * @param disabled 是否禁用
 * @param isMust 是否必填
 * @param children 子选项数组
 * @param dependencyProperty 依赖属性
 * @param controlProperty 控件属性
 * @param parent 父选项
 */
export interface StyleOptionNode {
    id: string | number;
    name: string;
    label: string;
    type: string;
    controlType: string;
    value: unknown;
    disabled?: boolean;
    isMust?: boolean;
    children?: StyleOptionNode[];
    dependencyProperty?: unknown;
    controlProperty?: string;
    parent?: string;
}
/**
 * 属性表模型
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

 */
export interface FeatureClassModel {
    ID: string;
    ModelId: string;
    ClassName: string;
    ClassLabel: string;
    GeoType: string;
    FeatureType?: string;
    FeatureCount?: string;
    AttrSchema?: unknown;
    GeoSchema?: unknown;
    ShapePropertySchema?: unknown;
}
/**
 * 模型特征样式模型
 * @param ID 类ID
 * @param StyleName 样式名称
 * @param FeatureClassId 特征类ID
 * @param StyleOptions 样式选项
 */
export interface StyleFeatureClassModel {
    ID: string;
    StyleName: string;
    FeatureClassId: string;
    StyleOptions: string;
}
/**
 * 分组属性表模型
 * @param groupKey 分组key
 * @param group 分组数据
 * @param modelValue 模型值
 * @param entities 实体数组
 * @param entity 实体
 */
export interface MoreModelGroupHeaderActionContext {
    groupKey?: string;
    group?: Record<string, unknown>;
    modelValue?: Record<string, unknown>;
    entities: unknown[];
    entity?: unknown;
}
/**
 * 分组属性表模型
 * @param key 分组key
 * @param name 分组名称
 * @param headerAction 顶部按钮
 * @param property 当前分组属性
 * @param children 子分组
 */
export interface GroupPropertyType {
    /**
     * 分组key
     */
    key: string;
    /**
     * 分组名称
     */
    name: string;
    /**
     * 分组显隐
     */
    isShow?: boolean | ((ctx: MoreModelGroupHeaderActionContext) => boolean);
    /**
     * 顶部按钮
     */
    headerAction?: Record<string, any>;
    /**
     * 当前分组属性
     */
    property: any[];
    /**
     * 子分组
     *
     * 用于:
     *
     * 导线点
     *   |
     *   导线点信息
     *
     *   二维样式
     *       |
     *       点
     *
     */
    children?: GroupPropertyType[];
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
export interface McGeoPropertyBinding {
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
    /** 已解析的样式内部属性名（如 lineColor），优先级高于 nodeName 的二次推断 */
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
export interface McGeoPropertyDescriptor {
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
export interface McGeoPropertyGroupDescriptor {
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
export {};
