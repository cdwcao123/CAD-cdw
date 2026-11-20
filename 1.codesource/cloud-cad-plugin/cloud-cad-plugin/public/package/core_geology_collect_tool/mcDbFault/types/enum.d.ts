/**
 * 断层性质
 */
declare enum McFaultClassification {
    NORMAL = 11,//正断层
    REVERSE = 12,//逆断层
    STRIKESLIP = 2,//平移断层
    HINGE = 4,//枢纽断层
    VERTICAL = 13,//垂直断层
    OBLIQUE = 3
}
/**断层类型 */
declare enum McFaultMode {
    LARGESCALE = 1,
    MIN = 2
}
/**
 * 巷道绘制样式属性类型
 */
declare enum McDbFaultDrawStylePropertyType {
    FaultName = 0,//断层名称
    FaultColor = 1,//断层名称
    FaultType = 2,// 断层性质
    FaultTowards = 3,// 走向
    FaultTrend = 4,//倾向
    FaultAngle = 5,//倾角
    FaultStratums = 6,//断开地层
    FaultElv = 7,//标高
    FaultDropMin = 8,//断层落差最小值
    FaultDropMax = 9,//断层落差最大值
    FaultVerticalDirect = 10,//垂直滑动方向
    FaultHorDirect = 11,//平措方向
    FaultHorDis = 12
}
/**
 * 巷道绘制样式面板事件
 */
declare enum McDbFaultDrawStylePropertyEvent {
    /** 打开面板 */
    /**大断层 */
    LargeFaultPanel = 0,
    /**小断层 */
    MinFaultPanel = 1,
    /** 关闭面板 */
    FaultClosePanel = 2,
    /** 重启管线绘制 */
    FaultDrawRestart = 3,
    /**启用标高 */
    EnableElevation = 4,
    /**标高置灰 */
    DisEnableElevation = 5
}
export { McFaultClassification, McFaultMode, McDbFaultDrawStylePropertyEvent, McDbFaultDrawStylePropertyType, };
