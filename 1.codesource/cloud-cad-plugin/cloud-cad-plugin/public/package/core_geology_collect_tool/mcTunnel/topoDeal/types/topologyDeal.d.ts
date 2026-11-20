/** 拓扑处理的返回结果 */
export interface TopoDealResult {
    success: boolean;
    errorMessage?: string;
    bordersJson?: Record<string, string>;
}
/** 处理类型枚举 */
export declare enum DealType {
    Add = 1,
    Delete = 2,
    Modify = 3
}
/** 点格式类型 */
export declare enum PointFormat {
    Object = 1,
    Array = 2
}
/** TopoDealWasmExports 导出接口 */
export interface TopoDealWasmExports {
    dealTopoAll: (lwArrJson: string, nResPointType: number) => string;
    dealOne: (originalLwArrJson: string, lwJson: string, dealType: number, nResPointType: number) => string;
}
/** CTopoDeal 命名空间导出 */
export interface CTopoDealNamespace {
    CTopoDeal: TopoDealWasmExports;
}
/** 顶层导出类型（根据你的实际程序集结构调整） */
export interface TopoAssemblyExports {
    LanewayTopoAutoDeal: CTopoDealNamespace;
}
