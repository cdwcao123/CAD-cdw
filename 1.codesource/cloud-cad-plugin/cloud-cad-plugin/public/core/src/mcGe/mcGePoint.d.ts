import { IMcGeVector3, IMcGeVector2 } from './index';
export declare class McGePoint implements IMcGeVector3 {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
}
export declare class McGePoint2 implements IMcGeVector2 {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
}
