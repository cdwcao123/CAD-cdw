import * as THREE from '../../../lib/ThreeJS/Three.js';
declare const McGsAnglePanelShader: {
    uniforms: {
        viewWidth: {
            type: string;
            value: number;
        };
        viewHeight: {
            type: string;
            value: number;
        };
        color: {
            type: string;
            value: THREE.Color;
        };
        highLightColor: {
            type: string;
            value: THREE.Color;
        };
    };
    vertexShader: string;
    fragmentShader: string;
};
export { McGsAnglePanelShader };
