import { WebGLCapabilities } from './WebGLCapabilities';
import { Scene } from './../../scenes/Scene';
import { Camera } from './../../cameras/Camera';
import { WebGLRenderer } from '../WebGLRenderer';
import { ShadowMapType } from '../../constants';
import { WebGLObjects } from './WebGLObjects';
import { Light } from '../../lights/Light';
export class WebGLShadowMap {
    constructor(_renderer: WebGLRenderer, _objects: WebGLObjects, _capabilities: WebGLCapabilities);

    
    enabled: boolean;

    
    autoUpdate: boolean;

    
    needsUpdate: boolean;

    
    type: ShadowMapType;

    render(shadowsArray: Light[], scene: Scene, camera: Camera): void;

    
    cullFace: any;
}
