import { McDbDatabase } from '../mcDbDatabase';
import { McDbAbstractViewTable } from './McDbAbstractViewTable';
import { McDbViewportTableRecord } from './McDbViewportTableRecord';
export declare class McDbViewPortTable extends McDbAbstractViewTable<McDbViewportTableRecord> {
    protected readonly _type: string;
    protected static readonly _className: string;
    constructor(db: McDbDatabase);
    getAt(entryName: string): McDbViewportTableRecord | undefined;
}
export { McDbViewPortTable as McDbViewportTable };
