import { McDbDatabase, McDbEntity, MCEntitySnapPoints, MCEntityStretchPoints, McGeVector3, McGeVector4 } from 'McCore';
import { McGeoLineStyle } from '../../style/mcGeoLineStyle';
import { McDbGeoBaseModel } from './mcDbGeoBaseModel';
/**
 * 地质模型线类
 * @description 通用类，给外部使用的地质模型线类提供实现
 */
export declare class McDbGeoLine extends McDbGeoBaseModel {
    protected readonly _type: string;
    protected static readonly _className: string;
    /**
     * 重构线元素子实体
     */
    rebuildChildEntity(db: McDbDatabase, recursive?: boolean): void;
    /**
     * 创建单条线
     * @param points 坐标数组
     * @param style 线样式
     * @returns
     */
    create(points: McGeVector4[], style: McGeoLineStyle): McDbEntity | undefined;
    /**
     * 创建单条线
     * @param points 坐标数组
     * @param style 线样式
     * @param isWall 是否为墙
     * @param isPipeLine 是否为管道
     * @returns 返回创建的线实体
     */
    createLine(points: McGeVector4[], style: McGeoLineStyle, isWall?: boolean, isPipeLine?: boolean): McDbEntity;
    /**
     * 添加点到线
     * @param index 索引位置,默认值为-1,表示添加到末尾
     * @param point 点坐标
     */
    addPointAt(index: number | undefined, point: McGeVector3): void;
    /**
     * 设置线点坐标
     * @param index 索引位置
     * @param point 点坐标
     */
    setPointAt(index: number, point: McGeVector3): void;
    /**
     * 删除线点坐标
     * @param index 索引位置
     */
    removePointAt(index: number): void;
    /**
     * 判断是否为线头点
     * @param index 索引位置
     * @returns 是否为线头点
     */
    isHeaderPoint(index: number): boolean;
    /**
     * 判断是否为线尾点
     * @param index 索引位置
     * @returns 是否为线尾点
     */
    isTailPoint(index: number): boolean;
    /**
     * 获取线点坐标
     * @param index 索引位置
     * @returns 点坐标
     */
    getPointAt(index: number): McGeVector3 | undefined;
    /**
     * 获取前一个点坐标
     * @param index 索引位置
     * @returns 前一个点坐标，如果为线头点，则返回undefined
     */
    getPrePointAt(index: number): McGeVector3 | undefined;
    /**
     * 获取后一个点坐标
     * @param index 索引位置
     * @returns 后一个点坐标，如果为线尾点，则返回undefined
     */
    getNextPointAt(index: number): McGeVector3 | undefined;
    /**
     * 获取线点坐标数组
     * @returns 线点坐标数组
     */
    getPoints(): McGeVector3[];
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
