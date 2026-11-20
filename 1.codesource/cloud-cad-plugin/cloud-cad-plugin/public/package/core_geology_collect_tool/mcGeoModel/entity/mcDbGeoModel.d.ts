import { McDbCustomEntity, McDbDatabase, McGeMatrix4, McGeVector3, McMcdFiler, McMctfFiler } from 'McCore';
import { McGeoGeometry } from '../geometry/mcGeoGeometry';
import { McGeoData, McGeoFeature, McGeoModelData, McGeoModelField, McGeoSchemaInfo } from '../types/interface';
import { McGeoFeatureClassInfo, McGeoFieldMap, McGeoSchema } from '../types/type';
import { McGeoFeatureClassImp } from './mcGeoFeatureClass';
/**
 * 地质模型类
 * @description 通用类，使用
 */
export declare class McDbGeoModel extends McDbCustomEntity {
    /**对象类型*/
    protected readonly _type: string;
    /**实体类名 */
    protected static readonly _className: string;
    /** 地质模型对象名字 */
    protected name: string;
    /** 数据模型ID */
    protected modelId: string;
    /** 数据模型名字 */
    protected modelName: string;
    /** 数据模型类型 */
    protected modelType: string;
    /** 属性字段 */
    protected fields: McGeoFieldMap;
    /** 要素列表 */
    protected featureClasses: McGeoFeatureClassImp[];
    /**
     * 模型信息
     * @description 包含模型ID、模型名字、模型类型、字段说明、要素类说明、坐标系参数等
     * @type {Map<string, McGeoData>}
     * @static
     * @memberof McDbGeoModel
     */
    protected static modelInfo: Map<string, McGeoData>;
    /**
     * 设置模型信息
     * @description 保存于静态属性中，供同类模型后续使用
     * @param modelInfo 模型信息
     */
    static setModelInfo(modelInfo: McGeoData): void;
    /**
     * 构造函数
     * @param data 地质模型数据
     */
    constructor(data?: McGeoModelData);
    /**
     * 获取模型ID
     * @returns 模型ID
     */
    getModelId(): string;
    /**
     * 获取模型名字
     * @returns 模型名字
     */
    getModelName(): string;
    /**
     * 获取模型类型
     * @returns 模型类型
     */
    getModelType(): string;
    /**
     * 获取模型字段
     * @returns 字段数组
     */
    getModelFields(): McGeoModelField[];
    /**
     * 设置模型字段值
     * @param fields 模型字段新值数组
     */
    setModelFields(fields: McGeoModelField[]): void;
    /**
     * 获取模型元属性字段说明
     * @returns 字段说明映射
     */
    getMetaDataSchema(): McGeoSchema | undefined;
    /**
     * 获取单个字段说明
     * @param fieldName 字段名称
     * @returns 字段说明
     */
    getMetaDataSchemaInfo(fieldName: string): McGeoSchemaInfo | undefined;
    /**
     * 获取要素类列表
     * @returns 要素类数组
     */
    getFeatureClassInfos(): McGeoFeatureClassInfo[];
    /**
     * 获取要素列表
     * @param featureClassId 要素类ID
     * @returns 要素数组或undefined
     */
    getFeatures(featureClassId: string): {
        id: string;
        name: string;
    }[] | undefined;
    /**
     * 获取要素字段值
     * @param featureClassId 要素类ID
     * @param featureId 要素ID
     * @returns 要素字段数组或undefined
     */
    getFeatureFields(featureClassId: string, featureId: string): McGeoModelField[] | undefined;
    /**
     * 设置要素字段值
     * @param featureClassId 要素类ID
     * @param featureId 要素ID
     * @param fields 要素字段新值映射
     * @returns void
     */
    setFeatureFields(featureClassId: string, featureId: string, fields: McGeoFieldMap): void;
    /**
     * 获取要素几何信息
     * @param featureClassId 要素类ID
     * @param featureId 要素ID
     * @returns 要素几何信息或undefined
     */
    getFeatureGeometry(featureClassId: string, featureId: string): McGeoGeometry | undefined;
    /**
     * 获取要素样式信息
     * @param featureClassId 要素类ID
     * @param featureId 要素ID
     * @returns 要素样式数组或undefined
     */
    getFeatureStyles(featureClassId: string, featureId: string): McGeoFeature['styles'] | undefined;
    /**
     * 设置要素样式属性值
     * @param featureClassId 要素类ID
     * @param featureId 要素ID
     * @param styleIndex 样式索引
     * @param propertyName 属性名称
     * @param propertyValue 属性值
     */
    setFeatureStyleProperty(featureClassId: string, featureId: string, styleIndex: number, propertyName: string, propertyValue: any): void;
    /**
     * 获取 实例类型名称 实例方法
     * @returns 类名称
     */
    isA(): string;
    /**
     * 重建当前实体的子实体数据
     * @param db 数据库对象
     * @param [recursive=true] 是否递归重构子实体
     */
    rebuildChildEntity(db: McDbDatabase, recursive?: boolean): void;
    /**
     * 高亮实体
     * @param bLight 是否高亮
     * @default true
     * @param bShowGrip 是否显示夹点
     * @default true
     * @param simpleHL 是否使用简单高亮效果
     * @default false
     */
    setHighLight(bLight?: boolean, bShowGrip?: boolean, simpleHL?: boolean, position?: McGeVector3 | undefined): void;
    /** 创建夹点对象 */
    protected createGrips(): void;
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
