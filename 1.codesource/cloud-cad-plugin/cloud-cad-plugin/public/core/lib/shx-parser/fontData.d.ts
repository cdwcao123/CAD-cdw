export type Orientation = 'horizontal' | 'vertical';
export declare enum ShxFontType {
    Shapes = "shapes",
    BigFont = "bigfont",
    UniFont = "unifont"
}
export interface ShxFontContentData {
    data: Record<number, Uint8Array>;
    info: string;
    orientation: Orientation;
    baseUp: number;
    baseDown: number;
    isExtended: boolean;
}
export interface ShxShapeContentData extends ShxFontContentData {
    names: Record<string, number>;
}
export interface ShxFontHeaderData {
    fontType: ShxFontType;
    fileHeader: string;
    fileVersion: string;
}
export interface ShxFontData {
    header: ShxFontHeaderData;
    content: ShxFontContentData;
}
