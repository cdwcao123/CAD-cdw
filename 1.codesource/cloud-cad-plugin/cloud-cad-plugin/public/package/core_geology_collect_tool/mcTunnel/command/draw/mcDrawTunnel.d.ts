import { McCore } from 'McCore';
import { McDbTunnel } from '../../entity/mcDbTunnel';
/**
 * 绘制巷道
 * @param core 内核实例
 * @returns
 */
export declare function drawTunnel(core: McCore, targetTunnel?: McDbTunnel, addToTail?: boolean): Promise<null | undefined>;
