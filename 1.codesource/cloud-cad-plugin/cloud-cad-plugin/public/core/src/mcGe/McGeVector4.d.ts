import { IMcGeVector4, McGeVector2, McGeVector3 } from './index';
import * as THREE from '../../lib/ThreeJS/Three.js';
export declare class McGeVector4 extends THREE.Vector4 implements IMcGeVector4 {
    toMcGeVector2(): McGeVector2;
    toMcGeVector3(): McGeVector3;
    toMcGeVector3w(): McGeVector3;
}
