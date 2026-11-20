import { McDbCircle } from '../../mcDb/entity/mcDbCircle';
import { McGeVector3 } from '../../mcGe/mcGeVector3';
import { McGsComplexCurveRender } from '..';
export declare class McGsCircleRender extends McGsComplexCurveRender {
    static getCurvePath(dbCircle: McDbCircle, segments?: number): McGeVector3[];
    render(): boolean;
}
