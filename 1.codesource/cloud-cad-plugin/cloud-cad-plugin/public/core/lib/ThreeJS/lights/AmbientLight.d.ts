import { ColorRepresentation } from '../utils';
import { Light } from './Light';

export class AmbientLight extends Light {
    
    constructor(color?: ColorRepresentation, intensity?: number);

    
    type: string;

    readonly isAmbientLight: true;
}
