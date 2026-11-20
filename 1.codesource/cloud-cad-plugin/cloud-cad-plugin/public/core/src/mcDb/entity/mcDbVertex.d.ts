import { McMcdFiler } from '../../mc/mcLoaders/mcMcdFiler';
import { McMctfFiler } from '../../mc/mcLoaders/mcMctfFiler';
import { McGeVector3 } from '../../mcGe/mcGeVector3';
import { IMcDbVertex } from '../types/interface';
export declare class McDbVertex implements IMcDbVertex {
    position: McGeVector3;
    bulge: number;
    startWidth: number;
    endWidth: number;
    constructor(position: McGeVector3, bulge?: number, startWidth?: number, endWidth?: number);
    mctfInFields(fields: McMctfFiler): Promise<void>;
    mctfOutFields(fields: McMctfFiler): void;
    mcdInFields(filer: McMcdFiler): Promise<void>;
    mcdOutFields(filer: McMcdFiler): void;
}
