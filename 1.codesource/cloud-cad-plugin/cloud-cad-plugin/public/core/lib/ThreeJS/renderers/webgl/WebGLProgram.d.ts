import { WebGLRenderer } from './../WebGLRenderer';
import { WebGLShader } from './WebGLShader';
import { WebGLUniforms } from './WebGLUniforms';
export class WebGLProgram {
    constructor(renderer: WebGLRenderer, cacheKey: string, parameters: object);

    name: string;
    id: number;
    cacheKey: string; 

    
    usedTimes: number;
    program: any;
    vertexShader: WebGLShader;
    fragmentShader: WebGLShader;
    
    uniforms: any;
    
    attributes: any;

    getUniforms(): WebGLUniforms;
    getAttributes(): any;
    destroy(): void;
}
