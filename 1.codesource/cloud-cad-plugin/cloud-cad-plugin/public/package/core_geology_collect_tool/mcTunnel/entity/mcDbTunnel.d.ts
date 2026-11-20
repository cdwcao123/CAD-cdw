import { McColor, McDbCustomEntity, McDbDatabase, McDbVertex, McEngine2D, McEngine3D, MCEntitySnapPoints, MCEntityStretchPoints, McGeMatrix4, McGePoint, McGeVector3, McMcdFiler, McMctfFiler, PickResult } from 'McCore';
import { McGeRaycaster } from 'McCore/mcGe/mcGeRaycaster';
import { McDbTunnelStyle } from '../style/mcDbTunnelStyle';
import { McTunnelExcavationStatus, McTunnelExcavationType, McTunnelSection, McTunnelSupportPattern, McTunnelType, McTunnelUse, McTunnelWindType, McReturnAirType, McSeriesVentilation, PathCalcType } from '../types/enum';
import { McTunnelNodeData, McTunnelData, IMcTunnelNodeData } from '../types/interface';
/**
 * 表示巷道（McDbTunnel）实体的类，继承自 McDbCustomEntity。
 *
 * 该类用于描述矿井巷道的各种属性、样式、导线点、边线等数据，并提供相关的操作方法。
 *
 * 主要功能包括：
 * - 管理巷道的基本属性（如名称、类型、高度、宽度、用途、支护类型等）
 * - 管理巷道的导线点、边线数据
 * - 支持巷道样式的设置与获取
 * - 支持巷道子实体（如中心线、边线、导线点、名称等）的重构与渲染
 * - 提供巷道编辑操作（如添加、移除、反转导线点等）
 * - 提供几何计算方法（如获取指定距离的点、最近点、方向、中心线计算等）
 * - 支持二维与三维渲染
 *
 * 适用于工业互联网操作系统平台下的矿井巷道建模与可视化场景。
 *
 * @remarks
 * - 依赖于 McCore、mcTunnel 相关类型、样式、渲染等模块。
 * - 支持属性变更自动通知（通过 @readyToModify 装饰器）。
 * - 支持多种巷道注记、符号、煤层结构等样式属性的灵活配置。
 *
 * @example
 * ```typescript
 * const tunnelData: McTunnelData = { ... };
 * const tunnel = new McDbTunnel(tunnelData);
 * tunnel.setLanewayName('主运输巷');
 * tunnel.draw();
 * ```
 */
