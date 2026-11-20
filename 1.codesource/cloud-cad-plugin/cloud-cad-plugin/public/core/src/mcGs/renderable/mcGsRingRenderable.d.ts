import { McRGB } from '../../mc';
import { PickResult } from '../../mcCore';
import { McGePlaneVolume, McGePoint, McGeVector3 } from '../../mcGe';
import { McGeRaycaster } from '../../mcGe/mcGeRaycaster';
import { GsMergeGeometry, McGsRenderable, McGsRendererBase } from '..';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class McGsRingRenderable extends McGsRenderable {
    protected matrix: THREE.Matrix4 | null;
    private alpha;
    constructor(renderBase: McGsRendererBase, matrix: THREE.Matrix4, alpha?: number, color?: McRGB);
    getMaterialCode(): string;
    generateGeometry(center: McGeVector3, offset: number, indexOffset: number, isTransparent: boolean): GsMergeGeometry | null;
    raycast(raycaster: McGeRaycaster): PickResult | null;
    raycastVolume(planeVolume: McGePlaneVolume, isWrap?: boolean): boolean;
    getHighLightData(): McGePoint[][] | null;
}
