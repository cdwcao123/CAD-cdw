import { DepthPackingStrategies } from '../constants';
import { MaterialParameters, Material } from './Material';
import { Texture } from './../textures/Texture';
export interface MeshDepthMaterialParameters extends MaterialParameters {
    map?: Texture | null | undefined;
    alphaMap?: Texture | null | undefined;
    depthPacking?: DepthPackingStrategies | undefined;
    displacementMap?: Texture | null | undefined;
    displacementScale?: number | undefined;
    displacementBias?: number | undefined;
    wireframe?: boolean | undefined;
    wireframeLinewidth?: number | undefined;
}

export class MeshDepthMaterial extends Material {
    constructor(parameters?: MeshDepthMaterialParameters);

    
    type: string;

    
    map: Texture | null;

    
    alphaMap: Texture | null;

    
    depthPacking: DepthPackingStrategies;

    
    displacementMap: Texture | null;

    
    displacementScale: number;

    
    displacementBias: number;

    
    wireframe: boolean;

    
    wireframeLinewidth: number;

    
    fog: boolean;

    setValues(parameters: MeshDepthMaterialParameters): void;
}
