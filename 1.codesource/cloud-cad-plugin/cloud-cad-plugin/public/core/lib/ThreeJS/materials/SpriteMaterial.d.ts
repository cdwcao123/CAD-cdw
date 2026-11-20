import { ColorRepresentation } from '../utils';
import { Color } from './../math/Color';
import { Texture } from './../textures/Texture';
import { MaterialParameters, Material } from './Material';
export interface SpriteMaterialParameters extends MaterialParameters {
    color?: ColorRepresentation | undefined;
    map?: Texture | null | undefined;
    alphaMap?: Texture | null | undefined;
    rotation?: number | undefined;
    sizeAttenuation?: boolean | undefined;
    fog?: boolean | undefined;
}

export class SpriteMaterial extends Material {
    constructor(parameters?: SpriteMaterialParameters);
    
    type: string;

    
    color: Color;

    
    map: Texture | null;

    
    alphaMap: Texture | null;

    
    rotation: number;

    
    sizeAttenuation: boolean;

    
    transparent: boolean;

    
    fog: boolean;

    readonly isSpriteMaterial: true;

    setValues(parameters: SpriteMaterialParameters): void;
    copy(source: SpriteMaterial): this;
}
