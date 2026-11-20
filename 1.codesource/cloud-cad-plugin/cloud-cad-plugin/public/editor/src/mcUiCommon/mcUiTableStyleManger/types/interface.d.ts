import { TableCellFormatTypeKey, TableCellStyleName } from './type';
import { CellAlignment, CellClass, GridLineStyle, McDataType, McDbLineWeight, McUnitType, TableFlowDirection } from 'McCore';
export interface TableStyleManagerData {
    selectedStyleName: string;
}
export interface CreateTableStyleFormData {
    name: string;
    baseStyleName: string;
}
export interface TableGridLineFormData {
    visibility: boolean;
    lineStyle: GridLineStyle;
    lineWeight: McDbLineWeight;
    lineType: string;
    color: string | number;
    doubleLineSpacing: number;
}
export interface TableCellStyleFormData {
    backgroundColor: string | number;
    alignment: CellAlignment;
    dataType: McDataType;
    unitType: McUnitType;
    dataFormat: number;
    cellClass: CellClass;
    horzCellMargin: number;
    vertCellMargin: number;
    isMerge: boolean;
    textStyle: string;
    textHeight: number;
    textColor: string | number;
    textRotation: number;
    gridLineStyles: Record<number, TableGridLineFormData>;
}
export interface TableStyleEditorData {
    flowDirection: TableFlowDirection;
    selectedCellStyleName: TableCellStyleName;
    cellStyles: Record<TableCellStyleName, TableCellStyleFormData>;
}
export interface TableStyleEditorProps {
    details: TableStyleEditorData;
    previewTableStyleName: string;
}
export interface TableCellFormatData {
    dataType: McDataType;
    unitType: McUnitType;
    dataFormat: number;
}
export interface TableCellFormatOption {
    label: string;
    value: number;
}
export interface TableCellFormatPreset {
    key: TableCellFormatTypeKey;
    label: string;
    dataType: McDataType;
    unitType: McUnitType;
    formats: TableCellFormatOption[];
}
