import { ComputedRef, Ref } from 'vue';
import { viewDisplayType } from './types/enum';
import { ColorConfig, LoadingConfigType, PrintRange } from './types/interface';
import { McUiMainExpandPanel, McUiMainVisiblePanel } from './types/type';
import { McEditorDrawingMode, McEditorRuntimeScene, McEditorViewMode } from '../mcEditor/type/interface';
export declare class McUiMainManager {
    private static instance;
    private topTimeout;
    readonly themeColor: Ref<string, string>;
    readonly characteristicPanelColor: Ref<{
        action?: string | undefined;
        label: string;
        value: any;
        key?: string | undefined;
        options?: {
            action?: string | undefined;
            label: string;
            value: any;
            key?: string | undefined;
            options?: any[] | undefined;
        }[] | undefined;
    }[], ColorConfig[] | {
        action?: string | undefined;
        label: string;
        value: any;
        key?: string | undefined;
        options?: {
            action?: string | undefined;
            label: string;
            value: any;
            key?: string | undefined;
            options?: any[] | undefined;
        }[] | undefined;
    }[]>;
    readonly showTopPanel: Ref<boolean, boolean>;
    readonly expandTopModule: Ref<boolean, boolean>;
    readonly expandTopPanel: Ref<boolean, boolean>;
    readonly showLeftPanel: Ref<boolean, boolean>;
    readonly expandLeftModule: Ref<boolean, boolean>;
    readonly expandLeftPanel: Ref<boolean, boolean>;
    readonly showRightPanel: Ref<boolean, boolean>;
    readonly expandRightModule: Ref<boolean, boolean>;
    readonly expandRightPanel: Ref<boolean, boolean>;
    readonly showBottomPanel: Ref<boolean, boolean>;
    readonly expandBottomPanel: Ref<boolean, boolean>;
    readonly viewShowType: Ref<viewDisplayType, viewDisplayType>;
    readonly drawingMode: Ref<McEditorDrawingMode>;
    readonly runtimeScene: Ref<McEditorRuntimeScene>;
    readonly viewMode: Ref<McEditorViewMode>;
    readonly loadPageInfo: Ref<{
        show: boolean;
        text: string;
        progress: number;
    }, LoadingConfigType | {
        show: boolean;
        text: string;
        progress: number;
    }>;
    readonly printRange: Ref<{
        minx: number;
        miny: number;
        minz: number;
        maxx: number;
        maxy: number;
        maxz: number;
    }, PrintRange | {
        minx: number;
        miny: number;
        minz: number;
        maxx: number;
        maxy: number;
        maxz: number;
    }>;
    readonly containerConfig: ComputedRef<{
        top: number;
        bottom: number;
        left: number;
        right: number;
    }>;
    private constructor();
    static getInstance(): McUiMainManager;
    readonly setColor: (config: ColorConfig) => void;
    readonly setCharacteristicPanelColors: (colors: ColorConfig[]) => void;
    readonly setThemeColor: (color: string) => void;
    readonly setVisiblePanel: (type: McUiMainVisiblePanel, show?: boolean) => void;
    readonly setExpandPanel: (type: McUiMainExpandPanel, show?: boolean) => void;
    readonly setTopTimeOut: (callback: (() => void) | null, time?: number) => void;
    readonly setLoadPageInfo: (config: Partial<LoadingConfigType>) => void;
    readonly setMainShowType: (type: viewDisplayType) => void;
    readonly setDrawingMode: (mode: McEditorDrawingMode) => void;
    readonly setRuntimeScene: (scene: McEditorRuntimeScene) => void;
    readonly setViewMode: (mode: McEditorViewMode) => void;
    readonly setPrintRange: (range: PrintRange) => void;
    readonly getPrintRange: () => PrintRange;
    readonly reset: () => void;
}
export declare const mcUiMainManager: McUiMainManager;
