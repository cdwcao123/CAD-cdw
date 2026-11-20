import { Material } from './../materials/Material';
import { Raycaster } from './../core/Raycaster';
import { Object3D } from './../core/Object3D';
import { BufferGeometry } from '../core/BufferGeometry';
import { Intersection } from '../core/Raycaster';

export class Points<
    TGeometry extends BufferGeometry = BufferGeometry,
    TMaterial extends Material | Material[] = Material | Material[],
> extends Object3D {
    
    constructor(geometry?: TGeometry, material?: TMaterial);

    type: 'Points';
    morphTargetInfluences?: number[] | undefined;
    morphTargetDictionary?: { [key: string]: number } | undefined;
    readonly isPoints: true;

    
    geometry: TGeometry;

    
    material: TMaterial;

    raycast(raycaster: Raycaster, intersects: Intersection[]): void;
    updateMorphTargets(): void;
}
