import { Material, MaterialParameters } from './Material';
import { Color } from './../math/Color';
import { Texture } from './../textures/Texture';
import { ColorRepresentation } from '../utils';
export interface PointsMaterialParameters extends MaterialParameters {
    color?: ColorRepresentation | undefined;
    map?: Texture | null | undefined;
    alphaMap?: Texture | null | undefined;
    size?: number | undefined;
    sizeAttenuation?: boolean | undefined;
    fog?: boolean | undefined;
}

export class PointsMaterial extends Material {
    constructor(parameters?: PointsMaterialParameters);

    
    type: string;

    
    color: Color;

    
    map: Texture | null;

    
    alphaMap: Texture | null;

    
    size: number;

    
    sizeAttenuation: boolean;

    
    fog: boolean;

    setValues(parameters: PointsMaterialParameters): void;
}
