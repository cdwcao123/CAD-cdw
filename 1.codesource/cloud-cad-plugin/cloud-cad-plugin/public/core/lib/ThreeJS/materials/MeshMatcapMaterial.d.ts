import { Color } from './../math/Color';
import { Texture } from './../textures/Texture';
import { Vector2 } from './../math/Vector2';
import { MaterialParameters, Material } from './Material';
import { NormalMapTypes } from '../constants';
import { ColorRepresentation } from '../utils';
export interface MeshMatcapMaterialParameters extends MaterialParameters {
    color?: ColorRepresentation | undefined;
    matcap?: Texture | null | undefined;
    map?: Texture | null | undefined;
    bumpMap?: Texture | null | undefined;
    bumpScale?: number | undefined;
    normalMap?: Texture | null | undefined;
    normalMapType?: NormalMapTypes | undefined;
    normalScale?: Vector2 | undefined;
    displacementMap?: Texture | null | undefined;
    displacementScale?: number | undefined;
    displacementBias?: number | undefined;
    alphaMap?: Texture | null | undefined;
    fog?: boolean | undefined;
    flatShading?: boolean | undefined;
}

export class MeshMatcapMaterial extends Material {
    constructor(parameters?: MeshMatcapMaterialParameters);

    
    type: string;

    
    defines: { [key: string]: any };

    
    color: Color;

    
    matcap: Texture | null;

    
    map: Texture | null;

    
    bumpMap: Texture | null;

    
    bumpScale: number;

    
    normalMap: Texture | null;

    
    normalMapType: NormalMapTypes;

    
    normalScale: Vector2;

    
    displacementMap: Texture | null;

    
    displacementScale: number;

    
    displacementBias: number;

    
    alphaMap: Texture | null;

    
    flatShading: boolean;

    
    fog: boolean;

    setValues(parameters: MeshMatcapMaterialParameters): void;
}
