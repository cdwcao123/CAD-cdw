import { LineSegments } from '../objects/LineSegments';
import { ColorRepresentation } from '../utils';
export class PolarGridHelper extends LineSegments {
    
    constructor(
        radius?: number,
        radials?: number,
        circles?: number,
        divisions?: number,
        color1?: ColorRepresentation,
        color2?: ColorRepresentation,
    );

    
    type: string;

    dispose(): void;
}
