import { Point } from './point';
export declare class ShxShape {
    readonly lastPoint?: Point;
    readonly polylines: Point[][];
    constructor(lastPoint?: Point, polylines?: Point[][]);
    get box(): {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
    };
    offset(p: Point, isNewInstance?: boolean): ShxShape;
    toSVG(options?: {
        strokeWidth?: string;
        strokeColor?: string;
        isAutoFit?: boolean;
    }): string;
}
