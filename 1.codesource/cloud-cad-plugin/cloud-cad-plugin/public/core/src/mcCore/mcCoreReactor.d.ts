import { McEventReactor } from '../mc/mcEventReactor';
import { McGeVector3 } from '../mcGe/mcGeVector3';
import { PluginLoadProgressSnapshot } from '../mc/types/interface';
export type CoreEventType = {
    coreInitialized: () => void;
    mouseCoordChange: (point: McGeVector3) => void;
    coreVYFinished: (result: number) => void;
    pluginsLoadProgress: (snapshot: PluginLoadProgressSnapshot) => void;
    pluginsReady: () => void | Promise<void>;
};
export declare class McCoreReactor extends McEventReactor<CoreEventType> {
    #private;
    constructor();
}
