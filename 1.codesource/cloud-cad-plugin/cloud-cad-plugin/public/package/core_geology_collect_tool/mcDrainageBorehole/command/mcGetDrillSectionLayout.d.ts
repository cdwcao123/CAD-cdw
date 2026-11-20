import { McDbEntity } from 'McCore';
/**
 * 获取指定分组钻孔列表的断面图数据
 * @param {[[string]]} drillGroups 钻孔分组数组，[[第一组编码数组],[第二组编码数组],["","",""]]
  * @param {bool} useInCoal  是否使用见煤深度进行计算，默认true
  * @param {bool} useCurve   煤层是否使用曲线进行平滑处理，默认true
 * @returns
 */
export declare function getDrillSectionLayout(drillGroups: string[][], useInCoal: boolean, useCurve: boolean): Promise<McDbEntity[]>;
