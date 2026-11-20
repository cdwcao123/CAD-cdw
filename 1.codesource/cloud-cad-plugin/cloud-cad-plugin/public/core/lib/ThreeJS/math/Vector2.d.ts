import { Matrix3 } from './Matrix3';
import { BufferAttribute } from './../core/BufferAttribute';
export type Vector2Tuple = [number, number];

export interface Vector {
    setComponent(index: number, value: number): this;

    getComponent(index: number): number;

    set(...args: number[]): this;

    setScalar(scalar: number): this;

    
    copy(v: Vector): this;

    
    add(v: Vector): this;

    
    addVectors(a: Vector, b: Vector): this;

    addScaledVector(vector: Vector, scale: number): this;

    
    addScalar(scalar: number): this;

    
    sub(v: Vector): this;

    
    subVectors(a: Vector, b: Vector): this;

    
    multiplyScalar(s: number): this;

    
    divideScalar(s: number): this;

    
    negate(): this;

    
    dot(v: Vector): number;

    
    lengthSq(): number;

    
    length(): number;

    
    normalize(): this;

    
    distanceTo?(v: Vector): number;

    
    distanceToSquared?(v: Vector): number;

    
    setLength(l: number): this;

    
    lerp(v: Vector, alpha: number): this;

    
    equals(v: Vector): boolean;

    
    clone(): Vector;
}

export class Vector2 implements Vector {
    constructor(x?: number, y?: number);

    
    x: number;

    
    y: number;
    width: number;
    height: number;
    readonly isVector2: true;

    
    set(x: number, y: number): this;

    
    setScalar(scalar: number): this;

    
    setX(x: number): this;

    
    setY(y: number): this;

    
    setComponent(index: number, value: number): this;

    
    getComponent(index: number): number;

    
    clone(): this;

    
    copy(v: Vector2): this;

    
    add(v: Vector2, w?: Vector2): this;

    
    addScalar(s: number): this;

    
    addVectors(a: Vector2, b: Vector2): this;

    
    addScaledVector(v: Vector2, s: number): this;

    
    sub(v: Vector2): this;

    
    subScalar(s: number): this;

    
    subVectors(a: Vector2, b: Vector2): this;

    
    multiply(v: Vector2): this;

    
    multiplyScalar(scalar: number): this;

    
    divide(v: Vector2): this;

    
    divideScalar(s: number): this;

    
    applyMatrix3(m: Matrix3): this;

    
    min(v: Vector2): this;

    
    max(v: Vector2): this;

    
    clamp(min: Vector2, max: Vector2): this;

    
    clampScalar(min: number, max: number): this;

    
    clampLength(min: number, max: number): this;

    
    floor(): this;

    
    ceil(): this;

    
    round(): this;

    
    roundToZero(): this;

    
    negate(): this;

    
    dot(v: Vector2): number;

    
    cross(v: Vector2): number;

    
    lengthSq(): number;

    
    length(): number;

    
    lengthManhattan(): number;

    
    manhattanLength(): number;

    
    normalize(): this;

    
    angle(): number;

    
    distanceTo(v: Vector2): number;

    
    distanceToSquared(v: Vector2): number;

    
    distanceToManhattan(v: Vector2): number;

    
    manhattanDistanceTo(v: Vector2): number;

    
    setLength(length: number): this;

    
    lerp(v: Vector2, alpha: number): this;

    
    lerpVectors(v1: Vector2, v2: Vector2, alpha: number): this;

    
    equals(v: Vector2): boolean;

    
    fromArray(array: number[] | ArrayLike<number>, offset?: number): this;

    
    toArray(array?: number[], offset?: number): number[];
    toArray(array?: Vector2Tuple, offset?: 0): Vector2Tuple;

    
    toArray(array: ArrayLike<number>, offset?: number): ArrayLike<number>;

    
    fromBufferAttribute(attribute: BufferAttribute, index: number): this;

    
    rotateAround(center: Vector2, angle: number): this;

    
    random(): this;
}
