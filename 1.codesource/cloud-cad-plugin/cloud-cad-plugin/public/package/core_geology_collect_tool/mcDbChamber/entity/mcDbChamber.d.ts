import { McDbCustomEntity, McDbDatabase, McGeVector3, McMcdFiler, McMctfFiler, McGeMatrix4, MCEntityStretchPoints, MCEntitySnapPoints, McEngine3D } from 'McCore';
import { PathCalcType } from '@/core_geology_collect_tool/mcTunnel';
/**
 * 拐角方式
 */
export declare enum CornerType {
    /**无拐角 */
    None = 0,
    /**倒角 */
    Chamfer = 1,
    /**圆角 */
    Round = 2
}
/**
 * 硐室数据接口
 */
export interface IMcDbChamberData {
    /**名称 */
    name: string;
    /**坐标 */
    position: McGeVector3;
    /**宽度 */
    width: number;
    /**高度 */
    height: number;
    /**深度 */
    depth: number;
    /**所在巷道ID */
    tunnelId: string;
    /**巷道侧类型 */
    tunnelSideType: PathCalcType.eCalcLeft | PathCalcType.eCalcRight;
    /**拐角方式 */
    cornerType: CornerType;
    /**拐角半径 */
    cornerRadius: number;
    /**与巷道的夹角(单位:度) */
    withTunnelAngle: number;
}
/**
 * 硐室实体
 */
export declare class McDbChamber extends McDbCustomEntity {
    #private;
    protected readonly _type: string;
    protected static readonly _className: string;
    constructor(data?: IMcDbChamberData);
    /**
     * 获取名称
     */
    getName(): string;
    /**
     * 设置名称
     */
    setName(name: string): void;
    /**
     * 获取是否显示名称
     */
    getShowName(): boolean;
    /**
     * 设置是否显示名称
     */
    setShowName(showName: boolean): void;
    /**
     * 获取坐标
     */
    getPosition(): McGeVector3;
    /**
     * 设置坐标
     */
    setPosition(position: McGeVector3): void;
    /**
     * 获取宽度
     */
    getWidth(): number;
    /**
     * 设置宽度
     */
    setWidth(width: number): void;
    /**
     * 获取高度
     */
    getHeight(): number;
    /**
     * 设置高度
     */
    setHeight(height: number): void;
    /**
     * 获取深度
     */
    getDepth(): number;
    /**
     * 设置深度
     */
    setDepth(depth: number): void;
    /**
     * 获取硐室轨迹
     */
    getPathLine(): McGeVector3[];
    /**
     * 设置硐室轨迹
     */
    setPathLine(path: McGeVector3[]): void;
    /**
     * 获取所在巷道ID
     */
    getTunnelId(): string;
    /**
     * 设置所在巷道ID
     */
    setTunnelId(tunnelId: string): void;
    /**
     * 获取拐角方式
     */
    getCornerType(): number;
    /**
     * 设置拐角方式
     */
    setCornerType(cornerType: number): void;
    /**
     * 获取拐角半径
     */
    getCornerRadius(): number;
    /**
     * 设置拐角半径
     */
    setCornerRadius(cornerRadius: number): void;
    /**
     * 获取与巷道的夹角
     */
    getWithTunnelAngle(): number;
    /**
     * 设置与巷道的夹角
     */
    setWithTunnelAngle(withTunnelAngle: number): void;
    /**
     * 获取巷道侧类型
     */
    getTunnelSideType(): PathCalcType.eCalcLeft | PathCalcType.eCalcRight;
    /**
   *  获取硐室所在巷道的轨迹线
   * @returns
   * @internal
   */
    private getSideLine;
    protected createGrips(): void;
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
    rebuildChildEntity(db: McDbDatabase, recursive?: boolean): void;
    worldDraw3d(engine: McEngine3D): void;
    /**
   * 构建轨迹路径
   * @returns
   */
    buildPath(): void;
    /**
     * 计算硐室方向
     * @param tunnel 所在巷道
     * @param sidePl 所在巷道的侧线
     * @param ptOnSide 侧线上的点
     * @param dAngle 与巷道的夹角（度）
     */
    private calcChamberDirection;
    /**
     * 计算圆角轨迹
     * 圆角位于硐室开口两端（ptS、ptE）与巷道侧线的交接处，
     * 用侧线切线方向作为拐角的一条边，硐室侧边作为另一条边。
     * @param plSide 所在巷道的侧线
     * @param ptS 硐室开口处的起点（在侧线上）
     * @param pt1 硐室底部的点（靠近起点）
     * @param ptE 硐室开口处的终点（在侧线上）
     * @param pt2 硐室底部的点（靠近终点）
     * @param dRadius 圆角半径
     * @param plFillet 返回的圆角多段线
     */
    private calcFilletCorner;
    transformBy(matrix: McGeMatrix4): boolean;
    /**
     * 计算单个拐角的圆角数据
     * @param ptCorner 拐角点
     * @param vtPrev 从拐角出发、指向 prev 边方向的方向向量
     * @param vtNext 从拐角出发、指向 next 边方向的方向向量
     * @param dRadius 圆角半径
     * @returns 落在 prev 边与 next 边上的切点及圆弧凸度，无法计算时返回 null
     */
    private calcCornerFillet;
    /**
     * 从外部mctf导入
     */
    mctfInFields(fields: McMctfFiler): void;
    /**
     * 当前实体的属性输出到外部
     */
    mctfOutFields(fields: McMctfFiler): void;
    /**
     * 从外部mcd导入到当前实体
     * @param filer 数据读取对象
     */
    mcdInFields(filer: McMcdFiler): void;
    /**
     * 当前实体的属性输出到外部
     * @param filer 数据写入对象
     */
    mcdOutFields(filer: McMcdFiler): void;
}
