import * as THREE from '../../../lib/ThreeJS/Three.js';
declare const McGsSolidYTShader: {
    uniforms: {
        pointLightPosition: {
            type: string;
            value: THREE.Vector3;
        };
    };
    vertexShader: string;
    fragmentShader: string;
};
export { McGsSolidYTShader };
