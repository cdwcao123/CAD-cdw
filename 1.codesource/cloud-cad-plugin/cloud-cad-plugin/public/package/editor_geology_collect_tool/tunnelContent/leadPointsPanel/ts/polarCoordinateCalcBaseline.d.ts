import { type LegacyLeadPoint, type RelativeParam, type TunnelLike } from './polarCoordinateCalc';
/**
 * 将导线点数组转换为旧版巷道数据结构
 * @param points 导线点数组
 * @returns 兼容旧版 `traverse_point_array` 的巷道对象
 */
export declare const toLegacyTunnel: (points: LegacyLeadPoint[]) => TunnelLike;
/**
 * 相对坐标计算导线点坐标
 * @param tunnel 巷道
 * @param ptRefIndex 参考点索引
 * @param param 相对位置参数
 * @param bForward 要计算的点在巷道上的位置，是在参考点的前方还是后方，默认前方 true
 * @returns [Error, undefined] | [null, []] 失败时 Error 非空，成功时数组第二项依次为 x y z_top z_bottom
 */
export declare const legacyCalcLeadPointCoordByRelative: (tunnel: TunnelLike, ptRefIndex: number, param: RelativeParam, bForward: boolean) => [Error, undefined] | [null, Array<number>];
/**
 * 相对坐标连续推算导线点坐标
 * @param tunnel 巷道
 * @param ptRef 参考点坐标
 * @param param 相对位置参数
 * @param ptCurIndex 当前要计算的点在巷道中的索引位置，当 param 水平角是与巷道夹角时有效
 * @returns [Error, undefined] | [null, []] 失败时 Error 非空，成功时数组第二项依次为 x y z_top z_bottom
 */
export declare const legacyCalcLeadPointCoordByRelative2: (tunnel: TunnelLike, ptRef: LegacyLeadPoint, param: RelativeParam, ptCurIndex: number) => [Error, undefined] | [null, Array<number>];
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
export declare const legacyCalcRelativeParamBetweenTwoLeadPoint: (tunnel: TunnelLike, ptRefIndex: number, ptCurIndex: number, horizontalAngleType?: number, bLockCoord?: boolean, bSameDipAngleToLast?: boolean) => [Error, undefined] | [null, RelativeParam];
