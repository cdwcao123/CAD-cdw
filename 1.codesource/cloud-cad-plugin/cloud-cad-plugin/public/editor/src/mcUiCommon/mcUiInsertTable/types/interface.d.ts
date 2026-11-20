import { ExcelCellValueKind } from './enum';
import { ExcelHorizontalAlignment, ExcelRangeMode, ExcelVerticalAlignment } from './type';
import { BorderStyle, WorksheetState } from 'exceljs';
import { McDbTable } from 'McCore';
export interface InsertTableOption {
    label: string;
    value: string;
}
export interface InsertTableFormData {
    tableStyle: string;
    source: 'empty' | 'file';
    sourceFile: File | null;
    excelSheetName: string;
    excelRangeMode: ExcelRangeMode;
    excelRange: string;
    excelTableData: ExcelTableData | null;
    excelTableDataList: ExcelTableData[];
    insertionMode: 'point' | 'window';
    columnSizingMode: 'count' | 'width';
    columnCount: number;
    columnWidth: number;
    rowCount: number;
    rowSizingMode: 'count' | 'height';
    rowHeight: number;
    firstRowStyle: string;
    secondRowStyle: string;
    otherRowStyle: string;
}
export interface InsertTableProps {
    modelValue?: Partial<InsertTableFormData>;
    tableStyleOptions?: InsertTableOption[];
    cellStyleOptions?: InsertTableOption[];
    cellStyleOptionsByTable?: Record<string, InsertTableOption[]>;
    tableStyles?: import('McCore').McDbTableStyle[];
    fileAccept?: string;
    onEditTableStyle?: (styleName: string) => void;
    hasStartingTable?: boolean;
}
export interface ExcelLinkDialogData {
    sourceFile: File | null;
    sheetName: string;
    rangeMode: ExcelRangeMode;
    range: string;
    tableData: ExcelTableData | null;
    tableDataList: ExcelTableData[];
}
export interface ExcelLinkDialogProps {
    details?: Partial<ExcelLinkDialogData>;
}
export interface OpenExcelLinkDialogOptions {
    initialValue?: Partial<ExcelLinkDialogData>;
    onConfirm?: (data: ExcelLinkDialogData) => boolean | void | Promise<boolean | void>;
}
export interface ExcelSheetMetadata {
    id: number;
    index: number;
    name: string;
    state: WorksheetState;
    rowCount: number;
    columnCount: number;
    actualRowCount: number;
    actualColumnCount: number;
}
export interface ExcelWorkbookData {
    sheetCount: number;
    sheets: ExcelSheetMetadata[];
}
export interface ExcelRangeBounds {
    startRow: number;
    endRow: number;
    startColumn: number;
    endColumn: number;
}
export interface ExcelMergedRange extends ExcelRangeBounds {
    sourceAddress: string;
}
export interface ExcelColorData {
    red: number;
    green: number;
    blue: number;
    css: string;
}
export interface ExcelBorderData {
    style?: BorderStyle;
    color?: ExcelColorData;
}
export interface ExcelCellStyleData {
    fontName?: string;
    fontSize?: number;
    fontColor?: ExcelColorData;
    bold: boolean;
    italic: boolean;
    fillColor?: ExcelColorData;
    horizontalAlignment: ExcelHorizontalAlignment;
    verticalAlignment: ExcelVerticalAlignment;
    wrapText: boolean;
    textRotation: number;
    topBorder: ExcelBorderData;
    rightBorder: ExcelBorderData;
    bottomBorder: ExcelBorderData;
    leftBorder: ExcelBorderData;
}
export interface ExcelCellData {
    rowIndex: number;
    columnIndex: number;
    sourceAddress: string;
    displayText: string;
    valueKind: ExcelCellValueKind;
    formula?: string;
    numberFormat?: string;
    style: ExcelCellStyleData;
}
export interface ExcelRowData {
    index: number;
    height: number;
}
export interface ExcelColumnData {
    index: number;
    width: number;
}
export interface ExcelTableData {
    sheetName: string;
    sourceRange: string;
    rowCount: number;
    columnCount: number;
    rows: ExcelRowData[];
    columns: ExcelColumnData[];
    cells: ExcelCellData[][];
    mergedRanges: ExcelMergedRange[];
    warnings: string[];
}
export interface ExcelTableImportResult {
    importedCellCount: number;
    warnings: string[];
}
export interface ExcelTableBatchImportResult extends ExcelTableImportResult {
    tableCount: number;
}
export interface ExcelTableCreationOptions {
    tableStyle: string;
    firstRowCellStyle: string;
    secondRowCellStyle: string;
    otherRowCellStyle: string;
    previewOnDarkBackground?: boolean;
}
export interface ExcelCreatedTable {
    table: McDbTable;
    result: ExcelTableImportResult;
}
