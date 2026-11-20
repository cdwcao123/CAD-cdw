import { McDbCuboid } from 'McCore';
import { Solid3DBasePropertyScript } from '..';
export declare class CuboidPropertyScript extends Solid3DBasePropertyScript<McDbCuboid> {
    constructor(name: string, entity: McDbCuboid);
    initGeometryGroup(entity: McDbCuboid): void;
}
