import { PolyhedronGeometry } from './PolyhedronGeometry';
export class OctahedronGeometry extends PolyhedronGeometry {
    
    constructor(radius?: number, detail?: number);

    
    type: string;

    static fromJSON(data: any): OctahedronGeometry;
}
