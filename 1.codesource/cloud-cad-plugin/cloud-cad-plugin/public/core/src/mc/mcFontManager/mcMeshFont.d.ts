import { McFontType } from '../../mcCore/types/type';
import { McBaseFont } from './mcBaseFont';
import { McFont } from './mcFont';
import { McMeshTextShape } from './mcMeshTextShape';
export interface FontData {
    glyphs: Record<string, {
        ha: number;
        x_min: number;
        x_max: number;
        o?: string | undefined;
    }>;
    familyName: string;
    ascender: number;
    descender: number;
    underlinePosition: number;
    underlineThickness: number;
    boundingBox: {
        yMin: number;
        xMin: number;
        yMax: number;
        xMax: number;
    };
    resolution: number;
    original_font_information: {
        fontSubfamily: {
            zh: string;
        };
        fullName: {
            zh: string;
        };
    };
}
export interface McMeshFontData extends FontData {
    scaleFactor: number;
}
export declare class McMeshFont extends McBaseFont {
    protected scaleFactor?: number;
    readonly font: McFont;
    readonly type: McFontType;
    readonly data: McMeshFontData;
    constructor(data: McMeshFontData | ArrayBuffer, type: McFontType);
    generateShapes(text: string, size: number, widthFactor?: number): McMeshTextShape[];
    getCharShape(char: string, size: number, widthFactor?: number): McMeshTextShape | undefined;
    getScaleFactor(): number;
    getNotFoundTextShape(size: number): McMeshTextShape;
}
