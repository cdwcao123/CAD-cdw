import { McDbEntity } from 'McCore';
import { McDbDrainageBorehole } from '../entity/mcDbDrainageBorehole';
import { McThroughParameter } from '../types/interface';
export declare function correctBorehole(invertDrills: McDbDrainageBorehole[], designDrills: McDbDrainageBorehole[], throughParameter: McThroughParameter): Promise<{
    designDrills: McDbDrainageBorehole[];
    newDrills: McDbDrainageBorehole[];
    designMap: McDbEntity[];
    newMap: McDbEntity[];
} | null>;
