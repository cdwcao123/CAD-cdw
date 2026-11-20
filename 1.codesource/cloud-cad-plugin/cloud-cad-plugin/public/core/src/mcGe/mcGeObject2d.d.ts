import { McGeExtent3, McGeObject, McGeObject3d } from './index';
export declare abstract class McGeObject2d extends McGeObject {
    protected readonly _type: string;
    protected static readonly _className: string;
    abstract setElevation(elev: number): boolean;
    abstract getElevation(): number;
    abstract convert3D(): McGeObject3d | null;
    isInclude(obj: McGeObject): boolean;
    getExtend3D(res: McGeExtent3): boolean;
}
