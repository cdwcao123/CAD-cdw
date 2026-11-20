import { McColor, McDbAttribute, McDbBlock, McDbDatabase, McEngine2D, McEngine3D, McGeVector3, McMcdFiler, McMctfFiler } from 'McCore';
import { McGeoDrillBaseInfo, McGeoDrillDrillStratum, McGeoDrillComplexStratum, McGeoDrillLoggingStratum, McGeoDrillInclinometerInfo, McGeoDrillTemperatureInfo, McGeoDrillCompletionStructure, McGeoDrillWaterLevelInfo, McGeoDrillConsumptionInfo, McGeoDrillSealingInfo, McGeoDrillCoalQuality, McGeoDrillDrillingSchedule } from '../data';
import { McDbPlaneTemplateStyle } from '../template/planeTemplate/mcDbPlaneTemplateStyle';
import { IMcGeoDrillBaseInfo, IMcGeoDrillDrillStratum, IMcGeoDrillComplexStratum, IMcGeoDrillLoggingStratum, IMcGeoDrillInclinometerInfo, IMcGeoDrillTemperatureInfo, IMcGeoDrillCompletionStructure, IMcGeoDrillWaterLevelInfo, IMcGeoDrillConsumptionInfo, IMcGeoDrillSealingInfo, IMcGeoDrillCoalQuality, IMcGeoDrillDrillingSchedule } from '../types/interface';
/**
 * 地层类型
 * @description 地层类型，用于指定当前渲染的是岩层还是标志层
 */
export declare enum StratumType {
    /** 岩层 */
    Rock = "Rock",
    /** 标志层 */
    MarkerBed = "MarkerBed"
}
/**
 * 地层数据类型
 * @description 地层数据类型，用于指定当前使用的岩层信息类别
 */
export declare enum StratumDataType {
    /** 自动, 按照钻探地层, 综合地层, 测井地层的顺序，数组为空自动切换为下一个，都没有数据时根据钻孔高度生成一个 */
    Auto = "Auto",
    /** 钻探地层 */
    Drill = "Drill",
    /** 综合地层 */
    Complex = "Complex",
    /** 测井地层 */
    Logging = "Logging"
}
export interface IRockStratumVertex {
    /** 唯一标识 */
    id: string;
    /** 岩层名称*/
    name: string;
    /** 颜色 */
    color: McColor;
    /** 坐标 */
    pt: McGeVector3;
    /** 层厚 */
    thickness: number;
    /** 累计层厚 */
    sumThickness: number;
}
/**
 * 标志层顶点
 * @description 标志层顶点，用于绘制标志层
 */
export interface IMarkerBedVertex extends IRockStratumVertex {
}
/**
 * 地质钻孔实体
 */
