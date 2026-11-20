import { QueryResponse } from '../types/interface';
import { WorkerInput } from '../types/type';
export declare class McWorker {
    worker: Worker;
    pendingRequests: Map<string, (response: QueryResponse) => void>;
    currentRequestId: number;
    resolve: null | ((value: boolean | PromiseLike<boolean>) => void);
    reject: null | ((value: boolean | PromiseLike<boolean>) => void);
    constructor(workerUrl: string);
    sendDataToWorker(inputData: WorkerInput): Promise<unknown>;
    getDataFromWorker(key: string, count?: number, chunkSize?: number): Promise<any>;
    loadDataChunks(type: string, callback: Function, chunkSize?: number): Promise<void>;
    releaseWorkerData(): void;
}
