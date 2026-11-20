import { ClipboardDataDb } from './types/interface';
export declare class ClipboardCacheDb {
    private db;
    private readonly STORE_NAME;
    private log;
    constructor();
    addClipboardItem(data: ClipboardDataDb): Promise<void>;
    getAllClipboardItem(): Promise<ClipboardDataDb[]>;
    clearAllClipboardItem(): Promise<void>;
}
export declare const clipboardCacheDb: ClipboardCacheDb;
