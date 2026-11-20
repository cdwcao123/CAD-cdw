import { Euler } from './Euler';
import { Vector3 } from './Vector3';
import { Matrix4 } from './Matrix4';
import { BufferAttribute } from '../core/BufferAttribute';
import { InterleavedBufferAttribute } from '../core/InterleavedBufferAttribute';

export class Quaternion {
    
    constructor(x?: number, y?: number, z?: number, w?: number);

    
    x: number;

    
    y: number;

    
    z: number;

    
    w: number;
    readonly isQuaternion: true;

    
    set(x: number, y: number, z: number, w: number): Quaternion;

    
    clone(): this;

    
    copy(q: Quaternion): this;

    
    setFromEuler(euler: Euler, update?: boolean): Quaternion;

    
    setFromAxisAngle(axis: Vector3, angle: number): Quaternion;

    
    setFromRotationMatrix(m: Matrix4): Quaternion;
    setFromUnitVectors(vFrom: Vector3, vTo: Vector3): Quaternion;
    angleTo(q: Quaternion): number;
    rotateTowards(q: Quaternion, step: number): Quaternion;

    identity(): Quaternion;

    
    invert(): Quaternion;

    conjugate(): Quaternion;
    dot(v: Quaternion): number;
    lengthSq(): number;

    
    length(): number;

    
    normalize(): Quaternion;

    
    multiply(q: Quaternion): Quaternion;
    premultiply(q: Quaternion): Quaternion;

    
    multiplyQuaternions(a: Quaternion, b: Quaternion): Quaternion;

    slerp(qb: Quaternion, t: number): Quaternion;
    slerpQuaternions(qa: Quaternion, qb: Quaternion, t: number): Quaternion;
    equals(v: Quaternion): boolean;

    
    fromArray(array: number[] | ArrayLike<number>, offset?: number): this;

    
    toArray(array?: number[], offset?: number): number[];

    
    toArray(array: ArrayLike<number>, offset?: number): ArrayLike<number>;

    
    fromBufferAttribute(attribute: BufferAttribute | InterleavedBufferAttribute, index: number): Quaternion;

    _onChange(callback: () => void): Quaternion;
    _onChangeCallback: () => void;

    static slerpFlat(
        dst: number[],
        dstOffset: number,
        src0: number[],
        srcOffset: number,
        src1: number[],
        stcOffset1: number,
        t: number,
    ): void;

    static multiplyQuaternionsFlat(
        dst: number[],
        dstOffset: number,
        src0: number[],
        srcOffset: number,
        src1: number[],
        stcOffset1: number,
    ): number[];

    
    static slerp(qa: Quaternion, qb: Quaternion, qm: Quaternion, t: number): number;

    
    multiplyVector3(v: any): any;

    random(): Quaternion;

    [Symbol.iterator](): Generator<number, void>;
}
