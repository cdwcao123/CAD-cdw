import { McDbAttributeDef } from 'McCore';
import { BasePropertyScript } from '../basePropertyScript';
export declare class AttributeDefinitionPropertyScript extends BasePropertyScript<McDbAttributeDef> {
    constructor(name: string, entity: McDbAttributeDef);
    initAttributeGroup(entity: McDbAttributeDef): void;
}
