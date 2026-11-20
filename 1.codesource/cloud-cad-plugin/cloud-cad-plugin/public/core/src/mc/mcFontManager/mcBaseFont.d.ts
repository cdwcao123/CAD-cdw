import { ShxFontData } from '../../../lib/shx-parser';
import { McFontType } from '../../mcCore/types/type';
import { McBaseTextShape } from './mcBaseTextShape';
import { McMeshFontData } from './mcMeshFont';
export declare abstract class McBaseFont {
    abstract readonly type: McFontType;
    abstract readonly data: ShxFontData | McMeshFontData;
    unsupportedChars: Record<string, number>;
    abstract getCharShape(char: string, size: number, widthFactor: number): McBaseTextShape | undefined;
    abstract generateShapes(text: string, size: number, widthFactor: number): McBaseTextShape[] | undefined;
    abstract getScaleFactor(): number;
    abstract getNotFoundTextShape(size: number): McBaseTextShape | undefined;
    protected addUnsupportedChar(char: string): void;
}
