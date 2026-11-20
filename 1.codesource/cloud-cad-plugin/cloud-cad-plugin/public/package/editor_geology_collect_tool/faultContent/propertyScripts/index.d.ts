import { BasePropertyScript } from 'McEditor';
import type { McDbFaultInstance } from '@/utils/pluginApi';
/**
 * 断层属性面板脚本
 * @description 提供断层通用分组：
 * 常规(基类提供)/断层属性；
 * 各建模类型脚本继承此类，并补充自身断层属性
 */
export declare class FaultPropertyScript extends BasePropertyScript<McDbFaultInstance> {
    constructor(name: string, entity: McDbFaultInstance);
    /**
     * 初始化断层属性分组
     */
    initFaultGroup(entity?: McDbFaultInstance): void;
}
