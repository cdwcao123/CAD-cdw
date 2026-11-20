import { McCore } from '../../../mcCore';
export declare function cutClip(core: McCore): Promise<void>;
export declare function copyClip(core: McCore): Promise<void>;
export declare function copyClipWithBasePoint(core: McCore): Promise<void>;
export declare function pasteClip(core: McCore): Promise<void>;
export declare function pasteClipAsBlock(core: McCore): Promise<void>;
export declare function pasteClipToOrigin(core: McCore): Promise<void>;
export declare function handleCtrlV(core: McCore): Promise<void>;
