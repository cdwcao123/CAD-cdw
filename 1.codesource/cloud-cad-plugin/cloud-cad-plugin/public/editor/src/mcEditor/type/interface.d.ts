import { Layer } from '../../mcUiCommon/mcUiLayerSelect/components/mcUiLayerItem/type/interface';
import { DrawingSourceType } from '../../mcUiDraw';
import { Item } from '../../mcUiTop/type/interface';
import { MenuTriggerPosition } from './enum';
import { EditEventType, ExtractParam } from './type';
import { MapCoreEngine } from '../../mcUiDraw/type/interface';
import { IMcCoreOption, McPluginApiMap as CoreMcPluginApiMap, McPluginApiName as CoreMcPluginApiName, McPluginInfo as CoreMcPluginInfo } from 'McCore';
import { Component } from 'vue';
export type McEditorCoreOptions = Omit<Partial<IMcCoreOption>, 'container'>;
export type McEditorDrawingMode = 'single' | 'multiple';
export type McEditorRuntimeScene = 'main-window' | 'child-window';
export type McEditorViewMode = 'drawing' | 'custom-page';
export type McPluginApiMap = CoreMcPluginApiMap;
export type McPluginApiName = CoreMcPluginApiName;
export type McPluginInfo = CoreMcPluginInfo;
export interface CoreConfig extends McEditorCoreOptions {
    container: HTMLElement;
    assetsPath?: string;
    coreAssetsPath?: string;
    drawingMode?: McEditorDrawingMode;
}
export interface MenuState {
    value: any;
    disabled: boolean;
    options: Item[] | Layer[];
    entitys?: any[];
}
export interface FormConfigType {
    maxLength: number;
}
declare module 'vue' {
    interface ComponentCustomProperties {
        formConfig: FormConfigType;
    }
}
export interface menuTriggerType {
    type: MenuTriggerPosition;
    key: string;
    value: any;
}
export interface EditEventTypeMap {
    initStateChange: ExtractParam<EditEventType['initStateChange']>;
    containerLoaded: ExtractParam<EditEventType['containerLoaded']>;
    menuTrigger: ExtractParam<EditEventType['menuTrigger']>;
}
export interface NewWindowInfo {
    tempId?: string;
    sourceFileName?: string;
    sourceLastModified?: number;
    localEditedAt?: number;
    snapshotFormat?: 'mcd';
    snapshotEditedAt?: number;
    file?: ArrayBuffer;
    fileUrl?: string;
    isTemplate?: boolean;
    fileName?: string;
    drawInfo?: Partial<MapCoreEngine>;
    urlQuery?: Record<string, string | number | boolean | null | undefined>;
}
export interface DrawingWorkspaceItem {
    drawingId: string;
    cacheDrawingId?: string;
    name: string;
    sourceType: DrawingSourceType;
    cacheTempId?: string;
}
export interface DrawingWorkspaceSnapshot {
    entryTempId?: string;
    drawings: DrawingWorkspaceItem[];
    activeDrawingId?: string;
}
export interface DrawingBrowserSession {
    tabSessionId: string;
    runtimeScene: McEditorRuntimeScene;
}
export interface TempDrawingSnapshotMetadata {
    snapshotEditedAt?: number;
    localEditedAt?: number;
}
export type DwgCacheType = 'temp-tab' | 'recent';
export interface DwgInfoType {
    id?: number;
    openTime?: number;
    ID: string;
    MineCode: string;
    DwgName: string;
    FileUrl: string | ArrayBuffer;
    FileSize?: string;
    GroupId: string;
    GroupPath?: string;
    CurVersion?: number;
    VersionNumber?: number;
    HistoryID?: string;
    LockStatus?: string | null;
    LockTime?: string | null;
    LockPerson?: string | null;
    EditPerson?: string | null;
    DwgType?: string;
    MapType?: string;
    CreateDateTime?: string;
    CreateUserId?: string;
    CreateUserId_Text?: string;
    CreateCompanyId?: string;
    CreateCompanyId_Text?: string;
    CreateDepartmentId?: string;
    CreateDepartmentId_Text?: string;
    UpdateUserId?: string;
    UpdateUserId_Text?: string;
    UpdateDateTime?: string | null;
    sourceFileName?: string;
    sourceLastModified?: number;
    localEditedAt?: number;
    snapshotTempId?: string;
    ImageUrl?: string | null;
    Description?: string;
    DeleteMark?: number;
    WorkFlowTaskId?: string | null;
    DwgLayerInfoList?: any[] | null;
    sourceType?: DrawingSourceType;
    drawingFile?: ArrayBuffer;
    md5Hash?: string;
    cacheType?: DwgCacheType;
    bizDrawingId?: string;
    tempImage?: string;
    tempCacheDrawingData?: NewWindowInfo;
    owners?: string[];
    [key: string]: any;
}
export interface DBConfig {
    dbName: string;
    version: number;
    storeName: string;
    log: boolean;
}
export interface pageInfoType {
    page: number;
    pageSize: number;
    keyword?: string;
    total?: number;
}
export interface DwgInfoResponseType {
    list: DwgInfoType[];
    total: number;
}
export type McUiPluginSidePanelPosition = 'left-panel' | 'right-panel';
export interface McUiPluginCustomPageRegistration {
    name: string;
    desc?: string;
    component: Component | string;
    index: number;
    active?: boolean;
}
export interface McUiPluginComponentRegistration {
    key: string;
    name: string;
    desc?: string;
    component: Component;
}
export interface McUiPluginSidePanelRegistration {
    key: string;
    name: string;
    desc?: string;
    position: McUiPluginSidePanelPosition;
    component: Component | string;
}
export interface McUiPluginDialogRegistration {
    pluginName: string;
    key: string;
    title: string;
    component: Component | string;
    width?: string | number;
    height?: string | number;
}
