import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class McGsAxisHelper extends THREE.Object3D {
    camera: THREE.Camera;
    scene: THREE.Scene;
    domElement: HTMLElement;
    xText: THREE.LineSegments;
    yText: THREE.LineSegments;
    zText: THREE.LineSegments;
    rectAxis: THREE.LineSegments;
    xAxis: THREE.LineSegments;
    yAxis: THREE.LineSegments;
    zAxis: THREE.LineSegments;
    axisSize: number;
    color: THREE.Color;
    material: THREE.LineBasicMaterial | null;
    constructor(camera: THREE.Camera, scene: THREE.Scene, domElement: HTMLElement);
    render(delta: number): void;
    dispose(): void;
    setColor(color: THREE.Color): void;
    protected isZero(val: number): boolean;
}
