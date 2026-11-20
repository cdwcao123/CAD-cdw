import { McGeMatrix4, McGeVector4, McMcdFiler, McMctfFiler } from 'McCore';
import { McGeoGeometryType } from '../types/enum';
import { McGeoGeometryDataType } from '../types/type';
/**
 * 地质模型几何基类
 * @description 用于存储地质模型的几何数据，包括点、线、面等
 */
export declare abstract class McGeoGeometry {
    /** 几何类型，包括点、线、面等 */
    type: McGeoGeometryType;
    /** 几何坐标数据 */
    coord: McGeoGeometryDataType;
    /**
     * 构造函数
     * @param type 几何类型，包括点、线、面等
     * @param coord 几何坐标数据
     */
    constructor();
    constructor(type: McGeoGeometryType);
    constructor(type: McGeoGeometryType, coord: McGeoGeometryDataType);
    /**
     * 克隆几何对象
     */
    abstract clone(): McGeoGeometry;
    /**
     * 设置几何点坐标
     * @param index 索引位置
     * @param point 点坐标
     */
    abstract setPointAt(index: number, point: McGeVector4): void;
    /**
     * 实体变换
     */
    abstract transformBy(matrix: McGeMatrix4): boolean;
    /**
     * 从外部mctf导入
     */
    abstract mctfInFields(fields: McMctfFiler): void;
    /**
     * 当前实体的属性输出到外部
     */
    abstract mctfOutFields(fields: McMctfFiler): void;
    /**
     * 从外部mcd导入
     */
    abstract mcdInFields(filer: McMcdFiler): void;
    /**
     * 当前实体的属性输出到外部
     */
    abstract mcdOutFields(filer: McMcdFiler): void;
}
