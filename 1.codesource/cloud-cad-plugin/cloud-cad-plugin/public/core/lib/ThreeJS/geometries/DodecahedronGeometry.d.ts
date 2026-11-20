import { PolyhedronGeometry } from './PolyhedronGeometry';
export class DodecahedronGeometry extends PolyhedronGeometry {
    
    constructor(radius?: number, detail?: number);

    
    type: string;

    static fromJSON(data: any): DodecahedronGeometry;
}
