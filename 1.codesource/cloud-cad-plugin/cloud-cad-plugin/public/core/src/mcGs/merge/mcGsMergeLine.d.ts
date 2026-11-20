import { McEngine } from '../../mcCore/mcView/mcEngine';
import { McGsRenderManager, McGsRenderable } from '..';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class McGsMergeLine extends THREE.LineSegments {
    protected engine: McEngine;
    protected renderManager: McGsRenderManager;
    protected code: string;
    protected isTransparent: boolean;
    protected gsRenderables: Map<string, McGsRenderable>;
    protected needUpdate: boolean;
    constructor(renderMgr: McGsRenderManager, engine: McEngine, code: string, material: THREE.Material, geometry?: THREE.BufferGeometry);
    getNeedUpdate(): boolean;
    getRenderableCount(): number;
    addRenderable(renderable: McGsRenderable): void;
    removeRenderable(renderable: McGsRenderable): void;
    removeRenderableByUuid(uuid: string): void;
    clearRenderables(): void;
    getRenderable(uuid: string): McGsRenderable | undefined;
    updateRenderables(): void;
}
