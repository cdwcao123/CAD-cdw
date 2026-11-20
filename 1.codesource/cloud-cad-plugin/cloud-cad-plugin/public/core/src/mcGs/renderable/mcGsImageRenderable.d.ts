import { McRGB } from '../../mc';
import { PickResult } from '../../mcCore';
import { McGePlaneVolume, McGePoint, McGeVector3 } from '../../mcGe';
import { McGeRaycaster } from '../../mcGe/mcGeRaycaster';
import { McGsRendererBase } from '../render/mcGsRendererBase';
import { GsMergeGeometry } from '../types/interface';
import { McGsRenderable } from './mcGsRenderable';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class McGsImageRenderable extends McGsRenderable {
    private coords;
    private indices;
    private uvs;
    private alpha;
    private transparent;
    private image;
    constructor(renderBase: McGsRendererBase, coords: McGePoint[], indices: number[], uvs: number[], image: THREE.Texture, transparent: boolean, alpha?: number);
    getMaterialCode(): string;
    getAlpha(): number;
    setAlpha(alpha: number): void;
    getImage(): THREE.Texture;
    setImage(image: THREE.Texture): void;
    generateGeometry(center: McGeVector3, offset: number, indexOffset: number, isTransparent: boolean): GsMergeGeometry | null;
    raycast(raycaster: McGeRaycaster): PickResult | null;
    raycastVolume(planeVolume: McGePlaneVolume, isWrap?: boolean): boolean;
    getHighLightData(): McGePoint[][] | null;
    setColor(color: McRGB): void;
    setHighLightColor(color: McRGB): void;
    resetColor(): void;
}
