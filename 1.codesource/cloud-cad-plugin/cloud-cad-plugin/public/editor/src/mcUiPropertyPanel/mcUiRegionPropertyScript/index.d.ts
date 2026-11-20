import { McDbRegion } from 'McCore';
import { BasePropertyScript } from '../basePropertyScript';
export declare class RegionPropertyScript extends BasePropertyScript<McDbRegion> {
    constructor(name: string, entity: McDbRegion);
    initLineGroup(entity: McDbRegion): void;
}
