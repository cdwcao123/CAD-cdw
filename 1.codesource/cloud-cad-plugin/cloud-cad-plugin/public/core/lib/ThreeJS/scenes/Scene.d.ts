import { FogBase } from './Fog';
import { Material } from './../materials/Material';
import { Object3D } from './../core/Object3D';
import { Color } from '../math/Color';
import { Texture } from '../textures/Texture';
import { WebGLRenderer } from '../renderers/WebGLRenderer';
import { Camera } from '../cameras/Camera';

export class Scene extends Object3D {
    constructor();

    type: 'Scene';

    
    fog: FogBase | null;

    
    backgroundBlurriness: number;

    
    backgroundIntensity: number;

    
    overrideMaterial: Material | null;

    
    background: null | Color | Texture;

    
    environment: null | Texture;

    readonly isScene: true;

    toJSON(meta?: any): any;
}
