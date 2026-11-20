import * as THREE from '../../../lib/ThreeJS/Three.js';
declare const McGsMouseCursorShader: {
    uniforms: {
        viewWidth: {
            type: string;
            value: number;
        };
        viewHeight: {
            type: string;
            value: number;
        };
        screenX: {
            type: string;
            value: number;
        };
        screenY: {
            type: string;
            value: number;
        };
        color: {
            type: string;
            value: THREE.Color;
        };
    };
    vertexShader: string;
    fragmentShader: string;
};
export { McGsMouseCursorShader };
