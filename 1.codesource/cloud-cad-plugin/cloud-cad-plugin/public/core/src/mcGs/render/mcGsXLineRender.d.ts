import { EngineEventType, PickResult } from '../../mcCore';
import { McDbXLine } from '../../mcDb';
import { McGePlaneVolume, McGeVector3 } from '../../mcGe';
import { McGeRaycaster } from '../../mcGe/mcGeRaycaster';
import { McGsComplexCurveRender } from '..';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class McGsXLineRender extends McGsComplexCurveRender {
    protected eventHandleMap2D: Map<keyof EngineEventType, (...args: any[]) => void>;
    static getCurvePath(dbXLine: McDbXLine, camera: THREE.Camera): McGeVector3[];
    render(): boolean;
    dispose(): void;
    updateBoundingBox(): void;
    raycast(raycaster: McGeRaycaster): PickResult | null;
    raycastVolume(planeVolume: McGePlaneVolume, isWrap?: boolean): boolean;
}
