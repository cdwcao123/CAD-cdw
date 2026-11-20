declare function setStaticResourceBasePath(basePath?: string): void;
declare function resolveStaticResourcePath(path: string): string;
declare function compareRecords<T extends Record<string, any>>(oldObj: Record<string, any>, newObj: Record<string, any>): {
    changedOld: Record<string, any>;
    changedNew: Record<string, any>;
};
declare function handleFontFilePath(fontFileName: string, lib?: string): string;
export declare const convertObjectToBuffer: (jsonObject: object) => ArrayBuffer;
export declare const fromArrayBuffer: <T>(buffer: ArrayBuffer, classObj: T) => T;
export declare const bufferToJson: (buffer: ArrayBuffer) => object | null;
declare function convertArrayBufferToBase64(buffer: ArrayBuffer): string;
declare function convertBase64ToArrayBuffer(base64: string): ArrayBuffer;
export { compareRecords, setStaticResourceBasePath, resolveStaticResourcePath, handleFontFilePath, convertBase64ToArrayBuffer, convertArrayBufferToBase64, };
