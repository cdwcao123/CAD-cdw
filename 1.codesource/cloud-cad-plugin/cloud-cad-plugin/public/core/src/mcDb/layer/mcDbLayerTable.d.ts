import { McDbEntity } from '../entity/mcDbEntity';
import { McDbDatabase } from '../mcDbDatabase';
import { McDbSymbolTable } from '../mcDbSymbolTable';
import { McDbLayer } from './mcDbLayer';
export declare class McDbLayerTable extends McDbSymbolTable<McDbLayer> {
    protected readonly _type: string;
    protected static readonly _className: string;
    constructor(db: McDbDatabase);
    setCurrent(name: string): boolean;
    addEntityRef(entity: McDbEntity): void;
    removeEntityRef(entity: McDbEntity): void;
    updateEntityRef(entity: McDbEntity, changedOld: Record<string, any>, changedNew: Record<string, any>): void;
}
