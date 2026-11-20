import { Color } from './../math/Color';
import { Texture } from './../textures/Texture';
import { Vector2 } from './../math/Vector2';
import { MaterialParameters, Material } from './Material';
import { NormalMapTypes } from '../constants';
import { ColorRepresentation } from '../utils';
export interface MeshToonMaterialParameters extends MaterialParameters {
    
    color?: ColorRepresentation | undefined;
    opacity?: number | undefined;
    gradientMap?: Texture | null | undefined;
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
    alphaMap?: Texture | null | undefined;
    wireframe?: boolean | undefined;
    wireframeLinewidth?: number | undefined;
    wireframeLinecap?: string | undefined;
    wireframeLinejoin?: string | undefined;
    fog?: boolean | undefined;
}

export class MeshToonMaterial extends Material {
    constructor(parameters?: MeshToonMaterialParameters);

    
    type: string;

    
    defines: { [key: string]: any };

    
    color: Color;

    
    gradientMap: Texture | null;

    
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

    
    alphaMap: Texture | null;

    
    wireframe: boolean;

    
    wireframeLinewidth: number;

    
    wireframeLinecap: string;

    
    wireframeLinejoin: string;

    
    fog: boolean;

    setValues(parameters: MeshToonMaterialParameters): void;
}
