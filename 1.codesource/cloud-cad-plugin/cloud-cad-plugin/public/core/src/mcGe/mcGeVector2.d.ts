import { McGeVector3, McGePoint2d } from '.';
import * as THREE from '../../lib/ThreeJS/Three.js';
export declare class McGeVector2 extends THREE.Vector2 {
    static get unitX(): McGeVector2;
    static get unitY(): McGeVector2;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    static fromTwoVector(ptFrom: McGeVector2, ptEnd: McGeVector2): McGeVector2;
    toMcGePoint(): McGePoint2d;
    static McGeZero: McGeVector2;
    isParallel(vt: McGeVector2, precision?: number): boolean;
    getLVertVector(): McGeVector2;
    getRVertVector(): McGeVector2;
    toMcGeVector3(z?: number): McGeVector3;
    toMcGeVector2d(): McGeVector2;
    convert3D(z?: number): McGeVector3;
    convert2D(): McGeVector2;
    isSameDirection(vt: McGeVector2): boolean;
    getAngle(): number;
    isVectorLeft(vt: McGeVector2): boolean;
    isVectorRight(vt: McGeVector2): boolean;
    equals(v: McGeVector2): boolean;
}
