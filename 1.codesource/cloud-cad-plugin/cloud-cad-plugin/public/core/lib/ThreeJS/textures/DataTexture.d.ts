import { Texture } from './Texture';
import { Mapping, Wrapping, TextureFilter, PixelFormat, TextureDataType, TextureEncoding } from '../constants';
export class DataTexture extends Texture {
    
    constructor(
        data?: BufferSource | null,
        width?: number,
        height?: number,
        format?: PixelFormat,
        type?: TextureDataType,
        mapping?: Mapping,
        wrapS?: Wrapping,
        wrapT?: Wrapping,
        magFilter?: TextureFilter,
        minFilter?: TextureFilter,
        anisotropy?: number,
        encoding?: TextureEncoding,
    );

    get image(): ImageData;
    set image(value: ImageData);

    
    flipY: boolean;

    
    generateMipmaps: boolean;

    
    unpackAlignment: number;

    
    format: PixelFormat;

    readonly isDataTexture: true;
}
