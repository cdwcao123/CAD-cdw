import { McDbBlockDef, McMcdFiler, McMctfFiler } from 'McCore';
export declare enum PredefineField {
    /**钻孔名称 */
    DrillName = "drillName",
    /**孔口标高 */
    DrillOrificeElv = "coalElv",
    /**钻孔孔深 */
    DrillDepth = "drillDepth",
    /**层厚*/
    CoalThickness = "coalThickness",
    /**煤（岩）层底板标高 */
    CoalBottomElv = "bottomElv",
    /**见煤(岩)深度 */
    SeeCoalDepth = "seeCoalDepth",
    /**见煤（岩）点标高 */
    SeeCoalPointElv = "seeCoalPointElv",
    /**钻孔质量 */
    DrillQuality = "quality"
}
/**字段来源类型 */
export declare enum FieldSourceType {
    /**预定义 */
    Predefine = 0,
    /**自定义*/
    Custom = 1,
    /**基础信息 */
    BaseInfo = 2,
    /**钻探地层信息 */
    DrillStratumInfo = 3,
    /**综合地层信息 */
    ComplexStratumInfo = 4,
    /**测井地层信息 */
    LoggingStratumInfo = 5,
    /**测斜信息 */
    InclinometerInfo = 6,
    /**温度观测信息 */
    TemperatureInfo = 7,
    /**完井结构信息 */
    CompletionStructure = 8,
    /**水位观测信息 */
    WaterLevelInfo = 9,
    /**消耗量观测信息 */
    ConsumptionInfo = 10,
    /**封孔信息 */
    SealingInfo = 11,
    /**煤质信息 */
    CoalQuality = 12,
    /**打钻进度信息 */
    DrillingSchedule = 13
}
export interface IMcDbPlaneTemplateStyleAttrBindMap {
    /**属性名称(McDbAttributeDef 的 tag) */
    tag: string;
    /**字段来源类型 */
    sourceType: FieldSourceType;
    /**来源类型中文名(冗余,便于 UI 回显) */
    sourceTypeLabel: string;
    /**实体属性字段路径(支持嵌套如 name) */
    linkField: string;
    /**关联字段中文名(冗余,便于 UI 回显) */
    fieldLabel: string;
}
/** 字段来源类型下拉选项(value=枚举值, label=中文名) */
export declare const FieldSourceTypeOptions: {
    value: FieldSourceType;
    label: string;
}[];
/**
 * 地质钻孔平面模板样式类
 * @class
 * @extends McDbBlockDef
 */
export declare class McDbPlaneTemplateStyle extends McDbBlockDef {
    #private;
    /**对象类型*/
    protected readonly _type: string;
    /**实体类名 */
    protected static readonly _className: string;
    constructor(name: string, reNameable?: boolean);
    /** 获取所有属性绑定关系 */
    getAttrBindMaps(): IMcDbPlaneTemplateStyleAttrBindMap[];
    /**
     * 设置所有属性绑定关系(整体替换)
     * @param maps 绑定关系数组
     */
    setAttrBindMaps(maps: IMcDbPlaneTemplateStyleAttrBindMap[]): void;
    /**
     * 添加一条属性绑定关系
     * @param map 绑定关系(tag 不能与已有重复)
     * @returns 是否添加成功(tag 重复时返回 false)
     */
    addAttrBindMap(map: IMcDbPlaneTemplateStyleAttrBindMap): boolean;
    /**
     * 根据 tag 更新属性绑定关系
     * @param tag 属性名称(McDbAttributeDef 的 tag)
     * @param map 新的绑定关系
     * @returns 是否更新成功(tag 不存在时返回 false)
     */
    updateAttrBindMap(tag: string, map: IMcDbPlaneTemplateStyleAttrBindMap): boolean;
    /**
     * 根据 tag 删除属性绑定关系
     * @param tag 属性名称(McDbAttributeDef 的 tag)
     * @returns 是否删除成功(tag 不存在时返回 false)
     */
    removeAttrBindMap(tag: string): boolean;
    /**
     * 根据 tag 获取属性绑定关系
     * @param tag 属性名称(McDbAttributeDef 的 tag)
     * @returns 绑定关系,不存在时返回 undefined
     */
    getAttrBindMap(tag: string): IMcDbPlaneTemplateStyleAttrBindMap | undefined;
    /**创建标准样式模板 */
    static createStandardStyle(): McDbPlaneTemplateStyle;
    mctfInFields(fields: McMctfFiler): Promise<void>;
    mctfOutFields(fields: McMctfFiler): void;
    mcdInFields(fields: McMcdFiler): Promise<void>;
    mcdOutFields(fields: McMcdFiler): void;
}
