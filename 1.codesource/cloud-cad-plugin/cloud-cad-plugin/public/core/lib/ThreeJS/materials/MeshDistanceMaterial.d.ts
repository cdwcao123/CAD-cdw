import { MaterialParameters, Material } from './Material';
import { Vector3 } from './../math/Vector3';
import { Texture } from './../textures/Texture';
export interface MeshDistanceMaterialParameters extends MaterialParameters {
    map?: Texture | null | undefined;
    alphaMap?: Texture | null | undefined;
    displacementMap?: Texture | null | undefined;
    displacementScale?: number | undefined;
    displacementBias?: number | undefined;
    farDistance?: number | undefined;
    nearDistance?: number | undefined;
    referencePosition?: Vector3 | undefined;
}

export class MeshDistanceMaterial extends Material {
    constructor(parameters?: MeshDistanceMaterialParameters);

    
    type: string;

    
    map: Texture | null;

    
    alphaMap: Texture | null;

    
    displacementMap: Texture | null;

    
    displacementScale: number;

    
    displacementBias: number;

    
    farDistance: number;

    
    nearDistance: number;

    
    referencePosition: Vector3;

    
    fog: boolean;

    setValues(parameters: MeshDistanceMaterialParameters): void;
}
