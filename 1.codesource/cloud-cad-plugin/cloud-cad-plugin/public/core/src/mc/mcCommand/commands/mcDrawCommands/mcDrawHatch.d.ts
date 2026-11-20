import { McCore } from '../../../../mcCore';
import { McDbHatch } from '../../../../mcDb';
export declare function drawHatch(core: McCore, drawType: string): Promise<void>;
export declare function drawPatternHatch(core: McCore): Promise<void>;
export declare function drawGradientHatch(core: McCore): Promise<void>;
export declare function drawHatchBoundary(core: McCore): Promise<void>;
export declare function editHatch(core: McCore, hatch: McDbHatch): Promise<void>;
export declare function drawHatchByParams(core: McCore, params: any): Promise<void>;
export declare function getBoundaryLoops(core: McCore, callback: (data: {
    entities: any[];
    loops: any[];
}) => void): Promise<void>;
