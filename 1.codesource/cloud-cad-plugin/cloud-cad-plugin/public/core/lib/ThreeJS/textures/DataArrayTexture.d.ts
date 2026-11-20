import { Texture } from './Texture';
import { TextureFilter } from '../constants';
export class DataArrayTexture extends Texture {
    constructor(data?: BufferSource, width?: number, height?: number, depth?: number);

    
    magFilter: TextureFilter;

    
    minFilter: TextureFilter;

    
    wrapR: boolean;

    
    flipY: boolean;

    
    generateMipmaps: boolean;

    readonly isDataArrayTexture: true;
}
