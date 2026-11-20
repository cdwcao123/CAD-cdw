import { BufferGeometry } from './../core/BufferGeometry';
export class TorusGeometry extends BufferGeometry {
    
    constructor(radius?: number, tube?: number, radialSegments?: number, tubularSegments?: number, arc?: number);

    
    type: string;

    parameters: {
        radius: number;
        tube: number;
        radialSegments: number;
        tubularSegments: number;
        arc: number;
    };

    static fromJSON(data: any): TorusGeometry;
}
