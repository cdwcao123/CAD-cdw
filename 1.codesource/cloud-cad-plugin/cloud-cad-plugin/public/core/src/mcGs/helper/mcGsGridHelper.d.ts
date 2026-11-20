import { PickResult } from '../../mcCore';
import { McGeRaycaster } from '../../mcGe/mcGeRaycaster';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class McGsGridHelper extends THREE.Object3D {
    camera: THREE.Camera;
    scene: THREE.Scene;
    domElement: HTMLElement;
    axisSpace: number;
    lineNumber: number;
    dynamicsUpdate: boolean;
    color: THREE.Color;
    mainLineAlpha: number;
    assistLineAlpha: number;
    level: number;
    constructor(camera: THREE.Camera, scene: THREE.Scene, domElement: HTMLElement);
    protected buildGeometry(): void;
    render(delta: number): void;
    dispose(): void;
    getColor(): THREE.Color;
    setColor(color: THREE.Color): void;
    getAxisSpace(): number;
    setAxisSpace(space: number): void;
    getLineNumber(): number;
    setLineNumber(number: number): void;
    getDynamicsUpdate(): boolean;
    setDynamicsUpdate(update: boolean): void;
    pick(raycaster: McGeRaycaster): PickResult | null;
}
