declare enum McGeIntersectType {
    kOnBoth = 0,
    kExtThis = 1,
    kExtOther = 2,
    kExtBoth = 3
}
declare enum KnotParameterization {
    kChord = 0,
    kSqrtChord = 1,
    kUniform = 2,
    kCustomParameterization = 15,
    kNotDefinedKnotParam = 16
}
declare enum McGeIntersectionResType {
    kNull = 0,
    k1Pt = 1,
    k2Pt = 2,
    kLine = 10,
    kCircle = 11,
    kPLane = 12
}
export { McGeIntersectionResType, McGeIntersectType, KnotParameterization, };
