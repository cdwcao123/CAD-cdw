import { BufferGeometry } from './../core/BufferGeometry';
export class TorusKnotGeometry extends BufferGeometry {
    
    constructor(
        radius?: number,
        tube?: number,
        tubularSegments?: number,
        radialSegments?: number,
        p?: number,
        q?: number,
    );

    
    type: string;

    parameters: {
        radius: number;
        tube: number;
        tubularSegments: number;
        radialSegments: number;
        p: number;
        q: number;
    };

    static fromJSON(data: any): TorusKnotGeometry;
}
