import { McDbFrustumCone } from 'McCore';
import { Solid3DBasePropertyScript } from '..';
export declare class FrustumConePropertyScript extends Solid3DBasePropertyScript<McDbFrustumCone> {
    constructor(name: string, entity: McDbFrustumCone);
    initGeometryGroup(entity: McDbFrustumCone): void;
}
