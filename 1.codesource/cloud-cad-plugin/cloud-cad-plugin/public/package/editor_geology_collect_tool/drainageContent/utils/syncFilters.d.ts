import type { DrainageSyncFilterControl, DrainageSyncFilterData, DrainageSyncFilterIndex, DrainageSyncFilters, DrainageSyncGroup, DrainageSyncRow } from '../types/interface';
import type { DrainageSyncCategory, DrainageSyncFilterKey } from '../types/type';
/**
 * 创建默认的全部范围筛选。
 * @returns 没有筛选限制的新对象。
 */
export declare function createEmptySyncFilters(): DrainageSyncFilters;
/**
 * 合并同步行内所有本地实体的业务关联，设计孔与反演孔共用同一筛选行。
 * @param row 完整本地行或带本地关联的冲突行。
 * @param index 当前图纸的关联索引；尚未就绪时缺省。
 * @returns 各维度去重后的归属，无关联的维度为空数组。
 */
export declare function getSyncRowFilterData(row: DrainageSyncRow, index?: DrainageSyncFilterIndex): DrainageSyncFilterData;
/**
 * 检查同步行是否同时满足已选筛选条件。
 * @param row 待判断的本地或冲突行。
 * @param filters 当前条件；空字符串不限，__unassociated__ 匹配无关联的数据。
 * @param index 当前图纸的关联索引。
 * @returns 所有非空条件均满足时为 true。
 */
export declare function matchesSyncFilters(row: DrainageSyncRow, filters: DrainageSyncFilters, index?: DrainageSyncFilterIndex): boolean;
/**
 * 在同步关系已经完整分类后筛选本地及冲突分组，服务器列表保留完整数据。
 * @param groups 未筛选的四个同步分组。
 * @param filters 当前本地筛选条件。
 * @param index 当前图纸关联索引。
 * @returns 独立的展示分组，不修改原始行及同步分类。
 */
export declare function filterSyncGroups(groups: DrainageSyncGroup[], filters: DrainageSyncFilters, index?: DrainageSyncFilterIndex): DrainageSyncGroup[];
/**
 * 按当前大类型的筛选顺序生成联动选项，钻孔依次为类型、钻场、巷道、工作面、评价单元。
 * @param category 当前同步大类型。
 * @param rows 当前类别完整本地行。
 * @param filters 当前筛选条件。
 * @param index 当前图纸关联索引。
 * @returns 当前类别支持的控件；孔型固定为四类，评价单元选项按其自身工作面编码与上游条件联动。
 */
export declare function getSyncFilterControls(category: DrainageSyncCategory, rows: DrainageSyncRow[], filters: DrainageSyncFilters, index?: DrainageSyncFilterIndex): DrainageSyncFilterControl[];
/**
 * 更新单项条件并清除下游条件，避免上游变更后继续使用过期关联选项。
 * @param category 当前同步大类型，决定需要清除的后续字段。
 * @param filters 当前条件。
 * @param key 用户修改的字段。
 * @param value 新筛选值，空字符串表示全部。
 * @returns 更新后的独立条件对象。
 */
export declare function updateSyncFilter(category: DrainageSyncCategory, filters: DrainageSyncFilters, key: DrainageSyncFilterKey, value: string): DrainageSyncFilters;
