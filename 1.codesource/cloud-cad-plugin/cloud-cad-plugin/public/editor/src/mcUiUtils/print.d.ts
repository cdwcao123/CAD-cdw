import { CalculateScaleResult, PrintUnit } from '../mcUiCommon/mcUiPrint/types/interface';
export declare const MIN_PRINT_IMAGE_SIZE = 256;
export declare const MAX_PRINT_IMAGE_SIZE = 8192;
export declare function normalizePrintImageSize(size: number): {
    size: number;
    clamped: boolean;
};
interface DimensionInput {
    width: number;
    height: number;
}
interface ScaleRatio {
    mmValue: number;
    actualValue: number;
}
interface ConversionResult {
    width: number;
    height: number;
    ratio: number;
}
interface PrintLayoutOptions {
    centerPlot?: boolean;
    offsetX?: number;
    offsetY?: number;
    offsetUnit?: PrintUnit;
}
export declare function convertDimensions(dimensions: DimensionInput, scale?: ScaleRatio): ConversionResult;
export declare function printBase64Image(base64Data: string, printSize: string, options?: PrintLayoutOptions): Promise<unknown>;
export declare function calculateImageSize(width: number, height: number, unit?: PrintUnit, dpi?: number): {
    width: number;
    height: number;
};
export declare function calculateScale(containerWidth: number, containerHeight: number, physicalWidth: number, physicalHeight: number, unit?: PrintUnit): CalculateScaleResult;
export {};
