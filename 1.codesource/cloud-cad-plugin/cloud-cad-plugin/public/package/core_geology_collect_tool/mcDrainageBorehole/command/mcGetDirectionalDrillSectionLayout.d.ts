import { McDbEntity } from 'McCore';
/**
 * 获取指定定向钻孔的断面图数据
 * @param {string} drillID 钻孔ID
 * @returns
 */
export declare function getDirectionalDrillSectionLayout(drillID: string): Promise<McDbEntity[]>;
