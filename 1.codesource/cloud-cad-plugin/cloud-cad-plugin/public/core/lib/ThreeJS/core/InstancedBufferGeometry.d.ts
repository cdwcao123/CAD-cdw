import { BufferGeometry } from './BufferGeometry';

export class InstancedBufferGeometry extends BufferGeometry {
  
  constructor();

  
  type: string;

  
  readonly isInstancedBufferGeometry: true;

  
  instanceCount: number;

  
  copy(source: InstancedBufferGeometry): this;

  
  resetMaxInstanceCount(): void;
}
