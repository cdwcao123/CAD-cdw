import { OffscreenCanvas, Texture } from './Texture';
import { Mapping, Wrapping, TextureFilter, PixelFormat, TextureDataType } from '../constants';
export class CanvasTexture extends Texture {
    
    constructor(
        canvas: TexImageSource | OffscreenCanvas,
        mapping?: Mapping,
        wrapS?: Wrapping,
        wrapT?: Wrapping,
        magFilter?: TextureFilter,
        minFilter?: TextureFilter,
        format?: PixelFormat,
        type?: TextureDataType,
        anisotropy?: number,
    );

    readonly isCanvasTexture: true;
}
