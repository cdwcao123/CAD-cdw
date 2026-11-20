import { McDbDatabase, McDbSymbolTable, McDbDimStyle, McDbEntity } from '..';
export declare class McDbDimStyleTable extends McDbSymbolTable<McDbDimStyle> {
    protected readonly _type: string;
    protected static readonly _className: string;
    constructor(db: McDbDatabase);
    addEntityRef(entity: McDbEntity): void;
    removeEntityRef(entity: McDbEntity): void;
    updateEntityRef(entity: McDbEntity, changedOld: Record<string, any>, changedNew: Record<string, any>): void;
}
