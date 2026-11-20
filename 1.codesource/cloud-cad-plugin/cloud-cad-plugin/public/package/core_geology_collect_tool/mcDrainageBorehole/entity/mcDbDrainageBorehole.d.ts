import { McColor, McDbCustomEntity, McDbDatabase, McEngine2D, McEngine3D, MCEntitySnapPoints, MCEntityStretchPoints, McGeMatrix4, McGeVector3, McMcdFiler, McMctfFiler } from 'McCore';
import { McBoreholePurpose, McBoreholeType } from '../types/enum';
import { McBoreholeBranch, McBoreholeGeometry, McBoreholePath, McDrillCoalData } from '../types/interface';
/**
 *  抽采钻孔类
 */
export declare class McDbDrainageBorehole extends McDbCustomEntity {
    #private;
    protected readonly _type: string;
    protected static readonly _className: string;
    constructor(drillID: string, drillType: McBoreholeType, radius: number, range: number, position: McGeVector3, paths: McBoreholePath[], drillPosition?: string, tunnelID?: string, siteID?: string, isDesign?: boolean, group?: string);
    /**根据钻孔轨迹数据构建坐标轨迹线*/
    buildGeometry(): void;
    /**识别钻孔是否需要区分显示煤层内颜色*/
    isInCoal(): boolean;
    /**
       * 获取钻孔ID
       */
    getDrillID(): string;
    /**
     * 设置钻孔ID
     */
    setDrillID(drillID: string): void;
    /**
    * 获取钻孔所属的分组
    */
    getGroup(): string;
    /**
     * 设置钻孔所属的分组
     */
    setGroup(group: string): void;
    /**
   * 获取钻孔用途
   */
    getPurpose(): McBoreholePurpose;
    /**
    * 设置钻孔用途
    */
    setPurpose(purpose: McBoreholePurpose): void;
    /**
    * 获取钻孔类型
    */
    getDrillType(): McBoreholeType;
    /**
    * 获取是否为设计钻孔
    */
    getIsDesign(): boolean;
    /**
    * 获取隧道ID
    */
    getTunnelID(): string;
    /**
    * 获取站点ID
    */
    getSiteID(): string;
    /**
    * 获取钻孔位置描述信息
    */
    getDrillPosition(): string;
    /**
    * 设置钻孔位置描述信息
    */
    setDrillPosition(position: string): void;
    /**
    * 获取开孔位置的巷道走向，单位度
    */
    getTunnelHeading(): number;
    /**
    * 设置开孔位置的巷道走向，单位度
    */
    setTunnelHeading(heading: number): void;
    /**
    * 获取轨迹数据
    */
    getPath(): McBoreholePath[];
    /**
     * 设置轨迹数据
     */
    setPath(paths: McBoreholePath[]): void;
    /**
     * 获取分支轨迹数据
     */
    getBranchData(): McBoreholeBranch[];
    /**
     * 设置分支轨迹数据
     */
    setBranchData(branchData: McBoreholeBranch[]): void;
    /**
     * 设置指定索引位置处的分支轨迹数据
     */
    setIndexBranchData(index: number, branchData: McBoreholeBranch): void;
    /**
     * 获取分支几何坐标数据
     */
    getBranchGeometry(index: number): McGeVector3[];
    /**
     * 获取渲染几何数据
     */
    getGeometry(): McBoreholeGeometry[];
    /**
     * 获取煤层颜色
     */
    getCoalColor(): McColor;
    /**
     * 设置煤层颜色
     */
    setCoalColor(color: McColor): void;
    /**
     * 获取钻孔抽采区域颜色
     */
    getRangeColor(): McColor;
    /**
     * 设置钻孔抽采区域颜色
     */
    setRangeColor(color: McColor): void;
    /**
     * 获取见煤深
     */
    getInCoalLength(): number;
    /**
     * 设置见煤深
     */
    setInCoalLength(length: number): void;
    /**
     * 获取止煤深
     */
    getOutCoalLength(): number;
    /**
     * 设置止煤深
     */
    setOutCoalLength(length: number): void;
    /**
     * 获取钻孔深度
     */
    getDrillDepth(): number;
    /**
     * 获取钻孔半径
     */
    getRadius(): number;
    /**
     * 设置钻孔半径
     */
    setRadius(radius: number): void;
    /**
     * 获取钻孔抽采半径
     */
    getRange(): number;
    /**
     * 设置钻孔抽采半径
     */
    setRange(range: number): void;
    /**
     * 获取是否显示抽采范围
     */
    getShowRange(): boolean;
    /**
     * 设置是否显示抽采范围
     */
    setShowRange(showRange: boolean): void;
    /**
     * 获取是否显示钻孔名称
     */
    getShowName(): boolean;
    /**
     * 设置是否显示钻孔名称
     */
    setShowName(showName: boolean): void;
    /**
     * 获取钻孔开孔位置
     */
    getPosition(): McGeVector3;
    /**
     * 设置钻孔开孔位置
     */
    setPosition(position: McGeVector3): void;
    /**
     * 获取反演的穿透煤层数据
     */
    getCoalData(): McDrillCoalData[];
    /**
     * 设置反演的穿透煤层数据
     */
    setCoalData(coalData: McDrillCoalData[]): void;
    /**
     * 获取目标方位角
     */
    getTargetHeading(): number;
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
    * 获取最近点
    * @param {McGeVector3} pt 点
    * @returns {McGeVector3 | null} 最近点
    */
    getClosestPoint(pt: McGeVector3): McGeVector3 | null;
    /**
    * 获取距起点指定距离处的坐标点，如果距离大于长度，则取末尾点
    * @param {float} d 距离
    * @returns {McGeVector3|null} 投影坐标
    */
    getPointByDistance(d: number): McGeVector3 | null;
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
     * 根据朝向计算钻孔的方位角和俯仰角，如果传两个值则根据两个值计算朝向，如果只传一个值则默认为朝向值
     * @param {McGeVector3} start         起点坐标
     * @param {McGeVector3} end           终点坐标（如果该值为空，则将start当做朝向值）
     * @return {{heading:0, tilt:0}}  钻孔的方位角和俯仰角
     */
    static calHeadingTilt(start: McGeVector3, end?: McGeVector3): {
        heading: number;
        tilt: number;
    };
    /**
     * 根据钻孔的方位角和俯仰角，计算朝向
     * 瓦斯智能抽采系统使用接口
     * @param {float} heading        钻孔方位角
     * @param {float} tilt           钻孔倾角
     * @return {McGeVector3}         钻孔的朝向
     */
    static calDirByHeadingTilt(heading: number, tilt: number): McGeVector3;
}
