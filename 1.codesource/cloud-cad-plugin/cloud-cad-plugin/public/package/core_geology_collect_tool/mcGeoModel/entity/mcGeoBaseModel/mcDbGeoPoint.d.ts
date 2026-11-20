import { McDbDatabase, McDbEntity, MCEntitySnapPoints, MCEntityStretchPoints, McGeVector3, McGeVector4, Solid3DType } from 'McCore';
import { McGeoPointStyle } from '../../style/mcGeoPointStyle';
import { WellKnownName } from '../../types/enum';
import { McDbGeoBaseModel } from './mcDbGeoBaseModel';
/**
 * 地质模型点类
 * @description 通用类，给外部使用的地质模型点类提供实现
 */
export declare class McDbGeoPoint extends McDbGeoBaseModel {
    protected readonly _type: string;
    protected static readonly _className: string;
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
     * 重构点元素子实体
     */
    rebuildChildEntity(db: McDbDatabase, recursive?: boolean): void;
    /**
     * 创建点模型Mesh
     * @param {Array} point 坐标数据
     * @param {Json} style 样式
     * @returns 点Mesh
     */
    create(coord: McGeVector4, style: McGeoPointStyle): McDbEntity | undefined;
    /**
     * 创建图形
     * @param {String} name 图形名
     * @returns 图形的Geometry
     */
    createFigure(point: McGeVector4, style: McGeoPointStyle): McDbEntity | undefined;
    /**
     * 将已知名称转换为3D实体类型
     * @param wellKnownName 已知名称
     * @returns 3D实体类型或undefined
     */
    wellKnownNameToSolidType(wellKnownName: WellKnownName): Solid3DType | undefined;
    /**
     * 计算圆形坐标
     * @param {Number} radius 半径
     * @param {Number} count 点数
     * @returns Array 坐标数组
     */
    calculateCircleCoords(radius: number, count: number): McGeVector3[];
    /**
     * 计算五角星坐标
     * @param {Number} radius 五角星外接圆半径
     * @returns Array 坐标数组
     */
    calculateStarCoords(radius: number): McGeVector3[];
    /**
     * 计算十字
     * @param {Number} width 图形宽度
     * @returns Array 坐标数组
     */
    calculateCrossCoords(width: number): McGeVector3[][];
    /**
     * 计算X坐标
     * @param {Number} width 图形宽度
     * @returns Array 坐标数组
     */
    calculateXCoords(width: number): McGeVector3[][];
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
