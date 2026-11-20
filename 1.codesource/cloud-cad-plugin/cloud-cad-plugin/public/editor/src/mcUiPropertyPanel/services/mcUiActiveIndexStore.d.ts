export interface McUiActiveIndexContext {
    key: string;
    index: number;
}
export declare const mcUiDefaultIndexScope = "default";
export declare const isIndexFallbackKey: (key: unknown) => boolean;
export declare const setActiveIndex: (scope: string, key: string, index: unknown) => void;
export declare const getActiveIndex: (scope: string) => McUiActiveIndexContext | null;
export declare const clearActiveIndex: (scope: string) => void;
export declare const withIndexScope: <R>(scope: string, run: () => R) => R;
export declare const getCurrentIndexScope: () => string;
