import { LoadingManager } from './LoadingManager';

export class Loader {
    constructor(manager?: LoadingManager);

    
    crossOrigin: string;

    
    withCredentials: boolean;

    
    path: string;

    
    resourcePath: string;
    manager: LoadingManager;

    
    requestHeader: { [header: string]: string };

    

    setCrossOrigin(crossOrigin: string): this;
    setWithCredentials(value: boolean): this;
    setPath(path: string): this;
    setResourcePath(resourcePath: string): this;
    setRequestHeader(requestHeader: { [header: string]: string }): this;
}
