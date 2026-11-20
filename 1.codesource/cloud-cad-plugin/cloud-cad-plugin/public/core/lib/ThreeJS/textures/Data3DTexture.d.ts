import { Texture } from './Texture';
import { TextureFilter, Wrapping } from '../constants';
export class Data3DTexture extends Texture {
    constructor(data: BufferSource, width: number, height: number, depth: number);

    
    magFilter: TextureFilter;

    
    minFilter: TextureFilter;

    
    wrapR: Wrapping;

    
    flipY: boolean;

    
    generateMipmaps: boolean;

    readonly isData3DTexture: true;
}
