import { McColor, McGeVector3 } from 'McCore';
import { ColumnType } from './enum';
/**
 * 柱状图列信息
 */
export interface IColumnInfo {
    /**列名 */
    name: string;
    /**是否是有效列 */
    isValid: boolean;
    /**列标签 */
    label: string;
    /**列的数据类型 */
    type: ColumnType;
    /**属性值 */
    value: number | string;
}
/**
 * excel列与数据列关联信息
 */
export interface IColumnExcelInfo {
    /**列名 */
    name: string;
    /**列标签 */
    label: string;
    /**列的数据类型 */
    type: ColumnType;
    /**属性值 */
    value: number | string;
    /**关联Excel列索引 ，A ,B ,C ... */
    linkIndex: string;
}
/**
 * 地质钻孔基本信息接口
 */
export interface IMcGeoDrillBaseInfo {
    /** 唯一标识 */
    id: string;
    /** 钻孔名称 */
    name: string;
    /** 钻孔类型 */
    drillType: string;
    /** 第一勘探线 */
    firstExplorationLine: string;
    /** 第二勘探线 */
    secondExplorationLine: string;
    /** 孔口坐标 */
    orificeCoord: McGeVector3;
    /** 见煤点标高(m) */
    coalSeamZ: number;
    /** 煤厚(m) */
    coalSeamThickness: number;
    /** 孔半径(mm) */
    radius: number;
    /** 终孔深度(m) */
    endHoleDepth: number;
    /** 开工日期 */
    startDate: string;
    /** 竣工日期 */
    endDate: string;
    /** 负责人 */
    leader: string;
    /** 地层倾角 */
    layerAngle: number;
    /** 终孔层位 */
    endSeam: string;
    /** 测井深度 */
    loggingLength: number;
    /** 测井日期 */
    loggingDate: string;
    /** 最终斜度 */
    endAngle: number;
    /** 是否矿内孔('是'/'否') */
    isInMine: string;
    /** 是否斜孔('是'/'否') */
    isOblique: string;
    /** 施工目的 */
    target: string;
    /** 施工单位 */
    unit: string;
    /** 穿过煤层 */
    /** 穿过层位 */
    /** 技术员 */
    technician: string;
    /** 记录员 */
    recorder: string;
    /** 水文员 */
    hydrologyStaff: string;
    /** 测井员 */
    loggingPerson: string;
    /** 测井记录员 */
    loggingDescPerson: string;
    /** 说明 */
    remark: string;
}
/**
 * 钻探地层信息接口(钻孔与地层为一对多关系)
 */
export interface IMcGeoDrillDrillStratum {
    /** 唯一标识 */
    id?: string;
    /** 岩层名称 */
    name: string;
    /** 层厚 */
    depth: number;
    /** 累计层厚 */
    /** 真厚 */
    trueDepth: number;
    /** 累计真厚 */
    /** 岩心长度 */
    coreLength: number;
    /** 岩心采取率 */
    coreCollectRate: number;
    /** 岩心倾角 */
    coreAngle: number;
    /** 界 */
    rockBound: string;
    /** 系 */
    rockSystem: string;
    /** 统 */
    rockSeries: string;
    /** 组 */
    rockGroup: string;
    /** 段 */
    rockPart: string;
    /** 标志层 */
    markBed: string;
    /** 岩性描述 */
    remark: string;
    /** 颜色 */
    color?: McColor;
}
/**
 * 综合地层信息接口(钻孔与综合地层为一对多关系)
 */
export interface IMcGeoDrillComplexStratum {
    /** 唯一标识 */
    id?: string;
    /** 岩层名称 */
    name: string;
    /** 层厚 */
    depth: number;
    /** 累计层厚 */
    /** 真厚 */
    trueDepth: number;
    /** 累计真厚 */
    /** 岩心长度 */
    coreLength: number;
    /** 岩心采取率 */
    coreCollectRate: number;
    /** 岩心倾角 */
    coreAngle: number;
    /** 界 */
    rockBound: string;
    /** 系 */
    rockSystem: string;
    /** 统 */
    rockSeries: string;
    /** 组 */
    rockGroup: string;
    /** 段 */
    rockPart: string;
    /** 标志层 */
    markBed: string;
    /** 岩性描述 */
    remark: string;
    /** 颜色 */
    color?: McColor;
}
/**
 * 测井地层信息接口(钻孔与测井地层为一对多关系)
 */
