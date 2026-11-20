import { CellEdgeMask, McColor, McDbTableStyle } from 'McCore';
import { TableStyleEditorData } from '../types/interface';
import { TableCellStyleName } from '../types/type';
export declare const tableCellStyleNames: TableCellStyleName[];
export declare const tableCellEdgeMasks: CellEdgeMask[];
export declare const toMcColor: (value: string | number) => McColor;
export declare const tableStyleToEditorData: (style: McDbTableStyle) => TableStyleEditorData;
export declare const applyEditorDataToTableStyle: (data: TableStyleEditorData, target: McDbTableStyle) => void;
export declare const cloneTableStyle: (source: McDbTableStyle, name: string) => McDbTableStyle;
