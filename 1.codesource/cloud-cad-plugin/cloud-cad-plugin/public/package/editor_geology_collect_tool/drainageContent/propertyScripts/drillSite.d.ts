import { BasePropertyScript, type GroupPropertyType } from 'McEditor';
import type { McDbDrillSite } from '@/core_geology_collect_tool/mcDrainageBorehole';
/** 钻场属性与几何数据分组；钻场号、所属巷道和几何数据仅在单选时展示。 */
export declare const drillSiteProperties: Map<string, GroupPropertyType<McDbDrillSite>>;
/** 钻场特性面板脚本，负责装配钻场业务属性分组。 */
export declare class DrillSitePropertyScript extends BasePropertyScript<McDbDrillSite> {
    /**
     * 创建钻场特性面板脚本。
     * @param name 实体类型名称。
     * @param entity 当前选中的钻场实体。
     */
    constructor(name: string, entity: McDbDrillSite);
}
