import { IMcGeVector3, McGePoint3d, McGeVector2 } from './index';
import * as THREE from '../../lib/ThreeJS/Three.js';
export declare class McGeVector3 extends THREE.Vector3 implements IMcGeVector3 {
    constructor(x?: number, y?: number, z?: number);
    static get McGeXAxis(): McGeVector3;
    static get McGeYAxis(): McGeVector3;
    static get McGeZAxis(): McGeVector3;
    static get McGeZero(): McGeVector3;
    toMcGePoint(): McGePoint3d;
    fromThree(vec: THREE.Vector3): McGeVector3;
    static fromTwoVector(ptFrom: McGeVector3, ptEnd: McGeVector3): McGeVector3;
    isParallel(vt: McGeVector3, precision?: number): boolean;
    isSameDirection(vt: McGeVector3): boolean;
    isReverseDirection(vt: McGeVector3): boolean;
    convert2D(): McGeVector2;
    toMcGeVector2(z?: number): McGeVector2;
    convert3D(z?: number): McGeVector3;
    toMcGeVector3(z?: number): McGeVector3;
    equals(v: McGeVector3): boolean;
}
