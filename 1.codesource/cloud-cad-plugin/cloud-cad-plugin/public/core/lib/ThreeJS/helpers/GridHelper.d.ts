import { ColorRepresentation } from '../utils';
import { LineSegments } from './../objects/LineSegments';
export class GridHelper extends LineSegments {
    
    constructor(size?: number, divisions?: number, color1?: ColorRepresentation, color2?: ColorRepresentation);

    
    type: string;

    dispose(): void;
}
