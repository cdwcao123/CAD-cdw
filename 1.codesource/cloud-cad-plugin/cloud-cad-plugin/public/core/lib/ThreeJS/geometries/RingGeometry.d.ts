import { BufferGeometry } from './../core/BufferGeometry';
export class RingGeometry extends BufferGeometry {
    
    constructor(
        innerRadius?: number,
        outerRadius?: number,
        thetaSegments?: number,
        phiSegments?: number,
        thetaStart?: number,
        thetaLength?: number,
    );

    
    type: string;

    parameters: {
        innerRadius: number;
        outerRadius: number;
        thetaSegments: number;
        phiSegments: number;
        thetaStart: number;
        thetaLength: number;
    };

    static fromJSON(data: any): RingGeometry;
}
