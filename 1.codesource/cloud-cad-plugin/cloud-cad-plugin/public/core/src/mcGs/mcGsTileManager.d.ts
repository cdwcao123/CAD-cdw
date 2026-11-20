import { McEngine, PickResult } from '../mcCore';
import { McDbEntity, McDbEntityMask, McDbObject } from '../mcDb';
import { McGePlaneVolume, McGeVector3 } from '../mcGe';
import { McGeRaycaster } from '../mcGe/mcGeRaycaster';
import * as THREE from '../../lib/ThreeJS/Three.js';
export declare class McGsTileManager {
    private tilesMap;
    private entityTilesMap;
    private xLineMap;
    private engine;
    private tileSize;
    private is2D;
    constructor(engine: McEngine);
    init(): void;
    clear(): void;
    addEntity(entity: McDbEntity): void;
    removeEntity(entity: McDbEntity): boolean;
    getTwoLineCenterPoint(point: McGeVector3, range?: number): {
        centerPoint: McGeVector3;
        startPoint: McGeVector3;
        endPoint: McGeVector3;
    } | null;
    getLineCrossPoint(targetEntity: McDbEntity, targetPoint: McGeVector3): McGeVector3[];
    raycast(raycaster: McGeRaycaster): PickResult | null;
    pickVolumeScreen(planeVolume: McGePlaneVolume, isWrap: boolean, layers?: McDbEntityMask): McDbObject[];
    protected getRootEntity(entity: McDbEntity): McDbEntity;
}
export declare class McGsEntityTile {
    id: string;
    entitiesMap: Map<string, McDbEntity>;
    box: THREE.Box3;
    constructor(id: string, box: THREE.Box3);
}
