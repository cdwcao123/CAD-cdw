import { McDbCustomEntity, McDbEntity, McDbRasterImageDef, McEngine2D, McEngine3D, McMcdFiler, McMctfFiler } from 'McCore';
import { McGeoGeometry } from '../../geometry/mcGeoGeometry';
import { McGeoStyle } from '../../style/mcGeoStyle';
/**
 * 地质模型基础类
 * @description 通用类，给外部使用的地质模型基础类提供实现
 * 主要用于地质模型的2D和3D渲染，包含几何体和样式信息，以及2D和3D子实体数组
 * 实现了区分2D和3D渲染的功能，子类可以根据需要选择性渲染2D或3D子实体
 * @implements {McDbCustomEntity}
 * @class McDbGeoBaseModel
 */
export declare class McDbGeoBaseModel extends McDbCustomEntity {
    protected readonly _type: string;
    protected static readonly _className: string;
    /** 几何体 */
    geometry: McGeoGeometry;
    /** 样式 */
    style: McGeoStyle;
    /** 2D子实体数组 */
    children2D: McDbEntity[];
    /** 3D子实体数组 */
    children3D: McDbEntity[];
    /**
     * 构造函数
     * @param geometry 几何体
     * @param style 样式
     */
    constructor(geometry: McGeoGeometry, style: McGeoStyle);
    /**
       * 加载图片
       * @description 异步加载图片资源，如果图片已经存在于数据库中，则直接返回图片定义对象，
       * 否则从URL或ID加载图片并创建图片定义对象
       * @param urlOrId 图片的URL或ID
       * @param isId 是否为ID
       * @returns 返回加载的图片定义对象
       */
    loadTexture(urlOrId: string, isId?: boolean): Promise<McDbRasterImageDef | undefined>;
    /**
     * 2d渲染方法
     */
    worldDraw2d(engine: McEngine2D): void;
    /**
     * 3d渲染方法
     */
    worldDraw3d(engine: McEngine3D): void;
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
