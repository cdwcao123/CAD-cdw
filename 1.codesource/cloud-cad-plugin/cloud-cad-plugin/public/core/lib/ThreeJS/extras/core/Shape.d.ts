import { Vector2 } from './../../math/Vector2';
import { Path } from './Path';

export class Shape extends Path {
    constructor(points?: Vector2[]);

    
    type: string;

    uuid: string;

    
    holes: Path[];

    getPointsHoles(divisions: number): Vector2[][];

    extractPoints(divisions: number): {
        shape: Vector2[];
        holes: Vector2[][];
    };
}
