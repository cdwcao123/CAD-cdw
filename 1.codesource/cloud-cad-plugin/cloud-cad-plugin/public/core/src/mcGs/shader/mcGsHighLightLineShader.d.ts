import * as THREE from '../../../lib/ThreeJS/Three.js';
declare const McGsHighLightLineShader: {
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
        color: {
            type: string;
            value: THREE.Color;
        };
        alpha: {
            type: string;
            value: number;
        };
    };
    vertexShader: string;
    fragmentShader: string;
};
export { McGsHighLightLineShader };
