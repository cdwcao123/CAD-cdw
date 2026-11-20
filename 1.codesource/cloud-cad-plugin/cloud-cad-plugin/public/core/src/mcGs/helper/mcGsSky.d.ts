import { McGeVector3 } from '../../mcGe';
import { McGeRaycaster } from '../../mcGe/mcGeRaycaster';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class McGsSky extends THREE.Mesh {
    camera: THREE.Camera;
    scene: THREE.Scene;
    radius: number;
    sunPosition: McGeVector3;
    uniforms: any;
    constructor(camera: THREE.Camera, scene: THREE.Scene);
    render(delta: number): void;
    dispose(): void;
    raycast(raycaster: McGeRaycaster, intersects: THREE.Intersection[]): void;
}
