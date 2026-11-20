import { McDbArc } from 'McCore';
import { BasePropertyScript } from '../basePropertyScript';
export declare class ArcPropertyScript extends BasePropertyScript<McDbArc> {
    constructor(name: string, entity: McDbArc);
    initLineGroup(entity: McDbArc): void;
}
