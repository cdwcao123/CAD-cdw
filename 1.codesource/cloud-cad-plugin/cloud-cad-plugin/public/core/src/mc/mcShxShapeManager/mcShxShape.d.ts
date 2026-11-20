import { McGeVector3 } from '../../mcGe';
import { ShxShape } from '../../../lib/shx-parser';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class McShxShape {
    #private;
    private readonly shape;
    readonly name: string;
    width: number;
    height: number;
    constructor(name: string, shape: ShxShape, offset: McGeVector3, scale: number, rotation: number);
    protected getCharWidth(): number;
    protected getCharHeight(): number;
    getPolylines(position: THREE.Vector3, offset: THREE.Vector3, matrix: THREE.Matrix4): THREE.Vector3[][];
    getShapeData(position: THREE.Vector3, rotation: number, preOffset?: boolean): THREE.Vector3[][] | undefined;
}
