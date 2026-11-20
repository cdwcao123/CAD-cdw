import { McCore } from '../mcCore';
import { McDbDatabase, McDbEntity, McDbObject } from '../mcDb';
import { McXData } from './mcLoaders/mcMctfFiler';
export interface McLayerWorkspaceMetadata {
    libraryLayerId: string;
    libraryLayerCode: string;
    libraryLayerName: string;
    libraryLayerSourceName: string;
    libraryLayerVersion: number;
    libraryLayerBaseDwgPath: string;
    libraryLayerBaseHash: string;
    libraryLayerCurrentHash: string;
    libraryLayerResolvedServerVersion: number;
    libraryLayerConflictResolvedAt: string;
    libraryLayerSnapshotAfterResolveHash: string;
    libraryLayerBaseSnapshot: string;
    libraryLayerSnapshotAfterResolve: string;
}
export interface McLayerEntitySignature {
    id: string;
    idSource: 'objectId' | 'contentHash';
    type: string;
    layerName: string;
    hash: string;
    entity?: McDbEntity;
}
export type McLayerEntityConflictType = 'serverAdded' | 'localAdded' | 'bothAdded' | 'serverDeleted' | 'localDeleted' | 'bothModified' | 'localModifiedServerDeleted' | 'localDeletedServerModified' | 'serverModified' | 'localModified' | 'identityUnstable';
export interface McLayerEntityDiffItem {
    id: string;
    type: McLayerEntityConflictType;
    local?: McLayerEntitySignature;
    base?: McLayerEntitySignature;
    server?: McLayerEntitySignature;
}
export declare const getObjectXData: (record: McDbObject) => McXData | null;
export declare const ensureObjectXData: (record: McDbObject) => McXData;
export declare const getRecordId: (record: McDbObject) => string;
export declare const getRecordLayerName: (record: McDbEntity) => string;
export declare const hashText: (value: string) => string;
export declare const hashLayerDrawing: (core: McCore, layerName: string) => string;
export declare const hashLayerDrawingDatabase: (db: McDbDatabase, layerName: string) => string;
export declare const LAYER_WORKSPACE_XDATA_KEYS: string[];
export declare const LEGACY_LAYER_WORKSPACE_SNAPSHOT_XDATA_KEYS: string[];
export declare const getEntitySignature: (entity: McDbEntity) => Promise<McLayerEntitySignature>;
export declare const getLayerEntitySignatures: (core: McCore, layerName: string) => Promise<McLayerEntitySignature[]>;
export declare const getLayerEntitySignaturesFromDatabase: (db: McDbDatabase, layerName: string) => Promise<McLayerEntitySignature[]>;
export declare const diffLayerEntitySignatures: (localSignatures: McLayerEntitySignature[], baseSignatures: McLayerEntitySignature[], serverSignatures: McLayerEntitySignature[]) => McLayerEntityDiffItem[];
export declare const readLayerWorkspaceMetadata: (record: McDbObject) => Partial<McLayerWorkspaceMetadata>;
export declare const clearLayerWorkspaceMetadata: (record: McDbObject, keys?: string[]) => boolean;
export declare const stripLayerWorkspaceMetadataFromDatabase: (db: McDbDatabase) => void;
export declare const writeLayerWorkspaceMetadata: (record: McDbObject, values: Partial<McLayerWorkspaceMetadata>) => void;
