import { Matrix4 } from './Matrix4';
import { Vector3 } from './Vector3';
export type Matrix3Tuple = [number, number, number, number, number, number, number, number, number];

export interface Matrix {
    
    elements: number[];

    
    identity(): Matrix;

    
    copy(m: this): this;

    
    multiplyScalar(s: number): Matrix;

    determinant(): number;

    
    transpose(): Matrix;

    
    invert(): Matrix;

    
    clone(): Matrix;
}

export class Matrix3 implements Matrix {
    
    constructor();

    
    elements: number[];

    set(
        n11: number,
        n12: number,
        n13: number,
        n21: number,
        n22: number,
        n23: number,
        n31: number,
        n32: number,
        n33: number,
    ): Matrix3;
    identity(): Matrix3;
    clone(): this;
    copy(m: Matrix3): this;
    extractBasis(xAxis: Vector3, yAxis: Vector3, zAxis: Vector3): Matrix3;
    setFromMatrix4(m: Matrix4): Matrix3;
    multiplyScalar(s: number): Matrix3;
    determinant(): number;

    
    invert(): Matrix3;

    
    transpose(): Matrix3;
    getNormalMatrix(matrix4: Matrix4): Matrix3;

    
    transposeIntoArray(r: number[]): Matrix3;

    setUvTransform(tx: number, ty: number, sx: number, sy: number, rotation: number, cx: number, cy: number): Matrix3;

    scale(sx: number, sy: number): Matrix3;

    
    makeTranslation(x: number, y: number): this;
    makeTranslation(x: number, y: number): Matrix3;

    
    makeRotation(theta: number): this;
    makeRotation(theta: number): Matrix3;

    
    makeScale(x: number, y: number): this;
    makeScale(x: number, y: number): Matrix3;

    rotate(theta: number): Matrix3;

    translate(tx: number, ty: number): Matrix3;

    equals(matrix: Matrix3): boolean;

    
    fromArray(array: number[] | ArrayLike<number>, offset?: number): Matrix3;

    
    toArray(array?: number[], offset?: number): number[];
    toArray(array?: Matrix3Tuple, offset?: 0): Matrix3Tuple;

    
    toArray(array?: ArrayLike<number>, offset?: number): ArrayLike<number>;

    
    multiply(m: Matrix3): Matrix3;

    premultiply(m: Matrix3): Matrix3;

    
    multiplyMatrices(a: Matrix3, b: Matrix3): Matrix3;

    
    multiplyVector3(vector: Vector3): any;

    
    multiplyVector3Array(a: any): any;

    
    getInverse(matrix: Matrix4, throwOnDegenerate?: boolean): Matrix3;
    getInverse(matrix: Matrix): Matrix;

    
    flattenToArrayOffset(array: number[], offset: number): number[];
}
