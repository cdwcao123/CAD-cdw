import { McMcdFiler } from '../../mc/mcLoaders/mcMcdFiler';
import { McMctfFiler } from '../../mc/mcLoaders/mcMctfFiler';
import { McGePoint2 } from '../../mcGe';
import { IMcDbVertex2d } from '../types/interface';
export declare class McDbVertex2d implements IMcDbVertex2d {
    position: McGePoint2;
    bulge: number;
    startWidth: number;
    endWidth: number;
    constructor(position: McGePoint2, bulge?: number, startWidth?: number, endWidth?: number);
    mctfInFields(fields: McMctfFiler): Promise<void>;
    mctfOutFields(fields: McMctfFiler): void;
    mcdInFields(filer: McMcdFiler): Promise<void>;
    mcdOutFields(filer: McMcdFiler): void;
}
