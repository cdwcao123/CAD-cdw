import { McDbTable } from 'McCore';
import { TableBorderDraft, TableEditRibbonState } from '../types/interface';
export declare const createDefaultTableBorderDraft: () => TableBorderDraft;
export declare const tableEditRibbonState: import('vue').ShallowReactive<TableEditRibbonState>;
export declare const updateTableBorderDraft: (draft: TableBorderDraft) => void;
export declare const syncTableEditRibbonState: (table: McDbTable) => void;