export declare class McDbGeoDrill extends McDbBlock {
    #private;
    protected readonly _type: string;
    protected static readonly _className: string;
    /**
     * 构造函数
     * @param position 孔口坐标
     * @param templateName 钻孔模板名称
     * @param isAutoBuildAttr 是否自动构建显示属性,默认true,根据模板中配置的属性自动取值，生成显示属性,如果为false,则用户手动输入显示属性
     */
    constructor(position?: McGeVector3, templateName?: string, isAutoBuildAttr?: boolean);
    /**
     * 获取当前渲染的地层类型
     * @returns 当前渲染的地层类型
     */
    getCurStratumType(): StratumType;
    /**
     * 获取当前使用的岩层数据类别
     * @returns 当前使用的岩层数据类别
     */
    getCurStratumDataType(): StratumDataType;
    /**
     * 设置当前渲染的地层类型,标志层还是岩层
     * @param value 当前渲染的地层类型
     */
    setCurStratumType(value: StratumType): void;
    /**
     * 设置当前使用的岩层数据类别
     * @param value 当前使用的岩层数据类别
     */
    setCurStratumDataType(value: StratumDataType): void;
    /**
     * 获取当前显示的地层名称或岩层id
     * @returns 当前显示的地层名称或岩层id
     */
    getCurShowStratum(): string;
    /**
     * 设置当前显示的地层名称或岩层id
     * @param value 当前显示的地层名称或岩层id
     */
    setCurShowStratum(value: string): void;
    /**
     * 获取钻孔基本信息
     * @returns 钻孔基本信息数据
     */
    getBaseInfo(): McGeoDrillBaseInfo;
    /**
     * 设置钻孔基本信息
     * @param value 钻孔基本信息数据
     */
    setBaseInfo(value: IMcGeoDrillBaseInfo): void;
    /**
     * 获取唯一标识
     * @returns 唯一标识
     */
    getId(): string;
    /**
     * 设置唯一标识
     * @param value 唯一标识
     */
    setId(value: string): void;
    /**
     * 获取钻孔名称
     * @returns 钻孔名称
     */
    getName(): string;
    /**
     * 设置钻孔名称
     * @param value 钻孔名称
     */
    setName(value: string): void;
    /**
     * 获取钻孔类型
     * @returns 钻孔类型
     */
    getDrillType(): string;
    /**
     * 设置钻孔类型
     * @param value 钻孔类型
     */
    setDrillType(value: string): void;
    /**
     * 获取第一勘探线
     * @returns 第一勘探线
     */
    getFirstExplorationLine(): string;
    /**
     * 设置第一勘探线
     * @param value 第一勘探线
     */
    setFirstExplorationLine(value: string): void;
    /**
     * 获取第二勘探线
     * @returns 第二勘探线
     */
    getSecondExplorationLine(): string;
    /**
     * 设置第二勘探线
     * @param value 第二勘探线
     */
    setSecondExplorationLine(value: string): void;
    /**
     * 获取孔口坐标
     * @returns 孔口坐标
     */
    getPosition(): McGeVector3;
    /**
     * 设置孔口坐标
     * @param value 孔口坐标
     */
    setPosition(value: McGeVector3): void;
    /**
     * 获取见煤点标高(m)
     * @returns 见煤点标高
     */
    getCoalSeamZ(): number;
    /**
     * 设置见煤点标高(m)
     * @param value 见煤点标高
     */
    setCoalSeamZ(value: number): void;
    /**
     * 获取煤厚(m)
     * @returns 煤厚
     */
    getCoalSeamThickness(): number;
    /**
     * 设置煤厚(m)
     * @param value 煤厚
     */
    setCoalSeamThickness(value: number): void;
    /**
     * 获取孔半径(mm)
     * @returns 孔半径
     */
    getRadius(): number;
    /**
     * 设置孔半径(mm)
     * @param value 孔半径
     */
    setRadius(value: number): void;
    /**
     * 获取终孔深度(m)
     * @returns 终孔深度
     */
    getEndHoleDepth(): number;
    /**
     * 设置终孔深度(m)
     * @param value 终孔深度
     */
    setEndHoleDepth(value: number): void;
    /**
     * 获取开工日期
     * @returns 开工日期
     */
    getStartDate(): string;
    /**
     * 设置开工日期
     * @param value 开工日期
     */
    setStartDate(value: string): void;
    /**
     * 获取竣工日期
     * @returns 竣工日期
     */
    getEndDate(): string;
    /**
     * 设置竣工日期
     * @param value 竣工日期
     */
    setEndDate(value: string): void;
    /**
     * 获取负责人
     * @returns 负责人
     */
    getLeader(): string;
    /**
     * 设置负责人
     * @param value 负责人
     */
    setLeader(value: string): void;
    /**
     * 获取地层倾角
     * @returns 地层倾角
     */
    getLayerAngle(): number;
    /**
     * 设置地层倾角
     * @param value 地层倾角
     */
    setLayerAngle(value: number): void;
    /**
     * 获取终孔层位
     * @returns 终孔层位
     */
    getEndSeam(): string;
    /**
     * 设置终孔层位
     * @param value 终孔层位
     */
    setEndSeam(value: string): void;
    /**
     * 获取测井深度
     * @returns 测井深度
     */
    getLoggingLength(): number;
    /**
     * 设置测井深度
     * @param value 测井深度
     */
    setLoggingLength(value: number): void;
    /**
     * 获取测井日期
     * @returns 测井日期
     */
    getLoggingDate(): string;
    /**
     * 设置测井日期
     * @param value 测井日期
     */
    setLoggingDate(value: string): void;
    /**
     * 获取最终斜度
     * @returns 最终斜度
     */
    getEndAngle(): number;
    /**
     * 设置最终斜度
     * @param value 最终斜度
     */
    setEndAngle(value: number): void;
    /**
     * 获取是否矿内孔
     * @returns 是否矿内孔('是'/'否')
     */
    getIsInMine(): string;
    /**
     * 设置是否矿内孔
     * @param value 是否矿内孔('是'/'否')
     */
    setIsInMine(value: string): void;
    /**
     * 获取是否斜孔
     * @returns 是否斜孔('是'/'否')
     */
    getIsOblique(): string;
    /**
     * 设置是否斜孔
     * @param value 是否斜孔('是'/'否')
     */
    setIsOblique(value: string): void;
    /**
     * 获取施工目的
     * @returns 施工目的
     */
    getTarget(): string;
    /**
     * 设置施工目的
     * @param value 施工目的
     */
    setTarget(value: string): void;
    /**
     * 获取施工单位
     * @returns 施工单位
     */
    getUnit(): string;
    /**
     * 设置施工单位
     * @param value 施工单位
     */
    setUnit(value: string): void;
    /**
     * 获取穿过煤层
     * @returns 穿过煤层集合
     */
    getCrossCoal(): string[];
    /**
     * 设置穿过煤层
     * @param value 穿过煤层集合
     */
    setCrossCoal(value: string[]): void;
    /**
     * 获取穿过层位
     * @returns 穿过层位集合
     */
    getCrossLayer(): string[];
    /**
     * 设置穿过层位
     * @param value 穿过层位集合
     */
    setCrossLayer(value: string[]): void;
    /**
     * 获取技术员
     * @returns 技术员
     */
    getTechnician(): string;
    /**
     * 设置技术员
     * @param value 技术员
     */
    setTechnician(value: string): void;
    /**
     * 获取记录员
     * @returns 记录员
     */
    getRecorder(): string;
    /**
     * 设置记录员
     * @param value 记录员
     */
    setRecorder(value: string): void;
    /**
     * 获取水文员
     * @returns 水文员
     */
    getHydrologyStaff(): string;
    /**
     * 设置水文员
     * @param value 水文员
     */
    setHydrologyStaff(value: string): void;
    /**
     * 获取测井员
     * @returns 测井员
     */
    getLoggingPerson(): string;
    /**
     * 设置测井员
     * @param value 测井员
     */
    setLoggingPerson(value: string): void;
    /**
     * 获取测井记录员
     * @returns 测井记录员
     */
    getLoggingDescPerson(): string;
    /**
     * 设置测井记录员
     * @param value 测井记录员
     */
    setLoggingDescPerson(value: string): void;
    /**
     * 获取说明
     * @returns 说明
     */
    getRemark(): string;
    /**
     * 设置说明
     * @param value 说明
     */
    setRemark(value: string): void;
    /**
     * 获取钻探地层信息集合(岩层数据)
     * @returns 钻探地层信息集合(岩层数据)
     */
    getDrillStratums(): McGeoDrillDrillStratum[];
    /**
     * 设置钻探地层信息集合(整体替换)
     * @param value 钻探地层信息集合
     */
    setDrillStratums(value: IMcGeoDrillDrillStratum[]): void;
    /**
     * 添加一条钻探地层信息
     * @param value 钻探地层信息
     */
    addDrillStratum(value: IMcGeoDrillDrillStratum): void;
    /**
     * 插入一条钻探地层信息
     * @param index 地层信息索引,插入位置,插入到前边
     * @param value 钻探地层信息
     */
    insertDrillStratum(index: number, value: IMcGeoDrillDrillStratum): void;
    /**
     * 按索引移除钻探地层信息
     * @param index 地层信息索引
     */
    removeDrillStratum(index: number): void;
    /**
     * 按索引获取钻探地层信息
     * @param index 地层信息索引
     * @returns 钻探地层信息,未找到返回undefined
     */
    getDrillStratum(index: number): McGeoDrillDrillStratum | undefined;
    /**
     * 获取综合地层信息集合
     * @returns 综合地层信息集合
     */
    getComplexStratums(): McGeoDrillComplexStratum[];
    /**
     * 设置综合地层信息集合(整体替换)
     * @param value 综合地层信息集合
     */
    setComplexStratums(value: IMcGeoDrillComplexStratum[]): void;
    /**
     * 添加一条综合地层信息
     * @param value 综合地层信息
     */
    addComplexStratum(value: IMcGeoDrillComplexStratum): void;
    /**
     * 插入一条综合地层信息
     * @param index 地层信息索引,插入位置,插入到前边
     * @param value 综合地层信息
     */
    insertComplexStratum(index: number, value: IMcGeoDrillComplexStratum): void;
    /**
     * 按索引移除综合地层信息
     * @param index 地层信息索引
     */
    removeComplexStratum(index: number): void;
    /**
     * 按索引获取综合地层信息
     * @param index 地层信息索引
     * @returns 综合地层信息,未找到返回undefined
     */
    getComplexStratum(index: number): McGeoDrillComplexStratum | undefined;
    /**
     * 获取测井地层信息集合
     * @returns 测井地层信息集合
     */
    getLoggingStratums(): McGeoDrillLoggingStratum[];
    /**
     * 设置测井地层信息集合(整体替换)
     * @param value 测井地层信息集合
     */
    setLoggingStratums(value: IMcGeoDrillLoggingStratum[]): void;
    /**
     * 添加一条测井地层信息
     * @param value 测井地层信息
     */
    addLoggingStratum(value: IMcGeoDrillLoggingStratum): void;
    /**
     * 插入一条测井地层信息
     * @param index 地层信息索引,插入位置,插入到前边
     * @param value 测井地层信息
     */
    insertLoggingStratum(index: number, value: IMcGeoDrillLoggingStratum): void;
    /**
     * 按索引移除测井地层信息
     * @param index 地层信息索引
     */
    removeLoggingStratum(index: number): void;
    /**
     * 按索引获取测井地层信息
     * @param index 地层信息索引
     * @returns 测井地层信息,未找到返回undefined
     */
    getLoggingStratum(index: number): McGeoDrillLoggingStratum | undefined;
    /**
     * 获取测斜信息集合
     * @returns 测斜信息集合
     */
    getInclinometerInfos(): McGeoDrillInclinometerInfo[];
    /**
     * 设置测斜信息集合(整体替换)
     * @param value 测斜信息集合
     */
    /**
     * 设置测斜信息集合(整体替换)
     * @param value 测斜信息集合
     */
    setInclinometerInfos(value: IMcGeoDrillInclinometerInfo[]): void;
    /**
     * 添加一条测斜信息
     * @param value 测斜信息
     */
    /**
     * 添加一条测斜信息
     * @param value 测斜信息
     */
    addInclinometerInfo(value: IMcGeoDrillInclinometerInfo): void;
    /**
     * 插入一条测斜信息
     * @param index 测斜信息索引,插入位置,插入到前边
     * @param value 测斜信息
     */
    insertInclinometerInfo(index: number, value: IMcGeoDrillInclinometerInfo): void;
    /**
     * 按索引移除测斜信息
     * @param index 测斜信息索引
     */
    removeInclinometerInfo(index: number): void;
    /**
     * 按索引获取测斜信息
     * @param index 测斜信息索引
     * @returns 测斜信息,未找到返回undefined
     */
    getInclinometerInfo(index: number): McGeoDrillInclinometerInfo | undefined;
    /**
     * 获取温度观测信息集合
     * @returns 温度观测信息集合
     */
    getTemperatureInfos(): McGeoDrillTemperatureInfo[];
    /**
     * 设置温度观测信息集合(整体替换)
     * @param value 温度观测信息集合
     */
    setTemperatureInfos(value: IMcGeoDrillTemperatureInfo[]): void;
    /**
     * 添加一条温度观测信息
     * @param value 温度观测信息
     */
    addTemperatureInfo(value: IMcGeoDrillTemperatureInfo): void;
    /**
     * 插入一条温度观测信息
     * @param index 温度观测信息索引,插入位置,插入到前边
     * @param value 温度观测信息
     */
    insertTemperatureInfo(index: number, value: IMcGeoDrillTemperatureInfo): void;
    /**
     * 按索引移除温度观测信息
     * @param index 温度观测信息索引
     */
    removeTemperatureInfo(index: number): void;
    /**
     * 按索引获取温度观测信息
     * @param index 温度观测信息索引
     * @returns 温度观测信息,未找到返回undefined
     */
    getTemperatureInfo(index: number): McGeoDrillTemperatureInfo | undefined;
    /**
     * 获取完井结构信息
     * @returns 完井结构信息
     */
    getCompletionStructure(): McGeoDrillCompletionStructure;
    /**
     * 设置完井结构信息
     * @param value 完井结构信息
     */
    setCompletionStructure(value: IMcGeoDrillCompletionStructure): void;
    /**
     * 获取水位观测信息集合
     * @returns 水位观测信息集合
     */
    getWaterLevelInfos(): McGeoDrillWaterLevelInfo[];
    /**
     * 设置水位观测信息集合(整体替换)
     * @param value 水位观测信息集合
     */
    setWaterLevelInfos(value: IMcGeoDrillWaterLevelInfo[]): void;
    /**
     * 添加一条水位观测信息
     * @param value 水位观测信息
     */
    addWaterLevelInfo(value: IMcGeoDrillWaterLevelInfo): void;
    /**
     * 插入一条水位观测信息
     * @param index 水位观测信息索引,插入位置,插入到前边
     * @param value 水位观测信息
     */
    insertWaterLevelInfo(index: number, value: IMcGeoDrillWaterLevelInfo): void;
    /**
     * 按索引移除水位观测信息
     * @param index 水位观测信息索引
     */
    removeWaterLevelInfo(index: number): void;
    /**
     * 按索引获取水位观测信息
     * @param index 水位观测信息索引
     * @returns 水位观测信息,未找到返回undefined
     */
    getWaterLevelInfo(index: number): McGeoDrillWaterLevelInfo | undefined;
    /**
     * 获取消耗量观测信息集合
     * @returns 消耗量观测信息集合
     */
    getConsumptionInfos(): McGeoDrillConsumptionInfo[];
    /**
     * 设置消耗量观测信息集合(整体替换)
     * @param value 消耗量观测信息集合
     */
    setConsumptionInfos(value: IMcGeoDrillConsumptionInfo[]): void;
    /**
     * 添加一条消耗量观测信息
     * @param value 消耗量观测信息
     */
    addConsumptionInfo(value: IMcGeoDrillConsumptionInfo): void;
    /**
     * 插入一条消耗量观测信息
     * @param index 消耗量观测信息索引,插入位置,插入到前边
     * @param value 消耗量观测信息
     */
    insertConsumptionInfo(index: number, value: IMcGeoDrillConsumptionInfo): void;
    /**
     * 按索引移除消耗量观测信息
     * @param index 消耗量观测信息索引
     */
    removeConsumptionInfo(index: number): void;
    /**
     * 按索引获取消耗量观测信息
     * @param index 消耗量观测信息索引
     * @returns 消耗量观测信息,未找到返回undefined
     */
    getConsumptionInfo(index: number): McGeoDrillConsumptionInfo | undefined;
    /**
     * 获取封孔信息
     * @returns 封孔信息
     */
    getSealingInfo(): McGeoDrillSealingInfo;
    /**
     * 设置封孔信息
     * @param value 封孔信息
     */
    setSealingInfo(value: IMcGeoDrillSealingInfo): void;
    /**
     * 获取煤质信息集合
     * @returns 煤质信息集合
     */
    getCoalQualities(): McGeoDrillCoalQuality[];
    /**
     * 设置煤质信息集合(整体替换)
     * @param value 煤质信息集合
     */
    setCoalQualities(value: IMcGeoDrillCoalQuality[]): void;
    /**
     * 添加一条煤质信息
     * @param value 煤质信息
     */
    addCoalQuality(value: IMcGeoDrillCoalQuality): void;
    /**
     * 插入一条煤质信息
     * @param index 煤质信息索引,插入位置,插入到前边
     * @param value 煤质信息
     */
    insertCoalQuality(index: number, value: IMcGeoDrillCoalQuality): void;
    /**
     * 按索引移除煤质信息
     * @param index 煤质信息索引
     */
    removeCoalQuality(index: number): void;
    /**
     * 按索引获取煤质信息
     * @param index 煤质信息索引
     * @returns 煤质信息,未找到返回undefined
     */
    getCoalQuality(index: number): McGeoDrillCoalQuality | undefined;
    /**
     * 获取打钻进度信息集合
     * @returns 打钻进度信息集合
     */
    getDrillingSchedules(): McGeoDrillDrillingSchedule[];
    /**
     * 设置打钻进度信息集合(整体替换)
     * @param value 打钻进度信息集合
     */
    setDrillingSchedules(value: IMcGeoDrillDrillingSchedule[]): void;
    /**
     * 添加一条打钻进度信息
     * @param value 打钻进度信息
     */
    addDrillingSchedule(value: IMcGeoDrillDrillingSchedule): void;
    /**
     * 插入一条打钻进度信息
     * @param index 打钻进度信息索引,插入位置,插入到前边
     * @param value 打钻进度信息
     */
    insertDrillingSchedule(index: number, value: IMcGeoDrillDrillingSchedule): void;
    /**
     * 按索引移除打钻进度信息
     * @param index 打钻进度信息索引
     */
    removeDrillingSchedule(index: number): void;
    /**
     * 按索引获取打钻进度信息
     * @param index 打钻进度信息索引
     * @returns 打钻进度信息,未找到返回undefined
     */
    getDrillingSchedule(index: number): McGeoDrillDrillingSchedule | undefined;
    /**
     * 清空属性
     * @param keepCustomAttr 是否保留自定义属性
     */
    clearAttribute(keepCustomAttr?: boolean): void;
    rebuildChildEntity(db: McDbDatabase): void;
    worldDraw2d(engine: McEngine2D): void;
    worldDraw3d(engine: McEngine3D): void;
    /**
     * 获取平面钻孔样式
     * @returns 平面钻孔样式
     */
    getBlockDef(): McDbPlaneTemplateStyle | undefined;
    /**
     *构建当前钻孔的从上到下的岩层几何信息集合(数据)
     * @returns 岩层几何信息集合(数据)
     */
    buildRockStratumPath(stratumDataType?: StratumDataType): IRockStratumVertex[];
    /**
     * 获取当前钻孔的岩层路径(从孔口到孔底)
     * @returns 岩层路径(从孔口到孔底)
     * @internal
     */
    _getRockPath(): IRockStratumVertex[];
    /**
     * 构建当前钻孔的从上到下的标志层几何信息集合(数据)
     * @returns 标志层几何信息集合(数据)
     */
    buildMarkerBedPath(stratumDataType?: StratumDataType): IMarkerBedVertex[];
    /**
     * 获取当前钻孔的标志层路径(从孔口到孔底)
     * @returns 标志层路径(从孔口到孔底)
     * @internal
     */
    _getMarkerBedPath(): IMarkerBedVertex[];
    createGrips(): void;
    clone(): this;
    /**
     * 从外部 mctf 数据源导入到当前实体
     * @param sourceFields mctf 数据源
     */
    mctfInFields(sourceFields: McMctfFiler): void;
    /**
     * 将当前实体的属性输出到外部 mctf 数据源
     * @param targetFields mctf 数据源
     */
    mctfOutFields(targetFields: McMctfFiler): void;
    /**
     * 从外部 mcd 数据流导入到当前实体
     * @param sourceFields mcd 数据流
     */
    mcdInFields(sourceFields: McMcdFiler): void;
    /**
     * 将当前实体的属性输出到外部 mcd 数据流
     * @param targetFields mcd 数据流
     */
    mcdOutFields(targetFields: McMcdFiler): void;
    /**
     * 根据模板样式中的 tag 与实体属性的绑定关系,从当前实体提取属性值生成 McDbAttribute 数组
     * @returns 生成的 McDbAttribute 数组,模板不存在或无绑定关系时返回空数组
     * @internal
     */
    generateAttributesFromTemplate(): McDbAttribute[];
    /**
   * 根据给定的模板值，创建一个实体实例
   * @param templateValues 模板参数值，key为模板参数名称，value为参数值
   * @param templateName 模板名称，用于创建实体时的模板样式
   * @returns 实体实例
   */
    static createByPlaneTemplateValues(db: McDbDatabase, templateValues: Record<string, unknown>, templateName?: string, position?: McGeVector3): McDbGeoDrill;
    /**
     * 根据给定的模板值，依据当前模板样式中的 tag 与实体属性的绑定关系,赋值给对应的实体属性
     * @param templateValues 模板参数值，key为模板参数名称，value为参数值
     * @description 必须保证已经设置了模板，且模板在数据库中存在
     */
    assignTemplateValues(templateValues: Record<string, unknown>): void;
}
