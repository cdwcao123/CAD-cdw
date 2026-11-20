import { McCore, McGeVector3 } from 'McCore';
import { McDbDrainageBorehole } from '../entity/mcDbDrainageBorehole';
import { McThroughParameter } from '../types/interface';
export declare function drawThroughBoreholeInTunnel(core: McCore, throughParameter: McThroughParameter): Promise<McDbDrainageBorehole[] | null>;
export declare function drawThroughBoreholeOneGroup(core: McCore, throughParameter: McThroughParameter, lastPoint: McGeVector3 | undefined): Promise<McDbDrainageBorehole[] | null>;
