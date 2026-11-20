import { Data3DTexture } from '../textures/Data3DTexture';
import { WebGLRenderTarget } from './WebGLRenderTarget';

export class WebGL3DRenderTarget extends WebGLRenderTarget {
    
    constructor(width?: number, height?: number, depth?: number);

    
    depth: number;

    
    texture: Data3DTexture;

    readonly isWebGL3DRenderTarget: true;
}
