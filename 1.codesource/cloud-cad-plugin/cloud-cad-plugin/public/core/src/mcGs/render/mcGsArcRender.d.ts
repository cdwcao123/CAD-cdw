import { McDbArc } from '../../mcDb';
import { McGeVector3 } from '../../mcGe';
import { McGsComplexCurveRender } from '..';
export declare class McGsArcRender extends McGsComplexCurveRender {
    static getCurvePath(dbArc: McDbArc, segments?: number): McGeVector3[];
    render(): boolean;
}
