import * as THREE from '../../../lib/ThreeJS/Three.js';
declare const McGsHeatMapShader: {
    uniforms: {
        map: {
            type: string;
            value: null;
        };
        alpha: {
            type: string;
            value: number;
        };
        color: {
            type: string;
            value: THREE.Color;
        };
        orders: {
            type: string;
            value: number;
        };
    };
    vertexShader: string;
    fragmentShader: string;
};
export { McGsHeatMapShader };
