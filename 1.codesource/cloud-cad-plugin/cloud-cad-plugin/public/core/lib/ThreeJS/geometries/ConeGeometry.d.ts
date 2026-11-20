import { CylinderGeometry } from './CylinderGeometry';
export class ConeGeometry extends CylinderGeometry {
    
    constructor(
        radius?: number,
        height?: number,
        radialSegments?: number,
        heightSegments?: number,
        openEnded?: boolean,
        thetaStart?: number,
        thetaLength?: number,
    );

    
    type: string;

    static fromJSON(data: any): ConeGeometry;
}
