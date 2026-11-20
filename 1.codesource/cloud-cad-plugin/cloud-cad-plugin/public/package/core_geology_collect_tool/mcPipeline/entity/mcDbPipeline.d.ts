import { McGeVector2, McColor, McDbCustomEntity, McDbDatabase, McGeMatrix4, McGePoint, McGeVector3, McEngine2D, McEngine3D, McMcdFiler, McMctfFiler } from 'McCore';
import { McPipeSection, McPipeType, McPipeSide, McPipeFlow } from '../types/enum';
import { McPipelineData, McPipePtInfo } from '../types/interface';
export declare class McDbPipeline extends McDbCustomEntity {
    /**对象类型*/
    protected readonly _type: string;
    /**实体类名 */
    protected static readonly _className: string;
    /** 管线编码 */
    protected pipeline_code: string;
    /** 管线名称 */
    protected pipeline_name: string;
    /** 管线路径 */
    protected pipeline_path: McGeVector3[];
    /** 矿井编码*/
    protected MineCode: string;
    /** 管线断面线*/
    protected pipeline_secpoly: McGePoint[];
    /** 元件中心点 */
    protected secenter: McGePoint;
    /** 管线偏移量 */
    protected pipeline_offset: number;
    /** 管线断面类型 */
    protected pipeline_sectype: McPipeSection;
    /**管径 （圆）*/
    protected radius: number;
    /** 管线断面宽 （正方形，矩形）*/
    protected pipeline_width: number;
    /** 管线断面高 （正方形，矩形）*/
    protected pipeline_height: number;
    /** 管线颜色 */
    protected pipeline_color: McColor;
    /** 管线类型 */
    protected pipeline_type: McPipeType;
    /** 管线距离巷道底部间距 */
    protected pipelinejd: number;
    /** 管线距巷道侧壁的间距 */
    protected pipelinejb: number;
    /** 流向 */
    protected pipeline_flow: McPipeFlow;
    /** 管线抬高 */
    protected pipeline_tg: number;
    /**偏移向量 */
    protected offset_direct: McGePoint;
    /** 管线在巷道左邦还是右邦 */
    protected pipeline_side: McPipeSide;
    /**关联的巷道编码 */
    protected laneway_code: string;
    /**管路数组 */
    protected pipeline_cntpts: McPipePtInfo[];
    /**元件字典 */
    protected map_cntpts: Map<string, McPipePtInfo>;
    /**
     * 构造函数
     * @param data 管线数据
     */
    constructor(data: McPipelineData);
    /**
  * 管线颜色
  */
    getPipeColor(): McColor;
    /**
     * 设置管线编码
     */
    setPipeColor(value: McColor): void;
    /**
   * 管线编码
   */
    getPipeCode(): string;
    /**
     * 设置管线编码
     */
    setPipeCode(value: string): void;
    /**
   * 管线名称
   */
    getPipeName(): string;
    /**
     * 设置管线名称
     */
    setPipeName(value: string): void;
    /**
   * 矿井编码
   */
    getMineCode(): string;
    /**
     * 设置矿井编码
     */
    setMineCode(value: string): void;
    /**
     * 关联的巷道编码
     */
    getLanewayCode(): string;
    /**
     * 设置关联巷道名称
     */
    setLaneWayCode(value: string): void;
    /**
     * 返回所有连接点
     */
    getAllPts(): McPipePtInfo[];
    /**
     * 返回指定索引连接点
     */
    getptByIndex(index: number): McPipePtInfo | null;
    /**
     * 返回最后一个连接点
     */
    getLastPt(): McPipePtInfo | null;
    /**
     * 添加一个连接点
     *
    */
    AddCntPt(subPipe: McPipePtInfo): void;
    /**
     * 更新连接点
     */
    setCntPt(value: McPipePtInfo, index: number): void;
    /**
     * 插入一个连接点
     *
    */
    insertCntPt(value: McPipePtInfo, index: number): void;
    /**初始化连接点列表 */
    initCntpts(pts: McPipePtInfo[]): void;
    addCntptList(cntPts: McPipePtInfo[]): void;
    /**
     * 清空所有元件
     */
    reCntPts(): void;
    /**
     * 移除连接点
     */
    removeCntPt(index: number): void;
    rePipePath(): void;
    /**
     * 元件编码获取元件
     */
    getCntByCode(key: string): McPipePtInfo | undefined;
    hasCntPt(key: string): boolean;
    getPtByPosition(centerPt: McGeVector3): {
        preInfo: McPipePtInfo | null;
        nextInfo: McPipePtInfo | null;
        state: number;
        index: number;
    };
    getSubPathByPt(centerPt: McGeVector3): {
        preInfo: McPipePtInfo | null;
        nextInfo: McPipePtInfo | null;
        state: number;
        index: number;
    };
    isPointOn(pt: McGeVector2, pt1: McGeVector2, pt2: McGeVector2): boolean;
    /**
     * 添加元件
     */
    initPtsMap(): void;
    /**
   * 添加元件
   */
    SetCntPt(value: McPipePtInfo): void;
    /**
     * 管线流向
     */
    getPipeFlow(): McPipeFlow;
    /**
     * 设置管线流向
     */
    setPipeFlow(value: McPipeFlow): void;
    /**
     * 管线在巷道左邦还是右邦
     */
    getPipeSide(): McPipeSide;
    /**
     * 设置管线在巷道左邦还是右邦
     */
    setPipeSide(value: McPipeSide): void;
    /**
   * 管线管径
   */
    getRadius(): number;
    /**
     * 设置管径
     */
    setRadius(value: number): void;
    /**
   * 管线断面宽
   */
    getPipeSecWidth(): number;
    /**
     * 设置管线断面宽
     */
    setPipeSecWidth(value: number): void;
    /**
   * 管线断面高
   */
    getPipeSecHeight(): number;
    /**
     * 设置管线断面高
     */
    setPipeSecHeight(value: number): void;
    /**
     * 管线距离底板高度
     */
    getPipejd(): number;
    /**
     * 设置管线距离底板高度
     */
    setPipeJd(value: number): void;
    /**
     * 管线类型
     */
    getPipeType(): McPipeType;
    /**
     * 设置管线类型
     */
    setPipeType(value: McPipeType): void;
    /**
   * 管线距离侧边距离
   */
    getPipejb(): number;
    /**
     * 设置管线距离侧边距离
     */
    setPipeJb(value: number): void;
    /**
   * 管线连接元件抬高
   */
    getPipeTg(): number;
    /**
     * 设置管线连接元件抬高
     */
    setPipeTg(value: number): void;
    /**
   * 管线断面类型
   */
    getPipeSecType(): McPipeSection;
    /**
     * 设置管线断面类型（未知,通用,圆,矩形,正方形）
     */
    setPipeSecType(value: McPipeSection): void;
    /**管线相对巷道边线偏移量 */
    getPipeOffSet(): number;
    /**
     * 获取管线相对巷道边线偏移量
     */
    setPipeOffset(value: number): void;
    /**管线连接点 */
    getPipeScenter(): McGePoint;
    /**
     * 获取管线连接点
     */
    setPipeScenter(value: McGePoint): void;
    /**
     * 获取管线路径
     * @returns
     */
    getPipePath(): McGeVector3[];
    /**
     * 设置管线路径
     * @param value
     */
    setPipePath(value: McGeVector3[]): void;
    /**
   * 获取管线断面线
   * @returns
   */
    getPipeSecPoly(): McGePoint[];
    /**
     * 设置管线断面线
     * @param value
     */
    setPipeSecPoly(value: McGePoint[]): void;
    /**
     * 管线偏移量向量
     * @returns
     */
    getPipeOffSetDirect(): McGePoint;
    /**
     * 设置管线偏移量向量
     * @param value
     */
    setPipeOffSetDirect(value: McGeVector3): void;
    calculatePipePath(): void;
    /**
     * 重构子实体
     */
    rebuildChildEntity(db: McDbDatabase, recursive?: boolean): void;
    drawSubPipe(subPipe: McGeVector3[]): void;
    drawCompnent(offset: McGeVector3, pt: McGeVector3, step: number): void;
    /** 变换方法 */
    transformBy(matrix: McGeMatrix4): boolean;
    protected createGrips(): void;
    /**
      * 3d渲染方法
      */
    worldDraw3d(engine: McEngine3D): void;
    worldDraw2d(engine: McEngine2D): void;
    /**
  * 当前实体的属性输出到外部
  */
    mcdOutFields(filer: McMcdFiler): void;
    /**
   * 从外部mcd导入到当前样式
   * @param filer 数据读取对象
   */
    mcdInFields(filer: McMcdFiler): void;
    /**
   * 从外部mcd导入到当前样式
   */
    mctfInFields(fields: McMctfFiler): void;
    /**
  * 当前实体的属性输出到外部
  */
    mctfOutFields(fields: McMctfFiler): void;
}
