import { McCore, McEngine } from '../mcCore';
import { McDbEntity } from '../mcDb';
import * as THREE from '../../lib/ThreeJS/Three.js';
export declare class McPrDrawRender {
    mcCore: McCore;
    entities: McDbEntity[];
    objects: Map<THREE.Object3D, McEngine>;
    constructor(mcCore: McCore);
    drawEntity(entity: McDbEntity): void;
    clearDBEntity(): void;
    getEntities(): McDbEntity[];
    drawObject(object: THREE.Object3D): void;
    clearObject(): void;
    clearEntity(): void;
}
