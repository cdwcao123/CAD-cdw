/**
 * 生成实际钻孔在图纸中的业务编号。
 * @param drillID 设计与服务端共同使用的原始钻孔编号。
 * @returns 带 _fy 后缀的本地钻孔编号；已有该后缀时保持不变。
 */
export declare function createActualBoreholeID(drillID: string): string;
/**
 * 获取设计孔与反演孔共同使用的原始钻孔编号。
 * @param drillID 本地钻孔编号。
 * @returns 仅去除一个末尾 _fy 后缀的编号；其他编号原样返回。
 */
export declare function getOriginalBoreholeID(drillID: string): string;
