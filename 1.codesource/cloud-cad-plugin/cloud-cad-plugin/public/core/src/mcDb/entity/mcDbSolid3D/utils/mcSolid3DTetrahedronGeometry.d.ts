import { McGeVector3 } from '../../../../mcGe';
import { IMcSolid3DTetrahedronGeometry } from '../types/interface';
export declare function createTetrahedronGeometry(center: McGeVector3, edgeLength: number): IMcSolid3DTetrahedronGeometry;
export declare function createTetrahedronGeometryFromVertices(vertices: McGeVector3[]): IMcSolid3DTetrahedronGeometry;
