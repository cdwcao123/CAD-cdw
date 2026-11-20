import { McDbSolid3DBase } from 'McCore';
import { BasePropertyScript } from '../basePropertyScript';
export declare class Solid3DBasePropertyScript<T extends McDbSolid3DBase> extends BasePropertyScript<T> {
    constructor(name: string, entity?: T);
    initSolid3DBaseGroup(entity?: T): void;
}
