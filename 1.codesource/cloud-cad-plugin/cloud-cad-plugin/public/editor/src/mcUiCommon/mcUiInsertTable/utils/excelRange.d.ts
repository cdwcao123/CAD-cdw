import { ExcelRangeBounds } from '../types/interface';
export declare const columnIndexToLetters: (columnIndex: number) => string;
export declare const formatExcelRange: (bounds: ExcelRangeBounds) => string;
export declare const normalizeExcelTableRange: (expression: string) => string;
export declare const parseExcelTableRange: (expression: string) => ExcelRangeBounds;
export declare const parseExcelRange: (expression: string) => ExcelRangeBounds;
export declare const excelRangesIntersect: (left: ExcelRangeBounds, right: ExcelRangeBounds) => boolean;
export declare const excelRangeContains: (outer: ExcelRangeBounds, inner: ExcelRangeBounds) => boolean;
