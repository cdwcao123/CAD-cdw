import { McCore } from 'McCore';
import { McEditor } from './mcEditor/mcEditor';
declare global {
    interface Window {
        mcEditor: McEditor;
        fullscreenController: any;
        mcCore: McCore;
        maslg: {
            get: (text: string) => string;
            settag: (doc: any) => void;
            setLanguage: (v: any) => void;
            language: (v: any) => string;
            getMainCode: (v: any) => string;
            getSyn: (v: any) => string;
        };
        baseAPI: string;
        dtsAPI: string;
    }
    interface HTMLElement {
        webkitRequestFullscreen?: () => Promise<void>;
        mozRequestFullScreen?: () => Promise<void>;
        msRequestFullscreen?: () => Promise<void>;
    }
    interface Document {
        webkitExitFullscreen?: () => Promise<void>;
        mozCancelFullScreen?: () => Promise<void>;
        msExitFullscreen?: () => Promise<void>;
        webkitFullscreenElement?: () => Promise<void>;
        msFullscreenElement?: () => Promise<void>;
        mozFullScreenElement?: () => Promise<void>;
    }
}
