import { Curve } from './../extras/core/Curve';
import { Vector2 } from './../math/Vector2';
import { Vector3 } from './../math/Vector3';
import { Shape } from './../extras/core/Shape';
import { BufferGeometry } from './../core/BufferGeometry';
export interface ExtrudeGeometryOptions {
    
    curveSegments?: number | undefined;
    
    steps?: number | undefined;
    
    depth?: number | undefined;
    
    bevelEnabled?: boolean | undefined;
    
    bevelThickness?: number | undefined;
    bevelSize?: number | undefined;
    
    bevelOffset?: number | undefined;
    
    bevelSegments?: number | undefined;
    extrudePath?: Curve<Vector3> | undefined;
    UVGenerator?: UVGenerator | undefined;
}

export interface UVGenerator {
    generateTopUV(
        geometry: ExtrudeGeometry,
        vertices: number[],
        indexA: number,
        indexB: number,
        indexC: number,
    ): Vector2[];
    generateSideWallUV(
        geometry: ExtrudeGeometry,
        vertices: number[],
        indexA: number,
        indexB: number,
        indexC: number,
        indexD: number,
    ): Vector2[];
}

export class ExtrudeGeometry extends BufferGeometry {
    constructor(shapes?: Shape | Shape[], options?: ExtrudeGeometryOptions);

    
    type: string;

    addShapeList(shapes: Shape[], options?: any): void;
    addShape(shape: Shape, options?: any): void;

    static fromJSON(data: any): ExtrudeGeometry;
}
