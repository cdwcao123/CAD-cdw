import { McMctfFiler, McMcdFiler, McGeVector4, McGeMatrix4 } from 'McCore';
import { McGeoGeometryDataType } from '../types/type';
import { McGeoGeometry } from './mcGeoGeometry';
/**
 * 地质模型点几何
 * @description 用于存储地质模型的点几何数据，包括点的坐标信息
 */
export declare class McGeoPointGeometry extends McGeoGeometry {
    coord: McGeVector4 | undefined;
    /**
     * 构造函数
     * @param coord 点的坐标数据
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
     * @description 从外部mctf导入点几何数据，包括点的坐标信息
     * @param fields mctf文件流
     */
    mctfInFields(fields: McMctfFiler): void;
    /**
     * 当前实体的属性输出到外部
     * @description 当前实体的属性输出到外部mctf文件流
     * @param fields mctf文件流
     */
    mctfOutFields(fields: McMctfFiler): void;
    /**
     * 从外部mcd导入
     * @description 从外部mcd导入点几何数据，包括点的坐标信息
     * @param filer mcd文件流
     */
    mcdInFields(filer: McMcdFiler): void;
    /**
     * 当前实体的属性输出到外部
     * @description 当前实体的mcd文件流mcd文件流，包括点的坐标信息
     * @param filer mcd文件流
     */
    mcdOutFields(filer: McMcdFiler): void;
}
