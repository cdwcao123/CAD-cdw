import { McDrawOrderType } from '../../types/enum';
import { McCore } from '../../../mcCore';
import { McDbEntity } from '../../../mcDb';
export declare function drawOrderChange(core: McCore, entities: McDbEntity[], isFront?: boolean): Promise<void>;
export declare function drawOrder(core: McCore, drawOrderType?: McDrawOrderType): Promise<void>;
