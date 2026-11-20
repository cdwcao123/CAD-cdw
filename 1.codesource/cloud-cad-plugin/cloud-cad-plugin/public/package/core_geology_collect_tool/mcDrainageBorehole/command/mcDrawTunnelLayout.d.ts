import { McCore } from 'McCore';
/**
 * 绘制巷道开孔示意图命令
 * @param {McCore} core 核心实例
 * @param {string} tunnelID 目标巷道编码
 * @param {bool} isHorizontal  是否为横向断面,横向是延巷道走向的水平面断面视图，纵向是沿巷道走向的侧向断面
 * @param {string[]} drillTypes 要出图的钻孔类型
 * @returns
 */
export declare function drawTunnelLayout(core: McCore, tunnelID?: string, isHorizontal?: boolean, drillTypes?: string[]): Promise<void>;
