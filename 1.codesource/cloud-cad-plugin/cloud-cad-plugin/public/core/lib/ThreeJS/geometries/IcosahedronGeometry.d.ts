import { PolyhedronGeometry } from './PolyhedronGeometry';
export class IcosahedronGeometry extends PolyhedronGeometry {
    
    constructor(radius?: number, detail?: number);

    
    type: string;

    static fromJSON(data: any): IcosahedronGeometry;
}
