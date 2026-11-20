import { McCore } from 'McCore';
import { McDbTunnel } from '../../entity/mcDbTunnel';
/**
 * 编辑巷道
 * @param core 内核实例
 * @returns
 */
export declare function breakTunnel(core: McCore): Promise<null | undefined>;
/**
 * 合并巷道
 * @param core 当前核心实例
 * @returns
 */
export declare function mergeTunnel(core: McCore): Promise<null | undefined>;
/**
 * 多段线转巷道
 * @param core 当前核心实例
 * @description 选择一条或多条多段线、直线或三维多段线，将其转换为巷道实体，导线点与多段线的顶点一致，样式默认为当前巷道样式设置中的样式1
 */
export declare function polylineToTunnel(core: McCore): Promise<null | undefined>;
/**
 * 插入巷道节点
 * @param core 当前核心实例
 * @param param 参数对象，包含巷道实体、插入位置索引
 * @description index <= 0 表示在第一个导线点前插入
 * @description index = 1 表示在第一个导线点和第二个导线点之间插入
 * @description 特殊情况：
 * @description index >= 导线点数量 表示在最后一个导线点后插入
 * @description index == undefined || isNaN(index) 表示最近位置插入
 */
export declare function insertTunnelNode(core: McCore, param: {
    tunnel: McDbTunnel;
    index: number;
}): Promise<null | undefined>;
/**
 * 延长巷道
 * @param core 当前核心实例
 * @param param 参数对象，包含巷道实体和延长方向（起点或终点）
 */
export declare function extendTunnel(core: McCore, param: {
    tunnel: McDbTunnel;
    start: boolean;
}): Promise<null | undefined>;
