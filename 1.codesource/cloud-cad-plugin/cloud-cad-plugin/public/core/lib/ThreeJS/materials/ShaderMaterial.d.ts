import { IUniform } from '../renderers/shaders/UniformsLib';
import { MaterialParameters, Material } from './Material';
import { GLSLVersion } from '../constants';
export interface ShaderMaterialParameters extends MaterialParameters {
    uniforms?: { [uniform: string]: IUniform } | undefined;
    vertexShader?: string | undefined;
    fragmentShader?: string | undefined;
    linewidth?: number | undefined;
    wireframe?: boolean | undefined;
    wireframeLinewidth?: number | undefined;
    lights?: boolean | undefined;
    clipping?: boolean | undefined;
    fog?: boolean | undefined;
    extensions?:
        | {
              derivatives?: boolean | undefined;
              fragDepth?: boolean | undefined;
              drawBuffers?: boolean | undefined;
              shaderTextureLOD?: boolean | undefined;
          }
        | undefined;
    glslVersion?: GLSLVersion | undefined;
}

export class ShaderMaterial extends Material {
    constructor(parameters?: ShaderMaterialParameters);

    
    type: string;

    
    defines: { [key: string]: any };

    
    uniforms: { [uniform: string]: IUniform };
    vertexShader: string;
    fragmentShader: string;

    
    linewidth: number;

    
    wireframe: boolean;

    
    wireframeLinewidth: number;

    
    fog: boolean;

    
    lights: boolean;

    
    clipping: boolean;

    
    derivatives: any;

    
    extensions: {
        derivatives: boolean;
        fragDepth: boolean;
        drawBuffers: boolean;
        shaderTextureLOD: boolean;
    };

    
    defaultAttributeValues: any;

    
    index0AttributeName: string | undefined;

    
    uniformsNeedUpdate: boolean;

    
    glslVersion: GLSLVersion | null;

    isShaderMaterial: boolean;

    setValues(parameters: ShaderMaterialParameters): void;
    toJSON(meta: any): any;
}
