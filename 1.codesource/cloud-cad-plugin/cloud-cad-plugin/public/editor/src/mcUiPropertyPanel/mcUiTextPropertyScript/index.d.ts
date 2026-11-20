import { McDbText } from 'McCore';
import { BasePropertyScript } from '../basePropertyScript';
export declare class TextPropertyScript extends BasePropertyScript<McDbText> {
    constructor(name: string, entity: McDbText);
    initLineGroup(entity: McDbText): void;
}
