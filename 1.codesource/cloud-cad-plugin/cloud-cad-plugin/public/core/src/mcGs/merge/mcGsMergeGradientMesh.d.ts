import { McEngine } from '../../mcCore/mcView/mcEngine';
import { McGsMergeMesh, McGsRenderManager } from '..';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class McGsMergeGradientMesh extends McGsMergeMesh {
    constructor(renderMgr: McGsRenderManager, engine: McEngine, code: string, material: THREE.Material, geometry?: THREE.BufferGeometry);
    updateRenderables(): void;
}
