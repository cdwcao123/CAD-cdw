/**
 * 抽采钻孔类型,顺层左帮孔、顺层右帮孔、穿层底板孔、穿层顶板孔
 */
declare enum McBoreholeType {
    AlongLeft = "\u987A\u5C42\u5DE6\u5E2E\u5B54",
    AlongRight = "\u987A\u5C42\u53F3\u5E2E\u5B54",
    ThroughBottom = "\u7A7F\u5C42\u5E95\u677F\u5B54",
    ThroughTop = "\u7A7F\u5C42\u9876\u677F\u5B54",
    HighLevel = "\u9AD8\u4F4D\u94BB\u5B54",
    Directional = "\u5B9A\u5411\u94BB\u5B54"
}
/**
 * 抽采钻孔用途,区域防突、局部防突、采空区瓦斯治理
 */
declare enum McBoreholePurpose {
    AreaPrevention = "\u533A\u57DF\u9632\u7A81",
    LocalPrevention = "\u5C40\u90E8\u9632\u7A81",
    GoafPrevention = "\u91C7\u7A7A\u533A\u74E6\u65AF\u6CBB\u7406"
}
/**
 * 顺层孔的布孔方式
 */
declare enum McAlongLayoutType {
    Single = "\u5355\u6392",
    Double = "\u53CC\u6392",
    Three = "\u4E09\u82B1\u773C"
}
/**
 * 瓦斯涌出来源
 */
declare enum McGasSource {
    NonOutburstCoal = "\u975E\u7A81\u51FA\u7164\u5C42",
    OutburstCoalStrip = "\u7A81\u51FA\u7164\u5C42\u6761\u5E26\u533A\u57DF",
    OutburstCoalMining = "\u7A81\u51FA\u7164\u5C42\u56DE\u91C7\u533A\u57DF",
    NearLayerOrRock = "\u90BB\u8FD1\u5C42\u6216\u56F4\u5CA9",
    OutburstCoalExpose = "\u7A81\u51FA\u7164\u5C42\u63ED\u7164\u533A\u57DF"
}
/**
 * 工作面类型
 */
declare enum McWorkFaceType {
    Mining = "\u56DE\u91C7\u533A\u57DF",
    Tunnel = "\u7164\u5DF7\u6761\u5E26\u533A\u57DF"
}
/**
 * 煤层种类
 */
declare enum McCoalType {
    Anthracite = "\u65E0\u70DF\u7164",
    LeanAndCoking = "\u7626\u7164\u53CA\u7126\u7164",
    FatAndGas = "\u80A5\u7164\u3001\u6C14\u7164\u53CA\u957F\u70DF\u7164"
}
export { McBoreholeType, McAlongLayoutType, McBoreholePurpose, McGasSource, McWorkFaceType, McCoalType };
