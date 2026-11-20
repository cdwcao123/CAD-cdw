import { Usage } from '../constants';
import { Matrix3 } from './../math/Matrix3';
import { Matrix4 } from './../math/Matrix4';

export class BufferAttribute {
    
    constructor(array: ArrayLike<number>, itemSize: number, normalized?: boolean); 

    
    name: string;

    
    array: ArrayLike<number>;

    
    itemSize: number;

    
    usage: Usage;

    
    updateRange: {
        
        offset: number;
        
        count: number;
    };

    
    version: number;

    
    normalized: boolean;

    
    count: number;

    
    set needsUpdate(value: boolean);

    
    readonly isBufferAttribute: true;

    
    onUploadCallback: () => void;

    
    onUpload(callback: () => void): this;

    
    setUsage(usage: Usage): this;

    
    clone(): BufferAttribute;

    
    copy(source: BufferAttribute): this;

    
    copyAt(index1: number, attribute: BufferAttribute, index2: number): this;

    
    copyArray(array: ArrayLike<number>): this;

    
    applyMatrix3(m: Matrix3): this;

    
    applyMatrix4(m: Matrix4): this;

    
    applyNormalMatrix(m: Matrix3): this;

    
    transformDirection(m: Matrix4): this;

    
    set(value: ArrayLike<number> | ArrayBufferView, offset?: number): this;

    
    getX(index: number): number;

    
    setX(index: number, x: number): this;

    
    getY(index: number): number;

    
    setY(index: number, y: number): this;

    
    getZ(index: number): number;

    
    setZ(index: number, z: number): this;

    
    getW(index: number): number;

    
    setW(index: number, z: number): this;

    
    setXY(index: number, x: number, y: number): this;

    
    setXYZ(index: number, x: number, y: number, z: number): this;

    
    setXYZW(index: number, x: number, y: number, z: number, w: number): this;

    
    toJSON(): {
        itemSize: number;
        type: string;
        array: number[];
        normalized: boolean;
    };
}

export class Int8BufferAttribute extends BufferAttribute {
    
    constructor(
        array: Iterable<number> | ArrayLike<number> | ArrayBuffer | number,
        itemSize: number,
        normalized?: boolean,
    );
}

export class Uint8BufferAttribute extends BufferAttribute {
    
    constructor(
        array: Iterable<number> | ArrayLike<number> | ArrayBuffer | number,
        itemSize: number,
        normalized?: boolean,
    );
}

export class Uint8ClampedBufferAttribute extends BufferAttribute {
    
    constructor(
        array: Iterable<number> | ArrayLike<number> | ArrayBuffer | number,
        itemSize: number,
        normalized?: boolean,
    );
}

export class Int16BufferAttribute extends BufferAttribute {
    
    constructor(
        array: Iterable<number> | ArrayLike<number> | ArrayBuffer | number,
        itemSize: number,
        normalized?: boolean,
    );
}

export class Uint16BufferAttribute extends BufferAttribute {
    
    constructor(
        array: Iterable<number> | ArrayLike<number> | ArrayBuffer | number,
        itemSize: number,
        normalized?: boolean,
    );
}

export class Int32BufferAttribute extends BufferAttribute {
    
    constructor(
        array: Iterable<number> | ArrayLike<number> | ArrayBuffer | number,
        itemSize: number,
        normalized?: boolean,
    );
}

export class Uint32BufferAttribute extends BufferAttribute {
    
    constructor(
        array: Iterable<number> | ArrayLike<number> | ArrayBuffer | number,
        itemSize: number,
        normalized?: boolean,
    );
}

export class Float16BufferAttribute extends BufferAttribute {
    
    constructor(
        array: Iterable<number> | ArrayLike<number> | ArrayBuffer | number,
        itemSize: number,
        normalized?: boolean,
    );
}

export class Float32BufferAttribute extends BufferAttribute {
    
    constructor(
        array: Iterable<number> | ArrayLike<number> | ArrayBuffer | number,
        itemSize: number,
        normalized?: boolean,
    );
}

export class Float64BufferAttribute extends BufferAttribute {
    
    constructor(
        array: Iterable<number> | ArrayLike<number> | ArrayBuffer | number,
        itemSize: number,
        normalized?: boolean,
    );
}
