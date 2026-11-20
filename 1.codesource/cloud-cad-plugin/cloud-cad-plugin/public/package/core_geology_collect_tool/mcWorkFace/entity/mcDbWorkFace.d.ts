import { IMcGeVector4, McColor, McDbCustomEntity, McDbDatabase, McEngine3D, MCEntitySnapPoints, MCEntityStretchPoints, McGeMatrix4, McGeVector3, McMcdFiler, McMctfFiler, McTransparency } from 'McCore';
import { McSeriesVentilation } from '@/core_geology_collect_tool/mcTunnel';
import { McDbWorkFaceStatus, McWorkFaceVentilationType } from '../types/enum';
import { IMcWorkFaceFootageInfo, McWorkFaceData, McWorkFaceFootageInfo } from '../types/interface';
/**
 * 工作面实体类
 */
export declare class McDbWorkFace extends McDbCustomEntity {
    /**对象类型*/
    protected readonly _type: string;
    /**实体类名 */
    protected static readonly _className: string;
    /** 工作面名称 */
    protected name: string;
    /** 矿井名称 */
    protected miningName: string;
    /** 矿井编码 */
    protected mineCode: string;
    /** 采区名称 */
    protected miningAreaName: string;
    /** 水平名称 */
    protected horizontalName: string;
    /** 开采水平 */
    protected horizontalCode: string;
    /** 采区编码 */
    protected miningAreaCode: string;
    /** 区段编码 */
    protected regionCode: string;
    /** 区段名称 */
    protected regionName: string;
    /** 采煤工艺 */
    protected craft: string;
    /** 煤层 */
    protected coalSeamCode: string;
    /** 连续工作面 */
    protected continueWorkFace: string;
    /** 状态 */
    protected status: McDbWorkFaceStatus;
    /** 采高 */
    protected miningHeight: number;
    /** 单刀进尺 */
    protected singleKnifeFootage: number;
    /** 支架间距 */
    protected singleFrameFootage: number;
    /** 底板标高 */
    protected floorElevation: number;
    /** 倾向长度 */
    protected inclinationLength: number;
    /** 走向长度 */
    protected strikeLength: number;
    /** 采深上限 */
    protected topDepth: number;
    /** 采深下限 */
    protected bottomDepth: number;
    /** 特殊开采 */
    protected specialMining: string;
    /** 煤厚 */
    protected coalSeamThickness: number;
    /** 开采储量 */
    protected availableReserves: number;
    /** 切眼 */
    protected cutTunnel: string;
    /** 进风巷 */
    protected inletAirway: string;
    /** 回风巷 */
    protected returnAirway: string;
    /** 工作面通风类型 */
    protected ventilationType: McWorkFaceVentilationType;
    /** 系列通风 */
    protected seriesVentilation: McSeriesVentilation;
    /** 回风巷长度是否大于1km */
    protected returnAirwayLengthGreaterThan1km: boolean;
    /** 回风巷数量 */
    protected returnAirwayCount: number;
    /** 易燃自燃煤层 */
    protected flammableCoalSeam: boolean;
    /** 地温高工作面 */
    protected highTemperatureWorkingFace: boolean;
    /** 累计进尺长度 */
    protected accumulatedFootage: number;
    /** 起采线颜色 */
    protected footageStartLineColor: McColor;
    /** 终采线颜色 */
    protected footageEndLineColor: McColor;
    /** 停采线颜色 */
    protected footageStopLineColor: McColor;
    /** 采空区颜色 */
    protected goafColor: McColor;
    /** 工作面名称颜色 */
    protected nameColor: McColor;
    /** 工作面网格数据颜色 */
    protected gridColor: McColor;
    /** 显示起采线 */
    protected showFootageStartLine: boolean;
    /** 显示终采线 */
    protected showFootageEndLine: boolean;
    /** 显示工作面名称 */
    protected showName: boolean;
    /** 显示工作面网格数据 */
    protected showGrid: boolean;
    /** 显示采空区 */
    protected showGoaf: boolean;
    /** 采空区透明度 */
    protected goafAlpha: McTransparency;
    /** 网格的半径 */
    protected gridRadius: number;
    /** 回采左侧线 */
    protected footageLeftLine: IMcGeVector4[];
    /** 回采右侧线 */
    protected footageRightLine: IMcGeVector4[];
    /** 工作面网格坐标 */
    protected gridCoordinate: IMcGeVector4[][];
    /** 边界坐标 */
    protected borderArray: IMcGeVector4[][];
    /** 回采信息 */
    protected footageInfo: McWorkFaceFootageInfo[];
    protected centerPosition: McGeVector3;
    constructor(data: McWorkFaceData);
    /** 获取工作面名称 */
    getName(): string;
    /** 设置工作面名称 */
    setName(value: string): void;
    /** 获取工作面编码 */
    getFaceCode(): string;
    /** 设置工作面编码 */
    setFaceCode(value: string): void;
    /** 获取矿井名称 */
    getMiningName(): string;
    /** 设置矿井名称 */
    setMiningName(value: string): void;
    /** 获取矿井编码 */
    getMineCode(): string;
    /** 设置矿井编码 */
    setMineCode(value: string): void;
    /** 获取采区名称 */
    getMiningAreaName(): string;
    /** 设置采区名称 */
    setMiningAreaName(value: string): void;
    /** 获取水平名称 */
    getHorizontalName(): string;
    /** 设置水平名称 */
    setHorizontalName(value: string): void;
    /** 获取开采水平 */
    getHorizontalCode(): string;
    /** 设置开采水平 */
    setHorizontalCode(value: string): void;
    /** 获取采区编码 */
    getMiningAreaCode(): string;
    /** 设置采区编码 */
    setMiningAreaCode(value: string): void;
    /** 获取区段编码 */
    getRegionCode(): string;
    /** 设置区段编码 */
    setRegionCode(value: string): void;
    /** 获取区段名称 */
    getRegionName(): string;
    /** 设置区段名称 */
    setRegionName(value: string): void;
    /** 获取采煤工艺 */
    getCraft(): string;
    /** 设置采煤工艺 */
    setCraft(value: string): void;
    /** 获取煤层 */
    getCoalSeamCode(): string;
    /** 设置煤层 */
    setCoalSeamCode(value: string): void;
    /** 获取连续工作面 */
    getContinueWorkFace(): string;
    /** 设置连续工作面 */
    setContinueWorkFace(value: string): void;
    /** 获取状态 */
    getStatus(): McDbWorkFaceStatus;
    /** 设置状态 */
    setStatus(value: McDbWorkFaceStatus): void;
    /** 获取采高 */
    getMiningHeight(): number;
    /** 设置采高 */
    setMiningHeight(value: number): void;
    /** 获取单刀进尺 */
    getSingleKnifeFootage(): number;
    /** 设置单刀进尺 */
    setSingleKnifeFootage(value: number): void;
    /** 获取支架间距 */
    getSingleFrameFootage(): number;
    /** 设置支架间距 */
    setSingleFrameFootage(value: number): void;
    /** 获取底板标高 */
    getFloorElevation(): number;
    /** 设置底板标高 */
    setFloorElevation(value: number): void;
    /** 获取倾向长度 */
    getInclinationLength(): number;
    /** 设置倾向长度 */
    setInclinationLength(value: number): void;
    /** 获取走向长度 */
    getStrikeLength(): number;
    /** 设置走向长度 */
    setStrikeLength(value: number): void;
    /** 获取采深上限 */
    getTopDepth(): number;
    /** 设置采深上限 */
    setTopDepth(value: number): void;
    /** 获取采深下限 */
    getBottomDepth(): number;
    /** 设置采深下限 */
    setBottomDepth(value: number): void;
    /** 获取特殊开采 */
    getSpecialMining(): string;
    /** 设置特殊开采 */
    setSpecialMining(value: string): void;
    /** 获取煤厚 */
    getCoalSeamThickness(): number;
    /** 设置煤厚 */
    setCoalSeamThickness(value: number): void;
    /** 获取开采储量 */
    getAvailableReserves(): number;
    /** 设置开采储量 */
    setAvailableReserves(value: number): void;
    /** 获取切眼 */
    getCutTunnel(): string;
    /** 设置切眼 */
    setCutTunnel(value: string): void;
    /** 获取进风巷 */
    getInletAirway(): string;
    /** 设置进风巷 */
    setInletAirway(value: string): void;
    /** 获取回风巷 */
    getReturnAirway(): string;
    /** 设置回风巷 */
    setReturnAirway(value: string): void;
    /** 获取通风类型 */
    getVentilationType(): McWorkFaceVentilationType;
    /** 设置通风类型 */
    setVentilationType(value: McWorkFaceVentilationType): void;
    /** 获取系列通风 */
    getSeriesVentilation(): McSeriesVentilation;
    /** 设置系列通风 */
    setSeriesVentilation(value: McSeriesVentilation): void;
    /** 获取回风巷长度是否大于1km */
    getReturnAirwayLengthGreaterThan1km(): boolean;
    /** 设置回风巷长度是否大于1km */
    setReturnAirwayLengthGreaterThan1km(value: boolean): void;
    /** 获取回风巷数量 */
    getReturnAirwayCount(): number;
    /** 设置回风巷数量 */
    setReturnAirwayCount(value: number): void;
    /** 获取可燃煤层 */
    getFlammableCoalSeam(): boolean;
    /** 设置可燃煤层 */
    setFlammableCoalSeam(value: boolean): void;
    /** 获取高温工作面 */
    getHighTemperatureWorkingFace(): boolean;
    /** 设置高温工作面 */
    setHighTemperatureWorkingFace(value: boolean): void;
    /** 获取累计进尺 */
    getAccumulatedFootage(): number;
    /** 设置累计进尺 */
    setAccumulatedFootage(value: number): void;
    /** 获取回采左侧线 */
    getFootageLeftLine(): IMcGeVector4[];
    /** 设置回采左侧线 */
    setFootageLeftLine(value: IMcGeVector4[]): void;
    /** 获取回采右侧线 */
    getFootageRightLine(): IMcGeVector4[];
    /** 设置回采右侧线 */
    setFootageRightLine(value: IMcGeVector4[]): void;
    /** 获取工作面网格坐标 */
    getGridCoordinate(): IMcGeVector4[][];
    /** 设置工作面网格坐标 */
    setGridCoordinate(value: IMcGeVector4[][]): void;
    /** 获取边界坐标 */
    getBorderArray(): IMcGeVector4[][];
    /** 设置边界坐标 */
    setBorderArray(value: IMcGeVector4[][]): void;
    /** 获取回采信息 */
    getFootageInfo(): IMcWorkFaceFootageInfo[];
    /** 设置回采信息 */
    setFootageInfo(value: IMcWorkFaceFootageInfo[]): void;
    /** 获取工作面底面中心点坐标 */
    getCenterPosition(): McGeVector3;
    /** 起采线颜色 */
    getFootageStartLineColor(): McColor;
    /** 设置起采线颜色 */
    setFootageStartLineColor(value: McColor): void;
    /** 停采线颜色 */
    getFootageEndLineColor(): McColor;
    /** 设置停采线颜色 */
    setFootageEndLineColor(value: McColor): void;
    /** 终采线颜色 */
    getFootageStopLineColor(): McColor;
    /** 设置终采线颜色 */
    setFootageStopLineColor(value: McColor): void;
    /** 工作面名称颜色 */
    getNameColor(): McColor;
    /** 设置工作面名称颜色 */
    setNameColor(value: McColor): void;
    /** 采空区颜色 */
    getGoafColor(): McColor;
    /** 设置采空区颜色 */
    setGoafColor(value: McColor): void;
    /** 工作面网格数据颜色 */
    getGridColor(): McColor;
    /** 设置工作面网格数据颜色 */
    setGridColor(value: McColor): void;
    /**
     * 获取是否显示起采线
     */
    getShowFootageStartLine(): boolean;
    /**
     * 设置是否显示起采线
     */
    setShowFootageStartLine(value: boolean): void;
    /** 获取是否显示终采线 */
    getShowFootageEndLine(): boolean;
    /** 设置是否显示终采线 */
    setShowFootageEndLine(value: boolean): void;
    /** 获取是否显示工作面名称 */
    getShowName(): boolean;
    /** 设置是否显示工作面名称 */
    setShowName(value: boolean): void;
    /** 获取是否显示工作面网格数据 */
    getShowGrid(): boolean;
    /** 设置是否显示工作面网格数据 */
    setShowGrid(value: boolean): void;
    /** 获取是否显示采空区 */
    getShowGoaf(): boolean;
    /** 设置是否显示采空区 */
    setShowGoaf(value: boolean): void;
    /** 获取采空区透明度 */
    getGoafAlpha(): McTransparency;
    /**
     * 获取 采空区透明度（0-100），自动处理随层或随块
     */
    getRealGoafAlpha(): number;
    /**
     * 获取 与threejs 规则相同的 采空区透明度（0-1），自动处理随层或随块
     * @returns 采空区透明度（0-1）
     */
    getRealGoafAlphaThree(): number;
    /** 设置采空区透明度 */
    setGoafAlpha(value: number): void;
    /** 获取网格的半径 */
    getGridRadius(): number;
    /** 设置网格的半径 */
    setGridRadius(value: number): void;
    private calCenterPosition;
    /**
     * 计算在边线指定距离的坐标
     */
    private getPointByDistance;
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
    /**
      * 3d渲染方法
      */
    worldDraw3d(engine: McEngine3D): void;
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
