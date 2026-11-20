import { McMcdFiler } from '../../mc/mcLoaders/mcMcdFiler';
import { McMctfFiler } from '../../mc/mcLoaders/mcMctfFiler';
import { McEngine2D, McEngine3D } from '../../mcCore';
import { McGeMatrix4, McGeObject, McGePoint, McGeVector3 } from '../../mcGe';
import { MCEntitySnapPoints, MCEntityStretchPoints } from '../types/interface';
import { McDbEntity } from './mcDbEntity';
export declare class McDbPoint extends McDbEntity {
    #private;
    protected readonly _type: string;
    protected static readonly _className: string;
    constructor(pt: McGeVector3 | McGePoint);
    toMcGe(bTo2D?: boolean): McGeObject | null;
    getPosition(): McGeVector3;
    setPosition(value: McGeVector3 | McGePoint): void;
    getRotation(): number;
    setRotation(value: number): void;
    worldDraw2d(engine: McEngine2D): void;
    worldDraw3d(engine: McEngine3D): void;
    getStretchPoints(): MCEntityStretchPoints[];
    setStretchPoints(indexPoints: MCEntityStretchPoints[]): void;
    getSnapPoints(is2D: boolean): MCEntitySnapPoints[];
    createGrips(): void;
    transformBy(matrix: McGeMatrix4): boolean;
    isPlanar(): boolean;
    mctfInFields(fields: McMctfFiler): Promise<void>;
    mctfOutFields(fields: McMctfFiler): void;
    mcdInFields(filer: McMcdFiler): Promise<void>;
    mcdOutFields(filer: McMcdFiler): void;
}
