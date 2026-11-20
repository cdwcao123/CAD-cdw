export interface LayerWorkspaceSnapshotCacheRecord {
    key: string;
    drawingKey: string;
    layerKey: string;
    snapshotType: 'base' | 'resolved';
    snapshot: string;
    updateTime: number;
}
export interface LayerWorkspaceSnapshotOwnerRecord {
    key: string;
    drawingKey: string;
    sessionId: string;
    lastSeen: number;
    createdAt: number;
}
export declare class LayerWorkspaceSnapshotCacheDb {
    private readonly STORE_NAME;
    private readonly OWNER_STORE_NAME;
    constructor();
    get(key: string): Promise<LayerWorkspaceSnapshotCacheRecord | undefined>;
    set(record: LayerWorkspaceSnapshotCacheRecord): Promise<void>;
    remove(key: string): Promise<void>;
    touchOwner(drawingKey: string, sessionId: string, now?: number): Promise<void>;
    removeOwner(drawingKey: string, sessionId: string): Promise<void>;
    cleanupStaleOwners(staleMs: number, now?: number): Promise<number>;
    hasActiveOwner(drawingKey: string, staleMs: number, now?: number): Promise<boolean>;
    removeSnapshotsByDrawingKey(drawingKey: string): Promise<number>;
    cleanupOrphanSnapshots(options: {
        ownerStaleMs: number;
        orphanTtlMs: number;
        now?: number;
    }): Promise<number>;
    private buildOwnerKey;
}
export declare const layerWorkspaceSnapshotCacheDb: LayerWorkspaceSnapshotCacheDb;
