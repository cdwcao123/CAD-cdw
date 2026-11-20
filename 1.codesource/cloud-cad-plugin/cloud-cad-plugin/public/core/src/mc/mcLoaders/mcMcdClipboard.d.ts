import { McDbObject } from '../../mcDb';
import { McGeVector3 } from '../../mcGe';
import { MCDDataBlockType } from '../types/enum';
export declare function copyEntityToClipboard(basePoint: McGeVector3, entities: McDbObject[]): Promise<void>;
export declare function createEntityFromClipboard(): Promise<{
    basePoint: McGeVector3;
    entityMap: Map<MCDDataBlockType, any[]>;
}>;
