declare enum GsHAlignType {
    LEFT = "LEFT",
    CENTER = "CENTER",
    RIGHT = "RIGHT"
}
declare enum GsVAlignType {
    TOP = "TOP",
    CENTER = "CENTER",
    BOTTOM = "BOTTOM"
}
declare enum GsLineGripStyle {
    gsRect = 0,
    gsSquare = 1,
    gsRing = 2,
    gsSArrow = 3,
    gsDArrow = 4,
    gsCross = 5,
    gsTri = 6,
    gsT = 7
}
declare enum GsPipelineSection {
    HalfCircle = 0,
    Arc = 1,
    ThreeCenterArch = 2,
    Rectangle = 3,
    Trapezoid = 4,
    Circle = 5
}
export { GsHAlignType, GsVAlignType, GsLineGripStyle, GsPipelineSection };
