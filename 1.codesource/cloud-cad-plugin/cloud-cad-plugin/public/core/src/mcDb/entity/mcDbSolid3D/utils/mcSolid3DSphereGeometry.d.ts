import { McGeVector3 } from '../../../../mcGe';
import { IMcSolid3DSphereMesh, McSolid3DSphereParametricLines } from '../types/interface';
export declare function createSphereParametricLines(center: McGeVector3, radius: number, isolines?: number, segments?: number): McSolid3DSphereParametricLines;
export declare function createSphereGreatCircle(center: McGeVector3, radius: number, planeNormal: McGeVector3, segments?: number): McGeVector3[];
export declare function createSphereMesh(center: McGeVector3, radius: number, widthSegments?: number, heightSegments?: number): IMcSolid3DSphereMesh;
