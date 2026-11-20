
export class GLBufferAttribute {
    
    constructor(buffer: WebGLBuffer, type: GLenum, itemSize: number, elementSize: 1 | 2 | 4, count: number);

    
    readonly isGLBufferAttribute: true;

    
    name: string;

    
    buffer: WebGLBuffer;

    
    type: GLenum;

    
    itemSize: number;

    
    elementSize: 1 | 2 | 4;

    
    count: number;

    
    version: number;

    
    set needsUpdate(value: boolean);

    
    setBuffer(buffer: WebGLBuffer): this;

    
    setType(type: GLenum, elementSize: 1 | 2 | 4): this;

    
    setItemSize(itemSize: number): this;

    
    setCount(count: number): this;
}
