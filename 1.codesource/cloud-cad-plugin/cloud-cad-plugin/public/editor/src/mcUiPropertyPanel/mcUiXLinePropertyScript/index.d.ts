import { McDbXLine } from 'McCore';
import { BasePropertyScript } from '../basePropertyScript';
export declare class XLinePropertyScript extends BasePropertyScript<McDbXLine> {
    constructor(name: string, entity: McDbXLine);
    initLineGroup(entity: McDbXLine): void;
}
