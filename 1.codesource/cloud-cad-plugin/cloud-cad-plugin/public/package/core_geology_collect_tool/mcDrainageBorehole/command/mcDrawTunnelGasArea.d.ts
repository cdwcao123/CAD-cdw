import { McCore } from 'McCore';
import { McDbGasArea } from '../entity/mcDbGasArea';
import { McGasAreaParameter } from '../types/interface';
export declare function drawTunnelGasArea(core: McCore, areaParameter: McGasAreaParameter): Promise<McDbGasArea | null>;
