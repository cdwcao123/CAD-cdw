import { Box3 } from './Box3';
import { Line3 } from './Line3';
import { Matrix3 } from './Matrix3';
import { Matrix4 } from './Matrix4';
import { Sphere } from './Sphere';
import { Vector3 } from './Vector3';
export class Plane {
  constructor(normal?: Vector3, constant?: number);

  
  normal: Vector3;

  
  constant: number;

  readonly isPlane: true;

  set(normal: Vector3, constant: number): Plane;
  setComponents(x: number, y: number, z: number, w: number): Plane;
  setFromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): Plane;
  setFromCoplanarPoints(a: Vector3, b: Vector3, c: Vector3): Plane;
  setFromCoplanarPointVals(ax: number, ay: number, az: number, bx: number, by: number, bz: number, cx: number, cy: number, cz: number): Plane;
  clone(): this;
  copy(plane: Plane): this;
  normalize(): Plane;
  negate(): Plane;
  distanceToPoint(point: Vector3): number;
  distanceToSphere(sphere: Sphere): number;
  projectPoint(point: Vector3, target: Vector3): Vector3;
  intersectLine(line: Line3, target: Vector3): Vector3 | null;
  intersectsLine(line: Line3): boolean;
  intersectsBox(box: Box3): boolean;
  intersectsSphere(sphere: Sphere): boolean;
  coplanarPoint(target: Vector3): Vector3;
  applyMatrix4(matrix: Matrix4, optionalNormalMatrix?: Matrix3): Plane;
  translate(offset: Vector3): Plane;
  equals(plane: Plane): boolean;

  
  isIntersectionLine(l: any): any;
}
