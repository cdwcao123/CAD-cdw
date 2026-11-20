import { McColor, McDbObjectId, McGePoint, McGeVector3 } from 'McCore';
import { McReturnAirType, McSeriesVentilation, McTraversePointType, McTunnelExcavationStatus, McTunnelExcavationType, McTunnelSection, McTunnelSupportPattern, McTunnelType, McTunnelUse, McTunnelWindType, TunnelNodeAnnotationAttachment, TunnelNodeAnnotationDirect, TunnelNodeCoalType, TunnelNodeElevationSymbol, TunnelNodeElevationType } from './enum';
/**
 * 巷道数据结构
 */
interface IMcTunnelData {
    /** 巷道名称 */
    lanewayCode: string;
    /** 巷道名称 */
    lanewayName?: string;
    /** 巷道类型 */
    lanewayType?: McTunnelType;
    /** 矿井名称 */
    miningName?: string;
    /** 水平名称 */
    horizontalName?: string;
    /** 矿井区域名称*/
    miningAreaName?: string;
    /** 工作面名称 */
    workFaceName?: string;
    /** 进风回风类型 */
    intoOrOutWind?: McTunnelWindType;
    /** 巷道高度 */
    lanewayHeight?: number;
    /** 巷道宽度 */
    lanewayWidth?: number;
    /** 巷道断面类型 */
    lanewaySectionStyle?: McTunnelSection;
    /** 巷道用途 */
    lanewayUse?: McTunnelUse;
    /** 巷道支护类型 */
    supportPattern?: McTunnelSupportPattern;
    /** 串联通风 */
    seriesVentilation?: McSeriesVentilation;
    /** 回风类型 */
    returnAirType?: McReturnAirType;
    /** 掘进状态 */
    excavationStatus?: McTunnelExcavationStatus;
    /** 掘进类型 */
    excavationType?: McTunnelExcavationType;
    /** 进尺 */
    currentFootage?: number;
    /** 导线点列表 */
    nodes: McTunnelNodeData[];
    /** 边线列表 */
    borderLines: McGePoint[][];
}
/**
 * 巷道数据类
 */
declare class McTunnelData implements IMcTunnelData {
    lanewayCode: string;
    lanewayName?: string;
    lanewayType?: McTunnelType;
    miningName?: string;
    horizontalName?: string;
    miningAreaName?: string;
    workFaceName?: string;
    intoOrOutWind?: McTunnelWindType;
    lanewayHeight?: number;
    lanewayWidth?: number;
    lanewaySectionStyle?: McTunnelSection;
    lanewayUse?: McTunnelUse;
    supportPattern?: McTunnelSupportPattern;
    seriesVentilation?: McSeriesVentilation;
    returnAirType?: McReturnAirType;
    excavationStatus?: McTunnelExcavationStatus;
    excavationType?: McTunnelExcavationType;
    currentFootage?: number;
    nodes: McTunnelNodeData[];
    borderLines: McGePoint[][];
    constructor(data: IMcTunnelData);
}
/**
 * 巷道导线点数据结构
 */
interface IMcTunnelNodeData {
    /** 名称 */
    pointName: string;
    /** 左邦宽度 */
    leftSide: number;
    /** 右邦宽度 */
    rightSide: number;
    /** 序号 */
    pointOrder: number;
    /** 煤层结构 */
    coalSeamStruct: string;
    /** 底煤厚 */
    bottomCoalThick: number;
    /** 导线点类型 */
    traversePointType: McTraversePointType;
    /** 使用第二套邦线 */
    useSecondSide: boolean;
    /** 第二套左邦宽度 */
    secondLeftSide: number;
    /** 第二套右邦宽度 */
    secondRightSide: number;
    /** 半径，即后一段巷道凸度 */
    radius: number;
    /** 坐标 */
    x: number;
    y: number;
    /** 顶板标高 */
    z_top: number;
    /** 底板标高 */
    z_bottom: number;
}
/**
 * 巷道导线点数据类
 */
