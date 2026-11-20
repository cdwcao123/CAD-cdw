import { BufferGeometry } from '../core/BufferGeometry';
export class CircleGeometry extends BufferGeometry {
    
    constructor(radius?: number, segments?: number, thetaStart?: number, thetaLength?: number);

    
    type: string;

    parameters: {
        radius: number;
        segments: number;
        thetaStart: number;
        thetaLength: number;
    };

    static fromJSON(data: any): CircleGeometry;
}
