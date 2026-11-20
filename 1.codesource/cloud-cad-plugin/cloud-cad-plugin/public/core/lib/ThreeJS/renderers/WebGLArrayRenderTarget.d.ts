import { DataArrayTexture } from '../textures/DataArrayTexture';
import { WebGLRenderTarget } from './WebGLRenderTarget';

export class WebGLArrayRenderTarget extends WebGLRenderTarget {
    
    constructor(width?: number, height?: number, depth?: number);

    
    depth: number;

    
    texture: DataArrayTexture;

    readonly isWebGLArrayRenderTarget: true;
}
