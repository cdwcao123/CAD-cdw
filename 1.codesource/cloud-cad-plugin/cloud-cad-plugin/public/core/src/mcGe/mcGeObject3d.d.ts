import { McGeObject, McGeObject2d } from './index';
export interface IMcGeObject3d {
    convert2D(): McGeObject2d | null;
    isInclude(obj: McGeObject): boolean;
}
export declare abstract class McGeObject3d extends McGeObject implements IMcGeObject3d {
    protected readonly _type: string;
    protected static readonly _className: string;
    abstract convert2D(): McGeObject2d | null;
    isInclude(obj: McGeObject): boolean;
}
