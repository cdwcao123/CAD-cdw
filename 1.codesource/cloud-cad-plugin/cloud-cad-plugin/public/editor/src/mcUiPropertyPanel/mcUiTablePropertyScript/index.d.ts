import { McDbTable } from 'McCore';
import { BasePropertyScript } from '../basePropertyScript';
export declare class TablePropertyScript extends BasePropertyScript<McDbTable> {
    constructor(name: string, entity: McDbTable);
    private initTableGroups;
}
