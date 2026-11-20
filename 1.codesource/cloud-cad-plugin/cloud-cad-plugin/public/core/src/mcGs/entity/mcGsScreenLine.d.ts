import { McGeRaycaster } from '../../mcGe/mcGeRaycaster';
import { McEngine } from '../../mcCore/mcView/mcEngine';
import { McGePlaneVolume } from '../../mcGe/mcGePlaneVolume';
import { GsScreenLineOption } from '../types/interface';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class McGsScreenLine extends THREE.Mesh {
    readonly isGsObject: boolean;
    protected show: boolean;
    protected canPick: boolean;
    protected width: number;
    protected color: THREE.Color;
    protected coords: THREE.Vector2[][];
    protected engine: McEngine;
    protected alpha: number;
    constructor(engine: McEngine, coords: THREE.Vector2[][], option?: GsScreenLineOption);
    buildGeometry(): THREE.BufferGeometry;
    buildMaterial(): THREE.Material;
    raycast(raycaster: McGeRaycaster, intersects: THREE.Intersection[]): void;
    raycastVolume(planeVolume: McGePlaneVolume, isWrap?: boolean): boolean;
    resetSize(w: number, h: number): void;
    getShow(): boolean;
    setShow(show: boolean): void;
    getWidth(): number;
    setWidth(width: number): void;
    getColor(): THREE.Color;
    setColor(color: THREE.Color): void;
    getCoords(): THREE.Vector2[][];
    setCoords(coords: THREE.Vector2[][]): void;
}
