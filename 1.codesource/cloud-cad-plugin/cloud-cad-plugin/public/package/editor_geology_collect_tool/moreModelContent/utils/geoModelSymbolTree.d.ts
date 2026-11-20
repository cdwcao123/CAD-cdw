export type GeoSymbolTreeOption = {
    label: string;
    value: string;
    children?: GeoSymbolTreeOption[];
    leaf?: boolean;
    disabled?: boolean;
    meta?: Record<string, unknown>;
};
export declare const normalizeCadSymbolTreeValue: (value: unknown, options?: GeoSymbolTreeOption[]) => unknown;
export declare const loadCadSymbolTreeOptions: () => Promise<GeoSymbolTreeOption[]>;
