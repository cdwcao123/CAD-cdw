import { PrintRange } from '../../../mcUiMain';
import { McEngine2D, McPrintMode } from 'McCore';
export interface PrintTarget {
    signal?: AbortSignal;
    getEngine: () => McEngine2D;
    selectRange: (signal: AbortSignal) => Promise<PrintRange | null>;
    getLastRange: () => PrintRange | null;
    setLastRange: (range: PrintRange) => void;
}
export interface PrintPanelProps {
    target: PrintTarget;
}
export interface PrintDialogOptions {
    target?: PrintTarget;
    title?: string;
}
export type DrawDirection = 'portrait' | 'landscape';
export type PrintUnit = 'mm' | 'cm' | 'inch';
export interface PrintConfig {
    printTypeActive: McPrintMode;
    drawSize: string;
    drawSizeUnit: PrintUnit;
    drawDirection: DrawDirection;
    drawUnit: number;
    printScale: number;
    printUnit: PrintUnit;
    printFill: boolean;
    centerPlot: boolean;
    draWidth: number;
    draHeight: number;
    printOriginOffsetX: number;
    printOriginOffsetY: number;
    printOriginOffsetZ: number;
    printRange: PrintRange;
    printRadio: number;
    printImageSize: number;
    printPXRatio: number;
}
export interface ConversionOptions {
    size: number;
    unit?: PrintUnit;
    dpi?: number;
}
export interface CalculateScaleResult {
    pxPerUnit: number;
    pxPerMm: number;
    scale: number;
    fitWidth: number;
    fitHeight: number;
    unit: PrintUnit;
}
