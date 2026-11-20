import { Color } from './../math/Color';
import { Vector3 } from '../math/Vector3';
import { Object3D } from './../core/Object3D';
import { SpotLightShadow } from './SpotLightShadow';
import { Light } from './Light';
import { ColorRepresentation } from '../utils';
import { Texture } from '../textures/Texture';

export class SpotLight extends Light {
    constructor(
        color?: ColorRepresentation,
        intensity?: number,
        distance?: number,
        angle?: number,
        penumbra?: number,
        decay?: number,
    );

    
    type: string;

    
    position: Vector3;

    
    target: Object3D;

    
    intensity: number;

    
    distance: number;

    
    angle: number;

    
    decay: number;

    
    shadow: SpotLightShadow;
    power: number;

    
    penumbra: number;

    
    map: Texture | null;

    readonly isSpotLight: true;
}
