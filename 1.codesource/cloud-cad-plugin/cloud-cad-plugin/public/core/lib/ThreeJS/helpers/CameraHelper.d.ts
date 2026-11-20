import { Color } from '../math/Color';
import { Matrix4 } from '../math/Matrix4';
import { Camera } from './../cameras/Camera';
import { LineSegments } from './../objects/LineSegments';

export class CameraHelper extends LineSegments {
    
    constructor(camera: Camera);

    
    camera: Camera;

    
    pointMap: { [id: string]: number[] };

    
    matrix: Matrix4;

    
    matrixAutoUpdate: boolean;

    
    type: string;

    
    update(): void;

    
    dispose(): void;

    
    setColors(frustum: Color, cone: Color, up: Color, target: Color, cross: Color): this;
}
