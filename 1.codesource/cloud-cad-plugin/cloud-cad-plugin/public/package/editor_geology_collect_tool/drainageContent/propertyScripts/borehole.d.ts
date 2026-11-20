import { BasePropertyScript, type GroupPropertyType } from 'McEditor';
import type { McDbDrainageBorehole } from '@/core_geology_collect_tool/mcDrainageBorehole';
/** 抽采钻孔的属性及几何数据；孔号、开孔位置和几何数据仅在单选时展示。 */
export declare const boreholeProperties: Map<string, GroupPropertyType<McDbDrainageBorehole>>;
/** 抽采钻孔特性面板脚本，负责装配钻孔业务属性分组。 */
export declare class DrainageBoreholePropertyScript extends BasePropertyScript<McDbDrainageBorehole> {
    /**
     * 创建抽采钻孔特性面板脚本。
     * @param name 实体类型名称。
     * @param entity 当前选中的抽采钻孔实体。
     */
    constructor(name: string, entity: McDbDrainageBorehole);
}
