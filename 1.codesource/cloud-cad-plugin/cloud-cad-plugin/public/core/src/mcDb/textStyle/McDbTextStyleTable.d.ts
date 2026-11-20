import { McReturnStatus } from '../../mc/mcReturnStatus';
import { McDbDatabase } from '../mcDbDatabase';
import { McDbSymbolTable } from '../mcDbSymbolTable';
import { McDbTextStyle } from './mcDbTextStyle';
export declare class McDbTextStyleTable extends McDbSymbolTable<McDbTextStyle> {
    protected readonly _type: string;
    protected static readonly _className: string;
    constructor(db: McDbDatabase);
    addTextStyle(style: McDbTextStyle): Promise<McReturnStatus<string>>;
    setCurrent(name: string): boolean;
}
