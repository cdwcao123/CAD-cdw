import { McDbDatabase, McDbVertex, McGeVector3 } from 'McCore';
import { McDbTunnel } from '../entity/mcDbTunnel';
import { McTunnelSection } from './enum';
import { McTunnelData, McTunnelNodeData } from './interface';
/**
  * 生成巷道边线数据算法
  * @memberof MathUtil.prototype
  * @returns []
  */
export declare function generateTunnelBorderLine(nodes: McTunnelNodeData[], sectionType: McTunnelSection): McGeVector3[][];
/**
   * 判断是否为竖井巷道
   */
export declare function identifyShaft(nodes: McTunnelNodeData[]): boolean;
/**
 * 转换巷道数据
 * @param data json数据
 * @returns 巷道数据结构
 */
export declare function convertTunnelData(data: any): McTunnelData;
/**
 * 转换巷道数据列表
 * @param tunnels 巷道实体列表
 * @returns 巷道数据列表
 */
export declare function convertTunnelsToData(tunnels: McDbTunnel[]): any;
/**
 * 转换单条巷道数据
 * @param tunnel 巷道实体
 * @returns 巷道数据
 */
export declare function convertTunnelToData(tunnel: McDbTunnel): any;
/**
 * 更新巷道边线
 * @param tunnel 指定巷道，若不传则更新当前数据库中所有巷道边线
 * @returns
 */
export declare function updateTunnelBorderLine(tunnel?: McDbTunnel): Promise<void>;
/**
 * 创建巷道导线点数据
 * @param coord 坐标
 * @param index 序号
 * @returns 巷道导线点数据
 */
export declare function createNode(coord: McGeVector3, index: number, leftSide?: number, rightSide?: number): McTunnelNodeData;
/**
 * 创建巷道导线点数据
 * @param coord 坐标
 * @param index 序号
 * @returns 巷道导线点数据
 */
export declare function createNodeFromLine(coord: McGeVector3, index: number, radius?: number): McTunnelNodeData;
/**
 * 创建巷道节点数据列表
 * @param coords 巷道顶点列表
 * @returns 巷道节点数据列表
 */
export declare function createNodes(coords: McDbVertex[], isClosed?: boolean): McTunnelNodeData[];
/**
 * 创建巷道数据
 * @param coords 导线点坐标列表
 * @param tunnelId 巷道ID
 * @returns 巷道数据
 */
export declare function createTunnelData(coords: McGeVector3[], tunnelId?: string): McTunnelData;
/**
 * 创建巷道实体
 * @param nodes 巷道导线点数据列表
 * @param tunnelId 巷道ID
 * @param db 数据库实例
 * @returns 巷道实体
 */
export declare function createTunnel(nodes: McTunnelNodeData[], tunnelId: string, db: McDbDatabase): McDbTunnel;
