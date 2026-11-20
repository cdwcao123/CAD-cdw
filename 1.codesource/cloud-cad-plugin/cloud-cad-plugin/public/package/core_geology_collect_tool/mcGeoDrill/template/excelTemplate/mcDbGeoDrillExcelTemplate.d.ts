import { McDbSymbolTableRecord, McMcdFiler, McMctfFiler } from 'McCore';
import { IColumnExcelInfo, IColumnInfo } from '../../types/interface';
/**
 * 地质钻孔Excel导入导出模板类型
 */
export declare enum GeoDrillExcelTemplateType {
    /**批量绘制文件模板 */
    MultiDraw = "MultiDraw",
    /**基础信息模板 */
    BaseInfo = "BaseInfo",
    /**钻探地层模板 */
    Drill = "Drill",
    /**综合地层模板 */
    Complex = "Complex",
    /**测井地层模板 */
    Logging = "Logging",
    /** 测斜模板 */
    InclinometerInfo = "InclinometerInfo",
    /** 温度观测信息集合(钻孔与温度观测为一对多关系) */
    TemperatureInfo = "TemperatureInfo",
    /** 完井结构信息(钻孔与完井结构为一对一关系) */
    CompletionStructure = "CompletionStructure",
    /** 水位观测信息集合(钻孔与水位观测为一对多关系) */
    WaterLevelInfo = "WaterLevelInfo",
    /** 消耗量观测信息集合(钻孔与消耗量观测为一对多关系) */
    ConsumptionInfo = "ConsumptionInfo",
    /** 封孔信息(钻孔与封孔信息为一对一关系) */
    SealingInfo = "SealingInfo",
    /** 煤质信息集合(钻孔与煤质信息为一对多关系) */
    CoalQualInfo = "CoalQualInfo",
    /** 打钻进度信息集合(钻孔与打钻进度为一对多关系) */
    DrillingSchedule = "DrillingSchedule"
}
/**
 * 地质钻孔excel模板
 */
export declare class McDbGeoDrillExcelTemplate extends McDbSymbolTableRecord {
    /**对象类型*/
    protected readonly _type = "McDbGeoDrillExcelTemplate";
    /**实体类名 */
    protected static readonly _className = "McDbGeoDrillExcelTemplate";
    /**模板类型 */
    templateType: GeoDrillExcelTemplateType;
    /**源数据列信息 */
    sourceColumns: IColumnExcelInfo[];
    constructor(templateType: GeoDrillExcelTemplateType);
    mctfInFields(fields: McMctfFiler): Promise<void>;
    mctfOutFields(fields: McMctfFiler): void;
    mcdInFields(fields: McMcdFiler): Promise<void>;
    mcdOutFields(fields: McMcdFiler): void;
    /**创建占位列 */
    createUnValidColumn(): IColumnInfo;
}
