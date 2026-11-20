import { McDbDatabase } from '../mcDbDatabase';
import { McDbSymbolTable } from '../mcDbSymbolTable';
import { McDbObjectId } from '../types/type';
import { McDbAbstractViewTableRecord } from './McDbAbstractViewTableRecord';
export declare abstract class McDbAbstractViewTable<T extends McDbAbstractViewTableRecord> extends McDbSymbolTable<T> {
    protected readonly _type: string;
    protected static readonly _className: string;
    constructor(db: McDbDatabase);
    getAt(entryName: string): T | undefined;
    getAtId(entryName: string): McDbObjectId | undefined;
}
