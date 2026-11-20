import { McCore } from 'McCore';
declare const openLayerFeature: () => Promise<void>;
declare const setLayerSwitch: (core: McCore, active: boolean) => Promise<void>;
declare const setLayerFreeze: (core: McCore, active: boolean) => Promise<void>;
declare const setLayerLock: (core: McCore, active: boolean) => Promise<void>;
declare const setLayerCurrent: (core: McCore) => Promise<void>;
export declare const setObjectLayer: (core: McCore, key: string, text: string, active: boolean) => Promise<void>;
export { openLayerFeature, setLayerSwitch, setLayerFreeze, setLayerLock, setLayerCurrent, };
