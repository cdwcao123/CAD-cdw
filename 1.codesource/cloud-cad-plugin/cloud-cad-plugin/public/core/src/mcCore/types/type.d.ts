import { McGeVector3 } from '../../mcGe';
import { McMenuAction } from '../../mc/mcMenu/mcMenuAction';
import { McCore } from '../mcCore';
import { McControl } from '../mcView/mcControl';
import { McViewType } from './enum';
import { McSplitViewOptions, McSplitViewState } from './interface';
type CommandEventType = {
    cmdBegin: (cmdName: string) => void;
    cmdCancel: (cmdName: string, err: string) => void;
    cmdEnd: (cmdName: string) => void;
};
type CurCoreInstanceEventType = {
    curCoreChanged: (core: McCore | null) => void;
};
type ViewEventType = {
    viewFocusChange: (viewType: string) => void;
    viewTypeChange: (oldViewType: McViewType, newViewType: McViewType) => void;
};
type EngineEventType = {
    initialized: () => void;
    closed: () => void;
    mouseDown: (e: MouseEvent) => void;
    mouseUp: (e: MouseEvent) => void;
    mouseMove: (e: MouseEvent) => void;
    mouseWheel: (e: WheelEvent) => void;
    click: (e: MouseEvent) => void;
    dbClick: (e: MouseEvent) => void;
    contextmenu: (e: MouseEvent) => void;
    keyUp: (e: KeyboardEvent) => void;
    keyDown: (e: KeyboardEvent) => void;
    touchStart: (e: TouchEvent) => void;
    touchMove: (e: TouchEvent) => void;
    touchEnd: (e: TouchEvent) => void;
    resize: (w: number, h: number) => void;
    beforeRenderFrame: (time: number) => void;
    afterRenderFrame: (time: number) => void;
    cameraChanged: (control: McControl) => void;
};
type MenuEventType = {
    opened: () => void;
    closed: () => void;
    click: (menuName: string) => void;
    openProperty: () => void;
    openOption: () => void;
    openSearch: () => void;
    openQuickSelect: () => void;
    openPrint: () => void;
};
type CommandCallFunction = {
    (core: McCore, ...args: any[]): Promise<any>;
    (...args: any[]): Promise<any>;
};
type McFontType = 'shx' | 'ttf' | 'otf' | 'woff';
type McMeshTextShapeData = {
    vertices: McGeVector3[];
    indices: number[];
};
type McMenuActionFun = (menuAction: McMenuAction) => void;
type McMenuActionShowFun = () => boolean;
type McAttributeFun = () => Promise<{
    success: boolean;
    attributes: Map<string, string>;
}>;
type McSplitDirection = 'horizontal' | 'vertical';
type McSplitPaneName = 'primary' | 'secondary';
type SplitMode = 'both' | 'primary-only' | 'secondary-only';
type ResolvedOptions = Required<Omit<McSplitViewOptions, 'onChange'>> & {
    onChange?: (state: McSplitViewState) => void;
};
export type { CommandEventType, ViewEventType, EngineEventType, McFontType, CommandCallFunction, McMeshTextShapeData, McMenuActionFun, MenuEventType, McMenuActionShowFun, McAttributeFun, CurCoreInstanceEventType, McSplitDirection, McSplitPaneName, SplitMode, ResolvedOptions, };
