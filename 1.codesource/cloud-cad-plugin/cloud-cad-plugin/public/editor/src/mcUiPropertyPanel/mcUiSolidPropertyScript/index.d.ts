import { McDbSolid } from 'McCore';
import { BasePropertyScript } from '../basePropertyScript';
export declare class SolidPropertyScript extends BasePropertyScript<McDbSolid> {
    constructor(name: string, entity: McDbSolid);
    initLineGroup(entity: McDbSolid): void;
}
