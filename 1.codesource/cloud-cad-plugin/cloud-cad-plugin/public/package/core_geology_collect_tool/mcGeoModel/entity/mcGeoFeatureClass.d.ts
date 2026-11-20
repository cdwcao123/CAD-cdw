import { McGeMatrix4, McMcdFiler, McMctfFiler } from 'McCore';
import { McGeoGeometry } from '../geometry/mcGeoGeometry';
import { FeatureType } from '../types/enum';
import { McGeoFeatureClass, McGeoModelField } from '../types/interface';
import { McGeoFeatureClassInfo } from '../types/type';
import { McGeoFeatureImp } from './mcGeoFeature';
/**
 * 地质模型要素类实现
 * @description 通用类，给外部使用的地质模型要素类提供实现
 * @implements {McGeoFeatureClass}
 * @class McGeoFeatureClassImp
 */
export declare class McGeoFeatureClassImp {
    protected id: string;
    protected className: string;
    protected classLabel: string;
    protected featureType: FeatureType;
    protected features: McGeoFeatureImp[];
    constructor(data?: McGeoFeatureClass);
    /**
     * 获取模型ID
     * @returns 模型ID
     */
    getClassId(): string;
    /**
     * 获取模型名字
     * @returns 模型名字
     */
    getClassName(): string;
    /**
     * 获取模型名字
     * @returns 模型名字
     */
    getClassLabel(): string;
    /**
     * 获取模型类型
     * @returns 模型类型
     */
    getFeatureType(): FeatureType;
    /**
     * 获取要素类信息
     * @returns 要素类信息
     */
    getFeatureClassInfo(): McGeoFeatureClassInfo;
    /**
     * 获取要素数组
     * @returns 要素数组
     */
    getFeaturesInfo(): {
        id: string;
        name: string;
    }[];
    /**
     * 获取要素数组
     * @description 返回要素的深拷贝，避免外部修改要素对象
     * @returns 要素数组的深拷贝
     */
    getFeatures(): McGeoFeatureImp[];
    /**
     * 获取要素字段属性
     * @param featureId 要素ID
     * @returns 要素字段属性数组，如果要素不存在则返回undefined
     */
    getFeatureFields(featureId: string): McGeoModelField[] | undefined;
    /**
     * 设置要素字段属性
     * @param featureId 要素ID
     * @param fields 要素字段属性映射
     * @returns void
     */
    setFeatureFields(featureId: string, fields: Map<string, string>): void;
    /**
     * 获取要素几何信息
     * @param featureId 要素ID
     * @returns 要素几何信息，如果要素不存在则返回undefined
     */
    getFeatureGeometry(featureId: string): McGeoGeometry | undefined;
    /**
     * 获取要素样式信息
     * @param featureId 要素ID
     * @returns 要素样式信息，如果要素不存在则返回undefined
     */
    getFeatureStyles(featureId: string): McGeoFeatureClass['features'][number]['styles'] | undefined;
    /**
     * 设置要素样式属性
     * @param featureId 要素ID
     * @param styleIndex 样式索引
     * @param propertyName 样式属性名
     * @param propertyValue 样式属性值
     * @returns void
     */
    setFeatureStyleProperty(featureId: string, styleIndex: number, propertyName: string, propertyValue: any): void;
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
