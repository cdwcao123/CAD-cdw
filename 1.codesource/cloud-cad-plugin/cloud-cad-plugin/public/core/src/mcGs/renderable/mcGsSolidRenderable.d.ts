import { McRGB } from '../../mc';
import { PickResult } from '../../mcCore';
import { McGePlaneVolume, McGePoint } from '../../mcGe';
import { McGeRaycaster } from '../../mcGe/mcGeRaycaster';
import { McGsRenderable, McGsRendererBase } from '..';
import { GsMergeGeometry } from '../types/interface';
import { McGeVector3 } from './../../mcGe/mcGeVector3';
export declare class McGsSolidRenderable extends McGsRenderable {
    private coords;
    private alpha;
    polygonIndex: number[];
    constructor(renderBase: McGsRendererBase, coords: McGePoint[][], alpha?: number, color?: McRGB);
    getMaterialCode(): string;
    getAlpha(): number;
    setAlpha(alpha: number): void;
    generateGeometry(center: McGeVector3, offset: number, indexOffset: number, isTransparent: boolean): GsMergeGeometry | null;
    raycast(raycaster: McGeRaycaster): PickResult | null;
    raycastVolume(planeVolume: McGePlaneVolume, isWrap?: boolean): boolean;
    getHighLightData(): McGePoint[][] | null;
}
