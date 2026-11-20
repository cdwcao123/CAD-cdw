/**
 * 巷道断面类型
 */
declare enum McTunnelSection {
    HalfCircle = "\u534A\u5706\u62F1",
    Arc = "\u5706\u5F27\u62F1",
    ThreeCenterArch = "\u4E09\u5FC3\u62F1",
    Rectangle = "\u77E9\u5F62",
    Trapezoid = "\u68AF\u5F62",
    Circle = "\u5706\u5F62"
}
/**
 * 巷道类型
 */
declare enum McTunnelType {
    Normal = "\u666E\u901A",
    Shaft = "\u7AD6\u4E95"
}
/**
 * 进回风类型
 */
declare enum McTunnelWindType {
    InWind = "\u8FDB\u98CE",
    OutWind = "\u56DE\u98CE"
}
/**
 * 巷道用途
 */
declare enum McTunnelUse {
    Deploitation = "\u5F00\u62D3\u5DF7\u9053",
    Preparing = "\u51C6\u5907\u5DF7\u9053",
    Stope = "\u56DE\u91C7\u5DF7\u9053",
    CoalBunker = "\u7164\u4ED3",
    WaterSump = "\u6C34\u4ED3"
}
/**
 * 巷道支护类型
 */
declare enum McTunnelSupportPattern {
    AnchorRod = "\u951A\u6746\u652F\u62A4",
    AnchorNet = "\u951A\u6746\u951A\u7F51\u652F\u62A4",
    AnchorRodBeam = "\u951A\u6746\u951A\u6881\u652F\u62A4",
    AnchorNetGunite = "\u951A\u6746\u951A\u7F51\u55B7\u6D46\u652F\u62A4",
    SimpleGunite = "\u7D20\u55B7\u6D46\u652F\u62A4",
    Skewback = "\u7384\u77F3\u8D77\u62F1\u652F\u62A4",
    Ferroconcrete = "\u73B0\u6D47\u94A2\u7B4B\u6C34\u6CE5\u652F\u62A4",
    SectionSteel = "\u578B\u94A2\u652F\u62A4",
    IBeamThreeSectionShed = "\u5DE5\u5B57\u94A2\u4E09\u8282\u68DA\u652F\u62A4",
    Naked = "\u88F8\u4F53\u652F\u62A4"
}
/**
 * 回风类型
 */
declare enum McReturnAirType {
    UType = "U\u578B",
    ZType = "Z\u578B",
    YType = "Y\u578B",
    HType = "H\u578B",
    WType = "W\u578B",
    SingleExcavation = "\u5355\u6398\u8FDB",
    DoubleExcavation = "\u53CC\u6398\u8FDB",
    MiningAreaReturnAirway = "\u91C7\u533A\u56DE\u98CE\u5DF7",
    OneWingReturnAirway = "\u4E00\u7FFC\u56DE\u98CE\u5DF7",
    MainReturnAirway = "\u603B\u56DE\u98CE\u5DF7"
}
/**
 * 串联通风
 */
declare enum McSeriesVentilation {
    Yes = "1",// 是
    No = "2"
}
/**
 * 巷道掘进状态
 */
declare enum McTunnelExcavationStatus {
    Preparing = "\u51C6\u5907\u4E2D",
    Excavating = "\u6398\u8FDB\u4E2D",
    Over = "\u5B8C\u6210"
}
/**
 * 巷道掘进类型
 */
declare enum McTunnelExcavationType {
    Single = "\u5355\u6398",
    Double = "\u53CC\u6398",
    Normal = "\u666E\u901A"
}
/**
 * 导线点类型
 */
declare enum McTraversePointType {
    Default = "",
    Node = "\u5BFC\u7EBF\u70B9",
    Stop = "\u505C\u5934",
    Temporary = "\u4E34\u65F6\u5BFC\u7EBF\u70B9",
    Virtual = "\u865A\u62DF\u70B9"
}
/**
 * 导线点注记方向
 */
declare enum TunnelNodeAnnotationDirect {
    /** 平行于巷道 */
    ParallelToTunnel = 0,
    /** 垂直于巷道 */
    VerticalToTunnel = 1,
    /** 自动注记方向 */
    Auto = 2
}
/**
 * 导线点注记位置
 */
