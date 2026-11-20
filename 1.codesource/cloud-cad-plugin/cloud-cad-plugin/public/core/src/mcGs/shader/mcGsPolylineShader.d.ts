import * as THREE from '../../../lib/ThreeJS/Three.js';
declare const McGsPolylineShader: {
    uniforms: {
        viewWidth: {
            type: string;
            value: number;
        };
        viewHeight: {
            type: string;
            value: number;
        };
        canCover: {
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
        startColor: {
            type: string;
            value: THREE.Color;
        };
        endColor: {
            type: string;
            value: THREE.Color;
        };
        colorDuration: {
            type: string;
            value: number;
        };
        highlight: {
            type: string;
            value: number;
        };
        highLightColor: {
            type: string;
            value: THREE.Color;
        };
    };
    vertexShader: string;
    fragmentShader: string;
};
export { McGsPolylineShader };
