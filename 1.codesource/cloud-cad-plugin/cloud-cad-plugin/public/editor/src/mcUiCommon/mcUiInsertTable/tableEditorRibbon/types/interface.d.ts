import { TableBorderPreset, TableCellAlignment } from './enum';
import { TableCellEdgeName, TableEditMixedValue } from './type';
import { CellAlignment, CellContentLayout, CellContentType, McColor, McDbTable } from 'McCore';
export interface TableBorderDraft {
    lineWeight: number;
    lineType: string;
    color: number | string;
    mcColor?: McColor;
    doubleLine: boolean;
    spacing: number;
    preset: TableBorderPreset;
}
export interface TableBorderAvailability {
    innerHorizontal: boolean;
    innerVertical: boolean;
}
export interface TableBorderDialogProps {
    details: TableBorderDraft;
    availability: TableBorderAvailability;
    mixed: boolean;
}
export interface TableBorderReadState {
    details: Omit<TableBorderDraft, 'preset'>;
    mixed: boolean;
}
export interface TableBorderDialogEmits {
    (event: 'changeData', value: TableBorderDraft): void;
}
export interface TableCellEdgeTarget {
    row: number;
    col: number;
    edge: TableCellEdgeName;
}
export interface TableEditRibbonState {
    selectedTable?: McDbTable;
    coreKey?: string;
    alignment: TableCellAlignment | TableEditMixedValue;
    cellStyleName: string;
    fillColor: number | string;
    border: TableBorderDraft;
    borderMixed: boolean;
}
export interface TableBorderOption {
    value: TableBorderPreset;
    label: string;
    icon: string;
}
export interface TableBlockInsertDraft {
    blockDefName: string;
    autoScale: boolean;
    scale: number;
    rotation: number;
    alignment: CellAlignment;
}
export interface TableBlockCellTarget {
    rowIndex: number;
    colIndex: number;
}
export interface TableBlockOption {
    name: string;
}
export interface TableManageContentItem {
    id: number;
    contentType: CellContentType;
    label: string;
}
export interface TableManageContentDetails {
    items: TableManageContentItem[];
    orderedContentIds: number[];
    layout: CellContentLayout;
    spacing: number;
}
export interface TableManageContentDraft {
    orderedContentIds: number[];
    layout: CellContentLayout;
    spacing: number;
}
export interface TableManageContentCommit extends TableManageContentDraft {
    rowIndex: number;
    colIndex: number;
}
export interface TableManageContentDialogProps {
    details: TableManageContentDetails;
}
export interface TableManageContentDialogEmits {
    (event: 'changeData', value: TableManageContentDraft): void;
}
export interface TableModifiedEventSource {
    on(event: 'modified', handler: () => void): void;
    off(event: 'modified', handler: () => void): void;
}
export interface TableEditFrameScheduler {
    request(callback: () => void): number;
    cancel(frameId: number): void;
}
