import { McDbRay } from 'McCore';
import { BasePropertyScript } from '../basePropertyScript';
export declare class RadialPropertyScript extends BasePropertyScript<McDbRay> {
    constructor(name: string, entity: McDbRay);
    initLineGroup(entity: McDbRay): void;
}
