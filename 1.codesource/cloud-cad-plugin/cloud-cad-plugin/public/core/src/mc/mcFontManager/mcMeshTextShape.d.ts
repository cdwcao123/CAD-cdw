import { McMeshTextShapeData } from '../../mcCore/types/type';
import { McBaseTextShape } from './mcBaseTextShape';
import { McMeshFont } from './mcMeshFont';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class McMeshTextShape extends McBaseTextShape {
    isFound: boolean;
    private readonly font;
    constructor(char: string, fontSize: number, font: McMeshFont, widthFactor?: number);
    get box(): {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
    };
    getVerticesAndIndices(offset: THREE.Vector3, matrix: THREE.Matrix4, bold?: boolean): McMeshTextShapeData;
    private getCharWidth;
    private getCharHeight;
    toSVG(options?: {
        strokeWidth?: string;
        strokeColor?: string;
        isAutoFit?: boolean;
    }): string;
}
