import { IMcGeVector4, McColor, McGeVector3 } from 'McCore';
import { McSeriesVentilation } from '@/core_geology_collect_tool/mcTunnel/types/enum';
import { McDbWorkFaceStatus, McWorkFaceVentilationType } from './enum';
/**
 * 工作面进尺信息接口
 */
interface IMcWorkFaceFootageInfo {
    /** 序号 */
    order: number;
    /** 编码 */
    id: string;
    /** 日期 */
    date: string;
    /** 刀数 */
    knifeCount: number;
    /** 进尺 */
    footage: number;
    /** 颜色 */
    color: McColor;
    /** 是否显示 */
    show: boolean;
}
declare class McWorkFaceFootageInfo implements IMcWorkFaceFootageInfo {
    order: number;
    id: string;
    date: string;
    knifeCount: number;
    footage: number;
    color: McColor;
    show: boolean;
    constructor(data: IMcWorkFaceFootageInfo);
}
/**
 * 工作面属性
 */
interface IMcWorkFaceProperty {
    /** 工作面名称 */
    name: string;
    /** 工作面编码 */
    faceCode: string;
    /** 矿井名称 */
    miningName?: string;
    /** 矿井编码 */
    mineCode?: string;
    /** 采区名称 */
    miningAreaName?: string;
    /** 水平名称 */
    horizontalName?: string;
    /** 开采水平 */
    horizontalCode?: string;
    /** 采区编码 */
    miningAreaCode?: string;
    /** 区段编码 */
    regionCode?: string;
    /** 区段名称 */
    regionName?: string;
    /** 采煤工艺 */
    craft?: string;
    /** 煤层 */
    coalSeamCode?: string;
    /** 连续工作面 */
    continueWorkFace?: string;
    /** 状态 */
    status?: McDbWorkFaceStatus;
    /** 采高 */
    miningHeight?: number;
    /** 单刀进尺 */
    singleKnifeFootage?: number;
    /** 支架间距 */
    singleFrameFootage?: number;
    /** 底板标高 */
    floorElevation?: number;
    /** 倾向长度 */
    inclinationLength?: number;
    /** 走向长度 */
    strikeLength?: number;
    /** 采深上限 */
    topDepth?: number;
    /** 采深下限 */
    bottomDepth?: number;
    /** 特殊开采 */
    specialMining?: string;
    /** 煤厚 */
    coalSeamThickness?: number;
    /** 开采储量 */
    availableReserves?: number;
    /** 切眼 */
    cutTunnel?: string;
    /** 进风巷 */
    inletAirway?: string;
    /** 回风巷 */
    returnAirway?: string;
    /** 通风类型 */
    ventilationType?: McWorkFaceVentilationType;
    /** 串联通风 */
    seriesVentilation?: McSeriesVentilation;
    /** 回风巷长度大于1km */
    returnAirwayLengthGreaterThan1km?: boolean;
    /** 回风巷数量 */
    returnAirwayCount?: number;
    /** 易燃自燃煤层 */
    flammableCoalSeam?: boolean;
    /** 地温高工作面 */
    highTemperatureWorkingFace?: boolean;
    /** 累计进尺长度 */
    accumulatedFootage?: number;
    /** 回采左侧线 */
    footageLeftLine?: IMcGeVector4[];
    /** 回采右侧线 */
    footageRightLine?: IMcGeVector4[];
    /** 工作面网格坐标 */
    gridCoordinate?: IMcGeVector4[][];
    /** 边界坐标 */
    borderArray?: IMcGeVector4[][];
    /** 回采信息 */
    footageInfo?: IMcWorkFaceFootageInfo[];
}
/**
 * 工作面数据
 */
declare class McWorkFaceData implements IMcWorkFaceProperty {
    name: string;
    faceCode: string;
    miningName?: string | undefined;
    mineCode?: string | undefined;
    miningAreaName?: string | undefined;
    horizontalName?: string | undefined;
    horizontalCode?: string | undefined;
    miningAreaCode?: string | undefined;
    regionCode?: string | undefined;
    regionName?: string | undefined;
    craft?: string | undefined;
    coalSeamCode?: string | undefined;
    continueWorkFace?: string | undefined;
    status?: McDbWorkFaceStatus | undefined;
    miningHeight?: number | undefined;
    singleKnifeFootage?: number | undefined;
    singleFrameFootage?: number | undefined;
    floorElevation?: number | undefined;
    inclinationLength?: number | undefined;
    strikeLength?: number | undefined;
    topDepth?: number | undefined;
    bottomDepth?: number | undefined;
    specialMining?: string | undefined;
    coalSeamThickness?: number | undefined;
    availableReserves?: number | undefined;
    cutTunnel?: string | undefined;
    inletAirway?: string | undefined;
    returnAirway?: string | undefined;
    ventilationType?: McWorkFaceVentilationType | undefined;
    seriesVentilation?: McSeriesVentilation | undefined;
    returnAirwayLengthGreaterThan1km?: boolean | undefined;
    returnAirwayCount?: number | undefined;
    flammableCoalSeam?: boolean | undefined;
    highTemperatureWorkingFace?: boolean | undefined;
    accumulatedFootage?: number | undefined;
    footageLeftLine: IMcGeVector4[];
    footageRightLine: IMcGeVector4[];
    gridCoordinate: IMcGeVector4[][];
    borderArray: IMcGeVector4[][];
    footageInfo: IMcWorkFaceFootageInfo[];
    faceColor?: McColor;
    footageStartLineColor?: McColor;
    footageEndLineColor?: McColor;
    footageStopLineColor?: McColor;
    bShowStartLine?: boolean;
    bShowEndLine?: boolean;
    dLineWith?: number;
    constructor(data: IMcWorkFaceProperty);
}
/**
 * 工作面取点结构
 */
interface IWorkFacePointRet {
    index: number;
    point: McGeVector3;
    distance: number;
    isLeft?: boolean;
}
export { IMcWorkFaceProperty, McWorkFaceData, IMcWorkFaceFootageInfo, McWorkFaceFootageInfo, IWorkFacePointRet, };
