/** 缓存绑定类型：关闭面板按钮 */
export declare const closeBindingKind = "close";
/** 缓存绑定类型：字段控件 */
export declare const fieldControlBindingKind = "fieldControl";
/**
 * 绑定类型：字段控件
 */
export type LayoutLabelItem = {
    desc?: unknown;
    label?: unknown;
    [key: string]: unknown;
};
export type LayoutPair = unknown[]; /** 布局对数组 */
export type LayoutColumn = LayoutPair[]; /** 布局列数组，每个元素为一个布局对数组 */
export type LayoutRow = LayoutColumn[]; /** 布局行数组，每个元素为一个布局列数组 */
export type LayoutRows = LayoutRow[]; /** 布局行数组，每个元素为一个布局行数组 */
/**
 * 弹出布局节模型
 * @param pairs 布局对数组
 */
export type PopupSection = {
    pairs?: LayoutPair[];
};
/**
 * 构建顶部菜单布局选项
 * @param attrPairs 属性对数组
 * @param stylePairs 样式对数组
 * @param attrColumns 属性列数组
 * @param styleColumns 样式列数组
 * @param compactOverflowRows 是否压缩溢出行
 */
export type BuildTopMenuLayoutOptions = {
    attrPairs?: LayoutPair[];
    stylePairs?: LayoutPair[];
    attrColumns?: LayoutColumn[] | undefined;
    styleColumns?: LayoutColumn[] | undefined;
    compactOverflowRows?: boolean;
};
/**
 * 构建弹出布局选项
 * @param attrPairs 属性对数组
 * @param stylePairs 样式对数组
 * @param popupColumns 弹出列数组
 * @param popupSections 弹出布局节数组
 * @param popupLayoutMode 弹出布局模式
 * @param popupColumnsPerRow 弹出列数每行
 */
export type BuildPopupLayoutOptions = {
    attrPairs?: LayoutPair[];
    stylePairs?: LayoutPair[];
    popupColumns?: LayoutColumn[] | undefined;
    popupSections?: PopupSection[] | undefined;
    popupLayoutMode?: 'column' | 'grid' | 'row';
    popupColumnsPerRow?: number | undefined;
};
/**
 * 构建带弹出布局选项
 * @param usePopup 是否使用弹出布局
 */
export type BuildRibbonPanelLayoutOptions = BuildTopMenuLayoutOptions & BuildPopupLayoutOptions & {
    usePopup?: boolean;
};
/**
 * 构建顶部菜单布局选项
 * @param TopMenuType 顶部菜单类型
 * @param TopMenuIconSize 顶部菜单图标大小
 * @param TopMenuDisplayType 顶部菜单显示类型
 */
export type TopMenuRuntime = {
    TopMenuType: {
        INPUT: string;
        INPUT_NUMBER: string;
        SELECT: string;
        LABEL: string;
        ICON_TEXT: string;
    };
    TopMenuIconSize?: {
        LARGE?: string;
    };
    TopMenuDisplayType: {
        HORIZONTAL: string;
        VERTICAL: string;
        HORIZONTAL_DROPDOWN: string;
        VERTICAL_DROPDOWN: string;
    };
};
/**
 * 构建顶部菜单布局选项
 * @param label 选项标签
 * @param value 选项值
 * @param action 选项操作
 * @param key 选项键
 */
export type RibbonOption = {
    label?: unknown;
    value?: unknown;
    action?: unknown;
    [key: string]: unknown;
};
/**
 * 构建顶部菜单布局选项
 * @param key 选项键
 * @param label 选项标签
 * @param desc 选项描述
 * @param value 选项值
 * @param type 选项类型
 * @param displayType 选项显示类型
 * @param needCore 是否需要核心
 * @param searchable 是否可搜索
 * @param placeholder 占位符
 * @param component 组件
 * @param componentName 组件名称
 * @param controlType 控件类型
 * @param options 选项数组
 * @param maxlength 最大长度
 * @param clearable 是否可清除
 * @param min 最小值
 * @param max 最大值
 * @param step 步长
 */
