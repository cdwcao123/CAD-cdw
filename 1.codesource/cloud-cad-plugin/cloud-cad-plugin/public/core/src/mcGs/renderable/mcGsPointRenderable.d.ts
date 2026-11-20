import { McRGB } from '../../mc';
import { PickResult } from '../../mcCore';
import { McGePlaneVolume, McGePoint, McGeVector3 } from '../../mcGe';
import { McGeRaycaster } from '../../mcGe/mcGeRaycaster';
import { McGsRenderable, McGsRendererBase } from '..';
import { GsMergeGeometry } from '../types/interface';
export declare class McGsPointRenderable extends McGsRenderable {
    private alpha;
    private pointSize;
    constructor(renderBase: McGsRendererBase, coord: McGeVector3 | McGePoint, alpha?: number, color?: McRGB);
    getAlpha(): number;
    setAlpha(alpha: number): void;
    setPointCenterSize(size: number): void;
    getMaterialCode(): string;
    generateGeometry(center: McGeVector3, offset: number, indexOffset: number, isTransparent: boolean): GsMergeGeometry | null;
    raycast(raycaster: McGeRaycaster): PickResult | null;
    raycastVolume(planeVolume: McGePlaneVolume, isWrap?: boolean): boolean;
    getHighLightData(): McGePoint[][] | null;
}
