import { NewWindowInfo } from '../type/interface';
export declare const hasReusableMcdSnapshot: (data?: Pick<NewWindowInfo, "file" | "snapshotFormat">) => boolean;
export declare const selectReusableDrawingCacheData: (tempData?: NewWindowInfo, recentData?: NewWindowInfo, sourceFileName?: string, sourceLastModified?: number) => NewWindowInfo | undefined;
