import { GsPipelineSection, McDbPolyLine3d, McEngine3D, McGePoint, McGeVector3 } from 'McCore';
/**
 * 地质模型管线类
 * @description 通用类，给外部使用的地质模型管线类提供实现
 */
export declare class McDbGeoPipeLine extends McDbPolyLine3d {
    #private;
    protected readonly _type: string;
    protected static readonly _className: string;
    /**
     * 获取管线截面类型
     * @returns 管线截面类型
     */
    getPipeLineSection(): GsPipelineSection;
    /**
     * 设置管线截面类型
     * @param value 管线截面类型
     */
    setPipeLineSection(value: GsPipelineSection): void;
    /**
     * 获取管线直径
     * @returns 管线直径
     */
    getPipeDiameter(): number;
    /**
     * 设置管线直径
     * @param value 管线直径
     */
    setPipeDiameter(value: number): void;
    /**
     * 构造函数
     * @description 初始化管线截面类型为圆形，管线直径为1
     * @param vts 管线顶点数组，可选参数，默认为空数组
     */
    constructor(vts?: McGeVector3[] | McGePoint[]);
    /**
     * 3d渲染方法
     */
    worldDraw3d(engine: McEngine3D): void;
}
