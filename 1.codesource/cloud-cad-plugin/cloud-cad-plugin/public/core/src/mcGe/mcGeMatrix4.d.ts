import { McGePoint2d, McGePoint3d, McGeVector2, McGeVector3 } from './index';
import * as THREE from '../../lib/ThreeJS/Three.js';
export declare class McGeMatrix4 extends THREE.Matrix4 {
    to2DimArray(): number[][];
    transform2dPt(pt: McGePoint2d): void;
    transform2dVec(vct: McGeVector2): void;
    transform3dPt(point: McGePoint3d): void;
    transform3dVec(vct: McGeVector3): void;
    getEulerAngles(): THREE.Euler;
}
