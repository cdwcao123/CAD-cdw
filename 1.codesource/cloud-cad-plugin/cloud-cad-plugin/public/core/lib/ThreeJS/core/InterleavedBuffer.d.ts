import { InterleavedBufferAttribute } from './InterleavedBufferAttribute';
import { Usage } from '../constants';

export class InterleavedBuffer {
    
    constructor(array: ArrayLike<number>, stride: number);

    
    array: ArrayLike<number>;

    
    stride: number;

    
    usage: Usage;

    
    updateRange: {
        
        offset: number;
        
        count: number;
    };

    
    version: number;

    
    count: number;

    
    set needsUpdate(value: boolean);

    
    uuid: string;

    
    set(value: ArrayLike<number>, offset: number): this;

    
    setUsage(value: Usage): this;

    
    copy(source: InterleavedBuffer): this;

    
    copyAt(index1: number, attribute: InterleavedBufferAttribute, index2: number): this;

    
    clone(data: {}): InterleavedBuffer;

    
    toJSON(data: {}): {
        uuid: string;
        buffer: string;
        type: string;
        stride: number;
    };
}
