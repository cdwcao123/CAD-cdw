import { Mapping } from '../constants';
import { Texture } from '../textures/Texture';
export namespace ImageUtils {
    function getDataURL(image: any): string;

    
    let crossOrigin: string;

    
    function loadTexture(
        url: string,
        mapping?: Mapping,
        onLoad?: (texture: Texture) => void,
        onError?: (message: string) => void,
    ): Texture;

    
    function loadTextureCube(
        array: string[],
        mapping?: Mapping,
        onLoad?: (texture: Texture) => void,
        onError?: (message: string) => void,
    ): Texture;

    function sRGBToLinear(image: any): HTMLCanvasElement | { data: number[]; width: number; height: number };
}
