import { McGeVector3 } from '../../mcGe';
import { McMeshTextShapeData } from '../../mcCore/types/type';
import { McBaseTextShape } from './mcBaseTextShape';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class McPhraseShape extends McBaseTextShape {
    #private;
    private readonly shape;
    private scaleAndRotationMatrix;
    isShxFont(): boolean;
    isValid(): boolean;
    constructor(char: string, shape: McBaseTextShape[], offset: McGeVector3, scale: number, rotation: number, lineSpacing?: number, isShx?: boolean);
    protected getCharWidth(): number;
    protected getCharHeight(): number;
    getShapeData(position: THREE.Vector3, rotation: number, preOffset?: boolean): THREE.Vector3[][] | McMeshTextShapeData | undefined;
    private generateShapeData;
    toSVG(options: {
        strokeWidth?: string;
        strokeColor?: string;
        isAutoFit?: boolean;
    }): string;
}
