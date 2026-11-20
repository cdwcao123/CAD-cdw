import { McGeVector3 } from '../../../../mcGe';
import { IMcSolid3DOctahedronGeometry } from '../types/interface';
export declare function createOctahedronGeometry(center: McGeVector3, edgeLength: number): IMcSolid3DOctahedronGeometry;
export declare function createOctahedronGeometryFromVertices(vertices: McGeVector3[]): IMcSolid3DOctahedronGeometry;
