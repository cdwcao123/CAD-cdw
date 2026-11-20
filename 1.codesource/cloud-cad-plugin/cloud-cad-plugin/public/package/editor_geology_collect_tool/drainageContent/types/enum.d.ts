/** 评价单元巷道暴露时间字典键，与服务端 blTime 一致。 */
export declare enum McExposureTime {
    Days25 = 0,
    Days50 = 1,
    Days100 = 2,
    Days160 = 3,
    Days200 = 4,
    Days250 = 5,
    Days300 = 6,
    Unexposed = 7
}
/** GetCloudCadData 的 Type 查询参数，服务端按字符串编号区分数据类别。 */
export declare enum DrainageCloudCadType {
    /** 1：钻场信息。 */
    DrillSite = "1",
    /** 2：穿层钻孔。 */
    ThroughHole = "2",
    /** 3：顺层钻孔。 */
    AlongHole = "3",
    /** 4：定向钻孔。 */
    DirectionalHole = "4",
    /** 5：高位钻孔；钻孔记录中的 DrillType 编号为 6。 */
    HighLevelHole = "5",
    /** 6：评价单元信息。 */
    EvaluationUnit = "6"
}
/** DrillingPurpose 的实测字典编号，不依赖当前矿井是否已有钻孔样本。 */
export declare enum DrainageCloudCadPurpose {
    /** 区域防突。 */
    AreaPrevention = 1,
    /** 局部防突。 */
    LocalPrevention = 2,
    /** 采空区瓦斯治理。 */
    GoafPrevention = 3
}
