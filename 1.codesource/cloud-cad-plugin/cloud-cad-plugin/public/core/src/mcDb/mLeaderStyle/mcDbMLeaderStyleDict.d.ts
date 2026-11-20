import { McDbDatabase } from '../mcDbDatabase';
import { McDbDictionary } from '../mcDbDictionary';
import { McDbMLeaderStyle } from './mcDbMLeaderStyle';
export declare class McDbMLeaderStyleDict extends McDbDictionary<McDbMLeaderStyle> {
    readonly _type: string;
    static readonly _className: string;
    constructor(db: McDbDatabase);
    init(): void;
}
