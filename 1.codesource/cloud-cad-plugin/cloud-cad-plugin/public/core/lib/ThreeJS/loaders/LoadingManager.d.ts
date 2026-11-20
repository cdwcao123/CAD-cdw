import { Loader } from './Loader';
export const DefaultLoadingManager: LoadingManager;

export class LoadingManager {
    constructor(
        onLoad?: () => void,
        onProgress?: (url: string, loaded: number, total: number) => void,
        onError?: (url: string) => void,
    );

    
    onStart?: ((url: string, loaded: number, total: number) => void) | undefined;

    
    onLoad: () => void;

    
    onProgress: (url: string, loaded: number, total: number) => void;

    
    onError: (url: string) => void;

    
    setURLModifier(callback?: (url: string) => string): this;

    
    resolveURL(url: string): string;

    itemStart(url: string): void;
    itemEnd(url: string): void;
    itemError(url: string): void;

    

    addHandler(regex: RegExp, loader: Loader): this;
    removeHandler(regex: RegExp): this;
    getHandler(file: string): Loader | null;
}
