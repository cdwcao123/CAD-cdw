import type { DrainageReverseRow } from '../types/interface';
import type { DrainageBoreholeCategory, DrainageStraightBoreholeCategory } from '../types/type';
import type { CoreGeologyCollectTool } from '@/core_geology_collect_tool';
import type { McBoreholeType } from '@/core_geology_collect_tool/mcDrainageBorehole/types/enum';
/**
 * 将菜单孔型转换为已加载 Core 插件提供的实体类型，供绘制、导入和图件筛选共用。
 * @param api 当前图纸已加载的 Core 插件类型枚举。
 * @param category 菜单所属孔型。
 * @returns 该菜单允许处理的完整实体类型集合。
 */
export declare function getDrainageBoreholeTypes(api: Pick<CoreGeologyCollectTool, 'McBoreholeType'>, category: DrainageBoreholeCategory): McBoreholeType[];
/**
 * 按反演菜单筛选 Excel 行，其他孔型直接跳过，不生成错误行或参与重复孔号校验。
 * @param rows 从普通钻孔模板读取的输入行。
 * @param api 当前图纸已加载的孔型枚举。
 * @param category 顺层或穿层反演菜单所属孔型。
 * @returns 当前菜单的输入行；类型留空的行保留，由既有反演规则匹配同型源孔或报告错误。
 */
export declare function filterDrainageReverseRows(rows: DrainageReverseRow[], api: Pick<CoreGeologyCollectTool, 'McBoreholeType'>, category: DrainageStraightBoreholeCategory): DrainageReverseRow[];
