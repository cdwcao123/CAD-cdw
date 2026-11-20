import { StoreSchema, McCacheDbConfig } from './types/interface';
export declare class McCacheDb {
    private dbName;
    private version;
    private stores;
    private db;
    private initializing;
    private log;
    constructor(config?: McCacheDbConfig);
    addStore(store: StoreSchema): void;
    private requestToPromise;
    init(): Promise<IDBDatabase>;
    private initializeDatabase;
    private ensureDB;
    beginTransaction(storeNames: string | string[], mode?: IDBTransactionMode, options?: IDBTransactionOptions): Promise<IDBTransaction>;
    insert<T>(tableName: string, data: T, tx?: IDBTransaction): Promise<IDBValidKey>;
    update<T>(tableName: string, data: T, tx?: IDBTransaction): Promise<IDBValidKey>;
    remove(tableName: string, key: IDBValidKey, tx?: IDBTransaction): Promise<void>;
    select<T>(tableName: string, key: IDBValidKey, tx?: IDBTransaction): Promise<T | undefined>;
    selectAll<T>(tableName: string, query?: IDBValidKey | IDBKeyRange | null, count?: number, tx?: IDBTransaction): Promise<T[]>;
    count(tableName: string, query?: IDBValidKey | IDBKeyRange | null, tx?: IDBTransaction): Promise<number>;
    clear(tableName: string, tx?: IDBTransaction): Promise<undefined>;
    clearAll(): Promise<boolean>;
    close(): void;
    private isRecoverableConnectionError;
    static deleteDatabase(dbName: string): Promise<void>;
}
