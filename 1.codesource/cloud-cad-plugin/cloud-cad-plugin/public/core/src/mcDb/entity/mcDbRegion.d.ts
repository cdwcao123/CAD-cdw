import { McMcdFiler } from '../../mc/mcLoaders/mcMcdFiler';
import { McMctfFiler } from '../../mc/mcLoaders/mcMctfFiler';
import { McEngine2D, McEngine3D } from '../../mcCore';
import { McGeMatrix4 } from '../../mcGe';
import { MCEntitySnapPoints, MCEntityStretchPoints } from '../types/interface';
import { McDbEntity } from './mcDbEntity';
import { ILoopEdge } from './mcDbHatch';
export interface IComplexes {
    brShell: IBrShell[];
}
export interface IBrShell {
    brFace: IBrFace[];
}
export interface IBrFace {
    brLoop: IBrLoop[];
}
export interface IBrLoop {
    edges: ILoopEdge[];
}
export declare class McDbRegion extends McDbEntity {
    protected readonly _type: string;
    protected static readonly _className: string;
    protected complexes: IComplexes[];
    constructor();
    constructor(complexes: IComplexes[]);
    setComplexes(complexes: IComplexes[]): void;
    getComplexes(): IComplexes[];
    explode(): McDbEntity[];
    worldDraw2d(engine: McEngine2D): void;
    worldDraw3d(engine: McEngine3D): void;
    transformBy(matrix: McGeMatrix4): boolean;
    protected transformEdge(edge: ILoopEdge, matrix: McGeMatrix4): void;
    getStretchPoints(): MCEntityStretchPoints[];
    setStretchPoints(indexPoints: MCEntityStretchPoints[]): void;
    getSnapPoints(is2D: boolean): MCEntitySnapPoints[];
    protected createGrips(): void;
    protected getEdgeIndexPoints(startIndex: number, edge: ILoopEdge): MCEntityStretchPoints[];
    protected getEdgeGripPoints(edge: ILoopEdge): MCEntitySnapPoints[];
    getPerimeter(): number;
    protected getEdgeLength(edge: ILoopEdge): number;
    getArea(): number;
    mctfInFields(fields: McMctfFiler): Promise<void>;
    protected mctfInComplexesFields(sourceFields: McMctfFiler): void;
    mctfOutFields(fields: McMctfFiler): void;
    protected mctfOutComplexesFields(filer: McMctfFiler): void;
    mcdInFields(filer: McMcdFiler): Promise<void>;
    protected mcdInComplexesFields(filer: McMcdFiler): void;
    mcdOutFields(filer: McMcdFiler): void;
    protected mcdOutComplexesFields(filer: McMcdFiler): void;
}
