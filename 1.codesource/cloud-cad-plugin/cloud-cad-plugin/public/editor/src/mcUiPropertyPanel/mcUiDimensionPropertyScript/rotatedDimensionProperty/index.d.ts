import { McDbRotatedDimension } from 'McCore';
import { BasePropertyScript } from '../../basePropertyScript';
export declare class RotatedPropertyPanelScript extends BasePropertyScript<McDbRotatedDimension> {
    constructor(name: string, entity: McDbRotatedDimension);
    initLineGroup(entity: McDbRotatedDimension): void;
}
