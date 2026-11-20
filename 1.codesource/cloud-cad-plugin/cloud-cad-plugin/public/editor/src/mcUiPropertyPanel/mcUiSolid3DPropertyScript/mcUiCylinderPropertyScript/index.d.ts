import { McDbCylinder } from 'McCore';
import { Solid3DBasePropertyScript } from '..';
export declare class CylinderPropertyScript extends Solid3DBasePropertyScript<McDbCylinder> {
    constructor(name: string, entity: McDbCylinder);
    initGeometryGroup(entity: McDbCylinder): void;
}
