import * as THREE from '../../../lib/ThreeJS/Three.js';
declare const McGsSolidNTShader: {
    uniforms: {
        pointLightPosition: {
            type: string;
            value: THREE.Vector3;
        };
    };
    vertexShader: string;
    fragmentShader: string;
};
export { McGsSolidNTShader };
