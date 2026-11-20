import { McRGB } from '../../mc';
import { PickResult, McEngine } from '../../mcCore';
import { McDbEntity } from '../../mcDb';
import { McGeExtent3, McGePlaneVolume } from '../../mcGe';
import { McGeRaycaster } from '../../mcGe/mcGeRaycaster';
import { McGsRenderable, McGsHighLightRenderable } from '..';
export declare class McGsRendererBase {
    engine: McEngine;
    entity: McDbEntity;
    boundingBox: McGeExtent3;
    renderables: McGsRenderable[];
    protected hoverObject: McGsHighLightRenderable | null;
    constructor(entity: McDbEntity, engine: McEngine);
    render(): boolean;
    dispose(): void;
    getBoundingBox(): McGeExtent3;
    updateBoundingBox(): void;
    raycast(raycaster: McGeRaycaster): PickResult | null;
    raycastVolume(planeVolume: McGePlaneVolume, isWrap?: boolean): boolean;
    hover(isMerge?: boolean, simpleHL?: boolean): void;
    highLight(simpleHL?: boolean): void;
    protected updateHighLight(isMerge?: boolean, simpleHL?: boolean): void;
    static blendHighLightColor(highColor: McRGB, color: McRGB): McRGB;
}
