/**
 * 管线断面类型
 */
declare enum McPipeSection {
    Unknow = 0,//位置
    CUSTOM = 1,//自定义
    Circle = 2,//圆
    Rectangle = 3,//矩形
    Square = 4
}
/**管线类型 */
declare enum McPipeType {
    Dedicated = 0,
    Drainage = 1,
    Compressed = 2,
    WaterDelivery = 3
}
/**位于左邦还是右邦 */
declare enum McPipeSide {
    LeftSide = 1,
    RightSide = 2,
    None = 0
}
/**位于左邦还是右邦 */
declare enum McPipeFlow {
    None = 0,
    StartToEnd = 1,
    EndToStart = 2
}
/**元件类型 */
declare enum McComponentType {
    Dedicated = 0,//综采专供
    Drainage = 1,//排水
    Compressed = 2,//压风
    WaterDelivery = 3
}
/**
 * 巷道绘制样式属性类型
 */
declare enum McDbPipelineDrawStylePropertyType {
    PipelineSection = 0,// 断面类型
    PipelineHeight = 1,// 管线高度
    PipelineWidth = 2,// 管线宽度
    PipelineRadius = 3,//管径
    PipelineColor = 4,// 颜色
    PipelineJD = 5,//距底
    PipelineJB = 6,//距壁
    PipelineTG = 7,//抬高
    PipelineName = 8,//管线名称
    PipelineLayer = 9,// 管线图层
    PipelineType = 10,// 管线类型
    PipelineFlow = 11,// 流向
    PipelineElevation = 12
}
/**
 * 巷道绘制样式面板事件
 */
declare enum McDbPipelineDrawStylePropertyEvent {
    /** 打开面板 */
    PipeineOpenPanel = 0,
    /** 关闭面板 */
    PipeineClosePanel = 1,
    /** 重启管线绘制 */
    PipeineDrawRestart = 2,
    /**启用标高*/
    PipeEnableElevation = 3,
    /**禁用标高*/
    PipeDisableElevation = 4
}
export { McPipeSection, McPipeType, McPipeSide, McPipeFlow, McComponentType, McDbPipelineDrawStylePropertyEvent, McDbPipelineDrawStylePropertyType, };
