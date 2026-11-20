import { Texture } from './Texture';
import { Mapping, Wrapping, TextureFilter, CompressedPixelFormat, TextureDataType, TextureEncoding } from '../constants';
export class CompressedTexture extends Texture {
    
    constructor(
        mipmaps: ImageData[],
        width: number,
        height: number,
        format?: CompressedPixelFormat,
        type?: TextureDataType,
        mapping?: Mapping,
        wrapS?: Wrapping,
        wrapT?: Wrapping,
        magFilter?: TextureFilter,
        minFilter?: TextureFilter,
        anisotropy?: number,
        encoding?: TextureEncoding,
    );

    get image(): { width: number; height: number };
    set image(value: { width: number; height: number });

    mipmaps: ImageData[];

    
    flipY: boolean;

    
    generateMipmaps: boolean;

    readonly isCompressedTexture: true;
}
