import { ColorRepresentation } from '../utils';
import { Light } from './Light';
import { PointLightShadow } from './PointLightShadow';

export class PointLight extends Light {
    constructor(color?: ColorRepresentation, intensity?: number, distance?: number, decay?: number);

    
    type: string;

    
    intensity: number;

    
    distance: number;

    
    castShadow: boolean;

    
    decay: number;

    
    shadow: PointLightShadow;

    power: number;
}
