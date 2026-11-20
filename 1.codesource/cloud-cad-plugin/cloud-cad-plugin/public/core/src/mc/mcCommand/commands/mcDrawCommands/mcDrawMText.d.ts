import { McCore } from '../../../../mcCore';
import { McDbMText } from '../../../../mcDb';
export declare function drawMText(core: McCore): Promise<McDbMText | undefined>;
export declare function editMText(core: McCore, text: McDbMText): Promise<void>;
