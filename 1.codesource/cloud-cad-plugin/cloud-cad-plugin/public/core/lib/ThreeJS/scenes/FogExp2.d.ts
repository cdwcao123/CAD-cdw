import { Color } from './../math/Color';
import { FogBase } from './Fog';

export class FogExp2 implements FogBase {
    constructor(hex: number | string, density?: number);

    
    name: string;

    color: Color;

    
    density: number;

    readonly isFogExp2: true;

    clone(): FogExp2;
    toJSON(): any;
}
