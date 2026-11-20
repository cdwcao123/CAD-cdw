import { McGeVector3 } from '../../mcGe/mcGeVector3';
import { ShxShape } from '../../../lib/shx-parser';
import { McBaseTextShape } from './mcBaseTextShape';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class McShxTextShape extends McBaseTextShape {
    private readonly shape;
    constructor(char: string, shape: ShxShape, widthFactor?: number, size?: number);
    protected getCharWidth(): number;
    protected getCharHeight(): number;
    offset(x: number, y: number): McShxTextShape;
    toPolylines(letterSpacing?: number, overline?: boolean, strikeThrough?: boolean, underline?: boolean): McGeVector3[][];
    getPolylines(offset: THREE.Vector3, matrix: THREE.Matrix4, letterSpacing?: number, overline?: boolean, strikeThrough?: boolean, underline?: boolean): McGeVector3[][];
    getPolylinesForEmpty(width: number, height: number, offset: THREE.Vector3, matrix: THREE.Matrix4, letterSpacing?: number, overline?: boolean, strikeThrough?: boolean, underline?: boolean): McGeVector3[][];
    toSVG(options?: {
        strokeWidth?: string;
        strokeColor?: string;
        isAutoFit?: boolean;
    }): string;
}
