import { Color } from './../math/Color';
import { Texture } from './../textures/Texture';
import { Vector2 } from './../math/Vector2';
import { MaterialParameters, Material } from './Material';
import { Combine, NormalMapTypes } from '../constants';
import { ColorRepresentation } from '../utils';
export interface MeshPhongMaterialParameters extends MaterialParameters {
    
    color?: ColorRepresentation | undefined;
    specular?: ColorRepresentation | undefined;
    shininess?: number | undefined;
    opacity?: number | undefined;
    map?: Texture | null | undefined;
    lightMap?: Texture | null | undefined;
    lightMapIntensity?: number | undefined;
    aoMap?: Texture | null | undefined;
    aoMapIntensity?: number | undefined;
    emissive?: ColorRepresentation | undefined;
    emissiveIntensity?: number | undefined;
    emissiveMap?: Texture | null | undefined;
    bumpMap?: Texture | null | undefined;
    bumpScale?: number | undefined;
    normalMap?: Texture | null | undefined;
    normalMapType?: NormalMapTypes | undefined;
    normalScale?: Vector2 | undefined;
    displacementMap?: Texture | null | undefined;
    displacementScale?: number | undefined;
    displacementBias?: number | undefined;
    specularMap?: Texture | null | undefined;
    alphaMap?: Texture | null | undefined;
    envMap?: Texture | null | undefined;
    combine?: Combine | undefined;
    reflectivity?: number | undefined;
    refractionRatio?: number | undefined;
    wireframe?: boolean | undefined;
    wireframeLinewidth?: number | undefined;
    wireframeLinecap?: string | undefined;
    wireframeLinejoin?: string | undefined;
    fog?: boolean | undefined;
    flatShading?: boolean | undefined;
}

export class MeshPhongMaterial extends Material {
    constructor(parameters?: MeshPhongMaterialParameters);

    
    type: string;

    
    color: Color;

    
    specular: Color;

    
    shininess: number;

    
    map: Texture | null;

    
    lightMap: Texture | null;

    
    lightMapIntensity: number;

    
    aoMap: Texture | null;

    
    aoMapIntensity: number;

    
    emissive: Color;

    
    emissiveIntensity: number;

    
    emissiveMap: Texture | null;

    
    bumpMap: Texture | null;

    
    bumpScale: number;

    
    normalMap: Texture | null;

    
    normalMapType: NormalMapTypes;

    
    normalScale: Vector2;

    
    displacementMap: Texture | null;

    
    displacementScale: number;

    
    displacementBias: number;

    
    specularMap: Texture | null;

    
    alphaMap: Texture | null;

    
    envMap: Texture | null;

    
    combine: Combine;

    
    reflectivity: number;

    
    refractionRatio: number;

    
    wireframe: boolean;

    
    wireframeLinewidth: number;

    
    wireframeLinecap: string;

    
    wireframeLinejoin: string;

    
    flatShading: boolean;

    
    metal: boolean;

    
    fog: boolean;

    setValues(parameters: MeshPhongMaterialParameters): void;
}
