import { ColorRepresentation } from '../utils';
import { Color } from './../math/Color';
export interface FogBase {
    name: string;
    color: Color;
    clone(): FogBase;
    toJSON(): any;
}

export class Fog implements FogBase {
    constructor(color: ColorRepresentation, near?: number, far?: number);

    
    name: string;

    
    color: Color;

    
    near: number;

    
    far: number;

    readonly isFog: true;

    clone(): Fog;
    toJSON(): any;
}
