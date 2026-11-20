import { TableCellFormatData, TableCellFormatPreset } from '../types/interface';
import { TableCellFormatTypeKey } from '../types/type';
export declare const tableCellFormatPresets: TableCellFormatPreset[];
export declare const getTableCellFormatTypeKey: (data: Pick<TableCellFormatData, "dataType" | "unitType">) => TableCellFormatTypeKey;
export declare const getTableCellFormatLabel: (data: TableCellFormatData) => string;
