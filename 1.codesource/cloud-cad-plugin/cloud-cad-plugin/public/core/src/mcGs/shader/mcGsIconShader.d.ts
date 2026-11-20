import * as THREE from '../../../lib/ThreeJS/Three.js';
declare const McGsIconShader: {
    uniforms: {
        canCover: {
            type: string;
            value: number;
        };
        viewWidth: {
            type: string;
            value: number;
        };
        viewHeight: {
            type: string;
            value: number;
        };
        alpha: {
            type: string;
            value: number;
        };
        offsetX: {
            type: string;
            value: number;
        };
        offsetY: {
            type: string;
            value: number;
        };
        width: {
            type: string;
            value: number;
        };
        height: {
            type: string;
            value: number;
        };
        texSampler: {
            type: string;
            value: null;
        };
        highlight: {
            type: string;
            value: number;
        };
        highLightColor: {
            type: string;
            value: THREE.Color;
        };
        color: {
            type: string;
            value: THREE.Color;
        };
        alignH: {
            type: string;
            value: number;
        };
        alignV: {
            type: string;
            value: number;
        };
    };
    vertexShader: string;
    fragmentShader: string;
};
export { McGsIconShader };
