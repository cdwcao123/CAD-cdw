import { Camera } from './../../cameras/Camera';
import { Material } from './../../materials/Material';
import { Plane } from '../../math/Plane';
import { WebGLProperties } from './WebGLProperties';
export class WebGLClipping {
    constructor(properties: WebGLProperties);

    uniform: { value: any; needsUpdate: boolean };

    
    numPlanes: number;

    
    numIntersection: number;

    init(planes: any[], enableLocalClipping: boolean): boolean;
    beginShadows(): void;
    endShadows(): void;
    setGlobalState(planes: Plane[], camera: Camera): void;
    setState(material: Material, camera: Camera, useCache: boolean): void;
}
