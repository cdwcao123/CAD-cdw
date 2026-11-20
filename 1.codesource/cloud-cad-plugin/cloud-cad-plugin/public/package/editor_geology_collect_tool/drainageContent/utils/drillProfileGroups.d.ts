import type { DrainageBoreholeCategory, DrainageDrillValueMode } from '../types/type';
import type { McDbDrainageBorehole } from '@/core_geology_collect_tool/mcDrainageBorehole';
import type { McCore } from 'McCore';
/**
 * 从当前选择中提取指定参数类型的钻孔，预览、导出及插入共用同一集合。
 * @param core 当前图纸内核，尚未就绪时不返回钻孔。
 * @param entityIds 分组或框选得到的实体 ID，不扩充同组其他孔。
 * @param mode 设计或实际类型，以实体标记判断，不依赖孔号后缀。
 * @param category 菜单限定孔型，省略时仅筛选设计或实际标记。
 * @returns 去重后的有效钻孔 ID；当前类型没有钻孔时为空，不回退到另一类型。
 */
export declare function filterDrillProfileIds(core: McCore | null | undefined, entityIds: string[], mode: DrainageDrillValueMode, category?: DrainageBoreholeCategory): string[];
/**
 * 按“组号-序号”的孔号前缀读取剖面图组号，选择树与 Core 入参共用此规则。
 * @param drill 真实钻孔实体；实际孔的 _fy 后缀不属于组号。
 * @returns 第一个分隔符之前的孔号前缀；没有组号前缀时返回“未分组”，不使用施工班组。
 */
export declare function resolveDrillProfileGroup(drill: Pick<McDbDrainageBorehole, 'getDrillID'>): string;
/**
 * 读取定向钻剖面图的单孔孔号，仅移除实际孔末尾的 _fy 后缀，使同孔号的设计与实际孔归入同一单孔节点。
 * @param drill 真实定向钻孔实体。
 * @returns 移除 _fy 后的完整孔号；未设置孔号时返回空字符串。
 */
export declare function resolveDirectionalDrillCode(drill: Pick<McDbDrainageBorehole, 'getDrillID'>): string;
/**
 * 将同孔号的定向设计孔、反演实际孔归入设计孔所属巷道，供单孔剖面选择树使用。
 * @param drill 当前有效定向钻孔，设计或实际属性由 getIsDesign 返回。
 * @param drillsById 当前图纸有效定向钻孔的实体 ID 索引。
 * @returns 配对设计孔的巷道 ID；没有配对设计孔时使用自身巷道，空字符串表示未关联。
 */
export declare function resolveDirectionalProfileTunnelId(drill: McDbDrainageBorehole, drillsById: ReadonlyMap<string, McDbDrainageBorehole>): string;
