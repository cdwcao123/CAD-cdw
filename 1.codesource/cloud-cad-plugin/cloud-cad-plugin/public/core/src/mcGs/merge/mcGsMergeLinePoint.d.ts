import { McEngine } from '../../mcCore/mcView/mcEngine';
import { McGsRenderManager, McGsPointRenderable, McGsMergeLine } from '..';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class McGsMergeLinePoint extends McGsMergeLine {
    pointSize: number;
    pointMode: number;
    constructor(renderMgr: McGsRenderManager, engine: McEngine, code: string, material: THREE.Material);
    getPointSize(): number;
    setPointSize(size: number): void;
    getPointMode(): number;
    setPointMode(mode: number): void;
    addRenderable(renderable: McGsPointRenderable): void;
    updateRenderables(): void;
    static getPointGeometry(pointMode: number): THREE.InstancedBufferGeometry;
}
