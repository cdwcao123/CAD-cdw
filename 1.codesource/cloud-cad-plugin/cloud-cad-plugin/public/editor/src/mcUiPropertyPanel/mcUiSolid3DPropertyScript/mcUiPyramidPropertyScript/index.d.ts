import { McDbPyramid } from 'McCore';
import { Solid3DBasePropertyScript } from '..';
export declare class PyramidPropertyScript extends Solid3DBasePropertyScript<McDbPyramid> {
    constructor(name: string, entity: McDbPyramid);
    initGeometryGroup(entity: McDbPyramid): void;
}
