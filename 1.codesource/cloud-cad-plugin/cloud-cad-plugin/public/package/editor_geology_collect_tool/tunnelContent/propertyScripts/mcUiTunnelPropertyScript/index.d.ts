import { BasePropertyScript } from 'McEditor';
import type { McDbTunnelInstance } from '@/utils/pluginApi';
export declare class TunnelPropertyScript extends BasePropertyScript<McDbTunnelInstance> {
    constructor(name: string, entity: McDbTunnelInstance);
    /**
     * 初始化巷道分组
     */
    private initTunnelGroup;
}
export default TunnelPropertyScript;
