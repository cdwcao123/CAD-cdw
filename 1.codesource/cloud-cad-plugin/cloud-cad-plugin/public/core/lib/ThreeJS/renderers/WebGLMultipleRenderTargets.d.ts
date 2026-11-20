import { EventDispatcher } from '../core/EventDispatcher';
import { Texture } from '../textures/Texture';
import { WebGLRenderTargetOptions } from './WebGLRenderTarget';

export class WebGLMultipleRenderTargets extends EventDispatcher {
    texture: Texture[];

    readonly isWebGLMultipleRenderTargets = true;

    
    constructor(width?: number, height?: number, count?: number, options?: WebGLRenderTargetOptions);

    setSize(width: number, height: number, depth?: number): this;
    copy(source: WebGLMultipleRenderTargets): this;
    clone(): this;
    dispose(): void;
    
    setTexture(texture: Texture): void;
}
