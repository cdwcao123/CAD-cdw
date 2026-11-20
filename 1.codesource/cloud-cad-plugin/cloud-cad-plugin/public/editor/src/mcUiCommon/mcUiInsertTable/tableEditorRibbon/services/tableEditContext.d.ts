import { McDbObject } from 'McCore';
declare class TableEditContext {
    private dismissedTableId?;
    private activeCoreKey?;
    private readonly modifiedSubscription;
    handleSelection(coreKey: string, entities: Map<string, McDbObject>): void;
    dismiss(): void;
    release(coreKey?: string): void;
    private open;
    private syncModuleTools;
    private ensureModule;
    private close;
}
export declare const tableEditContext: TableEditContext;
export {};
