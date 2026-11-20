import { McDbDatabase, MCEntityStretchPoints, MCEntitySnapPoints, McGeVector3 } from 'McCore';
import { McDbGeoBaseModel } from './mcDbGeoBaseModel';
/**
 * 地质模型面类
 * @description 通用类，给外部使用的地质模型面类提供实现
 */
export declare class McDbGeoPolygon extends McDbGeoBaseModel {
    protected readonly _type: string;
    protected static readonly _className: string;
    /**
     * 重构多边形元素子实体
     */
    rebuildChildEntity(db: McDbDatabase, recursive?: boolean): false | undefined;
    /**
     * 获取线点坐标数组
     * @returns 线点坐标数组
     */
    getPoints(): McGeVector3[];
    /**
     * 设置线点坐标
     * @param index 索引位置
     * @param point 点坐标
     */
    setPointAt(index: number, point: McGeVector3): void;
    /**
     * 添加点到线
     * @param index 索引位置
     * @param point 点坐标
     */
    addPointAt(index: number, point: McGeVector3): void;
    /**
     * 获取拉伸点坐标，用于拉伸编辑操作
     * @returns {MCEntityStretchPoints} 拉伸点坐标数组
     */
    getStretchPoints(): MCEntityStretchPoints[];
    /**
     * 设置拉伸点坐标拉伸时的处理逻辑
     * @param indexPoints {MCEntityStretchPoints[]} 拉伸点坐标数组
     */
    setStretchPoints(indexPoints: MCEntityStretchPoints[]): void;
    /**
     * 获取捕捉点坐标数据
     */
    getSnapPoints(is2D: boolean): MCEntitySnapPoints[];
    /**
     * 创建夹点
     */
    protected createGrips(): void;
}
