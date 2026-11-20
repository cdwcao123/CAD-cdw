import { McEngine } from '../../mcCore/mcView/mcEngine';
import { McGsRenderManager, McGsPointRenderable, McGsMergeLine } from '..';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class McGsMergeRing extends McGsMergeLine {
    ringSegments: number;
    constructor(renderMgr: McGsRenderManager, engine: McEngine, code: string, material: THREE.Material);
    getRingSegments(): number;
    setRingSegments(segments: number): void;
    addRenderable(renderable: McGsPointRenderable): void;
    updateRenderables(): void;
}
