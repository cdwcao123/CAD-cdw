import * as exports from './exports';
export * from './exports';
declare const MCEDITOR: {
    VERSION: string;
    SUPPORTFILETYPE: string[];
    DELATIVE: 800;
    tempDrawingUrlParamId: "mcTempId";
    recentDrawingSessionKey: "mc:recentDrawing:restoreId";
    tempDrawingRecentSessionKeyPrefix: "mc:tempDrawing:recentId:";
    tempDrawingUrlParamVersion: "mcTempVer";
    tempDrawingUrlParamVersionValue: "1";
    tempDrawingTtlMs: number;
    tempDrawingIdSessionKey: "tempDrawingTabDataId";
    tempDrawingTabSessionKey: "tempDrawingTabSessionId";
    drawingBrowserSessionKey: "mc:drawingBrowserSession";
    tempDrawingTabSessionUrlParam: "mcTabSessionId";
    tempDrawingCloseSignalPrefix: "mc:tempDrawing:close:";
    tempDrawingCloseGraceMs: 1500;
    editorConfigGlobalKey: "__MC_EDITOR_CONFIG__";
    McEditor: typeof exports.McEditor;
    McEditCore: typeof exports.McEditCore;
    McUiPluginEditorContext: typeof exports.McUiPluginEditorContext;
    mcUiPluginEditorContext: exports.McUiPluginEditorContext;
    MenuTriggerPosition: typeof exports.MenuTriggerPosition;
    regCoreMenuEvens: (core: import('McCore').McCore) => void;
    regCoreCommandEvens: (core: import('McCore').McCore) => void;
    closeTopPanel: (cmdName: string) => Promise<void>;
    topToolUtils: typeof exports.topToolUtils;
    bottomToolUtils: typeof exports.bottomToolUtils;
    mcCoreToolUtils: typeof exports.mcCoreToolUtils;
    topModuleToolUtils: typeof exports.topModuleToolUtils;
    DwgCacheDb: typeof exports.DwgCacheDb;
    mcDwgCacheDb: exports.DwgCacheDb;
    McEditorSystemVariableManager: typeof exports.McEditorSystemVariableManager;
    mcEditorSystemVariableManager: exports.McEditorSystemVariableManager;
    saveDrawingBusinessInfo: (drawingInfo: exports.DwgInfoType) => void;
    getDrawingBusinessInfo: (drawingId: string) => exports.DwgInfoType | undefined;
    McUiBottomManager: typeof exports.McUiBottomManager;
    mcUiBottomManager: exports.McUiBottomManager;
    openPrintDialog: typeof exports.openPrintDialog;
    selectPreviewPrintRange: typeof exports.selectPreviewPrintRange;
    currentEntityList: import('vue').ShallowRef<import('McCore').McDbObject[] | import('McCore').McDbEntity[], import('McCore').McDbObject[] | import('McCore').McDbEntity[]>;
    calcApplyOptions: import('vue').ComputedRef<{
        action?: string | undefined;
        label: string;
        value: any;
        key?: string | undefined;
        options?: any[] | undefined;
    }[]>;
    propertyManager: import('./src/mcUiPropertyPanel/mcPropertyManager').McUiPropertyManager;
    quickSelectPreparing: import('vue').Ref<boolean, boolean>;
    quickSelectDataVersion: import('vue').Ref<number, number>;
    getQuickSelectEntitiesByApplyTo: (applyTo: number) => Promise<import('McCore').McDbObject[]>;
    rebuildQuickSelectPropertyCache: (entities: Iterable<import('McCore').McDbObject>, chunkSize?: number) => Promise<void>;
    rebuildQuickSelectPropertyCacheByApplyTo: (applyTo: number) => Promise<void>;
    applyOptions: import('vue').Ref<{
        action?: string | undefined;
        label: string;
        value: any;
        key?: string | undefined;
        options?: any[] | undefined;
    }[], exports.Options[] | {
        action?: string | undefined;
        label: string;
        value: any;
        key?: string | undefined;
        options?: any[] | undefined;
    }[]>;
    propertyOptions: import('vue').Ref<{
        action?: string | undefined;
        label: string;
        value: any;
        key?: string | undefined;
        options?: any[] | undefined;
    }[], exports.Options[] | {
        action?: string | undefined;
        label: string;
        value: any;
        key?: string | undefined;
        options?: any[] | undefined;
    }[]>;
    applyMethodOptions: import('vue').Ref<{
        action?: string | undefined;
        label: string;
        value: any;
        key?: string | undefined;
        options?: any[] | undefined;
    }[], exports.Options[] | {
        action?: string | undefined;
        label: string;
        value: any;
        key?: string | undefined;
        options?: any[] | undefined;
    }[]>;
    getPickEntity: (core: import('McCore').McCore, pickType?: import('McCore').McPickEntityMode) => Promise<import('McCore').McDbEntity[]>;
    McUiDwgTemplateManager: typeof exports.McUiDwgTemplateManager;
    dwgTemplateManager: exports.McUiDwgTemplateManager;
    McUiFontManager: typeof exports.McUiFontManager;
    mcUifontManager: exports.McUiFontManager;
    McUiInsertTable: import('vue').DefineComponent<exports.InsertTableProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
        changeData: (value: exports.InsertTableFormData) => any;
        "update:modelValue": (value: exports.InsertTableFormData) => any;
        editTableStyle: (value: string) => any;
    }, string, import('vue').PublicProps, Readonly<exports.InsertTableProps> & Readonly<{
        onChangeData?: ((value: exports.InsertTableFormData) => any) | undefined;
        "onUpdate:modelValue"?: ((value: exports.InsertTableFormData) => any) | undefined;
        onEditTableStyle?: ((value: string) => any) | undefined;
    }>, {
        modelValue: Partial<exports.InsertTableFormData>;
        tableStyleOptions: exports.InsertTableOption[];
        cellStyleOptions: exports.InsertTableOption[];
        cellStyleOptionsByTable: Record<string, exports.InsertTableOption[]>;
        tableStyles: import('McCore').McDbTableStyle[];
        fileAccept: string;
        onEditTableStyle: (styleName: string) => void;
        hasStartingTable: boolean;
    }, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
    McUiDialogManager: typeof exports.McUiDialogManager;
    mcUiDialogManager: exports.McUiDialogManager;
    McUiDrawManager: typeof exports.McUiDrawManager;
    mcUiDrawManager: exports.McUiDrawManager;
    DrawingSourceType: typeof exports.DrawingSourceType;
    useI18n: typeof exports.useI18n;
    McUiMainManager: typeof exports.McUiMainManager;
    mcUiMainManager: exports.McUiMainManager;
    ArcPropertyScript: typeof exports.ArcPropertyScript;
    BlockReferencePropertyScript: typeof exports.BlockReferencePropertyScript;
    CirclePropertyScript: typeof exports.CirclePropertyScript;
    EllipsePropertyScript: typeof exports.EllipsePropertyScript;
    LinePropertyScript: typeof exports.LinePropertyScript;
    MTextPropertyScript: typeof exports.MTextPropertyScript;
    PointPropertyScript: typeof exports.PointPropertyScript;
    PolylinePropertyScript: typeof exports.PolylinePropertyScript;
    RadialPropertyScript: typeof exports.RadialPropertyScript;
    StraightLinePropertyScript: typeof exports.StraightLinePropertyScript;
    TextPropertyScript: typeof exports.TextPropertyScript;
    Solid3DBasePropertyScript: typeof exports.Solid3DBasePropertyScript;
    TablePropertyScript: typeof exports.TablePropertyScript;
    XLinePropertyScript: typeof exports.XLinePropertyScript;
    BasePropertyScript: typeof exports.BasePropertyScript;
    entityTypeScriptMap: Record<string, any>;
    ControlType: typeof exports.ControlType;
    McUiSidePanelManager: typeof exports.McUiSidePanelManager;
    mcUiSidePanelManager: exports.McUiSidePanelManager;
    McUiTopManager: typeof exports.McUiTopManager;
    mcUiTopManager: exports.McUiTopManagerInstance;
    TopMenuType: typeof exports.TopMenuType;
    TopMenuIconSize: typeof exports.TopMenuIconSize;
    TopMenuDisplayType: typeof exports.TopMenuDisplayType;
    TopMenuSeparatorType: typeof exports.TopMenuSeparatorType;
    TopMenuAnchorPlacement: typeof exports.TopMenuAnchorPlacement;
    TopMenuMutationErrorCode: typeof exports.TopMenuMutationErrorCode;
    enumToOptions<T extends object>(enumObj: T, maslg: any, keyMap?: Record<string, string>): {
        value: number;
        label: any;
    }[];
    objectToFormData(obj: any, formData?: FormData, parentKey?: string): FormData;
    compare(a: any, b: any, operator: string): boolean;
    formatCommandValueTypesToOptions(flags: number): exports.Options[];
    getCommandValueTypeByValue(value: any): import('McCore').CommandValueType;
    getStaticPath(path: string): string;
    getArrowOptions(): {
        label: string;
        value: string;
    }[];
    getDrawingHash(buffer: any): Promise<string>;
    switchSceneView: (core: import('McCore').McCore, type: import('McCore').McViewType) => void;
    switchSceneSync: (core: import('McCore').McCore, isSync: boolean) => void;
    getLayerTable: (core: import('McCore').McCore) => import('McCore').McDbLayerTable;
    getLayerEntities: (core: import('McCore').McCore, layerId: string) => import('McCore').McDbLayer | undefined;
    moreParamsCommand: (item: exports.MenuItem | exports.TopNodeJsonItem) => Promise<void>;
    emitAction: <K extends keyof exports.EditEventTypeMap>(action: K, data: exports.EditEventTypeMap[K]) => void;
    readFileAsText: (file: File) => Promise<string>;
    toFixedOrOriginal: (num: number | string, decimalPlaces: number) => string | number;
    rgbToHex: (r: number, g: number, b: number) => string;
    hexOrRgbToRgb: (color: string) => {
        r: number;
        g: number;
        b: number;
    };
    getLineWeightOptions: () => {
        label: string;
        value: number;
    }[];
    downloadFileOrBlob: (data: Blob, filename: string) => void;
    downloadFileByUrl: (url: string, filename: string) => Promise<void>;
    jsonToFile: (jsonData: object, name: string) => File;
    jsonFileToJsonObject: (file: File) => Promise<object | undefined>;
    convertObjectToBuffer: (jsonObject: object) => ArrayBuffer;
    fromArrayBuffer: <T>(buffer: ArrayBuffer, classObj: T) => T;
    bufferToJson: (buffer: ArrayBuffer) => object | null;
    mcColorToRgb: (mcColor: import('McCore').McColor) => string;
    rgbToMcColor: (rgb: string | number) => import('McCore').McColor;
    mcColorWebColor: (mcColor: import('McCore').McColor) => string | number;
    formatColor: (color?: {
        r: number;
        g: number;
        b: number;
    }, colorIndex?: number) => string;
    mcColorToSelectValue: (color: import('McCore').McColor | undefined | null, fallbackColorIndex: number) => string | number;
    getFilenameFromUrl: (urlString: string) => string;
    getFileExtension: (filename: string) => string;
    getFileNameWithoutExtensionCapture: (fileName: string) => string;
    arrayToTree: (data: any[], options?: {}) => any;
    getBaseInfoFromEditor: () => {
        ID: string;
        DwgName: string;
    } | undefined;
    formatArrayBufferSize: (bytes: number, decimals?: number) => string;
    insertIntoMapViaArray: (originalMap: Map<string, any>, indexToInsertAfter: number, config: any) => Map<string, any>;
    invokeMethod: <T extends object>(instance: T, methodName: keyof T & string, ...args: any[]) => any;
    degToRad: (deg: number) => number;
    radToDeg: (rad: number) => number;
    normalizeRgbValue: (color: string) => string;
    getDimensionStyleOptions: () => {
        label: any;
        value: any;
    }[];
    getLeaderDimensionStyleOptions: () => {
        label: any;
        value: any;
    }[];
    apiClient: import('./src/mcUiHttp/httpClient').AdvancedHttpClient;
};
export default MCEDITOR;
declare global {
    interface Window {
        MCEDITOR: typeof MCEDITOR;
    }
}
