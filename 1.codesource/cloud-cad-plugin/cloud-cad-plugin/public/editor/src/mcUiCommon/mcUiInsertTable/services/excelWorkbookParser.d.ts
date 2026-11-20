import { ExcelTableData, ExcelWorkbookData } from '../types/interface';
import { ExcelRangeMode } from '../types/type';
export declare class ExcelWorkbookParser {
    private workbook?;
    private defaultFontStyle;
    load(file: File): Promise<ExcelWorkbookData>;
    extractTable(sheetName: string, rangeMode: ExcelRangeMode, rangeExpression: string): ExcelTableData;
}
