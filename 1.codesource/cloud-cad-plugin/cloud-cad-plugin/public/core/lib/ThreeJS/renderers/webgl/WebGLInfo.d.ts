import { WebGLProgram } from './WebGLProgram';

export class WebGLInfo {
    constructor(gl: WebGLRenderingContext);

    
    autoReset: boolean;

    
    memory: {
        geometries: number;
        textures: number;
    };

    
    programs: WebGLProgram[] | null;

    
    render: {
        calls: number;
        frame: number;
        lines: number;
        points: number;
        triangles: number;
    };
    update(count: number, mode: number, instanceCount: number): void;
    reset(): void;
}
