import { McGeVector3, IMcGeVector3, IMcGeVector4 } from 'McCore';
import { McDbTunnel } from '@/core_geology_collect_tool/mcTunnel';
import { McDbWorkFace } from '../entity/mcDbWorkFace';
import { IWorkFacePointRet, McWorkFaceData } from './interface';
/**
 * 转换工作面数据
 * @param data json数据
 * @returns 工作面数据结构
 */
export declare function convertWorkFaceData(data: any): McWorkFaceData;
/**
  * 根据巷道构建工作面边线，如下图逆时针方向 left->bot->right->top
  *      top
  *   _________
  *  |         | r
  *  | l       | i
  *  | e       | g
  *  | f       | h
  *  | t       | t
  *  |_________|
  *      bot
  *
  * @param Tunnel leftTunnel 左侧巷道
  * @param Tunnel botTunnel  切眼巷道
  * @param Tunnel rightTunnel 右侧巷道
  * @param Tunnel topTunnel 回采巷道
  * @param float space 工作面边线与巷道边线的间距
  * @param float thickness 工作面厚度
  * @returns [[{x,y,bot,top}],[{x,y,bot,top}],[{x,y,bot,top}],[{x,y,bot,top}]] 按左、底、右、顶顺序返回四个边线数组
  */
export declare function generateWorkfaceBorderLine(leftTunnel: McDbTunnel, botTunnel: McDbTunnel, rightTunnel: McDbTunnel, topTunnel: McDbTunnel, space: number, thickness: number): IMcGeVector4[][];
/**
 * 两巷道是否相连
 * @param tunnel1 第一条巷道
 * @param tunnel2 第二条巷道
 * @returns 是否相连
 */
export declare function isTunnelConnect(tunnel1: McDbTunnel, tunnel2: McDbTunnel): boolean;
/**
 * 获取边线上的最近投影点
 * @param coords 边线坐标数组
 * @param point 需要投影的点
 * @returns 边线上的最近投影点坐标、所在边线段索引、点到边线的距离
 */
export declare function getClosestPoint(coords: IMcGeVector3[], point: McGeVector3, calZ?: boolean): IWorkFacePointRet;
/**
 * 转换工作面数据列表
 * @param workFaces 工作面实体列表
 * @returns 工作面数据列表
 */
export declare function convertWorkFacesToData(workFaces: McDbWorkFace[]): any;
/**
 * 转换单条工作面数据
 * @param workFace 工作面实体
 * @returns 工作面数据
 */
export declare function convertWorkFaceToData(workFace: McDbWorkFace): any;
