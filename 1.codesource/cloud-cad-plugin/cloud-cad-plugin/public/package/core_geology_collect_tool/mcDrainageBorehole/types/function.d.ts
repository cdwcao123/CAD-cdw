import { McGeVector3, McGeVector2 } from 'McCore';
import { McDbDrainageBorehole } from '../entity/mcDbDrainageBorehole';
import { McDirectionalDesignParameter } from './interface';
/**
 * 计算定向设计结果
 * @param parameter 设计参数
 * @returns 设计结果
 */
export declare function calculateDirectionalDesignResult(parameter: McDirectionalDesignParameter): Promise<McDbDrainageBorehole[]>;
/**
   * 根据钻杆长度和相邻钻杆偏离角计算转弯半径
   *
   * @param rodLength 钻杆长度，单位：米
   * @param deviationAngleDeg 相邻钻杆之间的夹角，单位：度
   * @returns 转弯半径，单位：米
   */
export declare function calculateTurningRadius(rodLength: number, deviationAngleDeg: number): number;
/**
 * 计算下一个点，根据当前点、钻孔X轴方向、前进方向和钻杆长度
 * @param line 中心线
 * @param currentPoint 当前点
 * @param drillSiteX 钻场X轴方向
 * @param frontDir 前进方向，即钻杆真实方向在钻场X轴方向的单位向量
 * @param rodLength 钻杆长度
 * @returns 下一个点
 */
export declare function calculateNextPointByRadius(line: McGeVector3[], currentPoint: McGeVector3, drillSiteX: McGeVector3, frontDir: McGeVector2, rodLength: number): McGeVector3 | undefined;
