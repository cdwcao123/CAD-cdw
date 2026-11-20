import { McGeVector3 } from '../../mcGe';
import { McGsComplexCurveRender } from './mcGsComplexCurveRender';
export declare class McGsCylinderRender extends McGsComplexCurveRender {
    fade: boolean;
    render(): boolean;
    calculateCircleCoords(radius: number, count: number): McGeVector3[][];
}
