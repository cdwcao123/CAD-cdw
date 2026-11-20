import { McDbDiametricDimension } from 'McCore';
import { BasePropertyScript } from '../../basePropertyScript';
export declare class DiametricPropertyPanelScript extends BasePropertyScript<McDbDiametricDimension> {
    constructor(name: string, entity: McDbDiametricDimension);
    initLineGroup(entity: McDbDiametricDimension): void;
}
