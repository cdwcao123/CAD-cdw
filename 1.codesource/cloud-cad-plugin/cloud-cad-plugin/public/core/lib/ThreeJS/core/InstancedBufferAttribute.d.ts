import { BufferGeometry } from './BufferGeometry';
import { BufferAttribute } from './BufferAttribute';

export class InstancedBufferAttribute extends BufferAttribute {
    
    constructor(array: ArrayLike<number>, itemSize: number, normalized?: boolean, meshPerAttribute?: number);

    
    meshPerAttribute: number;
}
