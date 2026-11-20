import { McRGB } from '../../mc';
import { McGePoint, McGeVector3 } from '../../mcGe';
import { GsMergeGeometry, McGsMeshRenderable, McGsRendererBase } from '..';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export interface DrillVertex {
    color: McRGB;
    coord: McGePoint | McGeVector3;
}
export declare class McGsDrillRenderable3D extends McGsMeshRenderable {
    protected colors: McRGB[];
    constructor(renderBase: McGsRendererBase, coords: DrillVertex[], radius: number, alpha?: number);
    generateGeometry(center: McGeVector3, offset: number, indexOffset: number, isTransparent: boolean): GsMergeGeometry | null;
    resetColor(): void;
    static getQuaternion(xAxis: McGeVector3, yAxis: McGeVector3, zAxis: McGeVector3, quat: THREE.Quaternion): void;
}
