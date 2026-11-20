import { Plane } from './../math/Plane';
import { LineSegments } from './../objects/LineSegments';
export class PlaneHelper extends LineSegments {
    
    constructor(plane: Plane, size?: number, hex?: number);

    
    type: string;

    plane: Plane;

    
    size: number;

    updateMatrixWorld(force?: boolean): void;

    dispose(): void;
}
