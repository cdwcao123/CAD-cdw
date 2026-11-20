import { McDbBlock } from 'McCore';
import { BasePropertyScript } from '../basePropertyScript';
export declare class BlockReferencePropertyScript extends BasePropertyScript<McDbBlock> {
    constructor(name: string, entity: McDbBlock);
    initLineGroup(entity: McDbBlock): void;
}
