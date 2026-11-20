import { Plane } from './../math/Plane';
import { EventDispatcher } from './../core/EventDispatcher';
import { WebGLRenderer } from './../renderers/WebGLRenderer';
import { Shader } from './../renderers/shaders/ShaderLib';
import { BlendingDstFactor, BlendingEquation, Blending, BlendingSrcFactor, DepthModes, Side, StencilFunc, StencilOp, PixelFormat } from '../constants';
export interface MaterialParameters {
    alphaTest?: number | undefined;
    alphaToCoverage?: boolean | undefined;
    blendDst?: BlendingDstFactor | undefined;
    blendDstAlpha?: number | undefined;
    blendEquation?: BlendingEquation | undefined;
    blendEquationAlpha?: number | undefined;
    blending?: Blending | undefined;
    blendSrc?: BlendingSrcFactor | BlendingDstFactor | undefined;
    blendSrcAlpha?: number | undefined;
    clipIntersection?: boolean | undefined;
    clippingPlanes?: Plane[] | undefined;
    clipShadows?: boolean | undefined;
    colorWrite?: boolean | undefined;
    defines?: any;
    depthFunc?: DepthModes | undefined;
    depthTest?: boolean | undefined;
    depthWrite?: boolean | undefined;
    name?: string | undefined;
    opacity?: number | undefined;
    polygonOffset?: boolean | undefined;
    polygonOffsetFactor?: number | undefined;
    polygonOffsetUnits?: number | undefined;
    precision?: 'highp' | 'mediump' | 'lowp' | null | undefined;
    premultipliedAlpha?: boolean | undefined;
    forceSinglePass?: boolean | undefined;
    dithering?: boolean | undefined;
    side?: Side | undefined;
    shadowSide?: Side | undefined;
    toneMapped?: boolean | undefined;
    transparent?: boolean | undefined;
    vertexColors?: boolean | undefined;
    visible?: boolean | undefined;
    format?: PixelFormat | undefined;
    stencilWrite?: boolean | undefined;
    stencilFunc?: StencilFunc | undefined;
    stencilRef?: number | undefined;
    stencilWriteMask?: number | undefined;
    stencilFuncMask?: number | undefined;
    stencilFail?: StencilOp | undefined;
    stencilZFail?: StencilOp | undefined;
    stencilZPass?: StencilOp | undefined;
    userData?: any;
}

export class Material extends EventDispatcher {
    constructor();

    
    alphaTest: number;

    
    alphaToCoverage: boolean;

    
    blendDst: BlendingDstFactor;

    
    blendDstAlpha: number | null;

    
    blendEquation: BlendingEquation;

    
    blendEquationAlpha: number | null;

    
    blending: Blending;

    
    blendSrc: BlendingSrcFactor | BlendingDstFactor;

    
    blendSrcAlpha: number | null;

    
    clipIntersection: boolean;

    
    clippingPlanes: any;

    
    clipShadows: boolean;

    
    colorWrite: boolean;

    
    defines: undefined | { [key: string]: any };

    
    depthFunc: DepthModes;

    
    depthTest: boolean;

    
    depthWrite: boolean;

    
    id: number;

    
    stencilWrite: boolean;

    
    stencilFunc: StencilFunc;

    
    stencilRef: number;

    
    stencilWriteMask: number;

    
    stencilFuncMask: number;

    
    stencilFail: StencilOp;

    
    stencilZFail: StencilOp;

    
    stencilZPass: StencilOp;

    
    readonly isMaterial: true;

    
    name: string;

    
    needsUpdate: boolean;

    
    opacity: number;

    
    polygonOffset: boolean;

    
    polygonOffsetFactor: number;

    
    polygonOffsetUnits: number;

    
    precision: 'highp' | 'mediump' | 'lowp' | null;

    
    premultipliedAlpha: boolean;

    
    forceSinglePass: boolean;

    
    dithering: boolean;

    
    side: Side;

    
    shadowSide: Side | null;

    
    toneMapped: boolean;

    
    transparent: boolean;

    
    type: string;

    
    uuid: string;

    
    vertexColors: boolean;

    
    visible: boolean;

    
    userData: any;

    
    version: number;

    
    clone(): this;

    
    copy(material: Material): this;

    
    dispose(): void;

    
    onBeforeCompile(shader: Shader, renderer: WebGLRenderer): void;

    
    customProgramCacheKey(): string;

    
    setValues(values: MaterialParameters): void;

    
    toJSON(meta?: any): any;
}
