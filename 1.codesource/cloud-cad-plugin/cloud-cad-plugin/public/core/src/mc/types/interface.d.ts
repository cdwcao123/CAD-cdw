import { MCDDataBlockType, McColorIndex, McColorMethod } from './enum';
import { KeyBinding, NotificationType, NotificationAction, PluginLoadErrorStage, PluginLoadProgressStage, PluginPackageKind, PluginVueComponentLoader, WhateverFunc } from './type';
import { McCore } from '../../mcCore';
import { McPrintMode } from '../../mcCore/types/enum';
import { McGeExtent3 } from '../../mcGe';
interface IEventType {
    [key: string]: WhateverFunc;
    [numberKey: number]: WhateverFunc;
    [SymbolKey: symbol]: WhateverFunc;
}
interface IEventItem {
    fn: WhateverFunc;
    once: boolean;
    index: number;
    obstruct?: boolean;
    isEmit?: boolean;
}
interface McRGB {
    r: number;
    g: number;
    b: number;
}
interface MCDDataBlockInfo {
    type: MCDDataBlockType;
    offset: number;
    size: number;
}
interface EntityRegInfo {
    code: string;
    classConstructor: new (...args: any[]) => any;
    name: string;
    desc: string;
    isInternal?: boolean;
    args?: any[];
}
interface IMcColor {
    colorIndex: McColorIndex;
    colorMethod: McColorMethod;
    color?: McRGB;
}
interface ThemeColorConfig {
    theme: string;
    themeLight3: string;
    themeLight5: string;
    themeLight7: string;
    themeLight8: string;
    themeLight9: string;
    themeDark2: string;
    backgroundColor: string;
    backgroundColor2: string;
    textColor: string;
    borderColor: string;
}
interface TaskProgressArgs {
    message: string;
    step: number;
    total: number;
    visible: boolean;
    statusColor: string;
}
interface WorkerSuccessResponse {
    status: 'success';
    data: any;
}
interface WorkerErrorResponse {
    status: 'error';
    message: string;
}
interface QueryResponse {
    type: 'DATA_RESPONSE';
    requestId: string;
    status: 'success' | 'error';
    data?: any;
    message?: string;
    chunkTotal?: number;
}
interface ParseCompleteResponse {
    type: 'PARSE_COMPLETE';
    status: 'success' | 'error';
    message?: string;
}
interface InternalRequestConfig extends RequestInit {
    headers: Record<string, string>;
}
interface HttpClientOptions {
    baseURL: string;
    timeout: number;
    headers: Record<string, string>;
}
interface RequestInterceptor {
    onFulfilled: (config: InternalRequestConfig) => InternalRequestConfig | Promise<InternalRequestConfig>;
    onRejected?: (error: any) => any;
}
interface ResponseInterceptor {
    onFulfilled: (response: Response) => Response | Promise<Response>;
    onRejected?: (error: any) => any;
}
interface Interceptors {
    request: RequestInterceptor[];
    response: ResponseInterceptor[];
}
interface responseType<T> {
    info: string;
    code: number;
    data: T;
}
interface KeyBindingBase {
    id: string;
    key: string;
    when?: string;
    description?: string;
    priority?: number;
    enabled?: boolean;
    editable?: boolean;
    category?: string;
    tags?: string[];
}
interface KeyBindingWithCore extends KeyBindingBase {
    needCore?: true;
    handler: (core: McCore, ...args: any[]) => void;
}
interface KeyBindingWithoutCore extends KeyBindingBase {
    needCore: false;
    handler: (...args: any[]) => void;
}
interface KeyBindingUpdate {
    key?: string;
    when?: string;
    description?: string;
    priority?: number;
    enabled?: boolean;
    category?: string;
    tags?: string[];
}
interface KeyBindingContext {
    [key: string]: boolean | string | number;
}
interface KeyInfo {
    key: string;
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
    meta: boolean;
}
interface KeyBindingChangeEvent {
    type: 'add' | 'update' | 'remove' | 'enable' | 'disable';
    binding: KeyBinding;
    oldBinding?: KeyBinding;
}
interface ChordState {
    sequence: string[];
    timestamp: number;
    timeout: number;
}
interface NotificationConfig {
    type: NotificationType;
    title?: string;
    message?: string;
    cancelText?: string;
    confirmText?: string;
}
interface NotificationCheckboxConfig {
    label: string;
    checked?: boolean;
}
interface NotificationDecisionConfig extends NotificationConfig {
    confirmText?: string;
    rejectText?: string;
    cancelText?: string;
    checkbox?: NotificationCheckboxConfig;
}
interface ResolvedNotificationConfig extends NotificationDecisionConfig {
    title: string;
    message: string;
    cancelText: string;
    confirmText: string;
}
interface NotificationDecisionResult {
    action: NotificationAction;
    checked: boolean;
}
interface PluginLoadProgressCurrent {
    name: string;
    entry: string;
    kind: PluginPackageKind;
    step: 'manifest' | 'validate' | 'entry' | 'import' | 'style' | 'install' | 'init';
    requiresTotal: number;
    requiresSatisfied: number;
    requiresMissing: string[];
    requiresPending: string[];
}
interface PluginLoadProgressSnapshot {
    stage: PluginLoadProgressStage;
    packagesTotal: number;
    packagesDone: number;
    percent: number;
    errors: number;
    current?: PluginLoadProgressCurrent;
    inFlight: string[];
}
interface PluginPackageEntry {
    name: string;
    entry: string;
}
interface PluginPackagesJson {
    version?: number;
    packages: PluginPackageEntry[];
}
interface NormalizedPluginPackageEntry {
    name: string;
    entry: string;
    kind: PluginPackageKind;
}
type McPluginLoadEnv = 'core' | 'editor';
interface McPluginInfo {
    name: string;
    description?: string;
    buildTime: string;
    loadEnv?: McPluginLoadEnv;
    [key: string]: unknown;
}
interface McPluginModule<TPlugin = unknown> {
    info: McPluginInfo;
    requires?: string[];
    install: (core: McCore) => TPlugin | Promise<TPlugin>;
}
interface PluginLoadError {
    name: string;
    entry: string;
    stage: PluginLoadErrorStage;
    cause: unknown;
}
interface PluginBootstrapResult<TPlugin> {
    entries: NormalizedPluginPackageEntry[];
    loaded: Array<{
        entry: NormalizedPluginPackageEntry;
        plugin: TPlugin;
    }>;
    errors: PluginLoadError[];
}
interface PluginVueComponentRegistration {
    pluginName: string;
    key: string;
    loader: PluginVueComponentLoader;
}
interface ResolvedPluginVueComponent {
    pluginName: string;
    key: string;
    component: any;
}
interface PluginStartupPage {
    pluginName: string;
    key: string;
    componentKey: string;
    priority?: number;
    replaceEditor?: boolean;
    title?: string;
    icon?: string;
}
interface ExportLayerDrawingOptions {
    outFileType?: 'arrayBuffer' | 'blob' | 'file';
    fileName?: string;
}
interface TestExportLayerDrawingDownloadOptions {
    core?: McCore;
    layerName?: string;
    fileName?: string;
}
interface TestExportLayerDrawingDownloadResult {
    core: McCore;
    layerName: string;
    fileName: string;
    entityCount: number;
    byteLength: number;
}
interface MergeLayerDrawingIntoCurrentOptions {
    core: McCore;
    data: ArrayBuffer | File;
    textCode?: string;
    batchSize?: number;
    onProgress?: (progress: MergeLayerDrawingProgress) => void;
}
interface MergeLayerDrawingIntoCurrentResult {
    entityCount: number;
    groupCount: number;
    symbolCount: number;
    dictionaryCount: number;
    viewPortCount: number;
}
interface RemoveLayerDrawingFromCurrentOptions {
    core: McCore;
    libraryLayerId?: string;
    libraryLayerCode?: string;
    matchKeys?: string[];
}
interface MarkLayerDrawingInCurrentOptions {
    core: McCore;
    layerName: string;
    libraryLayerId: string;
    libraryLayerCode?: string;
    libraryLayerName?: string;
    libraryLayerVersion?: number;
    libraryLayerLocked?: boolean;
    libraryLayerLockPerson?: string;
    source?: string;
}
interface MarkLayerDrawingInCurrentResult {
    entityCount: number;
    symbolCount: number;
    dictionaryCount: number;
    viewPortCount: number;
    groupCount: number;
}
interface RemoveLayerDrawingFromCurrentResult {
    entityCount: number;
    symbolCount: number;
    dictionaryCount: number;
    viewPortCount: number;
    groupCount: number;
}
interface MergeLayerDrawingProgress {
    stage: 'start' | 'parse' | 'symbols' | 'dictionaries' | 'entities' | 'groups' | 'redraw' | 'done';
    message: string;
    current: number;
    total: number;
    percent: number;
    stageCurrent?: number;
    stageTotal?: number;
}
interface TestMergeLayerDrawingFromFileOptions {
    core?: McCore;
    accept?: string;
    textCode?: string;
    batchSize?: number;
    onProgress?: (progress: MergeLayerDrawingProgress) => void;
}
interface TestMergeLayerDrawingFromFileResult extends MergeLayerDrawingIntoCurrentResult {
    core: McCore;
    fileName: string;
    fileType: string;
    fileSize: number;
    targetEntityTotal: number;
    drawableEntityCount: number;
    hasDrawableExtent: boolean;
}
interface ExportPrintedImageOptions {
    mode: McPrintMode;
    width: number;
    height: number;
    extent?: McGeExtent3;
    convertColor?: boolean;
    fileName?: string;
}
interface ExportDrawingPdfOptions {
    w: number;
    h: number;
}
interface ExportDrawingSvgOptions {
    w: number;
    h: number;
    mode?: McPrintMode;
    printTypeActive?: McPrintMode;
    extent?: McGeExtent3;
    printRange?: {
        minx: number;
        miny: number;
        minz: number;
        maxx: number;
        maxy: number;
        maxz: number;
    };
    convertColor?: boolean;
}
export type { IEventItem, IEventType, WhateverFunc, McRGB, EntityRegInfo, IMcColor, ThemeColorConfig, TaskProgressArgs, WorkerSuccessResponse, WorkerErrorResponse, QueryResponse, ParseCompleteResponse, InternalRequestConfig, HttpClientOptions, RequestInterceptor, ResponseInterceptor, Interceptors, responseType, MCDDataBlockInfo, KeyInfo, KeyBindingWithCore, KeyBindingWithoutCore, KeyBindingUpdate, KeyBindingContext, KeyBindingChangeEvent, ChordState, NotificationConfig, NotificationCheckboxConfig, NotificationDecisionConfig, NotificationDecisionResult, ResolvedNotificationConfig, PluginLoadProgressCurrent, PluginLoadProgressSnapshot, PluginPackageEntry, PluginPackagesJson, NormalizedPluginPackageEntry, McPluginLoadEnv, McPluginInfo, McPluginModule, PluginLoadError, PluginBootstrapResult, PluginVueComponentRegistration, ResolvedPluginVueComponent, PluginStartupPage, ExportLayerDrawingOptions, TestExportLayerDrawingDownloadOptions, TestExportLayerDrawingDownloadResult, MergeLayerDrawingIntoCurrentOptions, MergeLayerDrawingIntoCurrentResult, MarkLayerDrawingInCurrentOptions, MarkLayerDrawingInCurrentResult, RemoveLayerDrawingFromCurrentOptions, RemoveLayerDrawingFromCurrentResult, MergeLayerDrawingProgress, TestMergeLayerDrawingFromFileOptions, TestMergeLayerDrawingFromFileResult, ExportPrintedImageOptions, ExportDrawingPdfOptions, ExportDrawingSvgOptions, };
