import { McDbCube } from 'McCore';
import { Solid3DBasePropertyScript } from '..';
export declare class CubePropertyScript extends Solid3DBasePropertyScript<McDbCube> {
    constructor(name: string, entity: McDbCube);
    initGeometryGroup(entity: McDbCube): void;
}
