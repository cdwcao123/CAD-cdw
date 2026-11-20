export declare function rgb2hex({ r, g, b }: any, toUpper: boolean): string;
export declare function createLinearGradient(direction: any, ctx: any, width: any, height: any, color1: any, color2: any): void;
export declare function hex2rgb(hex: any): {
    r: number;
    g: number;
    b: number;
};
export declare function rgb2hsv({ r, g, b }: any): {
    h: number;
    s: number;
    v: number;
};
export declare function isHex(str: string): boolean;
export declare function isRgb(str: string): boolean;
