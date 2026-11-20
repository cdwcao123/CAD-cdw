import { McMcdFiler, McMctfFiler } from '../../mc';
import { McEngine2D, McEngine3D } from '../../mcCore';
import { McDbEntity, MCEntitySnapPoints, MCEntityStretchPoints } from '..';
import { McGeMatrix4, McGePoint2, McGeVector2 } from '../../mcGe';
export declare class McDbSolid extends McDbEntity {
    #private;
    protected readonly _type: string;
    protected static readonly _className: string;
    constructor();
    getElevation(): number;
    setElevation(value: number): void;
    getPointAt(index: number): McGeVector2 | null;
    setPointAt(index: number, pt: McGeVector2 | McGePoint2): boolean;
    worldDraw2d(engine: McEngine2D): void;
    worldDraw3d(engine: McEngine3D): void;
    transformBy(matrix: McGeMatrix4): boolean;
    getStretchPoints(): MCEntityStretchPoints[];
    setStretchPoints(indexPoints: MCEntityStretchPoints[]): void;
    getSnapPoints(is2D: boolean): MCEntitySnapPoints[];
    createGrips(): void;
    mctfInFields(sourceFields: McMctfFiler): Promise<void>;
    mctfOutFields(targetFields: McMctfFiler): void;
    mcdInFields(filer: McMcdFiler): Promise<void>;
    mcdOutFields(filer: McMcdFiler): void;
}
