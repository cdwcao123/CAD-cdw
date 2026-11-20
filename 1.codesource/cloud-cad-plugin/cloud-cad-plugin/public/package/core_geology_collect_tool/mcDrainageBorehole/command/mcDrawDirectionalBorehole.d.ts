import { McCore } from 'McCore';
import { McDbDrainageBorehole } from '../entity/mcDbDrainageBorehole';
import { McSingleDirectionalParameter } from '../types/interface';
export declare function drawDirectionalBorehole(core: McCore, singleParameter: McSingleDirectionalParameter): Promise<McDbDrainageBorehole | null>;
