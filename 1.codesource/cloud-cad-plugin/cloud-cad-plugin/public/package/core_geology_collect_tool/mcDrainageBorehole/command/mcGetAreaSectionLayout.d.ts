import { McCore, McDbEntity } from 'McCore';
/**
 * 获取评价单元的钻孔断面图接口
 * @param {McCore} core 核心实例
* @param {[string]} designDrillIDs 设计钻孔的id数组
* @param {[string]} invertDrillIDs 反演钻孔的id数组
* @param {string}   areaName       评价单元名称
* @param {bool} designUseInCoal    设计钻孔是否使用见煤深度进行计算，默认true
* @param {bool} invertUseInCoal    反演钻孔是否使用见煤深度进行计算，默认false
* @param {bool} useCurve           煤层是否使用曲线进行平滑处理，默认true
 * @returns
 */
export declare function getAreaSectionLayout(core: McCore, designDrillIDs: string[], invertDrillIDs: string[], areaName: string, designUseInCoal: boolean, invertUseInCoal: boolean, useCurve?: boolean): Promise<McDbEntity[]>;
