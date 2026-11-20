import { McGeMatrix4, McGeVector3 } from '.';
import { McGePoint } from './mcGePoint';
import * as THREE from '../../lib/ThreeJS/Three.js';
export interface PVResult {
    picked: boolean;
    distance: number;
}
export declare class McGePlaneVolume {
    planes: THREE.Plane[];
    center: THREE.Vector3 | null;
    set(planes: THREE.Plane[]): McGePlaneVolume;
    clone(): McGePlaneVolume;
    copy(volume: McGePlaneVolume): McGePlaneVolume;
    applyMatrix4(matrix4: McGeMatrix4): McGePlaneVolume;
    addPlane(plane: THREE.Plane): void;
    addPoints(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): void;
    intersectsSprite(sprite: THREE.Sprite): boolean;
    intersectsSphere(sphere: THREE.Sphere): boolean;
    intersectsBox(box: THREE.Box3): boolean;
    intersectsRay(ray: THREE.Ray): PVResult;
    containsPoint(point: THREE.Vector3): boolean;
    buildVolume(coords: THREE.Vector3[]): void;
    buildVolumePoints(coords: McGePoint[] | McGeVector3[]): void;
    buildVolume2D(coords: THREE.Vector2[], camera: THREE.Camera): void;
}
