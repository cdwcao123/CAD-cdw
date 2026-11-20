import { McGsRendererBase } from '..';
export declare class McGsDashLineRender extends McGsRendererBase {
    #private;
    render(): boolean;
    dispose(): void;
    hover(isMerge?: boolean, simpleHL?: boolean): void;
    highLight(simpleHL?: boolean): void;
}
