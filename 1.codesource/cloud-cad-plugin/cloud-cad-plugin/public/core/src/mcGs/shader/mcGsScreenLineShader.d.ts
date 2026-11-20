import * as THREE from '../../../lib/ThreeJS/Three.js';
declare const McGsScreenLineShader: {
    uniforms: {
        viewWidth: {
            type: string;
            value: number;
        };
        viewHeight: {
            type: string;
            value: number;
        };
        width: {
            type: string;
            value: number;
        };
        alpha: {
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
export { McGsScreenLineShader };
