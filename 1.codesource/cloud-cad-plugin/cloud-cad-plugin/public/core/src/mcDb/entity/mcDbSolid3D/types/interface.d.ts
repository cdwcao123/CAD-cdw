import { McGeVector3 } from '../../../../mcGe';
export interface IMcSolid3DSphereMesh {
    coords: McGeVector3[];
    indices: number[];
    uvs: number[];
}
export type McSolid3DSphereParametricLines = McGeVector3[][];
export interface IMcSolid3DTetrahedronGeometry {
    vertices: McGeVector3[];
    indices: number[];
    edges: Array<[number, number]>;
}
export interface IMcSolid3DOctahedronGeometry {
    vertices: McGeVector3[];
    indices: number[];
    edges: Array<[number, number]>;
}
export interface IMcSolid3DPyramidGeometry {
    vertices: McGeVector3[];
    indices: number[];
    edges: Array<[number, number]>;
}
