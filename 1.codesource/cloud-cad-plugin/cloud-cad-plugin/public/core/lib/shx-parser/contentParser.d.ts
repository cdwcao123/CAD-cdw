import { ShxFileReader } from './fileReader';
import { ShxFontContentData, ShxFontType } from './fontData';
export interface ShxContentParser {
    parse(reader: ShxFileReader): ShxFontContentData;
}
export declare class ShxContentParserFactory {
    static createParser(fontType: ShxFontType): ShxContentParser;
}
