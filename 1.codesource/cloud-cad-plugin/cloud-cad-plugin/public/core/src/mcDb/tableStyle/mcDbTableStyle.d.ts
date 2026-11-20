import { default as McColor } from '../../mc/mcColor';
import { McMcdFiler } from '../../mc/mcLoaders/mcMcdFiler';
import { McMctfFiler } from '../../mc/mcLoaders/mcMctfFiler';
import { MCDDataBlockType } from '../../mc/types/enum';
import { McDbDictionaryRecord } from '../mcDbDictionaryRecord';
import { CellAlignment, CellClass, CellEdgeMask, GridLineStyle, McDataType, McDbLineWeight, McUnitType, TableFlowDirection } from '../types/enum';
export interface IMcGridLineProperty {
    visibility?: boolean;
    lineStyle?: GridLineStyle;
    lineWeight?: McDbLineWeight;
    lineType?: string;
    color?: McColor;
    doubleLineSpacing?: number;
}
export declare class McGridLineProperty implements IMcGridLineProperty {
    visibility?: boolean;
    lineStyle?: GridLineStyle;
    lineWeight?: McDbLineWeight;
    lineType?: string;
    color?: McColor;
    doubleLineSpacing?: number;
    hasProperty(): boolean;
    isEqualValidFlag(style: McGridLineProperty): boolean;
    merge(other: McGridLineProperty): void;
    constructor(props?: IMcGridLineProperty);
    mctfInFields(filer: McMctfFiler): void;
    mctfOutFields(targetFields: McMctfFiler): void;
    mcdInFields(filer: McMcdFiler): void;
    mcdOutFields(targetFields: McMcdFiler): void;
    toJson(): {
        visibility: boolean | undefined;
        lineStyle: GridLineStyle | undefined;
        lineWeight: McDbLineWeight | undefined;
        lineType: string | undefined;
        color: McColor | undefined;
        doubleLineSpacing: number | undefined;
    };
    static createDefault(): McGridLineProperty;
}
export declare class McCellStyle {
    backgroundColor: McColor;
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
    textColor: McColor;
    textRotation: number;
    gridLineStyles: Map<CellEdgeMask, McGridLineProperty>;
    static createDefaultStyle(styleType: '标题' | '表头' | '数据'): McCellStyle;
}
export declare class McDbTableStyle extends McDbDictionaryRecord {
    protected readonly _type: string;
    protected static readonly _className: string;
    description: string;
    bitFlags: number;
    flowDirection: TableFlowDirection;
    cellStyles: Map<string, McCellStyle>;
    constructor(copyStyle?: McDbTableStyle);
    getDependency(): {
        type: MCDDataBlockType;
        id: string;
    }[];
    static createStandardStyle(): McDbTableStyle;
    getCellStyle(name: string): McCellStyle;
    getGridLineStyle(cellStyleName: string, edgeMask: CellEdgeMask): McGridLineProperty;
}
