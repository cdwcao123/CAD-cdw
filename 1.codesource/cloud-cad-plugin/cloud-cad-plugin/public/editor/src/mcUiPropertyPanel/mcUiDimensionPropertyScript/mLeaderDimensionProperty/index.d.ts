import { McDbMLeaderDimension } from 'McCore';
import { BasePropertyScript } from '../../basePropertyScript';
export declare class MLeaderPropertyPanelScript extends BasePropertyScript<McDbMLeaderDimension> {
    constructor(name: string, entity?: McDbMLeaderDimension | null);
    private shouldLoadGroup;
    initLineGroup(entity?: McDbMLeaderDimension): void;
}
