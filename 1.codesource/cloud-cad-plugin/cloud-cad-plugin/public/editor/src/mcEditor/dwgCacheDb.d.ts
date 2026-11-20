import { DwgInfoResponseType, DwgInfoType, pageInfoType, TempDrawingSnapshotMetadata } from './type/interface';
import { TempDrawingSnapshotUpdateResult } from './type/type';
export declare class DwgCacheDb {
    #private;
    private db;
    private readonly STORE_NAME;
    private log;
    constructor();
    static getInstance(): DwgCacheDb;
    addOrUpdateRecord(record: DwgInfoType): Promise<string | number>;
    addOwner(drawingId: string | number, ownerId: string): Promise<void>;
    removeOwner(drawingId: string | number, ownerId: string): Promise<void>;
    getRecordByDrawingId(drawingId: string | number): Promise<DwgInfoType | undefined>;
    updateTempDrawingSnapshot(tempId: string, drawingFile: ArrayBuffer, fileName?: string, bizDrawingId?: string, metadata?: TempDrawingSnapshotMetadata): Promise<TempDrawingSnapshotUpdateResult>;
    getRecentRecords(pageInfo: pageInfoType): Promise<DwgInfoResponseType>;
    deleteRecord(id: string | number): Promise<void>;
    clearAllRecords(): Promise<void>;
    getRecordCount(): Promise<number>;
    searchRecords(pageInfo: pageInfoType): Promise<DwgInfoResponseType>;
    getRecordByHash(md5Hash: string): Promise<DwgInfoType | undefined>;
    cleanupExpiredTempRecords(ttlMs: number): Promise<number>;
    addRecordsBatch(records: DwgInfoType[]): Promise<(string | number)[]>;
    private formatSize;
    private getCurrentTimeStr;
}
export declare const mcDwgCacheDb: DwgCacheDb;
