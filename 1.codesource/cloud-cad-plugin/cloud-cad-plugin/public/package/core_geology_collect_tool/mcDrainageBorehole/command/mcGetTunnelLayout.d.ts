import { McDbEntity } from 'McCore';
/**
 * 获取指定巷道的开孔示意图
 * @param {string} tunnelID 巷道编码
 * @param {bool} isHorizontal 是否为横向断面,横向是延巷道走向的水平面断面视图，纵向是沿巷道走向的侧向断面
 * @param {string[]} drillTypes 要出图的钻孔类型
 * @returns
 */
export declare function getTunnelLayout(tunnelID: string, isHorizontal: boolean, drillTypes?: string[]): Promise<McDbEntity[]>;
