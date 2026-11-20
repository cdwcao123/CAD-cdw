import { McObject } from '../mc/mcObject';
import { McGeBitFlag, McGeExtent2, McGeExtent3, McGeMatrix4, McGeObjectList, McGeVector3 } from '.';
import { McGeIntersectType } from './types/enums';
export declare abstract class McGeObject extends McObject {
    protected readonly _type: string;
    protected static readonly _className: string;
    _objectId: string;
    constructor();
    isPoint(): boolean;
    isCurve(): boolean;
    intersectWith(obj: McGeObject, res: McGeObjectList, nExt?: McGeIntersectType): boolean;
    abstract getClosestPoint(pt: McGeVector3, bExtend: boolean): McGeVector3 | null;
    abstract getClosestPointInVec(pt: McGeVector3, bExtend: boolean, vtDir: McGeVector3): McGeVector3 | null;
    abstract isValid(): boolean;
    abstract clone(): McGeObject;
    isInclude(obj: McGeObject): boolean;
    hitTest(pt: McGeVector3): McGeBitFlag;
    getExtend2D(res: McGeExtent2): boolean;
    getExtend3D(res: McGeExtent3): boolean;
    getSamplePoint(): McGeVector3;
    abstract transformBy(pMatrix: McGeMatrix4): void;
    explode(res: McGeObjectList): boolean;
    _extendSingleLine(obj: McGeObject, objRet: McGeObjectList): boolean;
    extendForIntersectWith(obj: McGeObject, objRet: McGeObjectList): boolean;
    move(cx: number, cy: number, cz?: number): void;
    scale(sx: number, sy: number, sz?: number): void;
    rotate(angle: number, axis?: McGeVector3): void;
}
