import { McMeshTextShapeData } from '../../mcCore/types/type';
import { McBaseTextShape } from './mcBaseTextShape';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class McStackTextShape extends McBaseTextShape {
    #private;
    private readonly shape;
    isShxFont(): boolean;
    private fractionFormatType;
    constructor(char: string, shape: McBaseTextShape[][], lineSpacing?: number, isShx?: boolean);
    protected getCharWidth(): number;
    protected getCharHeight(): number;
    getShapeData(offset: THREE.Vector3, matrix: THREE.Matrix4, overline?: boolean, strikeThrough?: boolean, underline?: boolean, bold?: boolean): McMeshTextShapeData | THREE.Vector3[][] | undefined;
    private generateShapeData;
    toSVG(options: {
        strokeWidth?: string;
        strokeColor?: string;
        isAutoFit?: boolean;
    }): string;
}
