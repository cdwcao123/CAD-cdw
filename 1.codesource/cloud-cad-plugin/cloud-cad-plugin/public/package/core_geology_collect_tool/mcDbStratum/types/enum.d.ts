export declare enum McDbStratumVertexType {
    /** 自定义 */
    Custom = "\u81EA\u5B9A\u4E49",
    /** 终点 */
    GeoDrill = "\u5730\u8D28\u94BB\u5B54",
    /** 探煤点 */
    ExploreCoalPoint = "\u63A2\u7164\u70B9",
    /** 等值线 */
    Isobar = "\u7B49\u503C\u7EBF",
    /** 其他 */
    Other = "\u5176\u4ED6"
}
/**
 * 地层等值线类型
 */
export declare enum McDbIsoType {
    /** 顶板 */
    Top = 0,
    /**底板 */
    Bottom = 1,
    /**厚度 */
    Thickness = 2
}
/**
 * 地层三角网网格线显示类型
 */
export declare enum McDbTinShowType {
    /** 顶板 */
    Top = 0,
    /**底板 */
    Bottom = 1
}
/**
 * 等值线生成方式
 */
export declare enum McDbIsoGenerateType {
    /** 等间距生成 */
    Interval = 0,
    /** 固定值生成 */
    FixedValue = 1
}
export declare enum McDbIsoLineType {
    /** 折线 */
    Polyline = 0,
    /** 曲线 */
    Spline = 1
}
