import { McMcdFiler, McMctfFiler } from 'McCore';
import { GeoModelStyleType, McGeoViewType } from '../types/enum';
/**
 * 地质模型样式类
 * @description 通用类，给外部使用的地质模型样式类提供实现
 * @class McGeoStyle
 */
export declare class McGeoStyle {
    /** 视图类型 */
    viewType: McGeoViewType;
    /** 样式类型 */
    type: GeoModelStyleType;
    /** 线类型 */
    lineType?: string;
    /** 线宽 */
    lineWidth?: number;
    /** 线颜色 */
    lineColor?: string;
    /** 线透明度 */
    lineOpacity?: number;
    /** 是否显示边线 */
    showBorderLine: boolean;
    /** 虚线间隔 */
    strokeDasharray: number[];
    /**
     * 构造函数
     * @description 初始化样式类型为None，视图类型为2D
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
