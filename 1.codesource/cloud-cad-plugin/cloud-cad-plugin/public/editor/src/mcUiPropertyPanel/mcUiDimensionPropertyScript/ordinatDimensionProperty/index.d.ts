import { McDbOrdinateDimension } from 'McCore';
import { BasePropertyScript } from '../../basePropertyScript';
export declare class OrdinatePropertyPanelScript extends BasePropertyScript<McDbOrdinateDimension> {
    constructor(name: string, entity: McDbOrdinateDimension);
    initLineGroup(entity: McDbOrdinateDimension): void;
}
