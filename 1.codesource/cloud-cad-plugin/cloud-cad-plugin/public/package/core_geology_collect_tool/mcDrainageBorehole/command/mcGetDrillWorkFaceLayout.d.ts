import { McDbEntity } from 'McCore';
/**
 * 获取指定工作面中的钻孔布置图
 * @param {string} workFaceID 工作面编码
 * @param {bool} useInCoal  是否使用见煤深度进行计算，默认true
 * @returns
 */
export declare function getDrillWorkFaceLayout(workFaceID: string, useInCoal: boolean): Promise<McDbEntity[]>;
