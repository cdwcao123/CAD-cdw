import { McCore } from 'McCore';
import { McDbGasArea } from '../entity/mcDbGasArea';
import { McGasAreaParameter } from '../types/interface';
export declare function drawWorkFaceGasArea(core: McCore, areaParameter: McGasAreaParameter): Promise<McDbGasArea | null>;
