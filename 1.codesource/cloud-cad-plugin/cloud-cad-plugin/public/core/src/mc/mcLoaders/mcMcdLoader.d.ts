import { McDbDatabase } from '../../mcDb';
import { McGeVector3 } from '../../mcGe';
import { MCDDataBlockType } from '../types/enum';
export declare class McMcdLoader {
    #private;
    constructor(db: McDbDatabase);
    load(fileData: ArrayBuffer, textCode?: string, isTemplate?: boolean, silentTaskProgress?: boolean): Promise<boolean>;
    loadEntities(entityData: ArrayBuffer): Promise<{
        basePoint: McGeVector3;
        entityMap: Map<MCDDataBlockType, any[]>;
    }>;
    loadAsync(fileData: ArrayBuffer, textCode?: string, isTemplate?: boolean, silentTaskProgress?: boolean): Promise<boolean>;
}
