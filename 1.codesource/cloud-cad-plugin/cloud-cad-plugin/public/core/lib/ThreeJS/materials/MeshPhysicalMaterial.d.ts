import { Texture } from './../textures/Texture';
import { Vector2 } from './../math/Vector2';
import { MeshStandardMaterialParameters, MeshStandardMaterial } from './MeshStandardMaterial';
import { Color } from './../math/Color';
export interface MeshPhysicalMaterialParameters extends MeshStandardMaterialParameters {
    clearcoat?: number | undefined;
    clearcoatMap?: Texture | null | undefined;
    clearcoatRoughness?: number | undefined;
    clearcoatRoughnessMap?: Texture | null | undefined;
    clearcoatNormalScale?: Vector2 | undefined;
    clearcoatNormalMap?: Texture | null | undefined;

    reflectivity?: number | undefined;
    ior?: number | undefined;

    sheen?: number | undefined;
    sheenColor?: Color | undefined;
    sheenColorMap?: Texture | null | undefined;
    sheenRoughness?: number | undefined;
    sheenRoughnessMap?: Texture | null | undefined;

    transmission?: number | undefined;
    transmissionMap?: Texture | null | undefined;

    thickness?: number | undefined;
    thicknessMap?: Texture | null | undefined;

    attenuationDistance?: number | undefined;
    attenuationColor?: Color | undefined;

    specularIntensity?: number | undefined;
    specularColor?: Color | undefined;
    specularIntensityMap?: Texture | null | undefined;
    specularColorMap?: Texture | null | undefined;

    iridescenceMap?: Texture | null | undefined;
    iridescenceIOR?: number | undefined;
    iridescence?: number | undefined;
    iridescenceThicknessRange?: [number, number] | undefined;
    iridescenceThicknessMap?: Texture | null | undefined;
}

export class MeshPhysicalMaterial extends MeshStandardMaterial {
    constructor(parameters?: MeshPhysicalMaterialParameters);

    
    type: string;

    
    defines: { [key: string]: any };

    
    clearcoat: number;

    
    clearcoatMap: Texture | null;

    
    clearcoatRoughness: number;

    
    clearcoatRoughnessMap: Texture | null;

    
    clearcoatNormalScale: Vector2;

    
    clearcoatNormalMap: Texture | null;

    
    reflectivity: number;

    
    ior: number;

    
    sheen: number;

    
    sheenColor: Color;

    
    sheenColorMap: Texture | null;

    
    sheenRoughness: number;

    
    sheenRoughnessMap: Texture | null;

    
    transmission: number;

    
    transmissionMap: Texture | null;

    
    thickness: number;

    
    thicknessMap: Texture | null;

    
    attenuationDistance: number;

    
    attenuationColor: Color;

    
    specularIntensity: number;

    
    specularColor: Color;

    
    specularIntensityMap: Texture | null;

    
    specularColorMap: Texture | null;

    
    iridescenceMap: Texture | null;

    
    iridescenceIOR: number;

    
    iridescence: number;

    
    iridescenceThicknessRange: [number, number];

    
    iridescenceThicknessMap: Texture | null;
}
