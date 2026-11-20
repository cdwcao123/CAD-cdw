import { IMcDbHatchPatternLineDef, McCore } from '../mcCore';
import { GradientPatternType, HatchObjectType, HatchPatternType, HatchStyle, IHatchLoop, McDbDatabase, McDbEntity, McDbHatch } from '../mcDb';
import { McPrGetEntities, McPrGetPoint } from '../mcPr';
import { default as McColor } from './mcColor';
import { McEventReactor } from './mcEventReactor';
export interface IHatch {
    backgroundColor: McColor;
    associative: boolean;
    objectType: HatchObjectType;
    gradientPatternType?: GradientPatternType;
    gradientName?: string;
    color: McColor;
    gradientAngle?: number;
    gradientColors?: {
        color: McColor;
        value: number;
    }[];
    gradientOneColorMode?: boolean;
    shadeTintValue?: number;
    gradientShift?: number;
    patternType?: HatchPatternType;
    patternName?: string;
    hatchStyle: HatchStyle;
    patternAngle: number;
    patternScale: number;
    patternSpace: number;
    isPatternDouble?: boolean;
    patternDefinitions?: IMcDbHatchPatternLineDef[];
    lineGenerationEnabled: boolean;
    transparency: number;
    elevation: number;
    isIndependent: boolean;
}
export type CurHatchParamManagerEventType = {
    draw: () => void;
    drawFinish: (hatch: McDbHatch) => void;
    edit: (hatch: McDbHatch) => void;
    cancel: () => void;
    hatchPanelClose: () => void;
};
export declare class McCurHatchParamManager extends McEventReactor<CurHatchParamManagerEventType> {
    #private;
    params: IHatch;
    private static _instance;
    private _drawOrEditCallBack;
    resolve: ((data?: any) => void) | null;
    reject: ((reason?: any) => void) | null;
    hatch?: McDbHatch;
    entities: Map<string, McDbEntity>;
    pickEntityPr: McPrGetEntities | null;
    pickPointPr: McPrGetPoint | null;
    protected constructor();
    setParams(params: IHatch): void;
    getParams(): IHatch;
    setParam<K extends keyof IHatch>(param: K, value: IHatch[K]): void;
    getParam<K extends keyof IHatch>(param: K): IHatch[K];
    setDrawOrEditCallBack(callback: (activeType: 'draw' | 'edit', hatch?: McDbHatch) => void): void;
    onListen(): void;
    run(): Promise<void>;
    startDrawHatch(rootCore: McCore, isBoundary?: boolean): Promise<void>;
    drawBoundaryByHatchLoops(loops: IHatchLoop[], db: McDbDatabase): McDbEntity[] | null;
    drawHatchByEntities(entities: McDbEntity[], db: McDbDatabase): McDbHatch | null;
    drawHatchByLoops(loops: IHatchLoop[], db: McDbDatabase): McDbHatch | null;
    static get instance(): McCurHatchParamManager;
}
