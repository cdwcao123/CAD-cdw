import { McGePoint2, McGePoint } from 'McCore';
import { McDbTunnel } from '..';
export interface TunnelMeshData {
    /** 构建的各分段的几何数据 */
    vertices: McGePoint[];
    /** 内部纹理坐标 */
    textureCoord: McGePoint2[];
    /** 巷道的索引数据 */
    indices: number[];
}
/**
 * 构建巷道几何数据
 * @param tunnel 巷道实体
 * @param [cornerFlag=1.1] 倒角半径系数，基于巷道宽度和该系数确定倒角半径大小
 * @param [needUv=false] 是否计算uv坐标数据
 * @returns {TunnelMeshData}
 */
export declare function generatorTunnelData(tunnel: McDbTunnel, cornerFlag?: number, needUv?: boolean): TunnelMeshData;
