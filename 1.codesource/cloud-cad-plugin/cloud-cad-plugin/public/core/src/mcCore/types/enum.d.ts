declare enum McViewType {
    e2D = 0,
    e3D = 1,
    e2D3D = 2
}
declare enum McViewLayout {
    horizontal = "horizontal",
    vertical = "vertical"
}
declare enum McUniqueLineType {
    kByLayer = "ByLayer",
    kByBlock = "ByBlock",
    kContinuous = "Continuous"
}
declare enum McUniqueTransparency {
    kByLayer = -1,
    kByBlock = -2
}
declare enum McTouchState {
    None = 0,
    Rotate = 1,
    Pan = 2,
    Zoom = 3
}
declare enum CmdRecordOperateType {
    create = "create",
    update = "update",
    delete = "delete",
    order = "order"
}
declare enum CmdExeStatus {
    running = 0,
    success = 1,
    interrupt = -1
}
declare enum McFontSubfamily {
    None = "\u65E0",
    Regular = "\u5E38\u89C4",
    Normal = "\u5E38\u89C4",
    Bold = "\u7C97\u4F53",
    Italic = "\u659C\u4F53"
}
declare enum eDbRecordObjectType {
    entity = "McDbEntity",
    layer = "McDbLayer",
    lineType = "McDbLineType",
    group = "McDbGroup",
    dimStyle = "McDbDimStyle",
    blockDef = "McDbBlockDef",
    textStyle = "McDbTextStyle",
    hatchDef = "McDbHatchDef"
}
type DbRecordObjectType = eDbRecordObjectType | string;
declare enum McTextSymbols {
    mtsDegree = 0,
    mtsPlusMinusTolerance = 1,
    mtsDiameter = 2,
    mtsScarcelyLess = 3,
    mtsAngle = 4,
    mtsBoundaryLine = 5,
    mtsCenterLine = 6,
    mtsIncrement = 7,
    mtsElectricalPhase = 8,
    mtsStreamLine = 9,
    mtsSign = 10,
    mtsInitialLength = 11,
    mtsMereStoneLine = 12,
    mtsNotEqual = 13,
    mtsOhm = 14,
    mtsOmega = 15,
    mtsPropertyLine = 16,
    mtsSubscript = 17,
    mtsSquare = 18,
    mtsCube = 19,
    mtsNBSP = 20
}
declare enum McPrintMode {
    extent = 0,
    boundary = 1,
    view = 2
}
export { McViewType, McViewLayout, McUniqueLineType, McUniqueTransparency, McTouchState, CmdRecordOperateType, McFontSubfamily, McTextSymbols, McPrintMode, CmdExeStatus, eDbRecordObjectType };
export type { DbRecordObjectType };
