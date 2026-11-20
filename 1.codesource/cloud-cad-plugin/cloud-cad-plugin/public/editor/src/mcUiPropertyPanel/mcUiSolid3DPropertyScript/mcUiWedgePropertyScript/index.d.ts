import { McDbWedge } from 'McCore';
import { Solid3DBasePropertyScript } from '..';
export declare class WedgePropertyScript extends Solid3DBasePropertyScript<McDbWedge> {
    constructor(name: string, entity: McDbWedge);
    initGeometryGroup(entity: McDbWedge): void;
}
