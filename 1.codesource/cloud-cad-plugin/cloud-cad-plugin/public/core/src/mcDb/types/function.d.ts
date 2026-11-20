import { McDbSymbolTableRecord } from '../mcDbSymbolTableRecord';
import { CellAlignment, TextHorizontalMode, TextVerticalMode } from './enum';
export declare function _upDateSymbolRecordObjRef(record: McDbSymbolTableRecord, changedOld: Record<string, any>, changedNew: Record<string, any>): void;
export declare function cellAlignmentToHorizontalAndVerticalMode(alignment: CellAlignment): {
    horizontalMode: TextHorizontalMode;
    verticalMode: TextVerticalMode;
};
