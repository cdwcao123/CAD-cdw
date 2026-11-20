import { McGeMatrix4, McGeVector4, McMcdFiler, McMctfFiler } from 'McCore';
import { McGeoGeometryDataType } from '../types/type';
import { McGeoGeometry } from './mcGeoGeometry';
/**
 * 地质模型多线几何类
 * @description 用于存储地质模型的多线几何数据，包括多线的坐标信息
 */
export declare class McGeoMultiLineGeometry extends McGeoGeometry {
    /** 多线的坐标数据 */
    coord: McGeVector4[][];
    /**
     * 构造函数
     * @param coord 多线的坐标数据
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
     * 实体变换
     */
    transformBy(matrix: McGeMatrix4): boolean;
    /**
     * 从外部mctf导入
     * @description 从外部mctf导入多点几何数据，包括多点的坐标信息
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
     * @description 从外部mcd导入多点几何数据，包括多点的坐标信息
     * @param filer mcd文件流
     */
    mcdInFields(filer: McMcdFiler): void;
    /**
     * 当前实体的属性输出到外部
     * @description 当前实体的mcd文件流mcd文件流，包括多点的坐标信息
     * @param filer mcd文件流
     */
    mcdOutFields(filer: McMcdFiler): void;
}