export declare class McDbTunnel extends McDbCustomEntity {
    /**对象类型*/
    protected readonly _type: string;
    /**实体类名 */
    protected static readonly _className: string;
    /** 巷道名称 */
    protected lanewayName: string;
    /** 巷道类型 */
    protected lanewayType: McTunnelType;
    /** 矿井名称 */
    protected miningName: string;
    /** 水平名称 */
    protected horizontalName: string;
    /** 矿井区域名称*/
    protected miningAreaName: string;
    /** 工作面名称 */
    protected workFaceName: string;
    /** 进风回风类型 */
    protected intoOrOutWind: McTunnelWindType;
    /** 巷道高度 */
    protected lanewayHeight: number;
    /** 巷道宽度 */
    protected lanewayWidth: number;
    /** 巷道断面类型 */
    protected lanewaySectionStyle: McTunnelSection;
    /** 巷道用途 */
    protected lanewayUse: McTunnelUse;
    /** 巷道支护类型 */
    protected supportPattern: McTunnelSupportPattern;
    /** 串联通风 */
    protected seriesVentilation: McSeriesVentilation;
    /** 回风类型 */
    protected returnAirType: McReturnAirType;
    /** 掘进状态 */
    protected excavationStatus: McTunnelExcavationStatus;
    /** 掘进类型 */
    protected excavationType: McTunnelExcavationType;
    /** 进尺 */
    protected currentFootage: number;
    /** 导线点列表 */
    protected nodes: McTunnelNodeData[];
    /** 边线列表 */
    protected borderLines: McGePoint[][];
    /** 巷道样式 */
    protected style: string;
    /** 巷道样式属性 */
    /** 是否显示中心线 */
    protected showCenterLine: boolean;
    /** 中心线颜色 */
    protected tunnelCenterLineColor: McColor;
    /** 是否显示绑线 */
    protected showBorderLine: boolean;
    /** 是否显示巷道名称 */
    protected showTunnelName: boolean;
    /** 是否显示巷道节点名称 */
    protected showTunnelNodeName: boolean;
    /** 是否显示巷道节点高程 */
    protected showTunnelNodeElevation: boolean;
    /** 是否显示导线点连线 */
    protected showNodeLine: boolean;
    /** 导线点连线颜色 */
    protected tunnelNodeLineColor: McColor;
    /** 是否为竖井 */
    protected isShaft: boolean;
    /** 巷道位置 */
    protected position: McGeVector3;
    /** 巷道长度 */
    protected length: number;
    /** 中心线点列表 */
    protected centerCoords: McDbVertex[];
    /**
     * 构造函数
     * @param data 巷道数据
     */
    constructor(data: McTunnelData);
    /**
     * 初始化巷道样式
     * @param style 巷道样式
     */
    protected initStyle(style: McDbTunnelStyle): void;
    /**
     * 是否显示中心线
     */
    getShowCenterLine(): boolean;
    /**
     * 设置是否显示中心线
     */
    setShowCenterLine(value: boolean): void;
    /**
       * 获取中心线(返回克隆的新数组)
       */
    getCenterLine(): McGeVector3[];
    /**
     * 获取巷道中心线颜色
     */
    getTunnelCenterLineColor(): McColor;
    /**
     * 设置巷道中心线颜色
     */
    setTunnelCenterLineColor(value: McColor): void;
    /**
     * 获取是否显示邦线
     */
    getShowBorderLine(): boolean;
    /**
     * 设置是否显示邦线
     */
    setShowBorderLine(value: boolean): void;
    /**
     * 获取是否显示巷道名称
     */
    getShowTunnelName(): boolean;
    /**
     * 设置是否显示巷道名称
     */
    setShowTunnelName(value: boolean): void;
    /**
     * 获取是否显示巷道导线点名称
     */
    getShowTunnelNodeName(): boolean;
    /**
     * 设置是否显示巷道导线点名称
     */
    setShowTunnelNodeName(value: boolean): void;
    /**
     * 获取是否显示巷道导线点标高
     */
    getShowTunnelNodeElevation(): boolean;
    /**
     * 设置是否显示巷道导线点标高
     */
    setShowTunnelNodeElevation(value: boolean): void;
    /**
     * 获取是否显示导线点连线
     */
    getShowNodeLine(): boolean;
    /**
     * 设置是否显示导线点连线
     */
    setShowNodeLine(value: boolean): void;
    /**
     * 获取导线点连线颜色
     */
    getTunnelNodeLineColor(): McColor;
    /**
     * 设置导线点连线颜色
     */
    setTunnelNodeLineColor(value: McColor): void;
    /**
     * 获取巷道编码
     * @returns 巷道编码
     */
    getLanewayCode(): string;
    /**
     * 设置巷道编码
     * @param value 巷道编码
     */
    setLanewayCode(value: string): void;
    /**
     * 获取巷道名称
      * @returns 巷道名称
     */
    getLanewayName(): string;
    /**
     * 设置巷道名称
     * @param value 巷道名称
     */
    setLanewayName(value: string): void;
    /**
     * 获取巷道类型
     * @returns 巷道类型
     */
    getLanewayType(): McTunnelType;
    /**
     * 设置巷道类型
     * @param value 巷道类型
     */
    setLanewayType(value: McTunnelType): void;
    /**
     * 获取矿井名称
     * @returns 矿井名称
     */
    getMiningName(): string;
    /**
     * 设置矿井名称
     * @param value 矿井名称
     */
    setMiningName(value: string): void;
    /**
     * 获取水平名称
     * @returns 水平名称
     */
    getHorizontalName(): string;
    /**
     * 设置水平名称
     * @param value 水平名称
     */
    setHorizontalName(value: string): void;
    /**
     * 获取采区名称
     * @returns 采区名称
     * */
    getMiningAreaName(): string;
    /**
     * 设置采区名称
     * @param value 采区名称
     */
    setMiningAreaName(value: string): void;
    /**
     * 获取工作面名称
     * @returns 工作面名称
     */
    getWorkFaceName(): string;
    /**
     * 设置工作面名称
     * @param value 工作面名称
     */
    setWorkFaceName(value: string): void;
    /**
     * 获取进出风类型
     * @returns 进出风类型
     */
    getIntoOrOutWind(): McTunnelWindType;
    /**
     * 设置进出风类型
     * @param value 进出风类型
     */
    setIntoOrOutWind(value: McTunnelWindType): void;
    /**
     * 获取巷道高度
     * @returns 巷道高度
     */
    getLanewayHeight(): number;
    /**
     * 设置巷道高度
     * @param value 巷道高度
     */
    setLanewayHeight(value: number): void;
    /**
     * 获取巷道宽度
     * @returns 巷道宽度
     */
    getLanewayWidth(): number;
    /**
     * 设置巷道宽度
     * @param value 巷道宽度
     */
    setLanewayWidth(value: number): void;
    /**
     * 获取巷道断面类型
     * @returns 巷道断面类型
     */
    getLanewaySectionStyle(): McTunnelSection;
    /**
     * 设置巷道断面类型
     * @param value 巷道断面类型
     */
    setLanewaySectionStyle(value: McTunnelSection): void;
    /**
     * 获取巷道用途
     * @returns 巷道用途
     */
    getLanewayUse(): McTunnelUse;
    /**
     * 设置巷道用途
     * @param value 巷道用途
     */
    setLanewayUse(value: McTunnelUse): void;
    /**
     * 获取巷道支护类型
     * @returns 巷道支护类型
     */
    getSupportPattern(): McTunnelSupportPattern;
    /**
     * 设置巷道支护类型
     * @param value 巷道支护类型
     */
    setSupportPattern(value: McTunnelSupportPattern): void;
    /**
     * 获取巷道通风方式
     * @returns 巷道通风方式
     */
    getSeriesVentilation(): McSeriesVentilation;
    /**
     * 设置巷道通风方式
     * @param value 巷道通风方式
     */
    setSeriesVentilation(value: McSeriesVentilation): void;
    /**
     * 获取巷道回风类型
     * @returns 巷道回风类型
     */
    getReturnAirType(): McReturnAirType;
    /**
     * 设置巷道回风类型
     * @param value 巷道回风类型
     */
    setReturnAirType(value: McReturnAirType): void;
    /**
     * 获取巷道掘进状态
     * @returns 巷道掘进状态
     */
    getExcavationStatus(): McTunnelExcavationStatus;
    /**
     * 设置巷道掘进状态
     * @param value 巷道掘进状态
     */
    setExcavationStatus(value: McTunnelExcavationStatus): void;
    /**
     * 获取巷道掘进类型
     * @returns 巷道掘进类型
     */
    getExcavationType(): McTunnelExcavationType;
    /**
     * 设置巷道掘进类型
     * @param value 巷道掘进类型
     */
    setExcavationType(value: McTunnelExcavationType): void;
    /**
     * 获取巷道当前掘进进尺
     * @returns 巷道当前掘进进尺
     */
    getCurrentFootage(): number;
    /**
     * 设置巷道当前掘进进尺
     * @param value 巷道当前掘进进尺
     */
    setCurrentFootage(value: number): void;
    /**
     * 获取巷道导线点数据
     * @returns 巷道导线点数据
     */
    getNodes(): McTunnelNodeData[];
    /**
     * 设置巷道导线点数据
     * @param value 巷道导线点数据
     */
    setNodes(value: IMcTunnelNodeData[]): void;
    /**
     * 设置指定索引的巷道导线点数据
     * @param index 导线点索引
     * @param nodeData 导线点数据
     */
    setNode(index: number, nodeData: IMcTunnelNodeData): void;
    /**
     * 获取邻近导线点数据
     * @param index 导线点索引
     * @returns 邻近导线点数据
     */
    getNeighboringNodes(index: number): {
        preNode: McTunnelNodeData | null;
        nextNode: McTunnelNodeData | null;
    };
    /**
     * 获取巷道边线数据
     * @returns 巷道边线数据
     */
    getBorderLines(): McGePoint[][];
    /**
     * 设置巷道边线数据
     * @param value 巷道边线数据
     */
    setBorderLines(value: McGePoint[][]): void;
    /**
     * 获取巷道帮线数据
     * @returns 巷道左邦，右邦，计算数值
     */
    getSideLines(type: PathCalcType): McGePoint[];
    /**
     * 获取巷道帮线数据
     * @returns 相邻导线点之间偏移线段
     */
    getNodeLine(first: McTunnelNodeData, second: McTunnelNodeData, type: PathCalcType): McGePoint[];
    /**
     * 获取巷道是否为竖井
     * @returns 是否竖井
     */
    getIsShaft(): boolean;
    /**
     * 获取巷道位置
     * 默认为中心线中点
     * @returns 巷道位置
     */
    getPosition(): McGeVector3;
    /**
     * 获取巷道样式ID
     * @returns 巷道样式ID
     */
    get tunnelStyle(): string;
    /**
     * 获取巷道样式
     * @returns 巷道样式
     */
    getTunnelStyle(): McDbTunnelStyle;
    /**
     * 设置巷道样式
     * @param styleName 巷道样式名称
     */
    setTunnelStyle(styleName?: string): void;
    /**
     * 获取巷道长度
     * @returns 巷道长度
     */
    getTunnelLength(): number;
    /**
     * 插入导线点
     * @param position 导线点位置
     * @param index 插入索引，默认为巷道尾部
     * @return 是否成功插入导线点
     */
    insertNode(position: McGeVector3, index?: number): boolean;
    /**
     * 添加导线点
     * @param nodeData 导线点数据
     * @param index 插入索引，默认为末尾
     */
    addNode(nodeData: McTunnelNodeData, index?: number): void;
    /**
     * 移除导线点
     * @param index 导线点索引
     */
    removeNode(index: number): void;
    /**
     * 反转导线点顺序
     */
    invertNodes(): void;
    /**
     * 设置立井中所有导线点的x、y坐标
     */
    moveShiftNodes(x: number, y: number): void;
    /**
     * 更新巷道边线数据
     */
    updateBorderLines(): void;
    /**
    * 根据传入的射线，判定是否相交并计算交点坐标和距离，二维场景接口
    * @param {McGeRaycaster} raycaster    拾取器对象
    * @returns {PickResult | null } 返回拾取结果数据
    * @internal
    */
    raycast2D(raycaster: McGeRaycaster): PickResult | null;
    /**
    * 根据传入的射线，判定是否相交并计算交点坐标和距离,三维场景接口
    * @param {McGeRaycaster} raycaster    拾取器对象
    * @returns {PickResult | null } 返回拾取结果数据
    * @internal
    */
    raycast3D(raycaster: McGeRaycaster): PickResult | null;
    /**
     * 实体变换
     */
    transformBy(matrix: McGeMatrix4): boolean;
    /**
     * 重构巷道子实体
     */
    rebuildChildEntity(db: McDbDatabase, recursive?: boolean): void;
    getStretchPoints(): MCEntityStretchPoints[];
    setStretchPoints(indexPoints: MCEntityStretchPoints[]): void;
    getSnapPoints(is2D: boolean): MCEntitySnapPoints[];
    protected createGrips(): void;
    worldDraw2d(engine: McEngine2D): void;
    /**
  * 3d渲染方法
  */
    worldDraw3d(engine: McEngine3D): void;
    /**
     * 根据传入的坐标计算在巷道上的导线点位置相对距离
     * @param {McGeVector3} coord    坐标
     * @return {nodeName:string, dir:string, distance:number ,height:number, leftSpace:number} 导线点名称、方向、与导线点距离、离地高度、与左邦距离
     */
    getTunnelInfoByPoint(coord: McGeVector3): {
        nodeName: string;
        dir: string;
        distance: number;
        height: number;
        leftSpace: number;
    };
    /**
       * 根据传入的参数计算在巷道上的坐标
       * @param {string} nodeName    导线点名称
       * @param {string} dir         方向
       * @param {float} distance     与导线点距离
       * @param {float} height       离地高度
       * @param {float} leftSpace    与左邦距离
       * @return {McGeVector3}    坐标
       */
    getPointOnTunnel(nodeName: string, dir: string, distance: number, height: number, leftSpace: number): McGeVector3;
    /**
  * 获取中心线上距起点指定距离处的坐标点，如果距离大于长度，则取末尾点
  * @param {float} distance 距离
  * @returns {McGeVector3,index} 中心线上投影坐标和索引
  */
    getPointByDistance(distance: number): {
        point: McGeVector3;
        index: number;
    };
    /**
     * 获取指定点在中心线上的投影点
     * @param {McGeVector3} p 原始点坐标
     * @param {boolean} ignoreZ 是否忽略z值,坐标更精准
     * @returns {point, index} 中心线上的坐标点和位置索引
     */
    getClosestPoint(p: McGeVector3 | McGePoint, ignoreZ?: boolean): {
        point: McGeVector3;
        index: number;
    };
    /**
     * 获取与指定点最近的节点索引
     * @param p 指定点坐标
     * @returns 最近的节点索引
     */
    getClosestNode(p: McGeVector3 | McGePoint): number;
    /**
     * 获取指定点位置的巷道宽度
     * @param p 指定点坐标
     * @returns 巷道宽度
     */
    getWidthByPoint(p: McGeVector3): number;
    /**
     * 获取指定点位置的巷道高度
     * @param p 指定点坐标
     * @returns 巷道高度
     */
    getHeightByPoint(p: McGeVector3): number;
    /**
      * 获取指定点在巷道邦线上的投影点
      * @param p 指定点坐标
      * @param isLeft 是否用左邦线
      * @returns 邦线上投影点
      */
    getBorderPoint(p: McGeVector3, isLeft: boolean): McGeVector3;
    /**
     * 获取指定点在巷道上的距离
     * @param p 指定点坐标
     * @returns 距离
     */
    getDistanceByPoint(p: McGeVector3 | McGePoint): number;
    /**
     * 根据起始坐标，截取巷道中心线上的线段
     * @param {McGeVector3} start 起始坐标点
     * @param {McGeVector3} end   结束坐标点
     * @returns McGeVector3[] 坐标数组
     */
    getRangeByCoord(start: McGeVector3, end: McGeVector3): McGeVector3[];
    /**
     * 获取指定点处巷道方向
     * @param p 指定位置
     * @returns 巷道方向
     */
    getDirectByPoint(p: McGeVector3 | McGePoint): McGeVector3;
    /**
     * 计算巷道轴线长度，轴线为导线点连线，位置默认为导线点连线中点
     */
    calculateShaftLength(): void;
    /**
   * 计算中心线坐标
   * （注意这里中心线坐标和导线点是一一对应的，每个导线点对应一个中心线坐标，抽采很多地方依赖这个逻辑不得更改）
   */
    calculateCenterLineAndLength(): void;
    /**
     * 从外部mcd导入到当前样式
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
