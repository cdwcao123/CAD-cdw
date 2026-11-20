import { McGeVector2, McGeVector3, McMcdFiler, McMctfFiler } from 'McCore';
import { McGeoStyle } from './mcGeoStyle';
/**
 * 地质模型文本样式类
 * @description 通用类，给外部使用的地质模型文本样式类提供实现
 * @implements {McGeoStyle}
 * @class McGeoTextStyle
 */
export declare class McGeoTextStyle extends McGeoStyle {
    /** 文本内容 */
    labelText: string;
    /** 字体 */
    fontFamily: string;
    /** 字体样式 */
    fontStyle: string;
    /** 字体粗细 */
    fontWeight: number;
    /** 字体大小 */
    fontSize: number;
    /** 填充颜色 */
    fillColor: string;
    /** 锚点位置 */
    anchorPoint: McGeVector2;
    /** 偏移位置 */
    displacement: McGeVector3;
    /** 旋转角度 */
    rotation: number;
    /** 垂直偏移 */
    perpendicularOffset: number;
    /** 沿线显示 */
    followLine: boolean;
    /** 重复间隔 */
    repeat: number;
    /**
     * 构造函数
     * @description 初始化样式类型为Text，视图类型为2D
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
