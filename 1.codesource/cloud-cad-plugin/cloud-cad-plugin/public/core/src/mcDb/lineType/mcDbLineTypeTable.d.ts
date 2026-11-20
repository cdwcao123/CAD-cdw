import { McDbEntity } from '../entity/mcDbEntity';
import { McDbDatabase } from '../mcDbDatabase';
import { McDbSymbolTable } from '../mcDbSymbolTable';
import { McDbLineType } from './mcDbLineType';
export declare class McDbLineTypeTable extends McDbSymbolTable<McDbLineType> {
    protected readonly _type: string;
    protected static readonly _className: string;
    constructor(db: McDbDatabase);
    addEntityRef(entity: McDbEntity): void;
    removeEntityRef(entity: McDbEntity): void;
    updateEntityRef(entity: McDbEntity, changedOld: Record<string, any>, changedNew: Record<string, any>): void;
}
