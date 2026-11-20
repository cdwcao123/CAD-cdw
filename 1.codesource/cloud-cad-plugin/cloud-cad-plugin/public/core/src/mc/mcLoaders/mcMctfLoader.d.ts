import { McDbDatabase } from '../../mcDb/mcDbDatabase';
export declare class McMctfLoader {
    #private;
    constructor(db: McDbDatabase);
    load(fileData: string | ArrayBuffer, textCode?: string, isTemplate?: boolean): Promise<boolean>;
    loadAsync(fileData: string | ArrayBuffer, textCode?: string, isTemplate?: boolean): Promise<boolean>;
    loadXData(xData: any): Promise<void>;
}
