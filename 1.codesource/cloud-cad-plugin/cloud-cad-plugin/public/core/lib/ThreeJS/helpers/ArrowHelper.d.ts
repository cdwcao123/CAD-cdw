import { Vector3 } from './../math/Vector3';
import { Line } from './../objects/Line';
import { Mesh } from './../objects/Mesh';
import { Object3D } from './../core/Object3D';
import { ColorRepresentation } from '../utils';

export class ArrowHelper extends Object3D {
    
    constructor(
        dir?: Vector3,
        origin?: Vector3,
        length?: number,
        color?: ColorRepresentation,
        headLength?: number,
        headWidth?: number,
    );

    
    type: string;

    
    line: Line;

    
    cone: Mesh;

    
    setDirection(dir: Vector3): void;

    
    setLength(length: number, headLength?: number, headWidth?: number): void;

    
    setColor(color: ColorRepresentation): void;

    copy(source: this): this;

    dispose(): void;
}
