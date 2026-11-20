import { McDbHatch } from 'McCore';
import { BasePropertyScript } from '../basePropertyScript';
export declare class PatternFillingPropertyScript extends BasePropertyScript<McDbHatch> {
    constructor(name: string, entity: McDbHatch);
    initLineGroup(entity: McDbHatch): void;
}
