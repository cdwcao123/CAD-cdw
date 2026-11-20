import { Light } from './Light';
import { ColorRepresentation } from '../utils';
export class RectAreaLight extends Light {
    constructor(color?: ColorRepresentation, intensity?: number, width?: number, height?: number);

    
    type: string;

    
    width: number;

    
    height: number;

    
    intensity: number;

    power: number;

    readonly isRectAreaLight: true;
}
