import { McGeExtent3, McGeVector2 } from './index';
import * as THREE from '../../lib/ThreeJS/Three.js';
export declare class McGeExtent2 extends THREE.Box2 {
    constructor(minx?: number, miny?: number, maxx?: number, maxy?: number);
    setGeVector2(min: THREE.Vector2, max: THREE.Vector2): this;
    getBoundary(): McGeVector2[];
    convert3D(z?: number): McGeExtent3;
    intersect(box: McGeExtent2): McGeExtent2;
    containsBox(box: THREE.Box2): boolean;
    containsPoint(point: THREE.Vector2): boolean;
}
