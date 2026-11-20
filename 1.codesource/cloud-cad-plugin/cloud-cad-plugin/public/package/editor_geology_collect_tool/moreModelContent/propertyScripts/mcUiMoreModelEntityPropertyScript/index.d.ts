import { BasePropertyScript } from 'McEditor';
import type { McDbGeoModelInstance } from '@/utils/pluginApi';
export declare class MoreModelEntityPropertyScript extends BasePropertyScript<McDbGeoModelInstance> {
    private registerGroupTree;
    constructor(name: string, entity: McDbGeoModelInstance);
    /**
     * 地质模型实体实例级补丁（遵循 lessons learned：isA 与 name 必须 patch 才能让 UI 正确识别业务类型）
     */
    static ensureEntityInstancePatches: (entity: McDbGeoModelInstance) => void;
    /**
     * 初始化动态分组：直接读取缓存静态配置注入
     */
    initDynamicGroup: (entity: McDbGeoModelInstance, modelId: string) => void;
}
export default MoreModelEntityPropertyScript;
