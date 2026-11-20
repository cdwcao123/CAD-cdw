import { McCore } from '../../../../mcCore';
import { McGeVector3 } from '../../../../mcGe/mcGeVector3';
export declare function drawCircle(core: McCore): Promise<void>;
export declare function drawCircleByDiameter(core: McCore, hasCenter?: McGeVector3): Promise<void>;
export declare function drawCircleBy2Points(core: McCore): Promise<void>;
export declare function drawCircleBy3Points(core: McCore): Promise<void>;
export declare function drawCircleByTangent(core: McCore): Promise<void>;
export declare function drawCircleTangentToThreeCircles(core: McCore): Promise<void>;
