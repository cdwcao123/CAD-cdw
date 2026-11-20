import { McMctfFiler, McMcdFiler, McDbHatchPatternLineDef } from '..';
import { HatchPatternType } from '../../mcDb';
import { McGeExtent2 } from '../../mcGe';
import { IMcHatchPatternDef } from '../../mcCore/types/interface';
export declare class McHatchPatternDef implements IMcHatchPatternDef {
    name: string;
    editable: boolean;
    hatchType: HatchPatternType;
    group: string;
    desc: string;
    lines: Array<McDbHatchPatternLineDef>;
    constructor(name: string, lineDefs: Array<McDbHatchPatternLineDef>, editable?: boolean, group?: string, hatchType?: HatchPatternType, desc?: string);
    getExtent2D(): McGeExtent2;
    mctfInFields(fields: McMctfFiler): Promise<void>;
    mctfOutFields(fields: McMctfFiler): void;
    mcdInFields(fields: McMcdFiler): void;
    mcdOutFields(fields: McMcdFiler): void;
}
