import { BufferGeometry } from '../core/BufferGeometry';
export class CapsuleGeometry extends BufferGeometry {
    
    constructor(radius?: number, length?: number, capSegments?: number, radialSegments?: number);

    
    type: string;

    parameters: {
        radius: number;
        length: number;
        capSegments: number;
        radialSegments: number;
    };

    static fromJSON(data: any): CapsuleGeometry;
}
