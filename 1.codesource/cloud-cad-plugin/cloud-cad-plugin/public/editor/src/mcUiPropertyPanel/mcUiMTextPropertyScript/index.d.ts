import { McDbMText } from 'McCore';
import { BasePropertyScript } from '../basePropertyScript';
export declare class MTextPropertyScript extends BasePropertyScript<McDbMText> {
    constructor(name: string, entity: McDbMText);
    initLineGroup(entity: McDbMText): void;
}
