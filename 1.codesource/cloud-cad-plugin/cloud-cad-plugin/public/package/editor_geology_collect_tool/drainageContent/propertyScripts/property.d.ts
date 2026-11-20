import { type GroupPropertyType } from 'McEditor';
import type { McDbDrainageBorehole, McDbDrillSite } from '@/core_geology_collect_tool/mcDrainageBorehole';
/** 钻场单体标识与公共属性分组；单体字段仅在选中一个钻场时展示。 */
export declare const drillSiteProperties: Map<string, GroupPropertyType<McDbDrillSite>>;
/** 抽采钻孔的单体标识、公共属性及几何信息；多选时只展示公共属性。 */
export declare const boreholeProperties: Map<string, GroupPropertyType<McDbDrainageBorehole>>;
