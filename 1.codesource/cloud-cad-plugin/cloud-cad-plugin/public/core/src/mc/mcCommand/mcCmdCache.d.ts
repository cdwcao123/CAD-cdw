import { McCore } from '../../mcCore';
import { ICmdRecord } from '../../mcCore/types/interface';
export declare class McCmdCache {
    #private;
    readonly id: string;
    cmdName: string;
    constructor(core: McCore, cmdId: string, records?: ICmdRecord[]);
    addRecord(record: ICmdRecord): void;
    getRecords(): ICmdRecord[];
    popRecord(): void;
    clear(): void;
    reverse(): void;
    undo(): Promise<boolean>;
    redo(): Promise<boolean>;
}
