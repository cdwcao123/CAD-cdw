import { McDbTable } from 'McCore';
import { TableEditAction } from '../types/enum';
import { TableStructureRange, TableStructureTarget } from '../types/type';
export declare const editTableRows: (action: TableEditAction, table: McDbTable) => boolean;
export declare const editTableColumns: (action: TableEditAction, table: McDbTable) => boolean;
export declare const mergeTableRanges: (table: TableStructureTarget, ranges: TableStructureRange[]) => boolean;
export declare const editTableMergedCells: (action: TableEditAction, table: McDbTable) => boolean;
