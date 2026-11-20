import { CellAlignment, McColor, McDbTable, McCore } from 'McCore';
import { TableCellAlignment, TableEditAction } from '../types/enum';
import { TableBorderDraft, TableBorderReadState } from '../types/interface';
import { TableCellEdgeName } from '../types/type';
export declare const getTableRibbonAlignment: (alignment: CellAlignment) => TableCellAlignment;
export declare const getTableRibbonColor: (color: McColor) => number | string;
declare class TableEditActionService {
    private getCurrentTable;
    private modify;
    execute(core: McCore, target: McDbTable, action: TableEditAction, value?: unknown): void;
    private applyCellStyle;
    private applyManagedContent;
    private applyBorder;
}
export declare const tableEditActionService: TableEditActionService;
export declare const readTableBorderDraft: (table: McDbTable, edge?: TableCellEdgeName) => Omit<TableBorderDraft, "preset">;
export declare const readTableRangeBorderState: (table: McDbTable) => TableBorderReadState;
export {};
