import { McDbSphere } from 'McCore';
import { Solid3DBasePropertyScript } from '..';
export declare class SpherePropertyScript extends Solid3DBasePropertyScript<McDbSphere> {
    constructor(name: string, entity: McDbSphere);
    initGeometryGroup(entity: McDbSphere): void;
}
