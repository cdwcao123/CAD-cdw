import { Camera } from './../cameras/Camera';
import { Ray } from './../math/Ray';
import { Vector2 } from './../math/Vector2';
import { Vector3 } from './../math/Vector3';
import { Layers } from './Layers';
import { Object3D } from './Object3D';
export interface Face {
    a: number;
    b: number;
    c: number;
    normal: Vector3;
    materialIndex: number;
}

export interface Intersection<TIntersected extends Object3D = Object3D> {
    
    distance: number;
    distanceToRay?: number | undefined;
    
    point: Vector3;
    index?: number | undefined;
    
    face?: Face | null | undefined;
    
    faceIndex?: number | undefined;
    
    object: TIntersected;
    uv?: Vector2 | undefined;
    uv2?: Vector2 | undefined;
    
    instanceId?: number | undefined;
}

export interface RaycasterParameters {
    Mesh?: any;
    Line?: { threshold: number } | undefined;
    LOD?: any;
    Points?: { threshold: number } | undefined;
    Sprite?: any;
    Container?: { width: number, height: number } | undefined;
    MouseCoord?:{x:number, y:number} | undefined
    planeVolume?:any|undefined
}

export class Raycaster {
  
  constructor(origin?: Vector3, direction?: Vector3, near?: number, far?: number);

  
  ray: Ray;

  
  near: number;

  
  far: number;

  
  camera: Camera;

  
  layers: Layers;

  
  params: RaycasterParameters;

  
  is2D: boolean;

  
  set(origin: Vector3, direction: Vector3): void;

  
  setFromCamera(coords: Vector2, camera: Camera): void;

  
  intersectObject<TIntersected extends Object3D>(
        object: Object3D,
        recursive?: boolean,
        optionalTarget?: Array<Intersection<TIntersected>>,
    ): Array<Intersection<TIntersected>>;

  
  intersectObjects<TIntersected extends Object3D>(
        objects: Object3D[],
        recursive?: boolean,
        optionalTarget?: Array<Intersection<TIntersected>>,
    ): Array<Intersection<TIntersected>>;
}
