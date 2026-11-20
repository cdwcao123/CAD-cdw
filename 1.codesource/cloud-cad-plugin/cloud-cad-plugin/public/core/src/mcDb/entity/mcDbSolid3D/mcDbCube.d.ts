import { McMcdFiler } from '../../../mc/mcLoaders/mcMcdFiler';
import { McMctfFiler } from '../../../mc/mcLoaders/mcMctfFiler';
import { McEngine2D, McEngine3D } from '../../../mcCore/mcView';
import { MCEntitySnapPoints, MCEntityStretchPoints } from '../../types/interface';
import { McGeVector3 } from '../../../mcGe';
import { McDbSolid3DBase } from './mcDbSolid3DBase';
export declare class McDbCube extends McDbSolid3DBase {
    protected readonly _type: string;
    protected static readonly _className: string;
    protected width: number;
    getWidth(): number;
    setWidth(value: number): void;
    constructor();
    constructor(position: McGeVector3, width?: number);
    constructor(width: number);
    worldDraw2d(engine: McEngine2D): void;
    worldDraw3d(engine: McEngine3D): void;
    getStretchPoints(): MCEntityStretchPoints[];
    setStretchPoints(indexPoints: MCEntityStretchPoints[]): void;
    getSnapPoints(is2D: boolean): MCEntitySnapPoints[];
    protected createGrips(): void;
    mctfInFields(sourceFields: McMctfFiler): void;
    mctfOutFields(targetFields: McMctfFiler): void;
    mcdInFields(filer: McMcdFiler): void;
    mcdOutFields(filer: McMcdFiler): void;
}
