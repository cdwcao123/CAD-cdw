import { McDbMaterial } from '..';
import { McDbDatabase } from '../mcDbDatabase';
import { McDbSymbolTable } from '../mcDbSymbolTable';
export declare class McDbMaterialTable extends McDbSymbolTable<McDbMaterial> {
    protected readonly _type: string;
    protected static readonly _className: string;
    constructor(db: McDbDatabase);
}
