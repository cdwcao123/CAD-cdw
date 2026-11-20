import { McDbLine } from 'McCore';
import { BasePropertyScript } from '../basePropertyScript';
export declare class StraightLinePropertyScript extends BasePropertyScript<McDbLine> {
    constructor(name: string, entity: McDbLine);
    initLineGroup(entity: McDbLine): void;
}