export type RibbonControlItem = {
    key?: unknown;
    label?: unknown;
    desc?: unknown;
    value?: unknown;
    type?: string;
    displayType?: string;
    needCore?: unknown;
    searchable?: unknown;
    placeholder?: unknown;
    component?: unknown;
    componentName?: unknown;
    controlType?: unknown;
    options?: RibbonOption[];
    maxlength?: unknown;
    clearable?: unknown;
    min?: unknown;
    max?: unknown;
    step?: unknown;
    precision?: unknown;
    controls?: unknown;
    icon?: unknown;
    [key: string]: unknown;
};
/**
 * 构建顶部菜单布局选项
 * @param displayLabel 显示标签
 * @param desc 描述
 */
export type RibbonLabelOptions = {
    displayLabel?: unknown;
    desc?: unknown;
};
/**
 * 解析布局节点
 * @param node 节点
 * @param children 子节点数组
 */
export type ParsedLayoutNode = RibbonControlItem | ParsedLayoutNode[];
/**
 * 弹出列选项
 * @param label 标签
 * @param labelCharCount 标签字符数
 * @param pair 布局对
 */
export type PopupColumnEntry = {
    label?: unknown;
    labelCharCount?: number;
    pair?: unknown;
};
export type PopupColumn = PopupColumnEntry[]; /** 弹出列数组 */
/**
 * 弹出列移动选项
 * @param donorIndex 捐索引
 * @param receiverIndex 接收索引
 * @param movedGroup 移动组
 * @param nextColumnHeights 下一列高度数组
 */
export type PopupColumnMovePayload = {
    donorIndex: number;
    receiverIndex: number;
    movedGroup: PopupColumnEntry[];
    nextColumnHeights: number[];
};
export type AnyRecord = Record<string, any>; /** 任意记录类型 */
export type MoreModelRuntime = NonNullable<Window['MCEDITOR']>;
export type MoreModelOption = {
    label?: unknown;
    value?: unknown;
    [key: string]: unknown;
};
/**
 * 更多模型控制配置
 * @param editable 是否可编辑
 * @param disabled 是否禁用
 * @param options 选项数组
 * @param dataSource 数据源数组
 * @param type 控件类型
 * @param groupName 组名
 * @param propName 属性名
 * @param min 最小值
 * @param max 最大值
 * @param step 步长
 */
export type MoreModelControlConfig = AnyRecord & {
    editable?: boolean | ((args: AnyRecord) => unknown);
    disabled?: boolean | ((args: AnyRecord) => unknown);
    options?: MoreModelOption[] | ((args: AnyRecord) => unknown);
    dataSource?: MoreModelOption[] | ((args: AnyRecord) => unknown);
    type?: string;
    groupName?: string;
    propName?: string;
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    controls?: boolean;
    maxlength?: number;
    maxLength?: number;
    clearable?: boolean;
    defaultValue?: unknown;
};
/**
 * 更多模型属性配置
 * @param key 属性键
 * @param name 属性名称
 * @param label 属性标签
 * @param value 属性值
 * @param options 选项数组
 * @param isNeedIndex 是否需要索引
 * @param isIndex 是否索引
 * @param getVal 获取值函数
 * @param setVal 设置值函数
 * @param getLabel 获取标签函数
 * @param controlType 控件类型配置
 */
export type MoreModelProp = AnyRecord & {
    key?: string;
    name?: string;
    label?: string;
    value?: unknown;
    options?: MoreModelOption[];
    isNeedIndex?: boolean;
    isIndex?: boolean;
    getVal?: (entity: unknown) => unknown;
    setVal?: (entity: unknown, value: unknown) => void;
    getLabel?: (entity: unknown) => unknown;
    controlType?: {
        type?: string;
        controlConfig?: MoreModelControlConfig;
    };
};
/**
 * 更多模型选项配置
 * @param key 选项键
 * @param name 选项名称
 * @param children 子选项数组
 * @param property 属性映射
 */
export type MoreModelGroup = AnyRecord & {
    key?: string;
    name?: string;
    children?: MoreModelGroup[];
    property?: Map<unknown, MoreModelProp>;
};
/**
 * 模型值配置
 * @param _nextPropIndex 下一个属性索引
 */
export type ModelValue = Record<string, unknown> & {
    _nextPropIndex?: number;
};
/**
 * 索引状态配置
 * @param _nextPropIndex 下一个属性索引
 */
export type IndexState = Record<string, unknown>;
/**
 * 字段控制项配置
 * @param labelItem 标签项
 * @param controlItem 控件项
 */
