import { Vector } from '../../../../../dist/core/lib/ThreeJS/Three';
import { McGeoStyle } from '../style/mcGeoStyle';
import { McGeoData, McGeoModelData } from './interface';
/**
 * 转换地质模型数据
 * @param data json数据
 * @returns 地质模型数据结构
 */
export declare function convertGeoModelData(data: any): {
    modelInfo: McGeoData;
    modelData: McGeoModelData[];
};
/**
 * 将坐标数组转换为向量对象
 * @param coord 坐标数组
 * @returns 向量对象
 */
export declare function convertVector(coord: number[]): Vector;
/**
 * 将坐标数组列表转换为向量对象列表
 * @param coords 坐标数组列表
 * @returns 向量对象列表
 */
export declare function convertVectorList(coords: number[][]): Vector[];
/**
 * 解析样式数据
 * @param data 样式数据
 * @returns 样式对象列表
 */
export declare function parseStyle(data: any): McGeoStyle[];
