import { McDbDatabase, McDbEntity, MCEntitySnapPoints, MCEntityStretchPoints, McGeVector3, McGeVector4 } from 'McCore';
import { McGeoRasterStyle } from '../../style/mcGeoRasterStyle';
import { McDbGeoBaseModel } from './mcDbGeoBaseModel';
export declare class McDbGeoRaster extends McDbGeoBaseModel {
    protected readonly _type: string;
    protected static readonly _className: string;
    /**
       * 重构栅格元素子实体
       */
    rebuildChildEntity(db: McDbDatabase, recursive?: boolean): void;
    /**
     * 创建栅格
     * @param {Array} points 坐标数组
     * @param {Json} style 样式
     * @returns 栅格Mesh
     */
    create(style: McGeoRasterStyle): McDbEntity[];
    /**
     * 获取线点坐标数组
     * @returns 线点坐标数组
     */
    getPoints(): {
        points: McGeVector4[][];
        thickness: number;
        isSupportVector4: boolean;
    };
    /**
     * 设置线点坐标
     * @param index 索引位置
     * @param point 点坐标
     */
    setPointAt(index: number, point: McGeVector4): void;
    /**
     * 设置线点坐标
     * @param index 索引位置
     * @param point 点坐标
     */
    addPointAt(index: number, point: McGeVector4): void;
    /**
     * 删除线点坐标
     * @param index 索引位置
     */
    removePointAt(index: number): void;
    convertPoint(index: number, point: McGeVector3, isTop?: boolean): McGeVector4;
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
