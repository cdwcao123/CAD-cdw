import { McDbCone } from 'McCore';
import { Solid3DBasePropertyScript } from '..';
export declare class ConePropertyScript extends Solid3DBasePropertyScript<McDbCone> {
    constructor(name: string, entity: McDbCone);
    initGeometryGroup(entity: McDbCone): void;
}
