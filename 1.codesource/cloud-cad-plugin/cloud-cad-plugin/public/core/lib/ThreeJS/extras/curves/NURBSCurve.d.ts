import { Vector3 } from './../../math/Vector3';
import { Vector4 } from './../../math/Vector4';
import { Curve } from './../core/Curve';


export class NURBSCurve extends Curve<Vector3> {

  constructor(degree:number,
		knots:number[] ,
		controlPoints:Vector4[] ,
		startKnot?:number ,
		endKnot?:number, );

}
