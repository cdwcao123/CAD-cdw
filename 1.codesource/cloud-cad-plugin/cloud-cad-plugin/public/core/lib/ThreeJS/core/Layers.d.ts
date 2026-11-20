
export class Layers {
  
  constructor();

  
  mask: number;

  
  highMask: number;

  
  set(layer: number): void;

  
  enable(layer: number): void;

  
  enableAll(): void;

  
  toggle(layer: number): void;

  
  disable(layer: number): void;

  
  disableAll(): void;

  
  test(layers: Layers): boolean;

  
  isEnabled(layer: number): boolean;
}
