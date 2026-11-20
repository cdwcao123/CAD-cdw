import { InterleavedBuffer } from './InterleavedBuffer';

export class InstancedInterleavedBuffer extends InterleavedBuffer {
    
    constructor(array: ArrayLike<number>, stride: number, meshPerAttribute?: number);

    
    meshPerAttribute: number;
}
