import { McGeIntersectType } from './types/enums';
import { McGeCurve2d, McGeExtent2, McGeExtent3, McGeMatrix4, McGeObject, McGePoint2d, McGePoint3d } from './index';
export declare class McGeObjectList extends Array<McGeObject> {
    constructor(other?: McGeObjectList);
    intersectWith(obj: McGeObject, nExt: McGeIntersectType, res: McGeObjectList): boolean;
    incisionBy(curve: McGeCurve2d, left: McGeObjectList, right: McGeObjectList, mid: McGeObjectList): void;
    transformBy(mat: McGeMatrix4): void;
    getExtend2D(res: McGeExtent2): boolean;
    getExtend3D(res: McGeExtent3): boolean;
    convert2D(): void;
    convert3D(): void;
    isPoint(nIndex: number): boolean;
    getPoint(nIndex: number): McGePoint2d | McGePoint3d | null;
    getPoints<T extends McGePoint2d | McGePoint3d>(arPt: T[]): boolean;
    cloneAdd(lstObj: McGeObjectList): void;
    combine(combineArray: McGeObjectList, from?: number): number;
}
