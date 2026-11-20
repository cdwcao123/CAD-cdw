import { FontDataDb } from './types/interface';
export declare class FontCacheDb {
    private db;
    private readonly STORE_NAME;
    private log;
    constructor();
    getFont(file: string): Promise<FontDataDb>;
    getAllFontList(): Promise<FontDataDb[]>;
    updateFont(fontData: FontDataDb): Promise<void>;
    removeFont(file: string): Promise<void>;
    clearAllFonts(): Promise<void>;
    private fetchFontJson;
    initFonts(fonts: FontDataDb[]): Promise<void>;
}
export declare const fontCacheDb: FontCacheDb;
