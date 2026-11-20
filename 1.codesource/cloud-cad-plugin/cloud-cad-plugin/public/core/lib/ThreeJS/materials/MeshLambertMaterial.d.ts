import { Color } from './../math/Color';
import { Texture } from './../textures/Texture';
import { MaterialParameters, Material } from './Material';
import { Combine, NormalMapTypes } from '../constants';
import { ColorRepresentation } from '../utils';
import { Vector2 } from '../Three';
export interface MeshLambertMaterialParameters extends MaterialParameters {
    bumpMap?: Texture | undefined;
    bumpScale?: number | undefined;
    color?: ColorRepresentation | undefined;
    displacementMap?: Texture | undefined;
    displacementScale?: number | undefined;
    displacementBias?: number | undefined;
    emissive?: ColorRepresentation | undefined;
    emissiveIntensity?: number | undefined;
    emissiveMap?: Texture | null | undefined;
    flatShading?: boolean | undefined;
    map?: Texture | null | undefined;
    lightMap?: Texture | null | undefined;
    lightMapIntensity?: number | undefined;
    normalMap?: Texture | undefined;
    normalScale?: Vector2 | undefined;
    aoMap?: Texture | null | undefined;
    aoMapIntensity?: number | undefined;
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
}

export class MeshLambertMaterial extends Material {
    constructor(parameters?: MeshLambertMaterialParameters);

    
    type: string;

    
    color: Color;

    
    bumpMap: Texture | null;

    
    bumpScale: number;

    
    displacementMap: Texture | null;

    
    displacementScale: number;

    
    displacementBias: number;

    
    emissive: Color;

    
    emissiveIntensity: number;

    
    emissiveMap: Texture | null;

    
    flatShading: boolean;

    
    map: Texture | null;

    
    lightMap: Texture | null;

    
    lightMapIntensity: number;

    
    normalMap: Texture | null;

    normalMapType: NormalMapTypes;

    
    normalScale: Vector2;

    
    aoMap: Texture | null;

    
    aoMapIntensity: number;

    
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

    
    fog: boolean;

    setValues(parameters: MeshLambertMaterialParameters): void;
}
