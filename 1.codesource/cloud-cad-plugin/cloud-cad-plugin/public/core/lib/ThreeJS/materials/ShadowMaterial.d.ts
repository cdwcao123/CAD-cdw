import { ColorRepresentation } from '../utils';
import { Color } from './../math/Color';
import { MaterialParameters, Material } from './Material';
export interface ShadowMaterialParameters extends MaterialParameters {
    color?: ColorRepresentation | undefined;
    fog?: boolean | undefined;
}

export class ShadowMaterial extends Material {
    constructor(parameters?: ShadowMaterialParameters);

    
    type: string;

    
    color: Color;

    
    transparent: boolean;

    
    fog: boolean;
}
