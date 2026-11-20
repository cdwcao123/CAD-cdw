import { McDb2LineAngularDimension } from 'McCore';
import { BasePropertyScript } from '../../basePropertyScript';
export declare class LineAngularPropertyPanelScript extends BasePropertyScript<McDb2LineAngularDimension> {
    constructor(name: string, entity: McDb2LineAngularDimension);
    initLineGroup(entity: McDb2LineAngularDimension): void;
}
