import { McDbPoint } from 'McCore';
import { BasePropertyScript } from '../basePropertyScript';
export declare class PointPropertyScript extends BasePropertyScript<McDbPoint> {
    constructor(name: string, entity: McDbPoint);
    initLineGroup(entity: McDbPoint): void;
}
