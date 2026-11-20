import { Vector2 } from './../math/Vector2';
import { BufferGeometry } from './../core/BufferGeometry';
export class LatheGeometry extends BufferGeometry {
    
    constructor(points?: Vector2[], segments?: number, phiStart?: number, phiLength?: number);

    
    type: string;

    parameters: {
        points: Vector2[];
        segments: number;
        phiStart: number;
        phiLength: number;
    };

    static fromJSON(data: any): LatheGeometry;
}
