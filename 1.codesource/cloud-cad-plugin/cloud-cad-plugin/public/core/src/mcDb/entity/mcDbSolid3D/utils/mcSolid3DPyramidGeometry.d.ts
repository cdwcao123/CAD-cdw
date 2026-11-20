import { McGeVector3 } from '../../../../mcGe';
import { IMcSolid3DPyramidGeometry } from '../types/interface';
export declare function createPyramidGeometry(baseCenter: McGeVector3, sideCount: number, baseRadius: number, height: number): IMcSolid3DPyramidGeometry;
export declare function createPyramidGeometryFromVertices(vertices: McGeVector3[]): IMcSolid3DPyramidGeometry;
