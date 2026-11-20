import type { DirectionalDesignResultSheet } from '../types/interface';
/**
 * 读取定向钻模板或参数导出的设计、成孔 Sheet，其他类别的工作表直接跳过。
 * @param bytes 用户选择的 .xlsx 文件字节。
 * @returns 按工作簿顺序排列的参数；孔号取 E1，旧模板未加类别后缀的 Sheet 仍按实际孔读取。
 * @throws 无定向钻工作表、格式不符、同类孔号重复或任一轨迹校验失败时抛错。
 */
export declare function readDirectionalReverseWorkbook(bytes: ArrayBuffer): Promise<DirectionalDesignResultSheet[]>;
/**
 * 创建沿用参数表布局的无附图模板，两个示例 Sheet 分别对应独立的反演孔。
 * @returns XLSX 文件字节，偏角率取当前全局值；孔口坐标为米、角度为度、分支孔深从主孔孔口累计。
 */
export declare function createDirectionalReverseTemplate(): Promise<Uint8Array>;
/**
 * 下载每个 Sheet 独立对应实际孔的定向钻示例模板，不附轨迹图。
 * @returns 触发浏览器下载后完成；工作簿生成失败时继续抛错。
 */
export declare function downloadDirectionalReverseTemplate(): Promise<void>;
