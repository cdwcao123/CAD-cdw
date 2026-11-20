import { McGeIntersectType } from './types/enums';
import { McGeBaseLine3d, McGeBitFlag, McGeExtent2, McGeExtent3, McGeLine3d, McGeObject, McGeObjectList, McGePoint2d, McGePoint3d, McGeSeg2d, McGeVector3 } from './index';
export declare class McGeSeg3d extends McGeLine3d {
    protected readonly _type: string;
    protected static readonly _className: string;
    constructor();
    constructor(line: McGeBaseLine3d);
    constructor(pt0: McGePoint2d | McGePoint3d, pt1: McGePoint2d | McGePoint3d);
    constructor(pt0: McGePoint2d | McGePoint3d, vct: McGeVector3);
    setStartPoint(pt: McGePoint2d | McGePoint3d): void;
    getEndPoint(): McGePoint3d;
    setEndPoint(pt: McGePoint2d | McGePoint3d): void;
    getMidPoint(): McGePoint3d;
    length(): number;
    reverse(): void;
    split(paList: number[], res: McGeObjectList): void;
    convert2D(): McGeSeg2d;
    clone(): McGeSeg3d;
    intersectWith(obj: McGeObject, res: McGeObjectList, nExt?: McGeIntersectType): boolean;
    hitTest(pt: McGeVector3): McGeBitFlag;
    isInclude(obj: McGeObject): boolean;
    getExtend2D(res: McGeExtent2): boolean;
    getExtend3D(res: McGeExtent3): boolean;
    isSameSeg(seg: McGeSeg3d, bSameDirection?: boolean): boolean;
}
