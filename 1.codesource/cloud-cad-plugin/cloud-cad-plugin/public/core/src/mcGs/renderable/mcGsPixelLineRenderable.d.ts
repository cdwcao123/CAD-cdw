import { McRGB } from '../../mc';
import { PickResult } from '../../mcCore';
import { McGePlaneVolume, McGePoint, McGeVector3 } from '../../mcGe';
import { McGeRaycaster } from '../../mcGe/mcGeRaycaster';
import { McGsRenderable, McGsRendererBase } from '..';
import { GsMergeGeometry } from '../types/interface';
export declare class McGsPixelLineRenderable extends McGsRenderable {
    private coords;
    private width;
    private alpha;
    constructor(renderBase: McGsRendererBase, coords: McGePoint[][], width?: number, alpha?: number, color?: McRGB);
    getWidth(): number;
    setWidth(width: number): void;
    getAlpha(): number;
    setAlpha(alpha: number): void;
    getMaterialCode(): string;
    generateGeometry(center: McGeVector3, offset: number, indexOffset: number, isTransparent: boolean): GsMergeGeometry | null;
    raycast(raycaster: McGeRaycaster): PickResult | null;
    raycastVolume(planeVolume: McGePlaneVolume, isWrap?: boolean): boolean;
    getHighLightData(): McGePoint[][] | null;
}
