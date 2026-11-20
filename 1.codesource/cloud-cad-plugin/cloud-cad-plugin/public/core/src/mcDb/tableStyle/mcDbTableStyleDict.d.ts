import { McDbDatabase } from '../mcDbDatabase';
import { McDbDictionary } from '../mcDbDictionary';
import { McDbTableStyle } from './mcDbTableStyle';
export declare class McDbTableStyleDict extends McDbDictionary<McDbTableStyle> {
    readonly _type: string;
    static readonly _className: string;
    constructor(db: McDbDatabase);
    init(): void;
}
