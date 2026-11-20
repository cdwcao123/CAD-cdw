import { ShxFontData } from './fontData';
import { ShxShape } from './shape';
export declare class ShxShapeParser {
    private readonly fontData;
    private shapeCache;
    private shapeData;
    constructor(fontData: ShxFontData);
    release(): void;
    parse(code: number, size: number): ShxShape | undefined;
    parseShx(code: number): ShxShape | undefined;
    parseShape(data: Uint8Array, scale: number): ShxShape;
    private handleSpecialCommand;
    private handleVectorCommand;
    private getVectorForDirection;
    private handleSubshapeCommand;
    private handleXYDisplacement;
    private handleMultipleXYDisplacements;
    private handleOctantArc;
    private handleFractionalArc;
    private handleBulgeArc;
    private handleMultipleBulgeArcs;
    private skipCode;
    private getShapeByCodeWithOffset;
    private handleArcSegment;
}
