import { CommandValueType, McColor, McCore, McDbLayer, McDbLayerTable } from 'McCore';
import { McViewType } from 'McCore/mcCore';
import { EditEventTypeMap } from '../mcEditor/type/interface';
import { MenuItem } from '../mcUiCommon';
import { Options } from '../mcUiMain';
import { TopNodeJsonItem } from '../mcUiTop';
export declare const switchSceneView: (core: McCore, type: McViewType) => void;
export declare const switchSceneSync: (core: McCore, isSync: boolean) => void;
export declare const getLayerTable: (core: McCore) => McDbLayerTable;
export declare const getLayerEntities: (core: McCore, layerId: string) => McDbLayer | undefined;
export declare const moreParamsCommand: (item: MenuItem | TopNodeJsonItem) => Promise<void>;
export declare const emitAction: <K extends keyof EditEventTypeMap>(action: K, data: EditEventTypeMap[K]) => void;
export declare const readFileAsText: (file: File) => Promise<string>;
export declare const toFixedOrOriginal: (num: number | string, decimalPlaces: number) => string | number;
export declare const rgbToHex: (r: number, g: number, b: number) => string;
export declare const hexOrRgbToRgb: (color: string) => {
    r: number;
    g: number;
    b: number;
};
export declare const getLineWeightOptions: () => {
    label: string;
    value: number;
}[];
export declare const downloadFileOrBlob: (data: Blob, filename: string) => void;
export declare const downloadFileByUrl: (url: string, filename: string) => Promise<void>;
export declare const jsonToFile: (jsonData: object, name: string) => File;
export declare const jsonFileToJsonObject: (file: File) => Promise<object | undefined>;
export declare const convertObjectToBuffer: (jsonObject: object) => ArrayBuffer;
export declare const fromArrayBuffer: <T>(buffer: ArrayBuffer, classObj: T) => T;
export declare const bufferToJson: (buffer: ArrayBuffer) => object | null;
export declare const mcColorToRgb: (mcColor: McColor) => string;
export declare const rgbToMcColor: (rgb: string | number) => McColor;
export declare const mcColorWebColor: (mcColor: McColor) => string | number;
export declare function enumToOptions<T extends object>(enumObj: T, maslg: any, keyMap?: Record<string, string>): {
    value: number;
    label: any;
}[];
export declare const formatColor: (color?: {
    r: number;
    g: number;
    b: number;
}, colorIndex?: number) => string;
export declare const mcColorToSelectValue: (color: McColor | undefined | null, fallbackColorIndex: number) => string | number;
export declare const getFilenameFromUrl: (urlString: string) => string;
export declare const getFileExtension: (filename: string) => string;
export declare const getFileNameWithoutExtensionCapture: (fileName: string) => string;
export declare const arrayToTree: (data: any[], options?: {}) => any;
export declare const getBaseInfoFromEditor: () => {
    ID: string;
    DwgName: string;
} | undefined;
export declare const formatArrayBufferSize: (bytes: number, decimals?: number) => string;
export declare const insertIntoMapViaArray: (originalMap: Map<string, any>, indexToInsertAfter: number, config: any) => Map<string, any>;
export declare const invokeMethod: <T extends object>(instance: T, methodName: keyof T & string, ...args: any[]) => any;
export declare function objectToFormData(obj: any, formData?: FormData, parentKey?: string): FormData;
export declare function compare(a: any, b: any, operator: string): boolean;
export declare const degToRad: (deg: number) => number;
export declare const radToDeg: (rad: number) => number;
export declare const normalizeRgbValue: (color: string) => string;
export declare function formatCommandValueTypesToOptions(flags: number): Options[];
export declare function getCommandValueTypeByValue(value: any): CommandValueType;
export declare function getStaticPath(path: string): string;
export declare function getArrowOptions(): {
    label: string;
    value: string;
}[];
export declare function getDrawingHash(buffer: any): Promise<string>;
export declare const getDimensionStyleOptions: () => {
    label: any;
    value: any;
}[];
export declare const getLeaderDimensionStyleOptions: () => {
    label: any;
    value: any;
}[];
