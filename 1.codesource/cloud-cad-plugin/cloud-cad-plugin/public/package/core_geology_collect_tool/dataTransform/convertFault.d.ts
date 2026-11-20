import { McCore } from 'McCore';
import { McDbFault, McFaultData, McFaultMode } from '../mcDbFault';
import { McGeoModelData } from '../mcGeoModel/types/interface';
export declare function faultToModel(fault: McDbFault): {
    geoData: McGeoModelData;
    modeType: McFaultMode;
};
export declare function modelToFault(modelData: McGeoModelData, modeType: McFaultMode): McFaultData;
export declare function drawFaultByData(core: McCore, faultData: McFaultData): null | undefined;
