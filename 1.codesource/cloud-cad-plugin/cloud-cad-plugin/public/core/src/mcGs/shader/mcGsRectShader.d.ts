import * as THREE from '../../../lib/ThreeJS/Three.js';
declare const McGsRectShader: {
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
        width: {
            type: string;
            value: number;
        };
        height: {
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
        colorInner: {
            type: string;
            value: THREE.Color;
        };
        colorOutter: {
            type: string;
            value: THREE.Color;
        };
        offsetX: {
            type: string;
            value: number;
        };
        offsetY: {
            type: string;
            value: number;
        };
        innerAlpha: {
            type: string;
            value: number;
        };
        outterAlpha: {
            type: string;
            value: number;
        };
        direction: {
            type: string;
            value: THREE.Vector3;
        };
    };
    vertexShader: string;
    fragmentShader: string;
};
export { McGsRectShader };
