import { McDbPolyLine3d } from 'McCore';
import { BasePropertyScript } from '../basePropertyScript';
export declare class Polyline3dPropertyScript extends BasePropertyScript<McDbPolyLine3d> {
    constructor(name: string, entity: McDbPolyLine3d);
    initLineGroup(entity: McDbPolyLine3d): void;
}