export type FieldControlItem = {
    labelItem: RibbonControlItem;
    controlItem: RibbonControlItem;
};
/**
 * 字段入口配置
 * @param prop 属性
 * @param label 标签
 * @param displayLabelText 显示标签
 * @param labelCharCount 标签字符数
 * @param index 索引
 * @param item 字段控制项
 * @param pair 布局对
 * @param originalIndex 原始索引
 */
export type FieldEntry = {
    prop: MoreModelProp;
    label: string;
    displayLabelText: string;
    labelCharCount: number;
    index: number;
    item: FieldControlItem | null;
    pair?: PanelPair;
    originalIndex?: number;
};
/**
 * 面板对标签项配置
 * @param desc 描述
 * @param label 标签
 * @param key 键
 * @param [key] 任意键值对
 */
export type PanelPairLabelItem = {
    desc?: unknown;
    label?: unknown;
    key?: unknown;
    [key: string]: unknown;
};
export type PanelPair = [PanelPairLabelItem, ...unknown[]];
export type PanelColumn = PanelPair[];
/**
 * 收集组状态配置
 * @param attr 属性数组
 * @param style 样式数组
 * @param geometry 地理数组
 * @param styleColumns 样式分桶数组
 * @param styleColumnLabels 样式分桶标签数组
 * @param styleColumnKeys 样式分桶 key 数组
 * @param styleColumnMap 样式分桶映射
 */
export type CollectGroupState = {
    attr: MoreModelProp[];
    style: MoreModelProp[];
    geometry: MoreModelProp[];
    styleColumns: MoreModelProp[][];
    /** 样式分桶标签（与 styleColumns 一一对应，如"二维样式"/"三维样式"） */
    styleColumnLabels: string[];
    /** 样式分桶 key（与 styleColumns 一一对应） */
    styleColumnKeys: string[];
    styleColumnMap: Map<string, MoreModelProp[]>;
};
/**
 * 面板上下文配置
 * @param entity 实体
 * @param modelValue 模型值
 * @param indexState 索引状态
 * @param refreshLayout 刷新布局函数
 */
export type PanelContext = {
    entity: AnyRecord | null;
    modelValue: ModelValue;
    indexState?: IndexState;
    refreshLayout: () => void;
};
/**
 * 创建字段控制项选项配置
 * @param ownerKey 所有者键
 * @param prop 属性
 * @param modelValue 模型值
 * @param entity 实体
 * @param fieldIndex 字段索引
 * @param refreshLayout 刷新布局函数
 * @param forceDisabled 是否强制禁用
 * @param forceTextInput 是否强制文本输入
 */
export type CreateFieldControlItemOptions = {
    ownerKey: string;
    prop: MoreModelProp;
    modelValue: ModelValue;
    entity: AnyRecord | null;
    fieldIndex: number;
    refreshLayout: () => void;
    forceDisabled?: boolean;
    forceTextInput?: boolean;
};
/**
 * 创建字段入口选项配置
 * @param ownerKey 所有者键
 * @param entity 实体
 * @param modelValue 模型值
 * @param context 面板上下文
 * @param sortFn 排序函数
 */
export type CreateFieldEntriesOptions = {
    ownerKey: string;
    entity: AnyRecord | null;
    modelValue: ModelValue;
    context: PanelContext;
    sortFn?: ((a: MoreModelProp, b: MoreModelProp) => number) | undefined;
};
/**
 * 创建面板布局选项配置
 * @param ownerKey 所有者键
 * @param panelLabel 面板标签
 * @param attrProps 属性数组
 * @param styleProps 样式数组
 * @param styleColumns 样式分桶数组
 * @param styleColumnLabels 样式分桶标签数组
 * @param styleColumnKeys 样式分桶 key 数组
 * @param geometryProps 地理数组
 * @param attrColumnLayoutMode 属性列布局模式
 * @param context 面板上下文
 */
