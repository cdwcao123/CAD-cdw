export type TunnelLeadPoint = {
    bottomCoalThick: number;
    topCoalThick: number;
    coalSeamStruct: string;
    leftSide: number;
    rightSide: number;
    traversePointType: string;
    pointName: string;
    x: number;
    y: number;
    z_top: number;
    z_bottom: number;
    pointOrder?: number;
    radius?: number;
    use_second_side?: boolean | number;
    useSecondSide?: boolean | number;
    secondLeftSide?: number;
    secondRightSide?: number;
    bottom_coal_thick?: number;
    top_coal_thick?: number;
    coal_seam_struct?: string;
    left_side?: number;
    right_side?: number;
    traverse_point_type?: string;
    point_name?: string;
    point_order?: number;
    second_left_side?: number;
    second_right_side?: number;
};
export type LegacyLeadPoint = TunnelLeadPoint;
export type TunnelLike = {
    nodes?: unknown[];
    traverse_point_array?: unknown[];
};
/**
 * 获取巷道中的导线点列表
 * @param tunnel 巷道
 * @returns 兼容旧字段与新字段的导线点数组
 */
export declare const getTunnelLeadPoints: (tunnel: TunnelLike | null | undefined) => LegacyLeadPoint[];
/**
 * 将旧版导线点结构转换为新版节点数据
 * @param leadPoint 导线点
 * @param index 节点索引
 * @returns 新版 `McTunnelNodeData` 兼容结构
 */
export declare const toTunnelNodeData: (leadPoint: LegacyLeadPoint, index: number) => {
    pointName: string;
    leftSide: number;
    rightSide: number;
    pointOrder: number;
    coalSeamStruct: string;
    bottomCoalThick: number;
    traversePointType: any;
    useSecondSide: boolean;
    secondLeftSide: number;
    secondRightSide: number;
    radius: number;
    x: number;
    y: number;
    z_top: number;
    z_bottom: number;
};
export declare class RelativeParam {
    dDis: number;
    bLockCoord: boolean;
    horizontalAngleType: number;
    horizontalAngle: number;
    horizontalAngleDirect: number;
    bSameDipAngleToLast: boolean;
    dipAngleType: number;
    dipAngle: number;
    constructor(data?: Partial<RelativeParam>);
}
/**
 * 相对坐标计算导线点坐标
 * @param tunnel 巷道
 * @param ptRefIndex 参考点索引
 * @param param 相对位置参数
 * @param bForward 要计算的点在巷道上的位置，是在参考点的前方还是后方，默认前方 true
 * @returns [Error, undefined] | [null, []] 失败时 Error 非空，成功时数组第二项依次为 x y z_top z_bottom
 */
export declare const calcLeadPointCoordByRelative: (tunnel: TunnelLike, ptRefIndex: number, param: RelativeParam, bForward: boolean) => [Error, undefined] | [null, Array<number>];
/**
 * 相对坐标连续推算导线点坐标
 * @param tunnel 巷道
 * @param ptRef 参考点坐标
 * @param param 相对位置参数
 * @param ptCurIndex 当前要计算的点在巷道中的索引位置，当 param 水平角是与巷道夹角时有效
 * @returns [Error, undefined] | [null, []] 失败时 Error 非空，成功时数组第二项依次为 x y z_top z_bottom
 */
export declare const calcLeadPointCoordByRelative2: (tunnel: TunnelLike, ptRef: LegacyLeadPoint, param: RelativeParam, ptCurIndex: number) => [Error, undefined] | [null, Array<number>];
/**
 * 计算一条巷道中两个导线点之前的空间位置关系参数
 * @param tunnel 巷道
 * @param ptRefIndex 参考点索引
 * @param ptCurIndex 当前点索引
 * @param horizontalAngleType 水平角类型 1-方位角 2-与巷道夹角，默认为 1
 * @param bLockCoord 是否锁定坐标，默认否
 * @param bSameDipAngleToLast 是否倾角与上一段保持一致，默认否
 * @returns [Error, undefined] | [null, RelativeParam] 失败时 Error 非空，成功时返回相对位置参数
 */
export declare const calcRelativeParamBetweenTwoLeadPoint: (tunnel: TunnelLike, ptRefIndex: number, ptCurIndex: number, horizontalAngleType?: number, bLockCoord?: boolean, bSameDipAngleToLast?: boolean) => [Error, undefined] | [null, RelativeParam];
