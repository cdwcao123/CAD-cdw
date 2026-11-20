import type { FeatureClassSchemaItem, SourceQueryModelRecord } from '../types';
type ServerModelChildrenCacheItem = {
    modelId: string;
    rows: SourceQueryModelRecord[];
    featureSchemaList: FeatureClassSchemaItem[];
};
export declare const readServerModelChildrenCache: (scopeKey: string) => Record<string, ServerModelChildrenCacheItem>;
export declare const writeServerModelChildrenCache: (scopeKey: string, modelId: string, payload: ServerModelChildrenCacheItem) => void;
export declare const removeServerModelChildrenCache: (scopeKey: string, modelId: string) => void;
export declare const pruneServerModelChildrenCache: (scopeKey: string, validModelIds: string[]) => void;
export {};
