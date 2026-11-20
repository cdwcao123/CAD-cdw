import { McGeRaycaster } from '../../mcGe/mcGeRaycaster';
import { McEngine } from '../../mcCore/mcView/mcEngine';
import { McGePlaneVolume } from '../../mcGe/mcGePlaneVolume';
import { GsRectOption } from '../types/interface';
import { McGsSquare } from './mcGsSquare';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class McGsDoubleArrow extends McGsSquare {
    constructor(engine: McEngine, option?: GsRectOption);
    buildGeometry(): THREE.BufferGeometry;
    raycast(raycaster: McGeRaycaster, intersects: THREE.Intersection[]): void;
    raycastVolume(planeVolume: McGePlaneVolume, isWrap?: boolean): boolean;
}
