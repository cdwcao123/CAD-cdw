import { McDbCircle } from 'McCore';
import { BasePropertyScript } from '../basePropertyScript';
export declare class CirclePropertyScript extends BasePropertyScript<McDbCircle> {
    constructor(name: string, entity: McDbCircle);
    initLineGroup(entity: McDbCircle): void;
}
