import type { BoreholeCorrectionGroup, BoreholeCorrectionTunnelOption } from '../types/interface';
/**
 * 管理反演修正单侧列表的巷道筛选和组单选，左右两侧分别调用以保持独立。
 * @param readGroups 读取本侧完整分组的函数；选项按巷道实体 ID 去重，不按显示名称合并。
 * @returns 巷道选项、筛选结果及选中值；巷道选中值 null 表示全部，空字符串表示未关联巷道。
 */
export declare function useBoreholeCorrectionGroupFilter(readGroups: () => BoreholeCorrectionGroup[]): {
    tunnelId: import("vue").Ref<string | null, string | null>;
    tunnelOptions: import("vue").ComputedRef<BoreholeCorrectionTunnelOption[]>;
    filteredGroups: import("vue").ComputedRef<BoreholeCorrectionGroup[]>;
    groupKey: import("vue").Ref<string, string>;
};
