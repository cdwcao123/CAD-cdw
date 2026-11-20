import { McDbEllipse } from '../../mcDb';
import { McGeVector3 } from '../../mcGe';
import { McGsComplexCurveRender } from '..';
export declare class McGsEllipseRender extends McGsComplexCurveRender {
    static getCurvePath(dbEllipse: McDbEllipse, segments?: number): McGeVector3[];
    render(): boolean;
}
