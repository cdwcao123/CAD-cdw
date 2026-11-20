import { McFontData } from '../../mcCore/types/interface';
import { McBaseFont } from './mcBaseFont';
export declare class McFontFactory {
    private static _instance;
    private constructor();
    static get instance(): McFontFactory;
    createFont(data: McFontData): McBaseFont;
    createFontFromBuffer(fileName: string, buffer: ArrayBuffer): McBaseFont;
}
