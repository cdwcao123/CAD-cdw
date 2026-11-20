import { McMeshFontData } from '../../mc/mcFontManager';
import { McDbHatchPatternLineDef } from '../../mc/mcHatchPatternDefManager';
import { McDbGroup, McDbObject } from '../../mcDb';
import { McGeVector2, McGeVector3 } from '../../mcGe';
import { McGeRaycaster } from '../../mcGe/mcGeRaycaster';
import { ShxFontData } from '../../../lib/shx-parser';
import { McCore } from '../mcCore';
import { CmdExeStatus, CmdRecordOperateType, DbRecordObjectType, McFontSubfamily, McViewLayout, McViewType } from './enum';
import { CommandCallFunction, McFontType, McSplitDirection } from './type';
import { McPluginInfo, McPluginLoadEnv } from '../../mc/types/interface';
import * as THREE from '../../../lib/ThreeJS/Three.js';
interface McPluginApiMap {
}
type McPluginApiName = keyof McPluginApiMap & string;
interface IMcCoreRenderContainers {
    container2D?: HTMLElement | string;
    container3D?: HTMLElement | string;
}
interface IMcCoreResolvedRenderContainers {
    mode: 'internal-split' | 'external-containers';
    viewLayout: McViewLayout;
    host: HTMLElement;
    container2D: HTMLElement;
    container3D: HTMLElement;
}
interface McSplitViewState {
    direction: McSplitDirection;
    ratio: number;
    primarySize: number;
    secondarySize: number;
}
interface McSplitViewOptions {
    direction?: McSplitDirection;
    initialRatio?: number;
    minPrimarySize?: number;
    minSecondarySize?: number;
    dividerSize?: number;
    className?: string;
    showDivider?: boolean;
    eagleEyeVisible?: boolean;
    eagleEyeShowTitle?: boolean;
    eagleEyeTitle?: string;
    onChange?: (state: McSplitViewState) => void;
}
interface IMcCoreOption {
    viewType?: McViewType;
    loadEnv?: McPluginLoadEnv;
    container?: HTMLElement | string | IMcCoreRenderContainers;
    viewLayout?: McViewLayout;
    assetsPath?: string;
    mcdConvertApi?: string;
    isSync?: boolean;
    openTemplate?: string;
    openFileUrl?: string;
    enableEditEntity?: boolean;
    callBack?: (mcCore: McCore) => void;
    [propName: string]: any;
}
interface IMcEngineOption {
    showStatus: boolean;
    backgroundColor: THREE.Color;
    alpha: number;
    cameraPosition: THREE.Vector3;
    near: number;
    far: number;
    fov: number;
    showViewPanel?: boolean;
    showGrid?: boolean;
    showAxis?: boolean;
    showMouseCursor?: boolean;
}
interface IMcEngine2DOption extends IMcEngineOption {
}
interface IMcEngine3DOption extends IMcEngineOption {
    heading: number;
    tilt: number;
    distance: number;
    shadow: boolean;
    showSky: boolean;
    ambientColor: THREE.Color;
}
interface IMcCommandWithCore {
    name: string;
    shortName?: string;
    desc: string;
    group: string;
    fn: CommandCallFunction;
    unEditable?: boolean;
    bNotByMcCoreInstance?: false;
    keepHighlight?: boolean;
    enableInCommandLine?: boolean;
}
interface IMcCommandWithoutCore {
    name: string;
    shortName?: string;
    desc: string;
    group: string;
    fn: (...args: any[]) => Promise<any>;
    unEditable?: boolean;
    bNotByMcCoreInstance: true;
    keepHighlight?: boolean;
    enableInCommandLine?: boolean;
}
type IMcCommand = IMcCommandWithCore | IMcCommandWithoutCore;
interface ICmdRecord {
    objectType: DbRecordObjectType[] | DbRecordObjectType;
    objectClassName: string[] | string;
    operateType: CmdRecordOperateType;
    objectId?: string;
    objectIds?: string[];
    changes?: Record<string, any> | Record<string, any>[] | null;
    oldValues?: Record<string, any> | Record<string, any>[] | null;
    undoFn: Function;
    execFn: Function;
}
interface PickResult<TIntersected extends McDbObject = McDbObject> {
    distance: number;
    distanceToRay?: number | undefined;
    distanceScreen: number;
    point: McGeVector3;
    object?: TIntersected;
    child?: TIntersected;
    grips?: McGeVector3[];
    data?: any;
    groups?: McDbGroup[];
    rayCaster?: McGeRaycaster;
}
interface ICmdExeHistoryRecord {
    id: string;
    name: string;
    status: CmdExeStatus;
    startTime: string;
    endTime?: string;
}
interface McFontInfo {
    name: string | undefined;
    file: string;
    type: McFontType | undefined;
    url: string;
    bigFont: boolean;
    fontSubfamily: McFontSubfamily;
}
interface McFontData {
    name: string;
    type: McFontType;
    data: ShxFontData | McMeshFontData;
}
interface IMcHatchPatternDef {
    name: string;
    desc: string;
    lines: Array<McDbHatchPatternLineDef>;
}
interface IMcDbHatchPatternLineDef {
    angle: number;
    origin: McGeVector2;
    offset: McGeVector2;
    dashPattern: Array<number>;
}
export type { ICmdRecord, IMcCommand, IMcCommandWithCore, IMcCommandWithoutCore, McPluginInfo, McPluginLoadEnv, McPluginApiMap, McPluginApiName, IMcCoreOption, IMcCoreRenderContainers, IMcCoreResolvedRenderContainers, McSplitViewState, McSplitViewOptions, IMcEngineOption, IMcEngine2DOption, IMcEngine3DOption, PickResult, McFontData, McFontInfo, ICmdExeHistoryRecord, IMcHatchPatternDef, IMcDbHatchPatternLineDef, };
