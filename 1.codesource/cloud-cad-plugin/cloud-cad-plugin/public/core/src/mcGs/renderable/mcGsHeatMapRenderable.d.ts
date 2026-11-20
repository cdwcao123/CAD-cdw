import { McRGB } from '../../mc';
import { PickResult } from '../../mcCore';
import { McGePlaneVolume, McGePoint, McGeVector3 } from '../../mcGe';
import { McGeRaycaster } from '../../mcGe/mcGeRaycaster';
import { McGsRendererBase } from '../render/mcGsRendererBase';
import { GsMergeGeometry } from '../types/interface';
import { McGsRenderable } from './mcGsRenderable';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class McGsHeatMapRenderable extends McGsRenderable {
    private coords;
    private indices;
    private uvs;
    private alpha;
    private heatmap;
    constructor(renderBase: McGsRendererBase, coords: McGePoint[], indices: number[], uvs: number[], heatmap: THREE.Texture, alpha?: number);
    getMaterialCode(): string;
    getAlpha(): number;
    setAlpha(alpha: number): void;
    getHeatMap(): THREE.Texture;
    setHeatMap(heatmap: THREE.Texture): void;
    generateGeometry(center: McGeVector3, offset: number, indexOffset: number, isTransparent: boolean): GsMergeGeometry | null;
    raycast(raycaster: McGeRaycaster): PickResult | null;
    raycastVolume(planeVolume: McGePlaneVolume, isWrap?: boolean): boolean;
    getHighLightData(): McGePoint[][] | null;
    setColor(color: McRGB): void;
    setHighLightColor(color: McRGB): void;
    resetColor(): void;
}
