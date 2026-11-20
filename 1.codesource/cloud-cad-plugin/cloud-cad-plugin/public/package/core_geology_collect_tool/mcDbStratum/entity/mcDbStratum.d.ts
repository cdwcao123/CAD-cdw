import { McMcdFiler, McMctfFiler, McDbCustomEntity, McDbDatabase, McEngine3D, McEngine2D, MCEntityStretchPoints, MCEntitySnapPoints, McGeMatrix4, McDbSurface, IMcGeVector4, McGeVector4, McGeVector3, McColor } from 'McCore';
import { McDbIsoGenerateType, McDbIsoLineType, McDbIsoType, McDbTinShowType } from '../types/enum';
import type { IIsoParam, IMcDbStratum, IMcDbStratumVertex } from '../types/interface';
/**
 * 地层实体类
 */
export declare class McDbStratum extends McDbCustomEntity {
    #private;
    protected readonly _type: string;
    protected static readonly _className: string;
    /**
     * @param data 可选的部分数据,传入字段覆盖默认值
     */
    constructor(data?: Partial<IMcDbStratum>);
    rebuildChildEntity(db: McDbDatabase, recursive?: boolean): void;
    /**
     * 设置地层边界
     * @param boundary 地层边界
     */
    setBoundary(boundary: IMcGeVector4[]): void;
    /**
     * 添加地层孔
     * @param hole 地层孔
     */
    addHole(hole: IMcGeVector4[]): void;
    /**
     * 根据顶点信息构建地层内部顶点坐标
     */
    buildCoord(): void;
    _getChildrenSurface(): McDbSurface | undefined;
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
    protected createGrips(): void;
    /** 变换方法 */
    transformBy(matrix: McGeMatrix4): boolean;
    /**
   * 获取唯一标识(ID)
   * @returns 唯一标识(ID)
   */
    getId(): string;
    /**
     * 设置唯一标识(ID)
     * @param value 唯一标识(ID)
     */
    setId(value: string): void;
    /**
     * 获取地层名称
     * @returns 地层名称
     */
    getName(): string;
    /**
     * 设置地层名称
     * @param value 地层名称
     */
    setName(value: string): void;
    /**
     * 获取地层编码
     * @returns 地层编码
     */
    getStratumCode(): string;
    /**
     * 设置地层编码
     * @param value 地层编码
     */
    setStratumCode(value: string): void;
    /**
     * 获取地层类型
     * @returns 地层类型
     */
    getStratumType(): string;
    /**
     * 设置地层类型
     * @param value 地层类型
     */
    setStratumType(value: string): void;
    /**
     * 获取是否标志层(0:否, 1:是)
     * @returns 是否标志层(0:否, 1:是)
     */
    getIsMarkLayer(): number;
    /**
     * 设置是否标志层(0:否, 1:是)
     * @param value 是否标志层(0:否, 1:是)
     */
    setIsMarkLayer(value: number): void;
    /**
     * 获取是否含水层(0:否, 1:是)
     * @returns 是否含水层(0:否, 1:是)
     */
    getIsAquifer(): number;
    /**
     * 设置是否含水层(0:否, 1:是)
     * @param value 是否含水层(0:否, 1:是)
     */
    setIsAquifer(value: number): void;
    /**
     * 获取是否隔水层(0:否, 1:是)
     * @returns 是否隔水层(0:否, 1:是)
     */
    getIsAquiclude(): number;
    /**
     * 设置是否隔水层(0:否, 1:是)
     * @param value 是否隔水层(0:否, 1:是)
     */
    setIsAquiclude(value: number): void;
    /**
     * 获取父级地层
     * @returns 父级地层
     */
    getStratumParentCode(): string;
    /**
     * 设置父级地层
     * @param value 父级地层
     */
    setStratumParentCode(value: string): void;
    /**
     * 获取地层顺序
     * @returns 地层顺序
     */
    getStratumSort(): number;
    /**
     * 设置地层顺序
     * @param value 地层顺序
     */
    setStratumSort(value: number): void;
    /**
     * 获取地层厚度最小值
     * @returns 地层厚度最小值
     */
    getStratumThicknessMin(): number;
    /**
     * 设置地层厚度最小值
     * @param value 地层厚度最小值
     */
    setStratumThicknessMin(value: number): void;
    /**
     * 获取地层厚度最大值
     * @returns 地层厚度最大值
     */
    getStratumThicknessMax(): number;
    /**
     * 设置地层厚度最大值
     * @param value 地层厚度最大值
     */
    setStratumThicknessMax(value: number): void;
    /**
     * 获取地层厚度平均值
     * @returns 地层厚度平均值
     */
    getStratumThicknessAve(): number;
    /**
     * 设置地层厚度平均值
     * @param value 地层厚度平均值
     */
    setStratumThicknessAve(value: number): void;
    /**
     * 获取地层颜色
     * @returns 地层颜色
     */
    getStratumColor(): string;
    /**
     * 设置地层颜色
     * @param value 地层颜色
     */
    setStratumColor(value: string): void;
    /**
     * 获取地层岩性特征
     * @returns 地层岩性特征
     */
    getFormationLithology(): string;
    /**
     * 设置地层岩性特征
     * @param value 地层岩性特征
     */
    setFormationLithology(value: string): void;
    /**
     * 获取物性特征
     * @returns 物性特征
     */
    getPhysicalCharacteristics(): string;
    /**
     * 设置物性特征
     * @param value 物性特征
     */
    setPhysicalCharacteristics(value: string): void;
    /**
     * 获取水文地质特征
     * @returns 水文地质特征
     */
    getHydrogeologicalCharacteristics(): string;
    /**
     * 设置水文地质特征
     * @param value 水文地质特征
     */
    setHydrogeologicalCharacteristics(value: string): void;
    /**
     * 获取工程地质特征
     * @returns 工程地质特征
     */
    getEngineeringGeologicalCharacteristics(): string;
    /**
     * 设置工程地质特征
     * @param value 工程地质特征
     */
    setEngineeringGeologicalCharacteristics(value: string): void;
    /**
     * 获取岩性组合
     * @returns 岩性组合
     */
    getLithology(): string;
    /**
     * 设置岩性组合
     * @param value 岩性组合
     */
    setLithology(value: string): void;
    /**
     * 获取备注
     * @returns 备注
     */
    getRemark(): string;
    /**
     * 设置备注
     * @param value 备注
     */
    setRemark(value: string): void;
    /**
     * 获取地层顶点列表
     * @returns 地层顶点列表
     */
    getVertexes(): IMcDbStratumVertex[];
    getVertex(index: number): IMcDbStratumVertex | undefined;
    /**
     * 设置地层顶点列表
     * @param value 地层顶点列表
     */
    setVertexes(value: IMcDbStratumVertex[]): void;
    /**
     * 添加地层顶点
     * @param value 地层顶点
     */
    addVertex(value: IMcDbStratumVertex): void;
    /**
     * 添加地层点,类型为Custom顶点，id随机生成
     * @param pt 地层顶点坐标
     */
    addPoint(pt: McGeVector4): void;
    /**
     * 删除地层顶点
     * @param value 地层顶点
     */
    deleteVertex(index: number): boolean;
    /**修改顶点信息
     * @param value 地层顶点
     */
    setVertex(index: number, value: IMcDbStratumVertex): boolean;
    /**
     * 设置地层顶点坐标
     * @param index 顶点索引
     * @param x x坐标
     * @param y Y坐标
     * @param zTop Z坐标
     * @param zBottom Z坐标
     */
    setVertexPoint(index: number, x: number, y: number, zTop?: number, zBottom?: number): boolean;
    /**
     * 获取地层坐标,为有两个元素的数组,第一个元素为边界坐标，边界可以有多个，第一个为外边界，其余为孔洞,第二个元素为内部点坐标
     * @returns 地层坐标
     */
    getCoord(): any[];
    /**
     * 设置地层坐标,为有两个元素的数组,第一个元素为边界坐标，边界可以有多个，第一个为外边界，其余为孔洞,第二个元素为内部点坐标
     * @param value 地层坐标
     */
    setCoord(value: any[]): void;
    /**
     * 获取三角网剖分的约束线（等值线），约束边不会被三角网跨越
     * @returns 约束线列表
     */
    getConstraints(): McGeVector3[][];
    /**
     * 设置三角网剖分的约束线（等值线），约束边不会被三角网跨越
     * @param value 约束线列表
     */
    setConstraints(value: McGeVector3[][]): void;
    /**
     * 获取2D视口中是否显示网格线框
     * @returns 是否显示网格线框
     */
    getIsShowWireFrame2D(): boolean;
    /**
     * 设置2D视口中是否显示网格线框
     * @param value 是否显示网格线框
     */
    setIsShowWireFrame2D(value: boolean): void;
    /**
     * 获取3D视口中是否显示网格线框
     * @returns 是否显示网格线框
     */
    getIsShowWireFrame3D(): boolean;
    /**
     * 设置3D视口中是否显示网格线框
     * @param value 是否显示网格线框
     */
    setIsShowWireFrame3D(value: boolean): void;
    /**
     * 获取3D视口中是否显示网格线
     * @returns 是否显示网格线
     */
    getIsShowMesh3D(): boolean;
    /**
     * 设置3D视口中是否显示网格线
     * @param value 是否显示网格线
     */
    setIsShowMesh3D(value: boolean): void;
    /**
     * 获取显示的三角网网格线的类别 顶板还是底板
     * @returns 显示的三角网网格线的类别 顶板还是底板
     */
    getTinShowType2D(): McDbTinShowType;
    /**
     * 设置显示的三角网网格线的类别 顶板还是底板
     * @param value 显示的三角网网格线的类别 顶板还是底板
     */
    setTinShowType2D(value: McDbTinShowType): void;
    /**
     * 获取是否显示等值线
     * @returns 是否显示等值线
     */
    getIsShowIso(): boolean;
    /**
     * 设置是否显示等值线
     * @param value 是否显示等值线
     */
    setIsShowIso(value: boolean): void;
    /**
     * 获取等值线类型
     * @returns 等值线类型
     */
    getIsoType(): McDbIsoType;
    /**
     * 设置等值线类型
     * @param value 等值线类型
     */
    setIsoType(value: McDbIsoType): void;
    /**
     * 获取等值线参数
     * @returns 等值线参数
     */
    getIsoParam(): IIsoParam;
    /**
     * 设置等值线参数
     * @param value 等值线参数
     */
    setIsoParam(value: IIsoParam): void;
    /**
     * 获取等值线线型
     * @returns 等值线线型
     */
    getIsoLineType(): McDbIsoLineType;
    /**
     * 设置等值线线型
     * @param value 等值线线型
     */
    setIsoLineType(value: McDbIsoLineType): void;
    /**
     * 获取等值线生成方式
     * @returns 等值线生成方式
     */
    getIsoGenerateType(): McDbIsoGenerateType;
    /**
     * 设置等值线生成方式
     * @param value 等值线生成方式
     */
    setIsoGenerateType(value: McDbIsoGenerateType): void;
    /**
     * 获取等值线间距值
     * @returns 等值线间距值
     */
    getIsoInterval(): number | undefined;
    /**
     * 设置等值线间距值
     * @param value 等值线间距值
     */
    setIsoInterval(value: number | undefined): void;
    /**
     * 获取等值线固定值
     * @returns 等值线固定值
     */
    getIsoFixedValues(): number[] | undefined;
    /**
     * 设置等值线固定值
     * @param value 等值线固定值
     */
    setIsoFixedValues(value: number[] | undefined): void;
    /**
     * 获取等值线最小值
     * @returns 等值线最小值
     */
    getIsoMin(): number | undefined;
    /**
     * 设置等值线最小值
     * @param value 等值线最小值
     */
    setIsoMin(value: number | undefined): void;
    /**
     * 获取等值线最大值
     * @returns 等值线最大值
     */
    getIsoMax(): number | undefined;
    /**
     * 设置等值线最大值
     * @param value 等值线最大值
     */
    setIsoMax(value: number | undefined): void;
    /**
     * 获取三角网网格线框颜色
     * @returns 三角网网格线框颜色
     */
    getWireFrameColor(): McColor;
    /**
     * 设置三角网网格线框颜色
     * @param value 三角网网格线框颜色
     */
    setWireFrameColor(value: McColor): void;
    /**
     * 获取三角网面颜色
     * @returns 三角网面颜色
     */
    getMeshColor(): McColor;
    /**
     * 设置三角网面颜色
     * @param value 三角网面颜色
     */
    setMeshColor(value: McColor): void;
    /**
     * 获取等值线颜色
     * @returns 等值线颜色
     */
    getIsoColor(): McColor;
    /**
     * 设置等值线颜色
     * @param value 等值线颜色
     */
    setIsoColor(value: McColor): void;
    /**
     * 从 mctf 数据源读取字段值到当前对象
     * @param fields mctf 数据源
     */
    mctfInFields(fields: McMctfFiler): void;
    /**
     * 将当前对象的字段值写入 mctf 数据源
     * @param fields mctf 数据源
     */
    mctfOutFields(fields: McMctfFiler): void;
    /**
     * 从 mcd 数据流按顺序读取字段值到当前对象
     * @param fields mcd 数据流
     */
    mcdInFields(fields: McMcdFiler): void;
    /**
     * 将当前对象的字段值按顺序写入 mcd 数据流
     * @param fields mcd 数据流
     */
    mcdOutFields(fields: McMcdFiler): void;
}
