import { McMcdFiler, McMctfFiler } from 'McCore';
import { McGeoStyle } from './mcGeoStyle';
/**
 * 地质模型点样式类
 * @description 通用类，给外部使用的地质模型点样式类提供实现
 * @implements {McGeoStyle}
 * @class McGeoPointStyle
 */
export declare class McGeoPointStyle extends McGeoStyle {
    /** 贴图 */
    texture: string;
    /** 图形名称 */
    wellKnownName: string;
    /** 填充颜色 */
    fillColor: string;
    /** 填充透明度 */
    fillOpacity: number;
    /** 填充贴图 */
    fillTexture: string;
    /** 图形大小 */
    size: number;
    /** 方位角 偏北角 */
    azimuth: number;
    /** 倾角 */
    dip: number;
    /** 柱状体或小断层高度 */
    height: number;
    /** 柱状体或小断层宽度 */
    width: number;
    /** 走向 偏北角 */
    toward: number;
    /** 倾向 */
    trend: number;
    /**
     * 构造函数
     * @description 初始化样式类型为Point，视图类型为2D
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
