import { PickResult } from '../../mcCore';
import { McGeRaycaster } from '../../mcGe/mcGeRaycaster';
import { McGsRendererBase } from '..';
export declare class McGsPointRender extends McGsRendererBase {
    render(): boolean;
    raycast(raycaster: McGeRaycaster): PickResult | null;
    protected updateHighLight(isMerge?: boolean, simpleHL?: boolean): void;
}
