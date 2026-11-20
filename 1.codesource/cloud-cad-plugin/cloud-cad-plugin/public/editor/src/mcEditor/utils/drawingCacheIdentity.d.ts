export declare const createStableDrawingCacheId: (prefix: string, identity: string) => Promise<string>;
export declare const createLocalDrawingCacheId: (fileName: string, lastModified: number) => Promise<string>;
export declare const createSharedTempDrawingId: (drawingId: string) => Promise<string>;
export declare const resolveSharedDrawingCacheIds: (sourceFileName?: string, sourceLastModified?: number, existingDrawingId?: string) => Promise<{
    drawingId: string;
    tempId: string;
} | undefined>;
