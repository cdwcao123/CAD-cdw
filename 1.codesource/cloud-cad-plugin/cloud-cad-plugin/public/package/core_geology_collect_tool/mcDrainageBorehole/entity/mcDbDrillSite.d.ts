import { McColor, McDbCustomEntity, McDbDatabase, McEngine2D, McEngine3D, MCEntitySnapPoints, MCEntityStretchPoints, McGeMatrix4, McGePoint2, McGeVector3, McMcdFiler, McMctfFiler } from 'McCore';
/**
 *  抽采钻场类
 */
export declare class McDbDrillSite extends McDbCustomEntity {
    #private;
    protected readonly _type: string;
    protected static readonly _className: string;
    constructor(siteID: string, coords: McGeVector3[], height: number, tunnelID: string);
    /**
       * 获取钻场ID
       */
    getSiteID(): string;
    /**
     * 设置钻场业务编号。
     * @param siteID 新的钻场号。
     * @returns 无返回值。
     */
    setSiteID(siteID: string): void;
    /**
       * 获取隧道ID
       */
    getTunnelID(): string;
    /**
       * 获取钻场高度
       */
    getHeight(): number;
    /**
     * 设置钻场高度
     */
    setHeight(height: number): void;
    /**
     * 获取是否显示文本
     */
    getShowText(): boolean;
    /**
     * 设置是否显示文本
     */
    setShowText(show: boolean): void;
    /**
     * 获取坐标点数组
     */
    getCoords(): McGeVector3[];
    /**
     * 设置指定索引位置的坐标
     */
    setCoord(index: number, coord: McGeVector3): void;
    /**
     * 获取中心点坐标
     */
    getCenterCoord(): McGeVector3;
    /**
     * 获取文本颜色
     */
    getTextColor(): McColor;
    /**
     * 设置文本颜色
     */
    setTextColor(color: McColor): void;
    /**
     * 获取文本偏移量
     */
    getTextOffset(): McGePoint2;
    /**
     * 设置文本偏移量
     */
    setTextOffset(offset: McGePoint2): void;
    /**
     * 根据钻场范围计算文本大小
     */
    calTextSize(v1: McGeVector3, v2: McGeVector3): number;
    /**
    * 重建当前实体的子实体数据
    * @param db 数据库对象
    * @param [recursive=true] 是否递归重构子实体
    */
    rebuildChildEntity(db: McDbDatabase, recursive?: boolean): void;
    /**
     * 2d渲染方法
     */
    worldDraw2d(engine: McEngine2D): void;
    /**
     * 3d渲染方法
     */
    worldDraw3d(engine: McEngine3D): void;
    /**
     * 获取拉伸点坐标，用于拉伸编辑操作
     * @returns {MCEntityStretchPoints} 拉伸点坐标数组
     */
    getStretchPoints(): MCEntityStretchPoints[];
    /**
    * 设置拉伸点坐标拉伸时的处理逻辑
    * @param indexPoints {MCEntityStretchPoints[]} 拉伸点坐标数组
    */
    setStretchPoints(indexPoints: MCEntityStretchPoints[]): void;
    /** 获取捕捉点坐标数据 */
    getSnapPoints(is2D: boolean): MCEntitySnapPoints[];
    /** 创建夹点数据 */
    createGrips(): void;
    /** 变换方法 */
    transformBy(matrix: McGeMatrix4): boolean;
    /**
     * 从外部mcd导入到当前实体 带objectId
     */
    mctfInFields(fields: McMctfFiler): void;
    /**
    * 当前实体的属性输出到外部
    */
    mctfOutFields(fields: McMctfFiler): void;
    mcdInFields(filer: McMcdFiler): void;
    mcdOutFields(filer: McMcdFiler): void;
    /**
    * 根据传入的坐标计算在钻场内的相对位置
    * 瓦斯智能抽采系统使用接口
    * @param {McGeVector3} point    目标坐标点
    * @return {json}           钻场内的相对位置信息，包括离地高度、长度(沿巷道方向)、深度
    */
    getSiteInfoByPoint(point: McGeVector3): {
        height: number;
        length: number;
        deep: number;
    } | null;
    /**
     * 根据传入的参数计算钻场上的坐标
     * @param {float} height    钻孔开孔位置在钻场中的离地高度
     * @param {float} deep      钻孔开孔位置在钻场内的深度，相对于巷道侧帮的距离
     * @param {float} length    钻孔开孔位置在钻场中走向方向距离，沿着钻场所在巷道的方向
     * @return {McGeVector3}    坐标
     */
    getPointOnSite(height: number, deep: number, length: number): McGeVector3;
}
