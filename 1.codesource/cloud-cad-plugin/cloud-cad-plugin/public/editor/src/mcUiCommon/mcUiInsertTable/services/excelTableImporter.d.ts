import { McDbTable, McGeVector3, McCore } from 'McCore';
import { ExcelCreatedTable, ExcelTableBatchImportResult, ExcelTableData, ExcelTableCreationOptions, ExcelTableImportResult } from '../types/interface';
export declare const importExcelTableData: (core: McCore, table: McDbTable, data: ExcelTableData, previewOnDarkBackground?: boolean, updateTable?: boolean) => ExcelTableImportResult;
export declare const createExcelTableEntity: (core: McCore, data: ExcelTableData, options: ExcelTableCreationOptions, position?: McGeVector3) => ExcelCreatedTable;
export declare const insertExcelTableAtPoint: (core: McCore, data: ExcelTableData, options: ExcelTableCreationOptions) => Promise<ExcelTableImportResult | undefined>;
export declare const insertExcelTablesAtPoint: (core: McCore, dataList: ExcelTableData[], options: ExcelTableCreationOptions) => Promise<ExcelTableBatchImportResult | undefined>;
