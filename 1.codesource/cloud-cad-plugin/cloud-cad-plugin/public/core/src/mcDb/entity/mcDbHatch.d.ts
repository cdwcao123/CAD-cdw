import { McColor } from '../../mc';
import { IHatch } from '../../mc/mcCurHatchParamManager';
import { McMcdFiler } from '../../mc/mcLoaders/mcMcdFiler';
import { McMctfFiler } from '../../mc/mcLoaders/mcMctfFiler';
import { McReturnStatus } from '../../mc/mcReturnStatus';
import { IMcDbHatchPatternLineDef, McEngine2D, McEngine3D } from '../../mcCore';
import { McDbEntity, MCEntitySnapPoints, MCEntityStretchPoints } from '..';
import { McGeMatrix4, McGeVector2, McGeVector3 } from '../../mcGe';
import { GradientPatternType, HatchEdgeType, HatchLoopType, HatchObjectType, HatchPatternType, HatchStyle } from '../types/enum';
import { McDbObjectIdArray } from '../types/type';
export interface IHatchLoop {
    loopType: number;
    pts: McGeVector2[];
    bulges: number[];
    edges: ILoopEdge[];
    objIds: McDbObjectIdArray;
}
export interface ILoopEdge {
    type: HatchEdgeType;
}
export interface ILoopEdgeLine extends ILoopEdge {
    startPt: McGeVector2;
    endPt: McGeVector2;
}
export interface ILoopEdgeCirArc extends ILoopEdge {
    center: McGeVector2;
    radius: number;
    startAngle: number;
    endAngle: number;
    isClockWise: boolean;
}
export interface ILoopEdgeEllArc extends ILoopEdge {
    center: McGeVector2;
    majorAxis: McGeVector2;
    minorAxis: McGeVector2;
    minorAxisRatio: number;
    startAngle: number;
    endAngle: number;
    isClockWise: boolean;
}
export interface ILoopEdgeSpline extends ILoopEdge {
    controlPoints: McGeVector2[];
    degree: number;
    knots: number[];
    weights: number[];
}
export declare class McDbHatch extends McDbEntity {
    #private;
    protected readonly _type: string;
    protected static readonly _className: string;
    constructor(hatchType?: HatchObjectType, patternName?: string);
    getBackgroundColor(): McColor;
    setBackgroundColor(color: McColor): McReturnStatus<string>;
    gradientType(): GradientPatternType | undefined;
    gradientName(): string | undefined;
    setGradient(gradType: GradientPatternType, gradName: string): void;
    getGradientAngle(): number | undefined;
    setGradientAngle(value: number): void;
    getGradientColors(): {
        color: McColor;
        value: number;
    }[] | undefined;
    setGradientColors(gradColors: {
        color: McColor;
        value: number;
    }[]): void;
    getGradientOneColorMode(): boolean | undefined;
    setGradientOneColorMode(oneColorMode: boolean): void;
    getShadeTintValue(): McReturnStatus<number | string>;
    setShadeTintValue(value: number): McReturnStatus<string>;
    setShadeTintValueAndColor2(value: number): McReturnStatus<string>;
    gradientShift(): number | undefined;
    setGradientShift(shiftValue: number): McReturnStatus<string>;
    evaluateGradientColorAt(value: number): McReturnStatus<McColor | string>;
    setPatternType(patternType: HatchPatternType): void;
    getPatternType(): HatchPatternType | undefined;
    setPatternName(patName: string): void;
    getPatternName(): string | undefined;
    getPatternLineDefs(): IMcDbHatchPatternLineDef[] | undefined;
    getPatternAngle(): number | undefined;
    setPatternAngle(value: number): void;
    getPatternSpace(): number;
    setPatternSpace(value: number): McReturnStatus<string>;
    getPatternScale(): number;
    setPatternScale(value: number): McReturnStatus<string>;
    patternDouble(): boolean | undefined;
    setPatternDouble(isDouble: boolean): McReturnStatus<boolean | string>;
    numPatternDefinitions(): McReturnStatus<number | undefined | string>;
    getPatternDefinitionAt(index: number): McReturnStatus<IMcDbHatchPatternLineDef | string>;
    getHatchStyle(): HatchStyle;
    setHatchStyle(hStyle: HatchStyle): boolean;
    evaluateHatch(bUnderestimateNumLines?: boolean): McReturnStatus<string>;
    evaluateHatchAllScales(bUnderestimateNumLines?: boolean): McReturnStatus<string>;
    getArea(): number;
    lineGenerationEnabled(): boolean;
    setLineGenerationEnabled(bEnable: boolean): boolean;
    numHatchLines(): number;
    isSolidFill(): boolean;
    getHatchLineDataAt(index: number): McReturnStatus<{
        startPt: McGeVector3;
        endPt: McGeVector3;
    } | null | string>;
    getHatchLinesData(): McReturnStatus<{
        startPts: McGeVector3[];
        endPts: McGeVector3[];
    } | null | string>;
    numLoops(): number;
    loopTypeAt(loopIndex: number): McReturnStatus<HatchLoopType | string>;
    getLoopAt(loopIndex: number): IHatchLoop | undefined;
    getLoopCount(): number;
    appendLoop(loop: IHatchLoop): McReturnStatus<string>;
    insertLoopAt(loopIndex: number, loop: IHatchLoop): McReturnStatus<string>;
    removeLoopAt(loopIndex: number): McReturnStatus<string>;
    associative(): boolean;
    setAssociative(isAssociative: boolean): McReturnStatus<string>;
    appendLoopObjIds(loopType: HatchLoopType, dbObjIds: McDbObjectIdArray): McReturnStatus<string>;
    insertLoopObjIdsAt(loopIndex: number, loopType: HatchLoopType, dbObjIds: McDbObjectIdArray): McReturnStatus<string>;
    getAssocObjIdsAt(loopIndex: number): McReturnStatus<McDbObjectIdArray | string>;
    getAssocObjIds(): McReturnStatus<McDbObjectIdArray | string>;
    removeAssocObjIds(): McReturnStatus<string>;
    getHatchObjectType(): HatchObjectType;
    setHatchObjectType(type: HatchObjectType): boolean;
    setProperty(key: keyof IHatch, value: any): void;
    isGradient(): boolean;
    isHatch(): boolean;
    getCenter(): McGeVector3 | null;
    getCanExplode(): boolean;
    explode(): McDbEntity[];
    worldDraw2d(engine: McEngine2D): void;
    worldDraw3d(engine: McEngine3D): void;
    erase2d(): void;
    erase3d(): void;
    getStretchPoints(): MCEntityStretchPoints[];
    setStretchPoints(indexPoints: MCEntityStretchPoints[]): void;
    getSnapPoints(is2D: boolean): MCEntitySnapPoints[];
    createGrips(): void;
    protected deleteGrips(): void;
    transformBy(matrix: McGeMatrix4): boolean;
    getElevation(): number;
    setElevation(value: number): void;
    onDBClick(): boolean;
    mctfInFields(sourceFields: McMctfFiler): Promise<void>;
    mctfOutFields(targetFields: McMctfFiler): void;
    mcdInFields(filer: McMcdFiler): void;
    mcdOutFields(filer: McMcdFiler): void;
}
