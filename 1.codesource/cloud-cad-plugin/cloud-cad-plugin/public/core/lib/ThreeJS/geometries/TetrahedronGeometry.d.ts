import { PolyhedronGeometry } from './PolyhedronGeometry';
export class TetrahedronGeometry extends PolyhedronGeometry {
    
    constructor(radius?: number, detail?: number);

    
    type: string;

    static fromJSON(data: any): TetrahedronGeometry;
}
