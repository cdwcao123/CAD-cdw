import { McMcdFiler } from '../mcLoaders/mcMcdFiler';
import { McMctfFiler } from '../mcLoaders/mcMctfFiler';
import { McGeVector2 } from '../../mcGe/mcGeVector2';
import { IMcDbHatchPatternLineDef } from '../../mcCore/types/interface';
export declare class McDbHatchPatternLineDef implements IMcDbHatchPatternLineDef {
    angle: number;
    origin: McGeVector2;
    offset: McGeVector2;
    dashPattern: Array<number>;
    constructor(angle?: number, origin?: McGeVector2, offset?: McGeVector2, dashPattern?: Array<number>);
    clone(): McDbHatchPatternLineDef;
    mctfInFields(fields: McMctfFiler): void;
    mctfOutFields(fields: McMctfFiler): void;
    mcdInFields(fields: McMcdFiler): void;
    mcdOutFields(fields: McMcdFiler): void;
}
