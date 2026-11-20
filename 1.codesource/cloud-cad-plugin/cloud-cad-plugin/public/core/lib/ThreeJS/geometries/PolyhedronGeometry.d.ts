import { BufferGeometry } from './../core/BufferGeometry';
export class PolyhedronGeometry extends BufferGeometry {
    
    constructor(vertices?: number[], indices?: number[], radius?: number, detail?: number);

    
    type: string;

    parameters: {
        vertices: number[];
        indices: number[];
        radius: number;
        detail: number;
    };

    static fromJSON(data: any): PolyhedronGeometry;
}
