import type { TopologyService } from './topologyService';
/**
 * 懒加载拓扑处理服务，避免将 dotnet runtime 打进插件主入口。
 */
export declare function getTopologyService(): Promise<TopologyService>;
