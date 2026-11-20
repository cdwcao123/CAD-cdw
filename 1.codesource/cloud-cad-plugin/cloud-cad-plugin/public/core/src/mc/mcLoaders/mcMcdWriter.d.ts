import { McDbDatabase } from '../../mcDb';
import { McGeVector3 } from '../../mcGe';
import { MCDDataBlockType } from '../types/enum';
export declare class McMcdWriter {
    #private;
    constructor(db: McDbDatabase);
    setProgressCallback(callback: (progress: number) => void): void;
    write(bToTemplateFile?: boolean): ArrayBuffer;
    writeEntities(basePoint: McGeVector3, entityList: Map<MCDDataBlockType, string[]>): ArrayBuffer;
    writeDrawingByObjectIds(entityList: Map<MCDDataBlockType, string[]>): ArrayBuffer;
    writeAsync(): Promise<ArrayBuffer>;
}
