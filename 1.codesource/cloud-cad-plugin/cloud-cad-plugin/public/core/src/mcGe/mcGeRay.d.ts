import { McGeVector3 } from './index';
import * as THREE from '../../lib/ThreeJS/Three.js';
export declare class McGeRay extends THREE.Ray {
    constructor(origin?: McGeVector3, direction?: McGeVector3);
}
