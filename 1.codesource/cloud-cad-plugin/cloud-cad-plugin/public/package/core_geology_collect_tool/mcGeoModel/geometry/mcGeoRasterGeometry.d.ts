import { McGeMatrix4, McGeVector4, McMcdFiler, McMctfFiler } from 'McCore';
import { McGeoGeometryDataType } from '../types/type';
import { McGeoGeometry } from './mcGeoGeometry';
/**
 * 地质模型三角面几何类
 * @description 用于存储地质模型的三角面几何数据，包括三角面的坐标信息
 */
export declare class McGeoRasterGeometry extends McGeoGeometry {
    /**
     * 三角面几何的坐标
     * @description 一个McGeVector4对象数组的数组的数组，第一个数组为边界，第二个数组为内部顶点
     */
    coord: McGeVector4[][];
    /**
     * 构造函数
     * @param coord 三角面几何的坐标
     */
    constructor();
    constructor(coord: McGeoGeometryDataType);
    /**
     * 克隆几何对象
     * @returns 克隆后的几何对象
     */
    clone(): McGeoGeometry;
    /**
     * 设置几何点坐标
     * @param index 索引位置
     * @param point 点坐标
     */
    setPointAt(index: number, point: McGeVector4): void;
    /**
     * 设置几何点坐标
     * @param index 索引位置
     * @param point 点坐标
     */
    addPointAt(index: number, point: McGeVector4): void;
    /**
     * 实体变换
     */
    transformBy(matrix: McGeMatrix4): boolean;
    /**
     * 从外部mctf导入
     * @description 从外部mctf导入三角面几何数据，包括三角面的坐标信息
     * @param fields mctf文件流
     */
    mctfInFields(fields: McMctfFiler): void;
    /**
     * 当前实体的属性输出到外部
     * @description 当前实体的mctf文件流mctf文件流，包括多点的坐标信息
     * @param fields mctf文件流
     */
    mctfOutFields(fields: McMctfFiler): void;
    /**
     * 从外部mcd导入
     * @description 从外部mcd导入三角面几何数据，包括三角面的坐标信息
     * @param filer mcd文件流
     */
    mcdInFields(filer: McMcdFiler): void;
    /**
     * 当前实体的属性输出到外部
     * @description 当前实体的mcd文件流mcd文件流，包括面的坐标信息
     * @param filer mcd文件流
     */
    mcdOutFields(filer: McMcdFiler): void;
}
