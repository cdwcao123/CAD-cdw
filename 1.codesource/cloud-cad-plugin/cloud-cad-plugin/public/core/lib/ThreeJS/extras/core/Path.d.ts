import { Vector2 } from './../../math/Vector2';
import { CurvePath } from './CurvePath';

export class Path extends CurvePath<Vector2> {
    constructor(points?: Vector2[]);

    
    type: string;

    
    currentPoint: Vector2;

    
    fromPoints(vectors: Vector2[]): this;
    setFromPoints(vectors: Vector2[]): this;
    moveTo(x: number, y: number): this;
    lineTo(x: number, y: number): this;
    quadraticCurveTo(aCPx: number, aCPy: number, aX: number, aY: number): this;
    bezierCurveTo(aCP1x: number, aCP1y: number, aCP2x: number, aCP2y: number, aX: number, aY: number): this;
    splineThru(pts: Vector2[]): this;
    arc(aX: number, aY: number, aRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean): this;
    absarc(aX: number, aY: number, aRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean): this;
    ellipse(
        aX: number,
        aY: number,
        xRadius: number,
        yRadius: number,
        aStartAngle: number,
        aEndAngle: number,
        aClockwise: boolean,
        aRotation: number,
    ): this;
    absellipse(
        aX: number,
        aY: number,
        xRadius: number,
        yRadius: number,
        aStartAngle: number,
        aEndAngle: number,
        aClockwise: boolean,
        aRotation: number,
    ): this;
}