export interface IMcGeoDrillLoggingStratum {
    /** 唯一标识 */
    id?: string;
    /** 岩层名称 */
    name: string;
    /** 层厚 */
    thickness: number;
    /** 底板深度 */
    bottomDepth?: number;
    /** 界 */
    rockBound: string;
    /** 系 */
    rockSystem: string;
    /** 统 */
    rockSeries: string;
    /** 组 */
    rockGroup: string;
    /** 段 */
    rockPart: string;
    /** 标志层 */
    markBed: string;
    /** 岩性描述 */
    remark: string;
    /** 颜色 */
    color?: McColor;
}
/**
 * 测斜信息接口(钻孔与测斜信息为一对多关系)
 */
export interface IMcGeoDrillInclinometerInfo {
    /** 唯一标识 */
    id?: string;
    /** 测点深度 */
    measureDepth: number;
    /** 测点倾角 */
    dipAngle: number;
    /** 测点天顶角 */
    measureZenithAngle: number;
    /** 测点方位角 */
    measureAzimuth: number;
    /** 水平投影距离 */
    projection: number;
    /** 投影累计 */
    projectionSum: number;
    /** 垂距 */
    h: number;
    /** 垂距累计 */
    hSum: number;
    /** X偏移 */
    xOffset: number;
    /** X偏移累计 */
    xOffsetSum: number;
    /** Y偏移 */
    yOffset: number;
    /** Y偏移累计 */
    yOffsetSum: number;
    /** 孔斜累计 */
    dipAngleSum: number;
    /** 方位角累计 */
    measureAzimuthSum: number;
}
/**
 * 温度观测信息接口(钻孔与温度观测为一对多关系)
 */
export interface IMcGeoDrillTemperatureInfo {
    /** 唯一标识 */
    id?: string;
    /** 观测深度 */
    depth: number;
    /** 井温 */
    temperature: number;
    /** 备注 */
    remark: string;
}
/**
 * 完井结构信息接口(钻孔与完井结构为一对一关系)
 */
export interface IMcGeoDrillCompletionStructure {
    /** 唯一标识 */
    id?: string;
    /** 一开孔径 */
    diameterFirst: number;
    /** 一开孔深 */
    depthFirst: number;
    /** 二开孔径 */
    diameterSecond: number;
    /** 二开孔深 */
    depthSecond: number;
    /** 表层套管直径 */
    surfaceCasingDiameter: number;
    /** 表层套管下入深度 */
    surfaceCasingDepth: number;
    /** 生产套管直径 */
    productCasingDiameter: number;
    /** 生产套管下入深度 */
    productCasingDepth: number;
    /** 水泥返高 */
    cementHeight: number;
    /** 遇阻深度 */
    stopDepth: number;
    /** 阻位 */
    stopPosition: number;
    /** 备注 */
    remark: string;
}
/**
 * 水位观测信息接口(钻孔与水位观测为一对多关系)
 */
export interface IMcGeoDrillWaterLevelInfo {
    /** 唯一标识 */
    id?: string;
    /** 测井深度 */
    loggingDepth: number;
    /** 水位 */
    waterLevel: number;
    /** 备注 */
    remark: string;
}
/**
 * 消耗量观测信息接口(钻孔与消耗量观测为一对多关系)
 */
export interface IMcGeoDrillConsumptionInfo {
    /** 唯一标识 */
    id?: string;
    /** 测井深度 */
    loggingDepth: number;
    /** 消耗量 */
    consumption: number;
    /** 备注 */
    remark: string;
}
/**
 * 封孔信息接口(钻孔与封孔信息为一对一关系)
 */
export interface IMcGeoDrillSealingInfo {
    /** 唯一标识 */
    id?: string;
    /** 封孔材料 */
    sealingMaterial: string;
    /** 封孔起深 */
    sealingStart: number;
    /** 封孔止深 */
    sealingEnd: number;
    /** 备注 */
    remark: string;
}
/**
 * 煤质信息接口(钻孔与煤质信息为一对多关系)
 */
export interface IMcGeoDrillCoalQuality {
    /** 唯一标识 */
    id?: string;
    /** 煤层 */
    coalSeamCode: string;
    /** 采样编号 */
    samplingId: string;
    /** 采样起深 */
    samplingStartDepth: number;
    /** 采样止深 */
    samplingEndDepth: number;
    /** 采样长度 */
    samplingLength: number;
    /** 采样芯长 */
    samplingCoreLength: number;
    /** 采取率 */
    collectRate: number;
    /** 夹矸删除 */
    clipLiveDelete: number;
    /** 煤质指标 */
    coalQuality: string;
}
/**
 * 打钻进度信息接口(钻孔与打钻进度为一对多关系)
 */
export interface IMcGeoDrillDrillingSchedule {
    /** 唯一标识 */
    id?: string;
    /** 打钻深度 */
    drillingDepth: number;
    /** 时间(分钟) */
    drillTime: number;
    /** 备注 */
    remark: string;
}
