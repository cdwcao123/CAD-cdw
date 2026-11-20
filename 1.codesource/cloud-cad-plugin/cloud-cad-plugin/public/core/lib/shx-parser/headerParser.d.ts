import { ShxFileReader } from './fileReader';
import { ShxFontHeaderData } from './fontData';
export declare class ShxHeaderParser {
    parse(reader: ShxFileReader): ShxFontHeaderData;
    private parseHeader;
}
