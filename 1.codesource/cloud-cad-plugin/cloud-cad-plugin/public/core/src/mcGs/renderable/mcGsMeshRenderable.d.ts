import { McRGB } from '../../mc';
import { PickResult } from '../../mcCore';
import { McGePlaneVolume, McGePoint, McGeVector3 } from '../../mcGe';
import { McGeRaycaster } from '../../mcGe/mcGeRaycaster';
import { GsMergeGeometry, McGsRenderable, McGsRendererBase } from '..';
export declare class McGsMeshRenderable extends McGsRenderable {
    protected coords: McGePoint[][];
    protected indices: number[][];
    protected alpha: number;
    constructor(renderBase: McGsRendererBase, coords: McGePoint[][], indices: number[][], alpha?: number, color?: McRGB);
    getMaterialCode(): string;
    getAlpha(): number;
    setAlpha(alpha: number): void;
    generateGeometry(center: McGeVector3, offset: number, indexOffset: number, isTransparent: boolean): GsMergeGeometry | null;
    raycast(raycaster: McGeRaycaster): PickResult | null;
    raycastVolume(planeVolume: McGePlaneVolume, isWrap?: boolean): boolean;
    getHighLightData(): McGePoint[][] | null;
}
