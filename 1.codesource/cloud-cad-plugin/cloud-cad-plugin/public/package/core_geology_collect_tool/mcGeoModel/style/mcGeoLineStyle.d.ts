import { McMcdFiler, McMctfFiler } from 'McCore';
import { McGeoStyle } from './mcGeoStyle';
/**
 * 地质模型线样式类
 * @description 通用类，给外部使用的地质模型线样式类提供实现
 * @implements {McGeoStyle}
 * @class McGeoLineStyle
 */
export declare class McGeoLineStyle extends McGeoStyle {
    /** 墙高度 */
    wallHeight: number;
    /** 管道直径 */
    pipeDiameter: number;
    /** 贴图 */
    texture: string;
    /** 图形名称 */
    wellKnownName: string;
    /** 贴图高度 */
    textureHeight: number;
    /** 贴图宽度 */
    textureWidth: number;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 解析样式数据
     * @param data 样式数据
     */
    parse(data: any): void;
    /**
     * 设置样式属性
     * @param propertyName 属性名称
     * @param propertyValue 属性值
     */
    setProperty(propertyName: string, propertyValue: any): void;
    /**
     * 从外部mctf导入
     */
    mctfInFields(fields: McMctfFiler): void;
    /**
     * 当前实体的属性输出到外部
     */
    mctfOutFields(fields: McMctfFiler): void;
    /**
     * 从外部mcd导入到当前样式
     * @param filer 数据读取对象
     */
    mcdInFields(filer: McMcdFiler): void;
    /**
     * 当前实体的属性输出到外部
     */
    mcdOutFields(filer: McMcdFiler): void;
}
