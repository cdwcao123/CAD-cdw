import { McDbTunnel } from '../../entity/mcDbTunnel.js';
import { DealType, PointFormat, TopoDealResult } from '../types/topologyDeal.js';
export interface WasmExports {
    dealTopoAll: (lwArrJson: string, nResPointType: number) => string;
    dealOne: (originalLwArrJson: string, lwJson: string, dealType: number, nResPointType: number) => string;
}
/**
 * 巷道拓扑处理服务（使用泛型 WasmLoader）
 */
export declare class TopologyService {
    private static instances;
    private exports;
    private constructor();
    static getInstance(): TopologyService;
    /**
     * 获取 Blazor _framework 资源根路径。
     */
    private getBlazorFrameworkBaseUrl;
    /**
     * 初始化服务
     */
    initialize(): Promise<void>;
    isInitialized(): boolean;
    /**
     * 方式三：通过缓存的导出调用（推荐）
     */
    dealTopoAll(tunnels: McDbTunnel[], pointFormat?: PointFormat): Promise<TopoDealResult>;
    /**
     * 处理单条巷道变化
     */
    dealOne(originalTunnels: McDbTunnel[], changedTunnel: McDbTunnel, dealType: DealType, pointFormat?: PointFormat): Promise<TopoDealResult>;
    /**
     * 解析边界 JSON 字符串
     */
    parseBorders<T = [number, number]>(bordersJson: string): T[][];
    /**
     * 解析所有边界
     */
    parseAllBorders<T = [number, number]>(result: TopoDealResult): Record<string, T[][]>;
}
