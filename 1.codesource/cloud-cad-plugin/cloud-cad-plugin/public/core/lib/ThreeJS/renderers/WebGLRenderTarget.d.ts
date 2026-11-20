import { Vector4 } from './../math/Vector4';
import { Texture } from './../textures/Texture';
import { DepthTexture } from './../textures/DepthTexture';
import { EventDispatcher } from './../core/EventDispatcher';
import { Wrapping, TextureFilter, TextureDataType, TextureEncoding } from '../constants';
export interface WebGLRenderTargetOptions {
    wrapS?: Wrapping | undefined;
    wrapT?: Wrapping | undefined;
    magFilter?: TextureFilter | undefined;
    minFilter?: TextureFilter | undefined;
    format?: number | undefined; 
    type?: TextureDataType | undefined; 
    anisotropy?: number | undefined; 
    depthBuffer?: boolean | undefined; 
    stencilBuffer?: boolean | undefined; 
    generateMipmaps?: boolean | undefined; 
    depthTexture?: DepthTexture | undefined;
    encoding?: TextureEncoding | undefined;

    
    samples?: number;
}

export class WebGLRenderTarget extends EventDispatcher {
    constructor(width?: number, height?: number, options?: WebGLRenderTargetOptions);

    width: number;
    height: number;
    depth: number;

    scissor: Vector4;
    
    scissorTest: boolean;
    viewport: Vector4;
    texture: Texture;

    
    depthBuffer: boolean;

    
    stencilBuffer: boolean;

    
    depthTexture: DepthTexture;

    
    samples: number;

    readonly isWebGLRenderTarget: true;

    
    wrapS: any;
    
    wrapT: any;
    
    magFilter: any;
    
    minFilter: any;
    
    anisotropy: any;
    
    offset: any;
    
    repeat: any;
    
    format: any;
    
    type: any;
    
    generateMipmaps: any;

    setSize(width: number, height: number, depth?: number): void;
    clone(): this;
    copy(source: WebGLRenderTarget): this;
    dispose(): void;
}
