import { McGeVector2, McGeVector3 } from '.';
import * as THREE from '../../lib/ThreeJS/Three.js';
export declare class McGeExtent3 extends THREE.Box3 {
    constructor(minx?: number, miny?: number, minz?: number, maxx?: number, maxy?: number, maxz?: number);
    setGeVector3(min: McGeVector3, max: McGeVector3): this;
    getBoundary(): McGeVector2[];
    getWidth(): number;
    getHeight(): number;
}
