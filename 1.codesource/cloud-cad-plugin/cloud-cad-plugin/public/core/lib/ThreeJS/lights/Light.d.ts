import { Color } from './../math/Color';
import { LightShadow } from './LightShadow';
import { Object3D } from './../core/Object3D';

export class Light extends Object3D {
    constructor(hex?: number | string, intensity?: number);

    
    type: string;

    color: Color;

    
    intensity: number;
    readonly isLight: true;

    shadow: LightShadow;
    
    shadowCameraFov: any;
    
    shadowCameraLeft: any;
    
    shadowCameraRight: any;
    
    shadowCameraTop: any;
    
    shadowCameraBottom: any;
    
    shadowCameraNear: any;
    
    shadowCameraFar: any;
    
    shadowBias: any;
    
    shadowMapWidth: any;
    
    shadowMapHeight: any;

    dispose(): void;
}
