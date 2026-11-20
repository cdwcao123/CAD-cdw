import { McDbArcDimension } from 'McCore';
import { BasePropertyScript } from '../../basePropertyScript';
export declare class ArcPropertyPanelScript extends BasePropertyScript<McDbArcDimension> {
    constructor(name: string, entity: McDbArcDimension);
    initLineGroup(entity: McDbArcDimension): void;
}
