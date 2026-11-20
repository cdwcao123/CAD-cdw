import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class McGs3DAxisEditor extends THREE.TransformControls {
    pointerHover(pointer: {
        x: number;
        y: number;
        button: number;
    }): void;
    pointerDown(pointer: {
        x: number;
        y: number;
        button: number;
    }): void;
    pointerMove(pointer: {
        x: number;
        y: number;
        button: number;
    }): void;
    pointerUp(pointer: {
        x: number;
        y: number;
        button: number;
    }): void;
}
