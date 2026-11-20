import { FontInfoType } from './types/interface';
export declare class McUiFontManager {
    fontList: FontInfoType[];
    currentFont: FontInfoType;
    constructor();
    getAllFontList(): Promise<void>;
    deleteFont(id: string): Promise<boolean>;
    setCurrentFont(data: FontInfoType): void;
    upload(data: FontInfoType): Promise<boolean>;
    download(): void;
    modify(): void;
}
export declare const mcUifontManager: McUiFontManager;
