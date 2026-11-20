import { McDbEllipse } from 'McCore';
import { BasePropertyScript } from '../basePropertyScript';
export declare class EllipsePropertyScript extends BasePropertyScript<McDbEllipse> {
    constructor(name: string, entity: McDbEllipse);
    initLineGroup(entity: McDbEllipse): void;
}
