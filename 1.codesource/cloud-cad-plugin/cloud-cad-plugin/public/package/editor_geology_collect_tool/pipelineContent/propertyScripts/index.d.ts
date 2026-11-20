import { BasePropertyScript } from 'McEditor';
import type { McDbPipelineInstance } from '@/utils/pluginApi';
/**
 * 管线属性面板脚本
 * @description 提供管线通用分组：
 * 常规(基类提供)/管线属性；
 * 各建模类型脚本继承此类，并补充自身管线属性
 */
export declare class PipelinePropertyScript extends BasePropertyScript<McDbPipelineInstance> {
    constructor(name: string, entity: McDbPipelineInstance);
    /**
     * 初始化管线属性分组
     */
    initPipelineGroup(entity?: McDbPipelineInstance): void;
}
