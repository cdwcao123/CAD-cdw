import { McColor } from 'McCore';
type TableColor = Pick<McColor, 'colorIndex' | 'getColorIndex' | 'getColorMethod' | 'getMcRGB' | 'isByColor'>;
export declare const getTableColorSignature: (color: TableColor) => string;
export declare const getTableColorSelectValue: (color: TableColor | undefined | null, fallback?: number | string) => number | string;
export declare const getTableColorDisplayLabel: (color: TableColor) => string;
export {};
