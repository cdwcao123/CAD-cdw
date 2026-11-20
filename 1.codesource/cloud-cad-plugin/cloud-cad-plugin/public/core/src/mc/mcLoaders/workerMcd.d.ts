import { MCDDataBlockInfo } from '../types/interface';
interface McMcdHeaderInfo {
    version: number;
    headerSize: number;
    dataBlockCount: number;
    dataBlocks: MCDDataBlockInfo[];
}
export declare const mcdWorkerUrl: string;
export declare class McMcdWorker {
    #private;
    worker: Worker;
    constructor();
    parseHeader(inputData: ArrayBuffer): Promise<boolean>;
    getHeaderInfo(): Promise<McMcdHeaderInfo>;
    releaseWorkerData(): Promise<boolean>;
    terminate(): void;
}
export {};
