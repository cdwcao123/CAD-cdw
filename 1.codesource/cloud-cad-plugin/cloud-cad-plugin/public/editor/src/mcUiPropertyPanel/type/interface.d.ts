import { McCore, McDbObject } from 'McCore';
export interface McUiCommonSelectionValue<T = unknown> {
    value: T | undefined;
    mixed: boolean;
    count: number;
}
export interface McUiSelectionSnapshot {
    coreKey: string;
    rawEntities: ReadonlyMap<string, McDbObject>;
    entities: ReadonlyMap<string, McDbObject>;
    entityIds: ReadonlySet<string>;
    typeEntityIds: ReadonlyMap<string, ReadonlySet<string>>;
    typeCounts: ReadonlyMap<string, number>;
    commonValues: ReadonlyMap<string, McUiCommonSelectionValue>;
    firstEntityType: string | null;
    size: number;
    selectionVersion: number;
    contentVersion: number;
}
export interface McUiPendingSelectionUpdate {
    core: McCore;
    entities: ReadonlyMap<string, McDbObject>;
}
