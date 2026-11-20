import { IMcHatchPatternDef } from '../../mcCore/types/interface';
import { McHatchPatternDef } from './mcHatchPatternDef';
export declare enum HatchDefSearchType {
    ePreDefined = 0,
    eCustomDefined = 1,
    eAll = 2
}
export declare class McHatchPatternDefManager {
    #private;
    private static _instance;
    private constructor();
    getMap(type?: HatchDefSearchType): Map<string, McHatchPatternDef>;
    getNameList(): string[];
    has(name: string, type?: HatchDefSearchType): boolean;
    get(name: string, type?: HatchDefSearchType): McHatchPatternDef | undefined;
    set(hatchDef: McHatchPatternDef): boolean;
    remove(name: string): boolean;
    loadPrePatFile(): Promise<void>;
    loadPatFile(patContent: ArrayBuffer | string, encoding?: string, group?: string): void;
    static parsePatFile(fileContent: string): IMcHatchPatternDef[];
    static getInstance(): McHatchPatternDefManager;
}
export declare const mcHatchPatternDefManger: McHatchPatternDefManager;
