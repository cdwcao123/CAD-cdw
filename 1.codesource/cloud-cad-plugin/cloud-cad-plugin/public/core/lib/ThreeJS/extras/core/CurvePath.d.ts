import { Curve } from './Curve';
import { Vector } from './../../math/Vector2';
export class CurvePath<T extends Vector> extends Curve<T> {
    constructor();

    
    type: string;

    
    curves: Array<Curve<T>>;

    
    autoClose: boolean;

    add(curve: Curve<T>): void;
    closePath(): void;
    getPoint(t: number, optionalTarget?: T): T;
    getCurveLengths(): number[];
}
