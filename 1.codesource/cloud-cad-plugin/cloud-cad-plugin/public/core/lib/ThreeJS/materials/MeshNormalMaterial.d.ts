import { MaterialParameters, Material } from './Material';
import { Texture } from './../textures/Texture';
import { Vector2 } from './../math/Vector2';
import { NormalMapTypes } from '../constants';
export interface MeshNormalMaterialParameters extends MaterialParameters {
    bumpMap?: Texture | null | undefined;
    bumpScale?: number | undefined;
    normalMap?: Texture | null | undefined;
    normalMapType?: NormalMapTypes | undefined;
    normalScale?: Vector2 | undefined;
    displacementMap?: Texture | null | undefined;
    displacementScale?: number | undefined;
    displacementBias?: number | undefined;
    wireframe?: boolean | undefined;
    wireframeLinewidth?: number | undefined;

    flatShading?: boolean | undefined;
}

export class MeshNormalMaterial extends Material {
    constructor(parameters?: MeshNormalMaterialParameters);

    
    type: string;

    
    bumpMap: Texture | null;

    
    bumpScale: number;

    
    normalMap: Texture | null;

    
    normalMapType: NormalMapTypes;

    
    normalScale: Vector2;

    
    displacementMap: Texture | null;

    
    displacementScale: number;

    
    displacementBias: number;

    
    wireframe: boolean;

    
    wireframeLinewidth: number;

    
    flatShading: boolean;

    setValues(parameters: MeshNormalMaterialParameters): void;
}
