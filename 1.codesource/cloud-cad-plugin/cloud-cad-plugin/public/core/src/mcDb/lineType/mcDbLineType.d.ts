import { McMcdFiler } from '../../mc/mcLoaders/mcMcdFiler';
import { McMctfFiler } from '../../mc/mcLoaders/mcMctfFiler';
import { McDbSymbolTableRecord } from '../mcDbSymbolTableRecord';
import { IMcDbLineType, IMcDbLineTypeSegment } from '../types/interface';
export declare class McDbLineType extends McDbSymbolTableRecord {
    #private;
    protected readonly _type: string;
    protected static readonly _className: string;
    constructor(name?: string, desc?: string, pattern?: IMcDbLineTypeSegment[] | string, isReNameable?: boolean);
    getDesc(): string;
    setDesc(desc: string): boolean;
    getPattern(): IMcDbLineTypeSegment[];
    _getValidPattern(layerName?: string, blockDefEntLineType?: string): IMcDbLineTypeSegment[];
    setPattern(value: IMcDbLineTypeSegment[]): boolean;
    mctfInFields(fields: McMctfFiler): Promise<void>;
    mctfOutFields(fields: McMctfFiler): void;
    mcdInFields(fields: McMcdFiler): Promise<void>;
    mcdOutFields(fields: McMcdFiler): void;
    static byLayer: () => McDbLineType;
    static byBlock: () => McDbLineType;
    static continuous: () => McDbLineType;
    static dashed: () => McDbLineType;
    static isCustom(lineType: string | McDbLineType): boolean;
    static parseLinFile(fileContent: string): IMcDbLineType[];
    static parsePatternLine(line: string): IMcDbLineTypeSegment[];
    updateRefEntity(changedOld: Record<string, any>, changedNew: Record<string, any>): Promise<void>;
}
