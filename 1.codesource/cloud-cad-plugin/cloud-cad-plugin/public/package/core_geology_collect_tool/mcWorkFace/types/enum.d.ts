/**
 * 工作面状态
 */
declare enum McDbWorkFaceStatus {
    /** 准备开采 */
    Preparing = 1,
    /** 正在开采 */
    Mining = 2,
    /** 开采完成 */
    Over = 3
}
/**
 * 工作面通风类型
 */
declare enum McWorkFaceVentilationType {
    UType = "U\u578B",
    ZType = "Z\u578B",
    YType = "Y\u578B",
    HType = "H\u578B",
    WType = "W\u578B"
}
export { McDbWorkFaceStatus, McWorkFaceVentilationType };
