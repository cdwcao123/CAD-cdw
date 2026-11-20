import { McDbDatabase, McGeVector3, McGeVector4 } from 'McCore';
import { McDbGeoBaseModel } from './mcDbGeoBaseModel';
/**
 * 地质模型文本类
 * @description 通用类，给外部使用的地质模型文本类提供实现
 */
export declare class McDbGeoText extends McDbGeoBaseModel {
    protected readonly _type: string;
    protected static readonly _className: string;
    /**
     * 重构文本元素子实体
     */
    rebuildChildEntity(db: McDbDatabase, recursive?: boolean): void;
    /**
     * 获取线长
     * @param {Array} points 坐标数组
     * @returns Number 线长
     */
    getLineLength(points: McGeVector4[]): number;
    /**
     * 获取线段中对应长度位置处的坐标以及方向
     * @param {Array} points 坐标数组
     * @param {Number} length 长度
     * @returns [Vector3,Vector3] [坐标，方向]
     */
    getPositionAndDir(points: McGeVector4[], length: number): McGeVector3[];
}
