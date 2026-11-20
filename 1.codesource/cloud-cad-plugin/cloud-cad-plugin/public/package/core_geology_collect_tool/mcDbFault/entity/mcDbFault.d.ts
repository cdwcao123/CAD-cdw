import { McDbCustomEntity, McDbDatabase, McGeMatrix4, McGePoint, McGeVector3, McEngine2D, McEngine3D, McMcdFiler, McMctfFiler } from 'McCore';
import { McFaultClassification, McFaultMode } from '../types/enum';
import { McFaultData } from '../types/interface';
export declare class McDbFault extends McDbCustomEntity {
    /**对象类型*/
    protected readonly _type: string;
    /**实体类名 */
    protected static readonly _className: string;
    /** 断层编码 */
    protected fault_code: string;
    /** 断层名称 */
    protected fault_name: string;
    /** 断层类型 */
    protected fault_mode: McFaultMode;
    /** 矿井编码*/
    protected mine_code: string;
    /** 断层倾角*/
    protected fault_angle: number;
    /** 小断层中心点 */
    protected fault_point: McGePoint;
    /** 断层走向 */
    protected fault_towards: number;
    /** 断层倾向 */
    protected fault_trend: number;
    /**断层落差最小值*/
    protected fault_drop_min: number;
    /** *断层落差最大值*/
    protected fault_drop_max: number;
    /** 走向长度*/
    protected fault_length: number;
    /** 断层性质 */
    protected fault_type: McFaultClassification;
    /** 垂直滑动方向 */
    protected fault_vert_direct: string;
    /** 平措方向 */
    protected fault_hor_direct: string;
    /** 平措距离 */
    protected fault_hor_dis: number;
    /** 断开地层 */
    protected fault_stratums: string[];
    /** 上盘坐标 */
    protected fault_hang: McGeVector3[];
    /**下盘坐标 */
    protected fault_bottom: McGeVector3[];
    /** 边界坐标 */
    protected fault_bodunary: McGeVector3[];
    /**揭露点 */
    protected fault_plane: McGeVector3[];
    protected fault_showText: boolean;
    /**
     * 构造函数
     * @param data 断层数据
     */
    constructor(data: McFaultData);
    /**
   * 断层编码
   */
    getFaultCode(): string;
    /**
     * 设置断层编码
     */
    setFaultCode(value: string): void;
    /**
   * 断层显示标注
   */
    getFaultShowText(): boolean;
    /**
     * 设置断层是否显示标注
     */
    setFaultShowText(value: boolean): void;
    /**
   * 断层名称
   */
    getFaultName(): string;
    /**
     * 设置断层名称
     */
    setFaultName(value: string): void;
    /**
   * 矿井编码
   */
    getMineCode(): string;
    /**
     * 设置矿井编码
     */
    setMineCode(value: string): void;
    /**
     * 断层类型
     */
    getFaultMode(): McFaultMode;
    /**
     * 设置关联巷道名称
     */
    setFaultMode(value: McFaultMode): void;
    /**
     * 断层性质
     */
    getFaultType(): McFaultClassification;
    /**
     * 设置断层性质
     */
    setFaultType(value: McFaultClassification): void;
    /**
     * 获取断开地层
     */
    getBreakStratum(): string[];
    /**
     * 设置断开地层
     */
    setBreakStratum(value: string[]): void;
    /**
     * 断层倾角
     */
    getFaultLength(): number;
    /**
     * 设置断层倾角
     */
    setFaultLength(value: number): void;
    /**
     * 断层倾角
     */
    getFaultAngle(): number;
    /**
     * 设置断层倾角
     */
    setFaultAngle(value: number): void;
    /**
   * 断层走向
   */
    getFaultTowards(): number;
    /**
     * 设置断层走向
     */
    setFaultTowards(value: number): void;
    /**
   * 断层倾向
   */
    getFaultTrend(): number;
    /**
     * 设置断层倾向
     */
    setFaultTrend(value: number): void;
    /**
   * 小断层坐标
   */
    getFaultPoint(): McGePoint;
    /**
     * 小断层坐标
     */
    setFaultPoint(value: McGePoint): void;
    /**
     * 断层最小落差
     */
    getFaultDropMin(): number;
    /**
     * 设置断层最小落差
     */
    setFaultDropMin(value: number): void;
    /**
     * 断层最大落差
     */
    getFaultDropMax(): number;
    /**
     * 设置断层最大落差
     */
    setFaultDropMax(value: number): void;
    /**
   * 垂直滑动方向
   */
    getVertDirect(): string;
    /**
     * 设置垂直滑动方向
     */
    setVertDirect(value: string): void;
    /**
   * 平措方向
   */
    getHorDirect(): string;
    /**
     * 设置平措方向
     */
    setHorDirect(value: string): void;
    /**
   * 断层平措距离
   */
    getHorDis(): number;
    /**
     * 设置断层平措距离
     */
    setHorDis(value: number): void;
    /**断层上盘 */
    getHang(): McGeVector3[];
    /**
     * 设置断层上盘
     */
    initHang(value: McGeVector3[]): void;
    /**
     * 断层上盘添加点
     */
    addHangPt(value: McGeVector3, bhang: boolean): void;
    addHangPts(value: McGeVector3[], bhang: boolean): void;
    getLastPt(bhang: boolean): McGeVector3 | undefined;
    /**
     * 断层点总数（上/下盘点数取较大值，至少为 1）
     */
    numFitPoints(): number;
    /**
     * 按 0 基索引取断层点，用于“当前断层点”夹点绘制
     */
    getFitPointAt(index: number): McGeVector3 | undefined;
    /**断层下盘 */
    getBottom(): McGeVector3[];
    /**
   * 断层上盘移除尾点
   */
    removeHangPt(): void;
    /**
     * 设置断层下盘
     */
    setBottom(value: McGeVector3[]): void;
    addBottomPt(value: McGeVector3): void;
    addBottomPts(value: McGeVector3[]): void;
    /**
   * 断层下盘移除尾点
   */
    removeBtmPt(): void;
    /**断层边界 */
    getBoundary(): McGeVector3[];
    /**
     * 设置断层边界
     */
    setBoundary(value: McGeVector3[]): void;
    /**断层边界 */
    getPlane(): McGeVector3[];
    /**
     * 设置断层边界
     */
    setPlane(value: McGeVector3[]): void;
    /**
     * 重构子实体
     */
    rebuildChildEntity(db: McDbDatabase, recursive?: boolean): void;
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
