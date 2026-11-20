import { McDbCustomEntity, McDbDatabase, McEngine2D, McEngine3D, MCEntitySnapPoints, MCEntityStretchPoints, McGeMatrix4, McGeVector3, McMcdFiler, McMctfFiler, McMenuGroup } from 'McCore';
import { McCoalType, McGasSource, McWorkFaceType } from '../types/enum';
/**
 *  抽采评价单元类
 */
export declare class McDbGasArea extends McDbCustomEntity {
    #private;
    protected readonly _type: string;
    protected static readonly _className: string;
    constructor(name: string, workFaceType: McWorkFaceType, gasType: McGasSource, coalType: McCoalType, coords: McGeVector3[]);
    /**
     * 获取评价单元名称
     */
    getName(): string;
    /**
     * 设置评价单元名称
     */
    setName(name: string): void;
    /**
     * 获取瓦斯涌出来源
     */
    getGasType(): string;
    /**
     * 获取所属工作面类型
     */
    getWorkFaceType(): string;
    /**
     * 获取所属工作面编码
     */
    getWorkFaceCode(): string;
    /**
     * 设置所属工作面编码
     */
    setWorkFaceCode(code: string): void;
    /**
     * 获取煤种类
     */
    getCoalType(): McCoalType;
    /**
     * 设置煤种类
     */
    setCoalType(type: McCoalType): void;
    /**
       * 获取达标瓦斯压力
       */
    getGasPressure(): number;
    /**
     * 设置达标瓦斯压力
     */
    setGasPressure(pressure: number): void;
    /**
       * 获取达标瓦斯含量
       */
    getGasContentRate(): number;
    /**
     * 设置达标瓦斯含量
     */
    setGasContentRate(rate: number): void;
    /**
     * 获取工作面日产量
     */
    getWorkFaceDayOutput(): string;
    /**
     * 设置工作面日产量
     */
    setWorkFaceDayOutput(output: string): void;
    /**
     * 获取抽采半径
     */
    getRange(): number;
    /**
     * 设置抽采半径
     */
    setRange(range: number): void;
    /**
     * 获取初始抽采量
     */
    getStartReserve(): number;
    /**
     * 设置初始抽采量
     */
    setStartReserve(reserve: number): void;
    /**
     * 获取抽采开始时间
     */
    getStartTime(): string;
    /**
     * 设置抽采开始时间
     */
    setStartTime(time: string): void;
    /**
     * 获取高度
     */
    getHeight(): number;
    /**
     * 设置高度
     */
    setHeight(height: number): void;
    /**
     * 获取面积
     */
    getArea(): number;
    /**
     * 设置面积
     */
    setArea(area: number): void;
    /**
     * 获取走向方向高度h1
     */
    getHeadH1(): number;
    /**
     * 设置走向方向高度h1
     */
    setHeadH1(height1: number): void;
    /**
     * 获取走向方向高度h2
     */
    getHeadH2(): number;
    /**
     * 设置走向方向高度h2
     */
    setHeadH2(height2: number): void;
    /**
     * 设置倾向方向高度h1
     */
    setTiltH1(height1: number): void;
    /**
     * 获取倾向方向高度h1
     */
    getTiltH1(): number;
    /**
     * 设置倾向方向高度h2
     */
    setTiltH2(height2: number): void;
    /**
     * 获取倾向方向高度h2
     */
    getTiltH2(): number;
    /**
     * 设置走向方向高度h1等值宽度
     */
    setHeadH1Width(width: number): void;
    /**
     * 获取走向方向高度h1等值宽度
     */
    getHeadH1Width(): number;
    /**
     * 设置走向方向高度h2等值宽度
     */
    setHeadH2Width(width: number): void;
    /**
     * 获取走向方向高度h2等值宽度
     */
    getHeadH2Width(): number;
    /**
     * 设置倾向方向高度h1等值宽度
     */
    setTiltH1Width(width: number): void;
    /**
     * 获取倾向方向高度h1等值宽度
     */
    getTiltH1Width(): number;
    /**
     * 设置倾向方向高度h2等值宽度
     */
    setTiltH2Width(width: number): void;
    /**
     * 获取倾向方向高度h2等值宽度
     */
    getTiltH2Width(): number;
    /**
     * 设置煤量
     */
    setCoalReserve(reserve: number): void;
    /**
     * 获取煤量
     */
    getCoalReserve(): number;
    /**
     * 设置瓦斯涌出量
     */
    setGasReserve(reserve: number): void;
    /**
     * 获取瓦斯涌出量
     */
    getGasReserve(): number;
    /**
     * 设置测量因子
     */
    setMeasureFactor(factor: number): void;
    /**
     * 获取测量因子
     */
    getMeasureFactor(): number;
    /**
     * 获取坐标点数组
     */
    getCoords(): McGeVector3[];
    /**
     * 设置指定索引位置的坐标
     */
    setCoord(index: number, coord: McGeVector3): void;
    /**
   * 获取关联的钻孔id列表
   */
    getDrillIDs(): string[];
    /**
     * 设置关联的钻孔id列表
     */
    setDrillIDs(drillIDs: string[]): void;
    /**
       * 获取中心点坐标
       */
    getCenterCoord(): McGeVector3;
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
   * 实体上下文菜单事件
   * @returns McMenuGroup|null 菜单列表，返回null则不显示菜单
   */
    onContextMenu(defaultMenus: string[]): McMenuGroup | null;
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
}