declare class McTunnelNodeData implements IMcTunnelNodeData {
    pointName: string;
    leftSide: number;
    rightSide: number;
    pointOrder: number;
    coalSeamStruct: string;
    bottomCoalThick: number;
    traversePointType: McTraversePointType;
    useSecondSide: boolean;
    secondLeftSide: number;
    secondRightSide: number;
    radius: number;
    x: number;
    y: number;
    z_top: number;
    z_bottom: number;
    constructor(data: IMcTunnelNodeData);
    get position(): McGeVector3;
    clone(): McTunnelNodeData;
}
/**
 * 巷道属性
 */
interface IMcTunnelProperty {
    /** 是否显示中心线 */
    showCenterLine: boolean;
    /** 中心线颜色 */
    tunnelCenterLineColor: McColor;
    /** 是否显示绑线 */
    showBorderLine: boolean;
    /** 绑线颜色 */
    tunnelBorderLineColor: McColor;
    /** 是否显示巷道名称 */
    showTunnelName: boolean;
    /** 是否显示导线点连线 */
    showNodeLine: boolean;
    /** 导线点连线颜色 */
    tunnelNodeLineColor: McColor;
    /**  文字样式 */
    tunnelNodeNameTextStyle: McDbObjectId;
    /** 文字颜色 */
    tunnelNodeNameTextColor: McColor;
    /** 文字高度 */
    tunnelNodeNameTextHeight: number;
    /** 偏移距离 */
    tunnelNodeNameTextOffset: number;
    /** 注记导线点名称 */
    tunnelNodeNameEnable: boolean;
    /** 注记方向 */
    tunnelNodeNameDirection: TunnelNodeAnnotationDirect;
    /** 注记位置 */
    tunnelNodeNameTextAttachment: TunnelNodeAnnotationAttachment;
    /**  文字样式 */
    tunnelNodeElevationTextStyle: McDbObjectId;
    /** 文字颜色 */
    tunnelNodeElevationTextColor: McColor;
    /** 文字高度 */
    tunnelNodeElevationTextHeight: number;
    /** 偏移距离 */
    tunnelNodeElevationTextOffset: number;
    /** 小数位数 */
    tunnelNodeElevationTextDecimalCount: number;
    /** 注记导线点名称 */
    tunnelNodeElevationEnable: boolean;
    /** 注记方向 */
    tunnelNodeElevationDirection: TunnelNodeAnnotationDirect;
    /** 注记位置 */
    tunnelNodeElevationTextAttachment: TunnelNodeAnnotationAttachment;
    /** 高程符号 */
    tunnelNodeElevationSymbol: TunnelNodeElevationSymbol;
    /** 高程类型 */
    tunnelNodeElevationType: TunnelNodeElevationType;
    /**  文字样式 */
    tunnelNodeCoalTextStyle: McDbObjectId;
    /** 文字颜色 */
    tunnelNodeCoalTextColor: McColor;
    /** 文字高度 */
    tunnelNodeCoalTextHeight: number;
    /** 偏移距离 */
    tunnelNodeCoalTextOffset: number;
    /** 行间距 */
    tunnelNodeCoalTextLineSpace: number;
    /** 注记导线点名称 */
    tunnelNodeCoalEnable: boolean;
    /** 注记方向 */
    tunnelNodeCoalDirection: TunnelNodeAnnotationDirect;
    /** 注记位置 */
    tunnelNodeCoalTextAttachment: TunnelNodeAnnotationAttachment;
    /** 注记方式 */
    tunnelNodeCoalType: TunnelNodeCoalType;
    /** 符号名 */
    tunnelNodeSymbolName: string;
    /** 宽度 */
    tunnelNodeSymbolWidth: number;
    /** 高度 */
    tunnelNodeSymbolHeight: number;
    /** 颜色 */
    tunnelNodeSymbolColor: McColor;
    /** 虚拟导线点符号名 */
    tunnelVirtualNodeSymbolName: string;
    /** 虚拟导线点宽度 */
    tunnelVirtualNodeSymbolWidth: number;
    /** 虚拟导线点高度 */
    tunnelVirtualNodeSymbolHeight: number;
    /** 虚拟导线点颜色 */
    tunnelVirtualNodeSymbolColor: McColor;
    /** 立井符号名 */
    shaftTunnelSymbolName: string;
}
export { McTunnelData, IMcTunnelNodeData, IMcTunnelProperty, McTunnelNodeData };
