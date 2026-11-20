import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare abstract class McBaseTextShape extends THREE.Shape {
    readonly char: string;
    width: number;
    widthFactor: number;
    height: number;
    fontSize: number;
    constructor(char: string);
    abstract toSVG(options: {
        strokeWidth?: string;
        strokeColor?: string;
        isAutoFit?: boolean;
    }): string;
}
