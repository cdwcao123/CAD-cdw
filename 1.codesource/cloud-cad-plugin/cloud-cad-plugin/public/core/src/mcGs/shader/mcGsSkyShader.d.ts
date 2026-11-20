import * as THREE from '../../../lib/ThreeJS/Three.js';
declare const McGsSkyShader: {
    uniforms: {
        luminance: {
            type: string;
            value: number;
        };
        turbidity: {
            type: string;
            value: number;
        };
        rayleigh: {
            type: string;
            value: number;
        };
        mieCoefficient: {
            type: string;
            value: number;
        };
        mieDirectionalG: {
            type: string;
            value: number;
        };
        sunPosition: {
            type: string;
            value: THREE.Vector3;
        };
        cameraPos: {
            type: string;
            value: THREE.Vector3;
        };
    };
    vertexShader: string;
    fragmentShader: string;
};
export { McGsSkyShader };
