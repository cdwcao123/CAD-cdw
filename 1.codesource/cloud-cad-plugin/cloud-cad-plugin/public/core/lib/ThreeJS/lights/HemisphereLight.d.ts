import { Color } from './../math/Color';
import { Vector3 } from '../math/Vector3';
import { Light } from './Light';
import { ColorRepresentation } from '../utils';
export class HemisphereLight extends Light {
    
    constructor(skyColor?: ColorRepresentation, groundColor?: ColorRepresentation, intensity?: number);

    
    type: string;

    
    position: Vector3;

    groundColor: Color;

    readonly isHemisphereLight: true;
}
