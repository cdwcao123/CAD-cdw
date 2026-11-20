import { Object3D } from './../core/Object3D';
import { DirectionalLightShadow } from './DirectionalLightShadow';
import { Light } from './Light';
import { Vector3 } from '../math/Vector3';
import { ColorRepresentation } from '../utils';

export class DirectionalLight extends Light {
    constructor(color?: ColorRepresentation, intensity?: number);

    
    type: string;

    
    readonly position: Vector3;

    
    target: Object3D;

    
    intensity: number;

    
    shadow: DirectionalLightShadow;
    readonly isDirectionalLight: true;
}
