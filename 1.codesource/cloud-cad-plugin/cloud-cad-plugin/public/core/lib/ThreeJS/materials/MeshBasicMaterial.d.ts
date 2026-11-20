import { Color } from './../math/Color';
import { Texture } from './../textures/Texture';
import { MaterialParameters, Material } from './Material';
import { Combine } from '../constants';
import { ColorRepresentation } from '../utils';

export interface MeshBasicMaterialParameters extends MaterialParameters {
    color?: ColorRepresentation | undefined;
    opacity?: number | undefined;
    map?: Texture | null | undefined;
    lightMap?: Texture | null;
    lightMapIntensity?: number | undefined;
    aoMap?: Texture | null | undefined;
    aoMapIntensity?: number | undefined;
    specularMap?: Texture | null | undefined;
    alphaMap?: Texture | null | undefined;
    fog?: boolean | undefined;
    envMap?: Texture | null | undefined;
    combine?: Combine | undefined;
    reflectivity?: number | undefined;
    refractionRatio?: number | undefined;
    wireframe?: boolean | undefined;
    wireframeLinewidth?: number | undefined;
    wireframeLinecap?: string | undefined;
    wireframeLinejoin?: string | undefined;
}

export class MeshBasicMaterial extends Material {
    constructor(parameters?: MeshBasicMaterialParameters);

    
    type: string;

    
    color: Color;

    
    map: Texture | null;

    
    lightMap: Texture | null;

    
    lightMapIntensity: number;

    
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

    setValues(parameters: MeshBasicMaterialParameters): void;
}
