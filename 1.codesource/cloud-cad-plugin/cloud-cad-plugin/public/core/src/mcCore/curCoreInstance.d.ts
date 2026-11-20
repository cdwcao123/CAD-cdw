import { McEventReactor } from '../mc/mcEventReactor';
import { McCore } from './mcCore';
import { CurCoreInstanceEventType } from './types/type';
export declare class McCurCoreInstanceManager extends McEventReactor<CurCoreInstanceEventType> {
    #private;
    constructor();
    static getInstance(): McCurCoreInstanceManager;
    getCurCore(): McCore | null;
    setCurCore(core: McCore | null): void;
}
export declare const getCurCoreInstance: () => McCore | null;
export declare const setCurCoreInstance: (core: McCore | null) => void;
export declare const curCoreInstanceManager: McCurCoreInstanceManager;
