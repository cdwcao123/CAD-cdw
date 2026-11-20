import type { McGeoModelData } from '@/core_geology_collect_tool/mcGeoModel/types/interface';
/** 本地硐室实体最小可用契约（避免直接依赖内核类） */
export interface ChamberEntityLike {
    objectId?: string;
    isErased?: () => boolean;
    erase?: () => void;
}
export interface ChamberSyncRow {
    id: string;
    compareKey: string;
    modelId: string;
    businessCode: string;
    name: string;
    tunnelId: string;
    tunnelSideType?: string;
    width: number;
    height: number;
    depth: number;
    cornerType: any;
    cornerRadius: number;
    withTunnelAngle: number;
    positionX: number;
    positionY: number;
    positionZ: number;
    featureSummary: string;
    source: 'local' | 'server';
    entity?: unknown;
    /** 服务器原始模型数据，供「获取到本地」重绘使用 */
    serverModelData?: McGeoModelData;
    /** 服务器原始数据项，供覆盖/删除时读取记录 id */
    serverSourceData?: unknown;
}
export interface ChamberSyncComparison {
    conflicts: ChamberSyncRow[];
    localAdditions: ChamberSyncRow[];
    serverAdditions: ChamberSyncRow[];
}
export interface ChamberSyncDetail {
    local?: ChamberSyncRow;
    server?: ChamberSyncRow;
    type: 'local' | 'server' | 'conflict';
}
export interface ChamberSyncLoadResult {
    rows: ChamberSyncRow[];
    notice: string;
    modelId: string;
}
export type GenericRecord = Record<string, unknown>;
export type FeatureClassLike = {
    FeatureClassName?: string;
    featureClassName?: string;
    Name?: string;
    name?: string;
    features?: unknown[];
    records?: unknown[];
    items?: unknown[];
    featureCount?: number;
    count?: number;
};
