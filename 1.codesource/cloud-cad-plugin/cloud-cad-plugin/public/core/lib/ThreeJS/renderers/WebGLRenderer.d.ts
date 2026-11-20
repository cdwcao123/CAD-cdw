import { ToneMapping, ShadowMapType, CullFace, TextureEncoding } from '../constants';
import { Box3 } from '../math/Box3';
import { Vector3 } from '../math/Vector3';
import { Data3DTexture } from '../textures/Data3DTexture';
import { DataArrayTexture } from '../textures/DataArrayTexture';
import { OffscreenCanvas, Texture } from '../textures/Texture';
import { ColorRepresentation } from '../utils';
import { Camera } from './../cameras/Camera';
import { BufferGeometry } from './../core/BufferGeometry';
import { Object3D } from './../core/Object3D';
import { Material } from './../materials/Material';
import { Color } from './../math/Color';
import { Vector2 } from './../math/Vector2';
import { Vector4 } from './../math/Vector4';
import { Scene } from './../scenes/Scene';
import { WebGLCapabilities } from './webgl/WebGLCapabilities';
import { WebGLExtensions } from './webgl/WebGLExtensions';
import { WebGLInfo } from './webgl/WebGLInfo';
import { WebGLProperties } from './webgl/WebGLProperties';
import { WebGLRenderLists } from './webgl/WebGLRenderLists';
import { WebGLShadowMap } from './webgl/WebGLShadowMap';
import { WebGLState } from './webgl/WebGLState';
import { WebGLMultipleRenderTargets } from './WebGLMultipleRenderTargets';
import { WebGLRenderTarget } from './WebGLRenderTarget';
export interface Renderer {
    domElement: HTMLCanvasElement;

    render(scene: Object3D, camera: Camera): void;
    setSize(width: number, height: number, updateStyle?: boolean): void;
}

export interface WebGLRendererParameters {
    
    canvas?: HTMLCanvasElement | OffscreenCanvas | undefined;

    
    context?: WebGLRenderingContext | undefined;

    
    precision?: string | undefined;

    
    alpha?: boolean | undefined;

    
    premultipliedAlpha?: boolean | undefined;

    
    antialias?: boolean | undefined;

    
    stencil?: boolean | undefined;

    
    preserveDrawingBuffer?: boolean | undefined;

    
    powerPreference?: string | undefined;

    
    depth?: boolean | undefined;

    
    logarithmicDepthBuffer?: boolean | undefined;

    
    failIfMajorPerformanceCaveat?: boolean | undefined;

    
    is2DView?: boolean | undefined;
}

export interface WebGLDebug {
    
    checkShaderErrors: boolean;
}

export class WebGLRenderer implements Renderer {
  
  constructor(parameters?: WebGLRendererParameters);

  
  domElement: HTMLCanvasElement;

  
  autoClear: boolean;

  
  autoClearColor: boolean;

  
  autoClearDepth: boolean;

  
  autoClearStencil: boolean;

  
  debug: WebGLDebug;

  
  sortObjects: boolean;

  
  clippingPlanes: any[];

  
  localClippingEnabled: boolean;

  extensions: WebGLExtensions;

  
  outputEncoding: TextureEncoding;

  
  useLegacyLights: boolean;

  
  toneMapping: ToneMapping;

  
  toneMappingExposure: number;

  info: WebGLInfo;

  shadowMap: WebGLShadowMap;

  pixelRatio: number;

  capabilities: WebGLCapabilities;
  properties: WebGLProperties;
  renderLists: WebGLRenderLists;
  state: WebGLState;

  
  topOrder: number;
  bottomOrder: number;
  orderZRange: number;

  
  getContext(): WebGLRenderingContext | WebGL2RenderingContext;
  getContextAttributes(): any;
  forceContextLoss(): void;
  forceContextRestore(): void;

  
  getMaxAnisotropy(): number;

  
  getPrecision(): string;

  getPixelRatio(): number;
  setPixelRatio(value: number): void;

  getDrawingBufferSize(target: Vector2): Vector2;
  setDrawingBufferSize(width: number, height: number, pixelRatio: number): void;

  getSize(target: Vector2): Vector2;

  
  setSize(width: number, height: number, updateStyle?: boolean): void;

  getCurrentViewport(target: Vector4): Vector4;

  
  getViewport(target: Vector4): Vector4;

  
  setViewport(x: Vector4 | number, y?: number, width?: number, height?: number): void;

  
  getScissor(target: Vector4): Vector4;

  
  setScissor(x: Vector4 | number, y?: number, width?: number, height?: number): void;

  
  getScissorTest(): boolean;

  
  setScissorTest(enable: boolean): void;

  
  setOpaqueSort(method: (a: any, b: any) => number): void;

  
  setTransparentSort(method: (a: any, b: any) => number): void;

  
  getClearColor(target: Color): Color;

  
  setClearColor(color: ColorRepresentation, alpha?: number): void;

  
  getClearAlpha(): number;

  setClearAlpha(alpha: number): void;

  
  clear(color?: boolean, depth?: boolean, stencil?: boolean): void;

  clearColor(): void;
  clearDepth(): void;
  clearStencil(): void;
  clearTarget(renderTarget: WebGLRenderTarget, color: boolean, depth: boolean, stencil: boolean): void;

  
  resetGLState(): void;
  dispose(): void;

  renderBufferDirect(
        camera: Camera,
        scene: Scene,
        geometry: BufferGeometry,
        material: Material,
        object: Object3D,
        geometryGroup: any,
    ): void;

  
  

  
  animate(callback: () => void): void;

  
  compile(scene: Object3D, camera: Camera): void;

  
  render(scene: Object3D, camera: Camera): void;

  
  getActiveCubeFace(): number;

  
  getActiveMipmapLevel(): number;

  
  getRenderTarget(): WebGLRenderTarget | null;

  
  getCurrentRenderTarget(): WebGLRenderTarget | null;

  
  setRenderTarget(
        renderTarget: WebGLRenderTarget | WebGLMultipleRenderTargets | null,
        activeCubeFace?: number,
        activeMipmapLevel?: number,
    ): void;

  readRenderTargetPixels(
        renderTarget: WebGLRenderTarget | WebGLMultipleRenderTargets,
        x: number,
        y: number,
        width: number,
        height: number,
        buffer: any,
        activeCubeFaceIndex?: number,
    ): void;

  
  copyFramebufferToTexture(position: Vector2, texture: Texture, level?: number): void;

  
  copyTextureToTexture(position: Vector2, srcTexture: Texture, dstTexture: Texture, level?: number): void;

  
  copyTextureToTexture3D(
        sourceBox: Box3,
        position: Vector3,
        srcTexture: Texture,
        dstTexture: Data3DTexture | DataArrayTexture,
        level?: number,
    ): void;

  
  initTexture(texture: Texture): void;

  
  resetState(): void;

  
  vr: boolean;

  
  shadowMapEnabled: boolean;

  
  shadowMapType: ShadowMapType;

  
  shadowMapCullFace: CullFace;

  
  supportsFloatTextures(): any;

  
  supportsHalfFloatTextures(): any;

  
  supportsStandardDerivatives(): any;

  
  supportsCompressedTextureS3TC(): any;

  
  supportsCompressedTexturePVRTC(): any;

  
  supportsBlendMinMax(): any;

  
  supportsVertexTextures(): any;

  
  supportsInstancedArrays(): any;

  
  enableScissorTest(boolean: any): any;
}
