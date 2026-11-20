export declare class Point {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    set(x: number, y: number): Point;
    length(): number;
    normalize(): Point;
    clone(): Point;
    add(point: Point): Point;
    subtract(point: Point): Point;
    multiply(scalar: number): Point;
    divide(scalar: number): Point;
    multiplyScalars(xScalar: number, yScalar: number): Point;
    divideScalars(xScalar: number, yScalar: number): Point;
    distanceTo(point: Point): number;
}
