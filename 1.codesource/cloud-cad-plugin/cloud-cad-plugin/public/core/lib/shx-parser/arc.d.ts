import { Point } from './point';
export declare class Arc {
    readonly start: Point;
    readonly end: Point;
    private readonly bulge;
    readonly center: Point;
    readonly radius: number;
    readonly startAngle: number;
    readonly endAngle: number;
    readonly isClockwise: boolean;
    static fromBulge(start: Point, end: Point, bulge: number): Arc;
    static fromOctant(center: Point, radius: number, startOctant: number, octantCount: number, isClockwise: boolean): Arc;
    private constructor();
    tessellate(circleSpan?: number): Point[];
}
