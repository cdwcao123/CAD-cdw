import { ExcelTableData } from '../types/interface';
import { McCore, McDbTable } from 'McCore';
export declare const createExcelPreviewTables: (core: McCore, dataList: ExcelTableData[]) => McDbTable[];
