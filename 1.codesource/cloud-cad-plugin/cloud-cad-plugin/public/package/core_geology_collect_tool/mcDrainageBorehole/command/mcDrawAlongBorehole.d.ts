import { McCore } from 'McCore';
import { McDbDrainageBorehole } from '../entity/mcDbDrainageBorehole';
import { McAlongParameter } from '../types/interface';
export declare function drawAlongBorehole(core: McCore, alongParameter: McAlongParameter): Promise<McDbDrainageBorehole[] | null>;
