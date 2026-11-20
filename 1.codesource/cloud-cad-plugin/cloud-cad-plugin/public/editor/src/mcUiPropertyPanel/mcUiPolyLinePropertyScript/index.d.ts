import { McDbPolyLine } from 'McCore';
import { BasePropertyScript } from '../basePropertyScript';
export declare class PolylinePropertyScript extends BasePropertyScript<McDbPolyLine> {
    constructor(name: string, entity: McDbPolyLine);
    initLineGroup(entity: McDbPolyLine): void;
}
