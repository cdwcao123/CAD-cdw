import { ShxFontData } from '../../../lib/shx-parser';
import { McBaseFont } from './mcBaseFont';
import { McShxTextShape } from './mcShxTextShape';
export declare class McShxFont extends McBaseFont {
    private readonly font;
    readonly type = "shx";
    readonly data: ShxFontData;
    constructor(data: ShxFontData | ArrayBuffer);
    generateShapes(text: string, size: number, widthFactor?: number): McShxTextShape[];
    getScaleFactor(): number;
    getCharShape(char: string, size: number, widthFactor?: number): McShxTextShape | undefined;
    getNotFoundTextShape(size: number): McShxTextShape | undefined;
    private getCode;
}
