import { McEngine } from '../../mcCore/mcView/mcEngine';
import { McGsRenderManager, McGsPointRenderable, McGsMergeMesh } from '..';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class McGsMergePoint extends McGsMergeMesh {
    constructor(renderMgr: McGsRenderManager, engine: McEngine, code: string, material: THREE.Material);
    setPointCenterSize(size: number): void;
    addRenderable(renderable: McGsPointRenderable): void;
    updateRenderables(): void;
}
