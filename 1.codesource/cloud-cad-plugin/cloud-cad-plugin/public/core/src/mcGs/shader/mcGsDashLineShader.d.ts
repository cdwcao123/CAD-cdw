import * as THREE from '../../../lib/ThreeJS/Three.js';
declare const McGsDashLineShader: {
    uniforms: {
        color: {
            type: string;
            value: THREE.Color;
        };
        space: {
            type: string;
            value: number;
        };
        alpha: {
            type: string;
            value: number;
        };
    };
    vertexShader: string;
    fragmentShader: string;
};
export { McGsDashLineShader };
