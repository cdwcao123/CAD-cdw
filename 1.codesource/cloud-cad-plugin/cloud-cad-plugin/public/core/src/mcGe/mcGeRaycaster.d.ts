import { McGeVector3 } from './mcGeVector3';
import * as THREE from '../../lib/ThreeJS/Three.js';
export declare class McGeRaycaster extends THREE.Raycaster {
    constructor(origin?: McGeVector3, direction?: McGeVector3, near?: number, far?: number);
}
