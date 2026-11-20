import { McGeRaycaster } from '../../mcGe/mcGeRaycaster';
import { McEngine } from '../../mcCore/mcView/mcEngine';
import { McGePlaneVolume } from '../../mcGe/mcGePlaneVolume';
import { GsRectOption } from '../types/interface';
import { McGsSquare } from './mcGsSquare';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class McGsRing extends McGsSquare {
    protected radius: number;
    constructor(engine: McEngine, option?: GsRectOption);
    buildGeometry(): THREE.BufferGeometry;
    buildMaterial(): THREE.Material;
    raycast(raycaster: McGeRaycaster, intersects: THREE.Intersection[]): void;
    raycastVolume(planeVolume: McGePlaneVolume, isWrap?: boolean): boolean;
    getRadius(): number;
    setRadius(radius: number): void;
}
