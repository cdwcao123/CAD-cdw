import { McGeMatrix4, McMcdFiler, McMctfFiler } from 'McCore';
import { McGeoGeometry } from '../geometry/mcGeoGeometry';
import { McGeoStyle } from '../style/mcGeoStyle';
import { McGeoFeature, McGeoGeometryData, McGeoModelField } from '../types/interface';
import { McGeoFieldMap } from '../types/type';
/**
 * 地质模型要素实现
 * @description 通用类，给外部使用的地质模型要素提供实现
 * @implements {McGeoFeature}
 * @class McGeoFeatureImp
 */
export declare class McGeoFeatureImp {
    /** 要素字段 */
    protected fields: McGeoFieldMap;
    /** 要素几何信息 */
    protected geometry: McGeoGeometry;
    /** 要素样式信息 */
    protected styles: McGeoStyle[];
    /** 要素ID */
    protected id: string;
    /** 要素名字 */
    protected name: string;
    /**
     * 获取要素ID
     * @returns 要素ID
     */
    getId(): string;
    /**
     * 获取要素名字
     * @returns 要素名字
     */
    getName(): string;
    /**
     * 构造函数
     * @param data 要素数据
     */
    constructor(data?: McGeoFeature);
    /**
     * 克隆当前要素对象
     * @returns 克隆的要素对象
     */
    clone(): McGeoFeatureImp;
    /**
     * 获取要素字段
     * @returns 要素字段数组
     */
    getFields(): McGeoModelField[];
    /**
     * 设置要素字段
     * @param fields 要素字段映射
     */
    setFields(fields: McGeoFieldMap): void;
    /**
     * 获取要素几何信息
     * @returns 要素几何信息
     */
    getGeometry(): McGeoGeometry;
    /**
     * 转换为标准几何数据格式
     * @param data 地质模型几何信息
     * @returns 标准几何数据格式
     */
    toGeometry(data: McGeoGeometryData): McGeoGeometry;
    /**
     * 获取要素样式数组
     * @returns 要素样式数组
     */
    getStyles(): McGeoStyle[];
    /**
     * 设置要素样式属性
     * @param styleIndex 样式索引
     * @param propertyName 属性名称
     * @param propertyValue 属性值
     * @returns void
     */
    setStyleProperty(styleIndex: number, propertyName: string, propertyValue: any): void;
    /**
     * 实体变换
     */
    transformBy(matrix: McGeMatrix4): boolean;
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
