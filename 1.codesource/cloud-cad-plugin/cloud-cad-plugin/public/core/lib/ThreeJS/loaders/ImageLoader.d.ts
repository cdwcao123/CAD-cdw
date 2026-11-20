import { Loader } from './Loader';
import { LoadingManager } from './LoadingManager';

export class ImageLoader extends Loader {
    constructor(manager?: LoadingManager);

    load(
        url: string,
        onLoad?: (image: HTMLImageElement) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?: (event: ErrorEvent) => void,
    ): HTMLImageElement;

    loadAsync(url: string, onProgress?: (event: ProgressEvent) => void): Promise<HTMLImageElement>;
}