export type CreatePanelLayoutOptions = {
    ownerKey: string;
    panelLabel: string;
    attrProps?: MoreModelProp[];
    styleProps?: MoreModelProp[];
    styleColumns?: MoreModelProp[][];
    /** 样式分桶标签（与 styleColumns 一一对应） */
    styleColumnLabels?: string[];
    /** 样式分桶 key（与 styleColumns 一一对应） */
    styleColumnKeys?: string[];
    geometryProps?: MoreModelProp[];
    attrColumnLayoutMode?: 'rowWise' | 'denseVisible';
    context: PanelContext;
};
/**
 * 面板定义元数据
 * @param key 面板键
 * @param label 面板标签
 * @param icon 面板图标
 * @param ownerKey 所有者键
 * @param attrProps 属性数组
 * @param styleProps 样式数组
 * @param styleColumns 样式分桶数组
 * @param styleColumnLabels 样式分桶标签数组
 * @param styleColumnKeys 样式分桶 key 数组
 * @param geometryProps 地质数组
 */
export type PanelDefinitionMeta = {
    key: string;
    label: string;
    icon: string;
    ownerKey: string;
    attrProps: MoreModelProp[];
    styleProps?: MoreModelProp[];
    styleColumns?: MoreModelProp[][];
    /** 样式分桶标签（与 styleColumns 一一对应） */
    styleColumnLabels?: string[];
    /** 样式分桶 key（与 styleColumns 一一对应） */
    styleColumnKeys?: string[];
    geometryProps?: MoreModelProp[];
    attrColumnLayoutMode?: 'rowWise' | 'denseVisible';
    context: PanelContext;
};
/**
 * 面板定义
 * @param key 面板键
 * @param label 面板标签
 * @param icon 面板图标
 * @param children 子项数组
 */
export type PanelDefinition = {
    key: string;
    label: string;
    icon: string;
    children: unknown[];
};
/**
 * 面板上下文选项
 * @param entity 实体
 * @param modelId 模型ID
 * @param modelName 模型名称
 * @param closePanel 关闭面板函数
 * @param refreshLayout 刷新布局函数
 */
export type RibbonMenuContextOptions = {
    entity: AnyRecord | null;
    modelId: string;
    modelName: string;
    closePanel: () => void;
    refreshLayout: () => void;
};
/**
 * 关闭缓存绑定配置
 */
export type CloseCacheBinding = {
    kind: typeof closeBindingKind;
};
/**
 * 字段控制项缓存绑定配置
 * @param ownerKey 所有者键
 * @param propKey 属性键
 * @param propName 属性名称
 * @param propLabel 属性标签
 * @param fieldIndex 字段索引
 * @param forceTextInput 是否强制文本输入
 */
export type FieldControlCacheBinding = {
    kind: typeof fieldControlBindingKind;
    ownerKey: string;
    propKey?: string;
    propName?: string;
    propLabel?: string;
    fieldIndex: number;
    forceTextInput?: boolean;
};
/**
 * 更多模型缓存绑定配置
 */
export type MoreModelCacheBinding = CloseCacheBinding | FieldControlCacheBinding;
/**
 * 缓存上下文配置
 * @param allGroups 所有分组
 * @param entity 实体
 * @param modelValue 模型值
 * @param refreshLayout 刷新布局函数
 */
export type CacheHydrateContext = {
    allGroups: MoreModelGroup[];
    entity: AnyRecord | null;
    modelValue: ModelValue;
    refreshLayout: () => void;
};
/**
 * 更多模型绘制面板缓存记录
 */
export type MoreModelPanelCacheRecord = {
    modelId: string;
    modelName?: string;
    moduleJson?: Record<string, unknown>;
    cacheVersion?: string;
    updatedAt?: string;
    schemaDigest?: string;
};
/**
 * 地质模型顶部菜单动态添加项缓存记录（模型库"添加到当前菜单"后持久化）。
 * 与 MoreModelPanelCacheRecord 共用同一个 MoreModelPanelCacheDb 单例管理，不新开缓存文件。
 */
export type MoreModelTopMenuCacheRecord = {
    modelId: string;
    name: string;
    icon?: string;
    updatedAt?: string;
};
/**
 * 缓存绑定配置
 * @param kind 缓存绑定类型
 * @param key 缓存键
 * @param value 缓存值
 */
export type CacheBinding = {
    kind?: string;
    [key: string]: unknown;
};
/**
 * 读取缓存选项配置
 * @param schemaDigest 模型模式摘要
 */
export type ReadCacheOptions = {
    schemaDigest?: string;
};
