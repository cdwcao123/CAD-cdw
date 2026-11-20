import { ShxFontData } from './fontData';
import { ShxShape } from './shape';
export declare class ShxFont {
    readonly fontData: ShxFontData;
    private readonly shapeParser;
    constructor(data: ShxFontData | ArrayBuffer);
    getCharShape(code: number, size: number): ShxShape | undefined;
    release(): void;
}