declare enum TunnelNodeAnnotationAttachment {
    /** 上部居左 */
    TopLeft = 1,
    /** 上部居中 */
    TopCenter = 2,
    /** 左侧 */
    Left = 4,
    /** 右侧 */
    Right = 6,
    /** 下部居左 */
    BottomLeft = 7,
    /** 下部居中 */
    BottomCenter = 8
}
/**
 * 高程符号
 */
declare enum TunnelNodeElevationSymbol {
    /** 前端 */
    Front = 0,
    /** 后端 */
    Back = 1
}
/**
 * 高程类型
 */
declare enum TunnelNodeElevationType {
    /** 底板 */
    Bottom = 0,
    /** 顶板 */
    Top = 1,
    /** 煤层底板 */
    CoalBottom = 2,
    /** 煤层顶板 */
    CoalTop = 3
}
/**
 * 导线点煤层结构注记方式
 */
declare enum TunnelNodeCoalType {
    /** 同行注记 */
    SameLine = 0,
    /** 分别注记 */
    RespectivelyLine = 1
}
/**
 * 巷道绘制样式属性类型
 */
declare enum McDbTunnelDrawStylePropertyType {
    TunnelStyle = 0,// 巷道样式
    TunnelSection = 1,// 断面类型
    TunnelHeight = 2,// 巷道高度
    TunnelLeftSide = 3,// 左邦
    TunnelRightSide = 4,// 右邦
    TunnelElevation = 5,// 高程
    TunnelElevationType = 6,// 高程类型
    TunnelColor = 7,// 巷道颜色
    TunnelAngle = 8,// 仰角
    TunnelNodeLineColor = 9,// 导线点连线线颜色
    TunnelCenterLineColor = 10,// 中心线颜色
    TunnelName = 11,// 巷道名称
    TunnelMineName = 12,// 矿井名称
    TunnelHorizontalName = 13,// 水平名称
    TunnelWorkingFaceName = 14,// 工作面名称
    TunnelMiningAreaName = 15,// 采区名称
    TunnelSupportPattern = 16,// 支护类型
    TunnelUse = 17,// 用途
    TunnelWindInOut = 18,// 进回风类型
    TunnelSeriesVentilation = 19,// 串联通风
    TunnelReturnAirType = 20,// 回风类型
    TunnelMaterial = 21,// 材质
    TunnelExcavationStatus = 22,// 掘进状态
    TunnelExcavationType = 23,// 掘进类型
    TunnelCurrentFootage = 24,// 当前进尺
    TunnelShowTunnelName = 25,// 显示巷道名称
    TunnelShowNodeName = 26,// 显示节点名称
    TunnelShowElevation = 27,// 显示高程
    TunnelShowCenterLine = 28,// 显示中心线
    TunnelShowNodeLine = 29,// 显示节点线
    TunnelShowBorderLine = 30,// 显示边界线
    TunnelUseSecondSide = 31,// 是否启用第二套邦线
    TunnelSecondLeftSide = 32,// 第二套左邦
    TunnelSecondRightSide = 33
}
/**
 * 巷道绘制样式面板事件
 */
declare enum McDbTunnelDrawStylePropertyEvent {
    /** 打开面板 */
    TunnelOpenPanel = 0,
    /** 关闭面板 */
    TunnelClosePanel = 1,
    /** 重启巷道绘制 */
    TunnelDrawRestart = 2
}
declare enum PathCalcType {
    eCalcLeft = 0,//左侧
    eCalcMid = 1,//中线
    eCalcRight = 2,//右侧	
    eLeadPath = 3
}
export { McTunnelSection, McTunnelType, McTunnelWindType, McTunnelUse, McTunnelSupportPattern, McTunnelExcavationStatus, McTunnelExcavationType, McTraversePointType, TunnelNodeAnnotationDirect, TunnelNodeAnnotationAttachment, TunnelNodeElevationSymbol, TunnelNodeElevationType, TunnelNodeCoalType, McReturnAirType, McDbTunnelDrawStylePropertyType, McDbTunnelDrawStylePropertyEvent, McSeriesVentilation, PathCalcType, };
