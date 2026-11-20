import { McCore } from 'McCore';
import { McDbDrainageBorehole } from '../entity/mcDbDrainageBorehole';
import { McSingleParameter } from '../types/interface';
export declare function drawSingleBorehole(core: McCore, singleParameter: McSingleParameter): Promise<McDbDrainageBorehole | null>;
