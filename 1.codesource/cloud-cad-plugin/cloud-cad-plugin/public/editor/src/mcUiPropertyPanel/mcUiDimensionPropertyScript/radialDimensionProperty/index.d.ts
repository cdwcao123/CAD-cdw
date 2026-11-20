import { McDbRadialDimension } from 'McCore';
import { BasePropertyScript } from '../../basePropertyScript';
export declare class RadialPropertyPanelScript extends BasePropertyScript<McDbRadialDimension> {
    constructor(name: string, entity: McDbRadialDimension);
    initLineGroup(entity: McDbRadialDimension): void;
}
