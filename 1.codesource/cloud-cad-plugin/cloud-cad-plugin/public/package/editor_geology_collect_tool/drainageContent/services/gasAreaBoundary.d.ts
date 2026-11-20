import type { DrillSiteCoordRow } from '../types/interface';
/**
 * 校验构面边界，保留输入点的顺序、Z 和精度；允许首尾显式闭合及零坐标。
 * @param value 从 Excel JSON 解析的未知值。
 * @returns 原坐标数组，不补坐标、不排序、不重算图形面积。
 * @throws 缺少 XYZ、坐标非有限、退化或自交而不能构面时抛错。
 */
export declare function validateGasAreaBoundary(value: unknown): DrillSiteCoordRow[];
