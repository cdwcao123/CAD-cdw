import { McDbBlockDef, McDbDatabase, McDbSymbolTable } from '..';
export declare class McDbBlockDefTable extends McDbSymbolTable<McDbBlockDef> {
    protected readonly _type: string;
    protected static readonly _className: string;
    constructor(db: McDbDatabase);
}
