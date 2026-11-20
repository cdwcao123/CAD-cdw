import { Loader } from './Loader';
import { LoadingManager } from './LoadingManager';
import { Texture } from './../textures/Texture';

export class TextureLoader extends Loader {
    constructor(manager?: LoadingManager);

    load(
        url: string,
        onLoad?: (texture: Texture) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?: (event: ErrorEvent) => void,
    ): Texture;

    loadAsync(url: string, onProgress?: (event: ProgressEvent) => void): Promise<Texture>;
}
