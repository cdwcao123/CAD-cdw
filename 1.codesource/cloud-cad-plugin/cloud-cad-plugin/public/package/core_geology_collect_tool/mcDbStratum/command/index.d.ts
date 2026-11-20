import { McCore, McGeVector3, McGeVector4 } from 'McCore';
import type { IMcDbStratumVertex } from '../types/interface';
export declare function testStratum(core: McCore): Promise<void>;
export declare function drawStratum(core: McCore): Promise<void>;
/**
 * 根据等值线生成地层的命令
 * @param core
 * @param options 等值线采样参数，用于控制采样点疏密
 * @returns
 */
export declare function drawStratumByIso(core: McCore, options?: ITinSampleOptions): Promise<void>;
/**
 * 根据巷道生成地层
 * @param core 核心对象
 * @returns
 */
export declare function drawStratumByTunnel(core: McCore, boundary?: McGeVector4[], hores?: McGeVector4[][]): Promise<void>;
/**
 * 从等值线提取地层顶点的命令
 * @param core 当前核心实例
 * @param options 等值线提取选项
 * @param options.weedDistance 等值线提取选项，抽稀距离，相邻两点距离小于该值时视为冗余点，默认2
 * @param options.densifyDistance 等值线提取选项，增补距离，相邻两点距离大于该值时在中间插点，默认10
 * @param options.angleThreshold 等值线提取选项，偏转角阈值(度)，三点转角小于该值时视为平直段可抽稀，默认8
 * @param options.zTolerance 等值线提取选项，高程容差，抽稀后与原始点的高程偏差不超过该值，默认0.05
 * @returns
 */
export declare function pickStratumVertexsByIsoLine(core: McCore, options?: ITinSampleOptions): Promise<{
    vertexes: IMcDbStratumVertex[];
    constraints: McGeVector3[][];
} | undefined>;
/**
 * 从巷道提取三角网顶点
 * @param core 核心对象
 * @returns
 */
export declare function pickStratumVertexsByTunnel(core: McCore): Promise<IMcDbStratumVertex[] | undefined>;
/**
 * 从离散点实体（点、圆、块、钻孔）中提取地层顶点
 * 流程：选择点实体 -> 从点实体中提取地层顶点
 * @param core 核心对象

 * @returns 地层顶点列表
 */
export declare function pickStratumVertexsByDiscretePointEntity(core: McCore): Promise<IMcDbStratumVertex[] | undefined>;
/**
 * 等值线采样参数，用于控制采样点疏密
 */
export interface ITinSampleOptions {
    /** 抽稀距离，相邻两点距离小于该值时视为冗余点，默认2 */
    weedDistance?: number;
    /** 增补距离，相邻两点距离大于该值时在中间插点，默认10 */
    densifyDistance?: number;
    /** 偏转角阈值(度)，三点转角小于该值时视为平直段可抽稀，默认8 */
    angleThreshold?: number;
    /** 高程容差，抽稀后与原始点的高程偏差不超过该值，默认0.05 */
    zTolerance?: number;
}
