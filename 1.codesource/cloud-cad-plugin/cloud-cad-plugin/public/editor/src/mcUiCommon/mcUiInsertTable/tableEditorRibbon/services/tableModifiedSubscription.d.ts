import { TableEditFrameScheduler, TableModifiedEventSource } from '../types/interface';
export declare class TableModifiedSubscription<T extends TableModifiedEventSource> {
    private readonly scheduler;
    private readonly onSync;
    private source?;
    private frameId?;
    private readonly handleModified;
    constructor(scheduler: TableEditFrameScheduler, onSync: (source: T) => void);
    bind(source: T): void;
    unbind(): void;
}
