import { McCore } from '../../../../mcCore/mcCore';
import { McDbTable } from '../../../../mcDb/entity/mcDbTable';
import { McDbDatabase } from '../../../../mcDb/mcDbDatabase';
import { McGeVector3 } from '../../../../mcGe/mcGeVector3';
export declare enum InsertType {
    kByPoint = 0,
    kByArea = 1
}
export declare enum CellDrawType {
    kByCount = 0,
    kBySingleSize = 1,
    kAll = 2
}
export interface cellDrawParams {
    drawType: CellDrawType;
    count?: number;
    singleSize?: number;
}
export interface DrawTableParams {
    tableStyle: string;
    insertType: InsertType;
    rowOption: cellDrawParams;
    colOption: cellDrawParams;
    firstRowCellStyle: string;
    secondRowCellStyle: string;
    otherRowCellStyle: string;
}
export declare function drawTable(core: McCore, params?: DrawTableParams): Promise<void>;
export declare function createTableByPoint(point: McGeVector3, db: McDbDatabase, params: DrawTableParams): McDbTable;
export declare function editTable(core: McCore, table: McDbTable, defaultContent?: string): Promise<void>;
export declare function copyTableHighlightRangeToClipboard(core: McCore, table: McDbTable): Promise<void>;
export declare function pasteClipboardCellDataToTable(core: McCore, table: McDbTable): Promise<void>;
