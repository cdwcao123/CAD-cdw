declare enum McPrCurType {
    eCross = 0,
    eNormal = 1,
    eRect = 2,
    eText = 3,
    eNone = 4
}
declare enum McPrErrorStatus {
    eCancel = 0,
    eOK = 1,
    eKeyword = 2,
    eInput = 3,
    eDbClick = 4,
    eMenu = 5,
    eClick = 6,
    eError = -1
}
declare enum CmdLineInputType {
    eKeyword = 0,
    eInput = 1,
    eCancel = 2
}
declare enum McSelectEntityMode {
    eRect = 0,
    eWrap = 1,
    eCross = 2
}
declare enum McPickEntityMode {
    eSingle = 0,
    eMultiple = 1
}
declare enum McPrEntityUseType {
    eNone = 0,
    eDelete = 1,
    eAdd = 2
}
export { McPrCurType, CmdLineInputType, McPrErrorStatus, McSelectEntityMode, McPickEntityMode, McPrEntityUseType, };
