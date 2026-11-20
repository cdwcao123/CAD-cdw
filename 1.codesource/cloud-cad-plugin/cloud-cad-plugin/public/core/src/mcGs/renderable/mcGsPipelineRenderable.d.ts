import { McRGB } from '../../mc';
import { McGePoint, McGeVector3 } from '../../mcGe';
import { GsPipelineSection, McGsMeshRenderable, McGsRendererBase } from '..';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export interface PipelineVertex {
    startWidth: number;
    endWidth: number;
    thickness: number;
    coord: McGePoint | McGeVector3;
}
export declare class McGsPipelineRenderable extends McGsMeshRenderable {
    constructor(renderBase: McGsRendererBase, coords: PipelineVertex[][], pipelineSection?: GsPipelineSection, alpha?: number, color?: McRGB);
    static getQuaternion(xAxis: McGeVector3, yAxis: McGeVector3, zAxis: McGeVector3, quat: THREE.Quaternion): void;
}
