import { DirectionalLight } from './../lights/DirectionalLight';
import { Line } from './../objects/Line';
import { Matrix4 } from './../math/Matrix4';
import { Object3D } from './../core/Object3D';
import { ColorRepresentation } from '../utils';
export class DirectionalLightHelper extends Object3D {
    
    constructor(light: DirectionalLight, size?: number, color?: ColorRepresentation);

    light: DirectionalLight;
    lightPlane: Line;
    targetLine: Line;

    
    color: ColorRepresentation | undefined;
    matrix: Matrix4;

    
    matrixAutoUpdate: boolean;

    dispose(): void;
    update(): void;
}
