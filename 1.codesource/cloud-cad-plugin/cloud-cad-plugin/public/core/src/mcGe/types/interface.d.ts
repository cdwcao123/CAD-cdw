import { McGeIntersectionResType } from '..';
import { Vector } from '../../../lib/ThreeJS/Three.js';
import { McGePoint3d } from '../mcGePoint3d';
export interface IMcGeScale3d {
    x: number;
    y: number;
    z: number;
}
export interface IMcGeVector2 {
    x: number;
    y: number;
}
export interface IMcGeVector3 extends IMcGeVector2 {
    z: number;
}
export interface IMcGeVector4 extends IMcGeVector3 {
    w: number;
}
export interface McGeVector extends Vector {
}
export interface McSplineControlPointData {
    controlPts: number[][];
    knots: number[];
    degree: number;
}
export interface McGeIntersectionRes {
    type: McGeIntersectionResType;
    pa1?: number;
    pa2?: number;
    pt?: McGePoint3d;
}
