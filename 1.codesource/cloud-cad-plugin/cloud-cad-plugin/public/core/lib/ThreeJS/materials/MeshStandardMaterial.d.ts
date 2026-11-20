import { Color } from './../math/Color';
import { Texture } from './../textures/Texture';
import { Vector2 } from './../math/Vector2';
import { MaterialParameters, Material } from './Material';
import { NormalMapTypes } from '../constants';
import { ColorRepresentation } from '../utils';
export interface MeshStandardMaterialParameters extends MaterialParameters {
    color?: ColorRepresentation | undefined;
    roughness?: number | undefined;
    metalness?: number | undefined;
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
    roughnessMap?: Texture | null | undefined;
    metalnessMap?: Texture | null | undefined;
    alphaMap?: Texture | null | undefined;
    envMap?: Texture | null | undefined;
    envMapIntensity?: number | undefined;
    wireframe?: boolean | undefined;
    wireframeLinewidth?: number | undefined;
    fog?: boolean | undefined;
    flatShading?: boolean | undefined;
}

export class MeshStandardMaterial extends Material {
    constructor(parameters?: MeshStandardMaterialParameters);

    
    type: string;

    
    defines: { [key: string]: any };

    
    color: Color;

    
    roughness: number;

    
    metalness: number;

    
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

    
    roughnessMap: Texture | null;

    
    metalnessMap: Texture | null;

    
    alphaMap: Texture | null;

    
    envMap: Texture | null;

    
    envMapIntensity: number;

    
    wireframe: boolean;

    
    wireframeLinewidth: number;

    
    wireframeLinecap: string;

    
    wireframeLinejoin: string;

    
    flatShading: boolean;

    
    fog: boolean;

    isMeshStandardMaterial: boolean;

    setValues(parameters: MeshStandardMaterialParameters): void;
}
