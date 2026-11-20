import { Vector2 } from './../math/Vector2';
import { Matrix3 } from './../math/Matrix3';
import { Source } from './Source';
import { EventDispatcher } from './../core/EventDispatcher';
import { Mapping, Wrapping, TextureFilter, PixelFormat, PixelFormatGPU, TextureDataType, TextureEncoding } from '../constants';

export interface OffscreenCanvas extends EventTarget {}

export class Texture extends EventDispatcher {
    
    constructor(
        image?: TexImageSource | OffscreenCanvas,
        mapping?: Mapping,
        wrapS?: Wrapping,
        wrapT?: Wrapping,
        magFilter?: TextureFilter,
        minFilter?: TextureFilter,
        format?: PixelFormat,
        type?: TextureDataType,
        anisotropy?: number,
        encoding?: TextureEncoding,
    );

    id: number;
    uuid: string;

    
    name: string;
    sourceFile: string;

    
    source: Source;

    
    get image(): any;

    
    set image(data: any);

    
    mipmaps: any[]; 

    
    mapping: Mapping;

    
    wrapS: Wrapping;

    
    wrapT: Wrapping;

    
    magFilter: TextureFilter;

    
    minFilter: TextureFilter;

    
    anisotropy: number;

    
    format: PixelFormat;

    internalFormat: PixelFormatGPU | null;

    
    type: TextureDataType;

    
    matrix: Matrix3;

    
    matrixAutoUpdate: boolean;

    
    offset: Vector2;

    
    repeat: Vector2;

    
    center: Vector2;

    
    rotation: number;

    
    generateMipmaps: boolean;

    
    premultiplyAlpha: boolean;

    
    flipY: boolean;

    
    unpackAlignment: number;

    
    encoding: TextureEncoding;

    
    isRenderTargetTexture: boolean;

    
    needsPMREMUpdate: boolean;

    
    userData: any;

    
    version: number;
    set needsUpdate(value: boolean);
    readonly isTexture: true;

    onUpdate: () => void;

    static DEFAULT_ANISOTROPY: number;
    static DEFAULT_IMAGE: any;
    static DEFAULT_MAPPING: any;

    clone(): this;
    copy(source: Texture): this;
    toJSON(meta: any): any;
    dispose(): void;
    transformUv(uv: Vector2): Vector2;
    updateMatrix(): void;
}
