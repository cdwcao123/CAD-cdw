import { default as McColor } from '../../mc/mcColor';
import { McMcdFiler } from '../../mc/mcLoaders/mcMcdFiler';
import { McMctfFiler } from '../../mc/mcLoaders/mcMctfFiler';
import { McMenuGroup } from '../../mc/mcMenu/mcMenuGroup';
import { MCDDataBlockType } from '../../mc/types/enum';
import { PickResult } from '../../mcCore';
import { McGeExtent2, McGeMatrix4, McGePlaneVolume, McGePoint, McGeVector3 } from '../../mcGe';
import { McGeRaycaster } from '../../mcGe/mcGeRaycaster';
import { McDbBlockDef } from '../blockDef/mcDbBlockDef';
import { McDbLineType } from '../lineType/mcDbLineType';
import { McDbDatabase } from '../mcDbDatabase';
import { McCellStyle, McDbTableStyle, McGridLineProperty } from '../tableStyle/mcDbTableStyle';
import { McDbTextStyle } from '../textStyle/mcDbTextStyle';
import { CellAlignment, CellContentLayout, CellContentType, CellEdgeMask, CellMargin, CellPropertyFlag, CellType, GridLineStyle, GridLineType, McDataType, McDbLineWeight, McFormatOption, McParseOption, McUnitType, TableFlowDirection, TableHitItem } from '../types/enum';
import { MCEntitySnapPoints, MCEntityStretchPoints } from '../types/interface';
import { McDbObjectId } from '../types/type';
import { McDbCustomEntity } from './mcDbCustomEntity';
import { McDbEntity } from './mcDbEntity';
export declare class McValue {
    dataType: McDataType;
    unitType?: McUnitType;
    parseOption?: McParseOption;
    formatOption?: McFormatOption;
    dataFormat?: string;
    formula?: string;
    value: any;
    constructor(dataType?: McDataType, value?: number | string | McColor | McGePoint, unitType?: McUnitType, parseOption?: McParseOption, formatOption?: McFormatOption, dataFormat?: string, formula?: string);
}
export declare class McBlockContentData {
    blockDefName: string;
    attributes: Record<string, any>;
    scale: number;
    rotation: number;
    contentColor: McColor;
    isAutoScale: boolean;
    constructor(blockDefName?: string, isAutoScale?: boolean, scale?: number, rotation?: number, contentColor?: McColor, attributes?: Record<string, any>);
}
export declare class CellContent {
    contentType: CellContentType;
    value: any;
    dataType?: McDataType;
    unitType?: McUnitType;
    parseOption?: McParseOption;
    formatOption?: McFormatOption;
    dataFormat?: string;
    formula?: string;
    textStyle?: string;
    textHeight?: number;
    rotation?: number;
    scale?: number;
    isAutoScale?: boolean;
    attributes?: Record<string, any>;
    contentColor?: McColor;
    entityId?: McDbObjectId;
    constructor(contentType: CellContentType, value?: McValue | string);
    static createValueContent(value: McValue): CellContent;
    static createBlockContent(blockContent: McBlockContentData): CellContent;
    static createFieldContent(fieldId: string): CellContent;
    mctfInFields(fields: McMctfFiler): void;
    mctfOutFields(fields: McMctfFiler): void;
    mcdInFields(filer: McMcdFiler): void;
    mcdOutFields(filer: McMcdFiler): void;
}
export declare class CellFormatData {
    cellOverrides: Map<CellPropertyFlag, any>;
    cellType: CellType;
    cellStyle: string;
    customData: Record<string, any>;
    contents: CellContent[];
    backGroundColorHatchId?: string;
    topGridOverrides: McGridLineProperty;
    leftGridOverrides: McGridLineProperty;
    rightGridOverrides: McGridLineProperty;
    bottomGridOverrides: McGridLineProperty;
    mctfInFields(fields: McMctfFiler): void;
    mctfOutFields(fields: McMctfFiler): void;
    mcdInFields(filer: McMcdFiler): void;
    mcdOutFields(fields: McMcdFiler): void;
}
export declare class CellRange {
    minRow: number;
    maxRow: number;
    leftCol: number;
    rightCol: number;
    isValid(): boolean;
    isEqual(cellRange: CellRange): boolean;
    isIn(cellRange: CellRange): boolean;
    isContains(cellRange: CellRange): boolean;
    isIntersect(cellRange: CellRange): boolean;
    isStartWith(row: number, col: number): boolean;
    constructor(minRow: number, maxRow: number, leftCol: number, rightCol: number);
    clone(): CellRange;
}
export interface CellRangeData {
    mergedRanges: CellRange[];
    datas: CellFormatData[][];
    depends: {
        lineTypes: string[];
        textStyles: string[];
        blockNames: string[];
    };
    rowHeights: number[];
    colWidths: number[];
    rowStyles: string[];
    colStyles: string[];
}
export interface CellRangeDataEx {
    mergedRanges: CellRange[];
    datas: CellFormatData[][];
    depends: {
        lineTypes: McDbLineType[];
        textStyles: McDbTextStyle[];
        blockDefs: McDbBlockDef[];
    };
    rowHeights: number[];
    colWidths: number[];
    rowStyles: string[];
    colStyles: string[];
}
export declare enum TableStyleOverride {
    kTitleSuppressed = 1,
    kHeaderSuppressed = 2,
    kFlowDirection = 3,
    kHorzCellMargin = 4,
    kVertCellMargin = 5,
    kTitleRowColor = 6,
    kHeaderRowColor = 7,
    kDataRowColor = 8,
    kTitleRowFillNone = 9,
    kHeaderRowFillNone = 10,
    kDataRowFillNone = 11,
    kTitleRowFillColor = 12,
    kHeaderRowFillColor = 13,
    kDataRowFillColor = 14,
    kTitleRowAlignment = 15,
    kHeaderRowAlignment = 16,
    kDataRowAlignment = 17,
    kTitleRowTextStyle = 18,
    kHeaderRowTextStyle = 19,
    kDataRowTextStyle = 20,
    kTitleRowTextHeight = 21,
    kHeaderRowTextHeight = 22,
    kDataRowTextHeight = 23,
    kTitleRowDataType = 24,
    kHeaderRowDataType = 25,
    kDataRowDataType = 26,
    kTitleHorzTopColor = 40,
    kTitleHorzInsideColor = 41,
    kTitleHorzBottomColor = 42,
    kTitleVertLeftColor = 43,
    kTitleVertInsideColor = 44,
    kTitleVertRightColor = 45,
    kHeaderHorzTopColor = 46,
    kHeaderHorzInsideColor = 47,
    kHeaderHorzBottomColor = 48,
    kHeaderVertLeftColor = 49,
    kHeaderVertInsideColor = 50,
    kHeaderVertRightColor = 51,
    kDataHorzTopColor = 52,
    kDataHorzInsideColor = 53,
    kDataHorzBottomColor = 54,
    kDataVertLeftColor = 55,
    kDataVertInsideColor = 56,
    kDataVertRightColor = 57,
    kTitleHorzTopLineWeight = 70,
    kTitleHorzInsideLineWeight = 71,
    kTitleHorzBottomLineWeight = 72,
    kTitleVertLeftLineWeight = 73,
    kTitleVertInsideLineWeight = 74,
    kTitleVertRightLineWeight = 75,
    kHeaderHorzTopLineWeight = 76,
    kHeaderHorzInsideLineWeight = 77,
    kHeaderHorzBottomLineWeight = 78,
    kHeaderVertLeftLineWeight = 79,
    kHeaderVertInsideLineWeight = 80,
    kHeaderVertRightLineWeight = 81,
    kDataHorzTopLineWeight = 82,
    kDataHorzInsideLineWeight = 83,
    kDataHorzBottomLineWeight = 84,
    kDataVertLeftLineWeight = 85,
    kDataVertInsideLineWeight = 86,
    kDataVertRightLineWeight = 87,
    kTitleHorzTopVisibility = 100,
    kTitleHorzInsideVisibility = 101,
    kTitleHorzBottomVisibility = 102,
    kTitleVertLeftVisibility = 103,
    kTitleVertInsideVisibility = 104,
    kTitleVertRightVisibility = 105,
    kHeaderHorzTopVisibility = 106,
    kHeaderHorzInsideVisibility = 107,
    kHeaderHorzBottomVisibility = 108,
    kHeaderVertLeftVisibility = 109,
    kHeaderVertInsideVisibility = 110,
    kHeaderVertRightVisibility = 111,
    kDataHorzTopVisibility = 112,
    kDataHorzInsideVisibility = 113,
    kDataHorzBottomVisibility = 114,
    kDataVertLeftVisibility = 115,
    kDataVertInsideVisibility = 116,
    kDataVertRightVisibility = 117
}
export declare enum CellStyleType {
    kByRowOrCol = 0,
    kTitle = 3,
    kHeader = 1,
    kData = 2
}
export interface TableRowColInitParam {
    rowOpt: {
        count: number;
        single: number;
    };
    colOpt: {
        count: number;
        single: number;
    };
    firstRowCellStyle: string;
    secondRowCellStyle: string;
    otherRowCellStyle: string;
}
export declare class GridLine {
    basePos: number;
    baseStyle: McGridLineProperty;
    overrides: Map<number, McGridLineProperty>;
    lineIds: string[];
}
export declare function calcRowTrueHeight(cellStyle: McCellStyle, rowMultiple: number): number;
export declare class McDbTable extends McDbCustomEntity {
    #private;
    protected _type: string;
    protected static readonly _className: string;
    constructor(position?: McGeVector3 | McGePoint, tableStyle?: string);
    initByDrawParams(db: McDbDatabase, tableStyleName: string, param: TableRowColInitParam): boolean;
    getDependency(): {
        type: MCDDataBlockType;
        id: string;
    }[];
    getTableStyleName(): string;
    setTableStyleName(tableStyleName: string): void;
    getTableStyle(): McDbTableStyle | undefined;
    setInsertionPoint(point: McGeVector3): void;
    getInsertionPoint(): McGeVector3;
    getRotation(): number;
    setRotation(rotation: number): void;
    getNumRows(): number;
    getNumColumns(): number;
    setNumRows(count: number): void;
    setNumColumns(count: number): void;
    setTableWidth(width: number): void;
    getTableWidth(): number;
    setTableHeight(height: number): void;
    getTableHeight(): number;
    setColumnWidth(width: number, column?: number): void;
    getColumnWidth(column: number): number;
    setRowHeight(height: number, row?: number): void;
    getRowHeight(row: number): number;
    setRowStyle(styleName: string, row: number): void;
    getRowStyle(row: number): string;
    setColStyle(styleName: string, col: number): void;
    getColStyle(col: number): string;
    getFlowDirection(): TableFlowDirection;
    setFlowDirection(flow: TableFlowDirection): void;
    setPosition(position: McGeVector3): void;
    getPosition(): McGeVector3;
    _adjustCellDataOnResize(): void;
    _getCellStyle(row: number, col: number): McCellStyle | undefined;
    _getRowStyle(row: number): McCellStyle | undefined;
    _getCellOverride(row: number, col: number, override: CellPropertyFlag): any | undefined;
    _setCellOverride(row: number, col: number, override: CellPropertyFlag, value: any): boolean;
    getCellType(row: number, col: number): CellType;
    setCellType(row: number, col: number, type: CellType): boolean;
    getCellExtents(row: number, col: number, isOuterCell: boolean): McGeExtent2 | null;
    getAttachmentPoint(row: number, col: number): McGeVector3;
    isBackgroundColorNone(row: number, col: number): boolean;
    getBackgroundColor(row: number, col: number): McColor;
    setBackgroundColor(row: number, col: number, color: McColor): boolean;
    getContentColor(row: number, col: number, nContent?: number): McColor;
    setContentColor(row: number, col: number, color: McColor, nContent?: number): boolean;
    setCellAlignment(row: number, col: number, alignment: CellAlignment): boolean;
    getCellAlignment(row: number, col: number): CellAlignment;
    getCellContentLayout(row: number, col: number): CellContentLayout;
    setCellContentLayout(row: number, col: number, layout: CellContentLayout): boolean;
    getCellMargin(row: number, col: number, nMargin: CellMargin): number;
    setCellMargin(row: number, col: number, margin: CellMargin, value: number): boolean;
    getCellStyleOverrides(row: number, col: number): CellPropertyFlag[];
    clearCellOverrides(row: number, col: number): void;
    deleteContent(row: number, col: number, index?: number): boolean;
    getCellData(row: number, col: number): CellFormatData | undefined;
    setCellData(row: number, col: number, data: CellFormatData): void;
    getCellContents(row: number, col: number): CellContent[];
    getCellContent(row: number, col: number, index: number): CellContent | undefined;
    setMargin(row: number, col: number, nMargins: CellMargin, fMargin: number): boolean;
    getMargin(row: number, col: number, margin: CellMargin): number;
    getContentType(row: number, col: number, nContent?: number): CellContentType;
    getValue(row: number, col: number, nContent?: number): McValue | undefined;
    setValue(row: number, col: number, nContent: number | undefined, val: McValue): boolean;
    getTextString(row: number, col: number, nContent?: number): string | undefined;
    setTextString(row: number, col: number, text: string, nContent?: number): void;
    addContent(row: number, col: number, content: CellContent): number;
    removeContent(row: number, col: number, nContent?: number): boolean;
    moveContent(row: number, col: number, fromIndex?: number, toIndex?: number): boolean;
    setBlockContent(row: number, col: number, nContent: number | undefined, blockContent: McBlockContentData): boolean;
    getEntity(row: number, col: number, nContent?: number): McDbEntity | undefined;
    getTextStyle(row: number, col: number, nContent?: number): string;
    setTextStyle(row: number, col: number, nContent: number | undefined, textStyleName: string): boolean;
    getTextHeight(row: number, col: number, nContent?: number): number;
    setTextHeight(row: number, col: number, nContent: number | undefined, height: number): boolean;
    getCellRotation(row: number, col: number, nContent?: number): number;
    setCellRotation(row: number, col: number, nContent?: number, rot?: number): boolean;
    getFieldId(row: number, col: number, nContent?: number): McDbObjectId | undefined;
    setFieldId(row: number, col: number, nContent: number | undefined, fieldId: string): boolean;
    getBlockId(row: number, col: number, nContent?: number): McDbObjectId | undefined;
    isAutoScale(row: number, col: number, nContent: number): boolean;
    setAutoScale(row: number, col: number, nContent: number, autoScale: boolean): boolean;
    getScale(row: number, col: number, nContent: number): number;
    setScale(row: number, col: number, nContent: number, scale: number): boolean;
    getBlockAttributes(row: number, col: number, nContent: number): Record<string, any> | undefined;
    setBlockAttributeValue(row: number, col: number, nContent: number, attTag: string, value: string): boolean;
    getGridColor(row: number, col: number, iEdge: CellEdgeMask): McColor;
    setGridColor(row: number, col: number, lineType: GridLineType, color: McColor): boolean;
    getGridVisibility(row: number, col: number, iEdge: CellEdgeMask): boolean;
    setGridVisibility(row: number, col: number, lineType: GridLineType, value: boolean): boolean;
    getGridLineWeight(row: number, col: number, iEdge: CellEdgeMask): McDbLineWeight;
    setGridLineWeight(row: number, col: number, lineType: GridLineType, value: McDbLineWeight): boolean;
    getGridLineType(row: number, col: number, iEdge: CellEdgeMask): string;
    setGridLineType(row: number, col: number, lineType: GridLineType, value: string): boolean;
    getGridLineStyle(row: number, col: number, iEdge: CellEdgeMask): GridLineStyle;
    setGridLineStyle(row: number, col: number, lineType: GridLineType, value: GridLineStyle): boolean;
    getDoubleLineSpacing(row: number, col: number, iEdge: CellEdgeMask): number;
    setDoubleLineSpacing(row: number, col: number, lineType: GridLineType, value: number): boolean;
    setGridLineOverride(row: number, col: number, lineType: GridLineType, gridLineProperty: McGridLineProperty): boolean;
    insertColumnsAndInherit(col: number, nInheritFrom: number, nCols?: number): boolean;
    deleteColumns(col: number, nCols?: number): boolean;
    insertRowsAndInherit(row: number, nInheritFrom: number, nRows: number): boolean;
    deleteRows(row: number, nRows?: number): boolean;
    mergeCells(minRow: number, maxRow: number, minCol: number, maxCol: number): boolean;
    unmergeCells(minRow: number, maxRow: number, minCol: number, maxCol: number): boolean;
    isMergedCell(row: number, col: number): boolean;
    getMergedCellRanges(row: number, col: number): CellRange | null;
    hitTest(wpt: McGeVector3, wviewVec: McGeVector3, wxaper: number, wyaper: number, resultRowIndex: number, resultColumnIndex: number): boolean;
    hitTestDetailed(wpt: McGeVector3, wviewVec: McGeVector3, wxaper: number, wyaper: number): {
        nItem: TableHitItem;
        resultRowIndex?: number;
        resultColumnIndex?: number;
        contentIndex?: number;
    };
    private getHitCellByPoint;
    private findRowByY;
    private findColByX;
    private isHitRowIndicator;
    private isHitColumnIndicator;
    private getHitGridLine;
    private isRowGridLineVisible;
    private isColGridLineVisible;
    rebuildChildEntity(db: McDbDatabase, recursive?: boolean): void;
    private buildGridLines;
    private drawLine;
    private createRowGridLineEntity;
    private createSingleRowGridLine;
    private createColGridLineEntity;
    private isGridLineSegmentVisible;
    setDrawOrder(order: number): void;
    _setDrawOrder(order: number): void;
    private initRowGridLines;
    private applyMergedCellRowGridVisibility;
    private setGridLineVisibility;
    private initColGridLines;
    private applyMergedCellColGridVisibility;
    private buildCellContents;
    private createCellBackgroundColor;
    private buildCellContent;
    private buildTextContent;
    private buildBlockContent;
    private showIndicator;
    private hideIndicator;
    private hightIndicator;
    transformBy(matrix: McGeMatrix4): boolean;
    getStretchPoints(): MCEntityStretchPoints[];
    setStretchPoints(indexPoints: MCEntityStretchPoints[]): void;
    getSnapPoints(is2D: boolean): MCEntitySnapPoints[];
    protected createGrips(): void;
    raycast2D(raycaster: McGeRaycaster): PickResult | null;
    raycast3D(raycaster: McGeRaycaster): PickResult | null;
    raycastVolume2D(planeVolume: McGePlaneVolume, isWrap?: boolean): boolean;
    raycastVolume3D(planeVolume: McGePlaneVolume, isWrap?: boolean): boolean;
    setHighLight(bLight?: boolean, bShowGrip?: boolean, simpleHL?: boolean, position?: McGeVector3 | undefined): void;
    highLightCell(row: number, col: number, bLight?: boolean, bShowGrip?: boolean, simpleHL?: boolean): boolean;
    highLightCellRange(cellRange: CellRange, bLight?: boolean, bShowGrip?: boolean, simpleHL?: boolean): boolean;
    getCellRangeExtents(range: CellRange): {
        min: McGeVector3;
        max: McGeVector3;
    };
    getHighLightCellRange(): CellRange | undefined;
    handleFrameSelectCells(bLight: boolean | undefined, bShowGrip: boolean | undefined, simpleHL: boolean | undefined, ptClick: McGeVector3, ptClickUp: McGeVector3): void;
    private drawHighLightLine;
    private updateHighLightLine;
    erase(): void;
    clearHighLight(): void;
    private getCellRange;
    private getCellRangeData;
    setHover(isHover?: boolean, isMerge?: boolean, simpleHL?: boolean, position?: McGePoint | undefined): void;
    onContextMenu(defaultMenus: string[]): McMenuGroup | null;
    _pasteFromClipboardCellData(): Promise<void>;
    _pasteCellDataToTable(cellRangeData: CellRangeDataEx): Promise<void>;
    _copyHighlightLightRangeToClipboard(): Promise<void>;
    private _bufferToClipboard;
    private _cellRangeDataToBuffer;
    static _bufferToCellRangeData(buffer: ArrayBuffer): CellRangeDataEx | undefined;
    mctfInFields(fields: McMctfFiler): void;
    mctfOutFields(fields: McMctfFiler): void;
    mcdInFields(filer: McMcdFiler): void;
    mcdOutFields(filer: McMcdFiler): void;
}
