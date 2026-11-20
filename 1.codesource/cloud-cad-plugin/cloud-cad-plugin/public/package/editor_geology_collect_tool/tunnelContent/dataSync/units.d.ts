/**
 *  获取图纸中所有的巷道数据
 * @returns 所有的巷道数据
 */
export declare const getAllTunnels: () => Promise<any[] | undefined>;
/**
 *  获取图纸中所有的工作面数据
 * @returns 所有的工作面数据
 */
export declare const getAllWorkFaces: () => Promise<any[] | undefined>;
export declare const saveTunnelsMap: (onlyUpdate?: boolean) => Promise<any>;
export declare const saveCurrentVersion: () => Promise<any>;
/**
 *  更新当前场景的缩略图到api接口
 * @returns 是否更新成功
 */
export declare const updateThumbnail: (showMsg?: boolean) => Promise<any>;
