import { McDbTorus } from 'McCore';
import { Solid3DBasePropertyScript } from '..';
export declare class TorusPropertyScript extends Solid3DBasePropertyScript<McDbTorus> {
    constructor(name: string, entity: McDbTorus);
    initGeometryGroup(entity: McDbTorus): void;
}
