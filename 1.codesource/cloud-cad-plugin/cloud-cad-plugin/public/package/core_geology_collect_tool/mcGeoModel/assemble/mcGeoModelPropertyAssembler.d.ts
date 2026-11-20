import type { McGeoFeatureClassSchema, McGeoFeatureClassStyleMap, McGeoModelSchema, McGeoPropertyGroupDescriptor } from '../types/interface';
/**
 * 组装特性面板中性分组树描述
 * @param params 组装入参
 * @returns 特性面板分组树描述
 */
export declare const buildPropertyPanelDescriptor: (params: {
    modelSchema: McGeoModelSchema | null;
    featureClasses: McGeoFeatureClassSchema[];
    featureClassStyles: Map<string, McGeoFeatureClassStyleMap>;
}) => McGeoPropertyGroupDescriptor[];
