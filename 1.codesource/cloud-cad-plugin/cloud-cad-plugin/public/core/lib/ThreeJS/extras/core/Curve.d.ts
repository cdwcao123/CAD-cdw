import { Vector } from './../../math/Vector2';
import { Vector3 } from './../../math/Vector3';

export class Curve<T extends Vector> {
    
    type: string;

    
    arcLengthDivisions: number;

    
    getPoint(t: number, optionalTarget?: T): T;

    
    getPointAt(u: number, optionalTarget?: T): T;

    
    getPoints(divisions?: number): T[];

    
    getSpacedPoints(divisions?: number): T[];

    
    getLength(): number;

    
    getLengths(divisions?: number): number[];

    
    updateArcLengths(): void;

    
    getUtoTmapping(u: number, distance: number): number;

    
    getTangent(t: number, optionalTarget?: T): T;

    
    getTangentAt(u: number, optionalTarget?: T): T;

    
    computeFrenetFrames(
        segments: number,
        closed?: boolean,
    ): {
        tangents: Vector3[];
        normals: Vector3[];
        binormals: Vector3[];
    };

    clone(): this;
    copy(source: Curve<T>): this;
    toJSON(): object;
    fromJSON(json: object): this;

    
    static create(constructorFunc: () => void, getPointFunc: () => void): () => void;
}
