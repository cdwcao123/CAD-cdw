import type { GroupPropertyType, McGeoPropertyGroupDescriptor } from '../types';
/**
 * 对外入口：将中性 McGeoPropertyGroupDescriptor[] 转换为特性面板运行时 GroupPropertyType[]
 * （editor_geology_collect_tool/moreModelContent/propertyScripts/mcUiMoreModelEntityPropertyScript/property.ts 的唯一依赖，不可删除）
 */
export declare const hydrateMoreModelPropertyGroups: (descriptors: McGeoPropertyGroupDescriptor[]) => GroupPropertyType[];
