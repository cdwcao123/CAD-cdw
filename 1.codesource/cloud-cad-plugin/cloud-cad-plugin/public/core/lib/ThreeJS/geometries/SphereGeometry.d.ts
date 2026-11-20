import { BufferGeometry } from './../core/BufferGeometry';
export class SphereGeometry extends BufferGeometry {
    
    constructor(
        radius?: number,
        widthSegments?: number,
        heightSegments?: number,
        phiStart?: number,
        phiLength?: number,
        thetaStart?: number,
        thetaLength?: number,
    );

    
    type: string;

    parameters: {
        radius: number;
        widthSegments: number;
        heightSegments: number;
        phiStart: number;
        phiLength: number;
        thetaStart: number;
        thetaLength: number;
    };

    static fromJSON(data: any): SphereGeometry;
}
