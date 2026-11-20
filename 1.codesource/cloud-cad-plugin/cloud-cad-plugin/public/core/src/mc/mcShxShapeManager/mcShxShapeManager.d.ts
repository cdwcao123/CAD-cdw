import { McReturnStatus } from '../mcReturnStatus';
import { McGeVector3 } from '../../mcGe';
import { ShxFontHeaderData, ShxShapeContentData, ShxShapeParser } from '../../../lib/shx-parser';
import { McShxShape } from './mcShxShape';
export declare class McShxShapeManager {
    private static _instance;
    private loader;
    protected shxHeaderData: ShxFontHeaderData | undefined;
    protected shxContentData: ShxShapeContentData | undefined;
    protected shxShapeParser: ShxShapeParser | undefined;
    defaultShx: string;
    private initialized;
    private initPromise;
    private constructor();
    static get instance(): McShxShapeManager;
    init(): Promise<McReturnStatus<string>[]>;
    loadShxs(urls: string | string[]): Promise<McReturnStatus<string>[]>;
    loadShx(urlOrName: string, buff?: ArrayBuffer): Promise<void>;
    private parserShxData;
    generateShape(name: string, offset: McGeVector3, scale: number, rotation: number): McShxShape | undefined;
    getShxShapeName(code: number): string | undefined;
    getShxShapeCode(name: string): number | undefined;
}
