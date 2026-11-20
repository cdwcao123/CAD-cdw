import { McDbAlignedDimension } from 'McCore';
import { BasePropertyScript } from '../../basePropertyScript';
export declare class AlignedPropertyPanelScript extends BasePropertyScript<McDbAlignedDimension> {
    constructor(name: string, entity: McDbAlignedDimension);
    initLineGroup(entity: McDbAlignedDimension): void;
}
