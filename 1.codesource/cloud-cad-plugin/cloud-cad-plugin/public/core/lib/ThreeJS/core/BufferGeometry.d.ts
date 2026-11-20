import { BuiltinShaderAttributeName } from '../constants';
import { Box3 } from './../math/Box3';
import { Matrix4 } from './../math/Matrix4';
import { Quaternion } from './../math/Quaternion';
import { Sphere } from './../math/Sphere';
import { Vector2 } from './../math/Vector2';
import { Vector3 } from './../math/Vector3';
import { BufferAttribute } from './BufferAttribute';
import { EventDispatcher } from './EventDispatcher';
import { GLBufferAttribute } from './GLBufferAttribute';
import { InterleavedBufferAttribute } from './InterleavedBufferAttribute';

export class BufferGeometry extends EventDispatcher {
  
  constructor();

  
  id: number;

  
  uuid: string;

  
  name: string;

  
  type: string; 

  
  index: BufferAttribute | null;

  
  attributes: {
        [name: string]: BufferAttribute | InterleavedBufferAttribute | GLBufferAttribute; 
    };

  
  morphAttributes: {
        [name: string]: Array<BufferAttribute | InterleavedBufferAttribute>; 
    };

  
  morphTargetsRelative: boolean;

  
  groups: Array<{
        
        start: number;
        
        count: number;
        
        materialIndex?: number | undefined;
    }>;

  
  boundingBox: Box3 | null;

  
  boundingSphere: Sphere | null;

  
  drawRange: { start: number; count: number };

  
  userData: { [key: string]: any };

  
  readonly isBufferGeometry: true;

  
  getIndex(): BufferAttribute | null;

  
  setIndex(index: BufferAttribute | number[] | null): this;

  
  setAttribute(
        name: BuiltinShaderAttributeName | (string & {}),
        attribute: BufferAttribute | InterleavedBufferAttribute | GLBufferAttribute,
    ): this;

  
  getAttribute(
        name: BuiltinShaderAttributeName | (string & {}),
    ): BufferAttribute | InterleavedBufferAttribute | GLBufferAttribute;

  
  deleteAttribute(name: BuiltinShaderAttributeName | (string & {})): BufferGeometry;

  
  hasAttribute(name: BuiltinShaderAttributeName | (string & {})): boolean;

  
  addGroup(start: number, count: number, materialIndex?: number): void;

  
  clearGroups(): void;

  
  setDrawRange(start: number, count: number): void;

  
  applyMatrix4(matrix: Matrix4): this;

  
  applyQuaternion(quaternion: Quaternion): this;

  
  rotateX(angle: number): this;

  
  rotateY(angle: number): this;

  
  rotateZ(angle: number): this;

  
  translate(x: number, y: number, z: number): this;

  
  scale(x: number, y: number, z: number): this;

  
  lookAt(vector: Vector3): this;

  
  center(): this;

  
  setFromPoints(points: Vector3[] | Vector2[]): this;

  
  computeBoundingBox(): void;

  
  computeBoundingSphere(): void;

  
  computeTangents(): void;

  
  computeVertexNormals(): void;

  
  normalizeNormals(): void;

  
  toNonIndexed(): BufferGeometry;

  
  toJSON(): {};

  
  clone(): BufferGeometry;

  
  copy(source: BufferGeometry): this;

  
  dispose(): void;
}
