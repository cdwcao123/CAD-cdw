import { Texture } from './Texture';
import { Mapping, Wrapping, TextureFilter, TextureDataType } from '../constants';
export class DepthTexture extends Texture {
    
    constructor(
        width: number,
        height: number,
        type?: TextureDataType,
        mapping?: Mapping,
        wrapS?: Wrapping,
        wrapT?: Wrapping,
        magFilter?: TextureFilter,
        minFilter?: TextureFilter,
        anisotropy?: number,
    );

    get image(): { width: number; height: number };
    set image(value: { width: number; height: number });

    
    flipY: boolean;

    
    generateMipmaps: boolean;

    readonly isDepthTexture: true;
}
