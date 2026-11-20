import { McCore } from 'McCore';
import { McDbDrainageBorehole } from '../entity/mcDbDrainageBorehole';
import { McDbDrillSite } from '../entity/mcDbDrillSite';
import { McThroughParameter } from '../types/interface';
export declare function drawThroughBoreholeInSite(core: McCore, throughParameter: McThroughParameter): Promise<{
    drills: McDbDrainageBorehole[];
    sites: McDbDrillSite[];
} | null>;
