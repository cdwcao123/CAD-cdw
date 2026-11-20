import { McDbHelix } from 'McCore';
import { BasePropertyScript } from '../basePropertyScript';
export declare class HelixPropertyScript extends BasePropertyScript<McDbHelix> {
    constructor(name: string, entity: McDbHelix);
    initLineGroup(entity: McDbHelix): void;
}
