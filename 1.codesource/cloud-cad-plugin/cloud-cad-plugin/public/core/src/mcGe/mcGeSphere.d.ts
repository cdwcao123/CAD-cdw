import { McGeBitFlag } from './mcGeBitFlag';
import { McGeExtent2 } from './mcGeExtent2';
import { McGeExtent3 } from './mcGeExtent3';
import { McGeMatrix4 } from './mcGeMatrix4';
import { McGeObject2d } from './mcGeObject2d';
import { McGeObject3d } from './mcGeObject3d';
import { McGeVector3 } from './mcGeVector3';
export declare class McGeSphere extends McGeObject3d {
    protected readonly _type: string;
    protected static readonly _className: string;
    center: McGeVector3;
    radius: number;
    constructor(center?: McGeVector3, radius?: number);
    isValid(): boolean;
    clone(): McGeSphere;
    hitTest(point: McGeVector3): McGeBitFlag;
    isPointOn(point: McGeVector3): boolean;
    getClosestPoint(point: McGeVector3, extend?: boolean): McGeVector3;
    getClosestPointInVec(point: McGeVector3, extend: boolean, direction: McGeVector3): McGeVector3 | null;
    getNormalAt(point: McGeVector3): McGeVector3 | null;
    getPointAt(latitude: number, longitude: number): McGeVector3;
    canTransformBy(matrix: McGeMatrix4): boolean;
    transformBy(matrix: McGeMatrix4): void;
    convert2D(): McGeObject2d;
    getExtend2D(result: McGeExtent2): boolean;
    getExtend3D(result: McGeExtent3): boolean;
    getSamplePoint(): McGeVector3;
    private getSimilarityScale;
}
