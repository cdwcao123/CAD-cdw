import { BufferGeometry } from '../core/BufferGeometry';
export class CylinderGeometry extends BufferGeometry {
    
    constructor(
        radiusTop?: number,
        radiusBottom?: number,
        height?: number,
        radialSegments?: number,
        heightSegments?: number,
        openEnded?: boolean,
        thetaStart?: number,
        thetaLength?: number,
    );

    
    type: string;

    parameters: {
        radiusTop: number;
        radiusBottom: number;
        height: number;
        radialSegments: number;
        heightSegments: number;
        openEnded: boolean;
        thetaStart: number;
        thetaLength: number;
    };

    static fromJSON(data: any): CylinderGeometry;
}
