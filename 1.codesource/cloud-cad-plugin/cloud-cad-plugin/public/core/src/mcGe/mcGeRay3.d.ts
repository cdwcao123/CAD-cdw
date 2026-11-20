import { McGeIntersectType } from './types/enums';
import { McGeBaseLine3d, McGeBitFlag, McGeLine3d, McGeObject, McGeObjectList, McGePoint3d, McGeRay2, McGeVector3 } from './index';
export declare class McGeRay3 extends McGeLine3d {
    protected readonly _type: string;
    protected static readonly _className: string;
    constructor();
    constructor(line: McGeBaseLine3d);
    constructor(pt0: McGePoint3d, pt1: McGePoint3d);
    constructor(pt0: McGePoint3d, vct: McGeVector3);
    intersectWith(obj: McGeObject, res: McGeObjectList, nExt?: McGeIntersectType): boolean;
    hitTest(pt: McGeVector3): McGeBitFlag;
    isFinite(bStart: boolean): boolean;
    split(paList: number[], res: McGeObjectList): void;
    isSameRay(ray: McGeRay3): boolean;
    convert2D(): McGeRay2;
    clone(): McGeRay3;
    isInclude(obj: McGeObject): boolean;
}
